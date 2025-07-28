# Clinical Assistant with Chroma Vector Database
# Processes documents from 'docs' folder for clinical information retrieval

import os
import pandas as pd
import random
import shutil

# ChromaDB imports
import chromadb
from chromadb.config import Settings

# LangChain imports
from langchain_community.vectorstores import Chroma
try:
    from langchain_huggingface import HuggingFaceEmbeddings
except ImportError:
    from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from langchain.schema import Document
from langchain_community.llms import HuggingFacePipeline
from transformers import pipeline
from langchain_community.document_loaders import CSVLoader, PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter

# FastAPI imports
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Configuration
docs_path = "docs"
all_docs = []
chunk_id = 0

def load_documents_from_docs():
    """Load and process documents from the docs folder and all subfolders"""
    global all_docs, chunk_id
    
    all_docs = []
    
    if not os.path.exists(docs_path):
        print(f"Warning: {docs_path} folder not found. Creating it...")
        os.makedirs(docs_path)
        return []
    
    print(f"Scanning for documents in: {os.path.abspath(docs_path)}")
    
    supported_extensions = ['.pdf', '.csv', '.xlsx', '.txt']
    loaded_files = []
    
    # Walk through all directories and subdirectories
    for root, dirs, files in os.walk(docs_path):
        for file in files:
            file_extension = os.path.splitext(file)[1].lower()
            if file_extension in supported_extensions:
                file_path = os.path.join(root, file)
                relative_path = os.path.relpath(file_path, docs_path)
                loaded_files.append((file_path, relative_path, file))
    
    print(f"Found {len(loaded_files)} supported files")
    
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=150,
        length_function=len,
        separators=["\n\n", "\n", ". ", " ", ""]
    )
    
    # Load all found files
    for file_path, relative_path, filename in loaded_files:
        print(f"Processing: {relative_path}")
        
        subfolder = os.path.dirname(relative_path) if os.path.dirname(relative_path) else "root"
        
        if filename.endswith('.pdf'):
            try:
                loader = PyPDFLoader(file_path)
                pdf_docs = loader.load()
                
                pdf_chunks = text_splitter.split_documents(pdf_docs)
                for chunk in pdf_chunks:
                    chunk.metadata['chunk_id'] = chunk_id
                    chunk.metadata['source_type'] = 'pdf'
                    chunk.metadata['source_file'] = filename
                    chunk.metadata['source_path'] = relative_path
                    chunk.metadata['category'] = subfolder
                    chunk_id += 1
                
                all_docs.extend(pdf_chunks)
                print(f"  Loaded {len(pdf_chunks)} chunks from {filename}")
            except Exception as e:
                print(f"  Error loading PDF file {filename}: {e}")
        
        elif filename.endswith('.csv'):
            try:
                loader = CSVLoader(file_path=file_path)
                csv_docs = loader.load()
                
                csv_chunks = text_splitter.split_documents(csv_docs)
                for chunk in csv_chunks:
                    chunk.metadata['chunk_id'] = chunk_id
                    chunk.metadata['source_type'] = 'csv'
                    chunk.metadata['source_file'] = filename
                    chunk.metadata['source_path'] = relative_path
                    chunk.metadata['category'] = subfolder
                    chunk_id += 1
                
                all_docs.extend(csv_chunks)
                print(f"  Loaded {len(csv_chunks)} chunks from {filename}")
            except Exception as e:
                print(f"  Error loading CSV file {filename}: {e}")
        
        elif filename.endswith('.xlsx'):
            try:
                df = pd.read_excel(file_path)
                
                content = f"Document: {filename}\n"
                content += f"Category: {subfolder}\n"
                content += f"Type: Excel Spreadsheet\n"
                content += f"Columns: {', '.join(df.columns.tolist())}\n"
                content += "=" * 50 + "\n"
                content += f"This document contains {len(df)} rows of data.\n\n"
                
                for index, row in df.iterrows():
                    row_text = []
                    for col, val in row.items():
                        if pd.notna(val):
                            row_text.append(f"{col}: {val}")
                    content += f"Entry {index + 1}: {', '.join(row_text)}\n"
                
                doc = Document(page_content=content, metadata={
                    'source': filename, 
                    'source_type': 'xlsx',
                    'source_path': relative_path,
                    'category': subfolder
                })
                chunks = text_splitter.split_documents([doc])
                
                for chunk in chunks:
                    chunk.metadata['chunk_id'] = chunk_id
                    chunk.metadata['source_type'] = 'xlsx'
                    chunk.metadata['source_file'] = filename
                    chunk.metadata['source_path'] = relative_path
                    chunk.metadata['category'] = subfolder
                    chunk_id += 1
                
                all_docs.extend(chunks)
                print(f"  Loaded {len(chunks)} chunks from {filename}")
            except Exception as e:
                print(f"  Error loading Excel file {filename}: {e}")
        
        elif filename.endswith('.txt'):
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                enhanced_content = f"Document: {filename}\nCategory: {subfolder}\n" + "="*50 + "\n" + content
                
                doc = Document(page_content=enhanced_content, metadata={
                    'source': filename, 
                    'source_type': 'txt',
                    'source_path': relative_path,
                    'category': subfolder
                })
                chunks = text_splitter.split_documents([doc])
                
                for chunk in chunks:
                    chunk.metadata['chunk_id'] = chunk_id
                    chunk.metadata['source_type'] = 'txt'
                    chunk.metadata['source_file'] = filename
                    chunk.metadata['source_path'] = relative_path
                    chunk.metadata['category'] = subfolder
                    chunk_id += 1
                
                all_docs.extend(chunks)
                print(f"  Loaded {len(chunks)} chunks from {filename}")
            except Exception as e:
                print(f"  Error loading text file {filename}: {e}")
    
    print(f"\nTotal documents loaded: {len(all_docs)} chunks from {len(loaded_files)} files")
    
    if all_docs:
        print("\nDocuments by category:")
        category_counts = {}
        for doc in all_docs:
            category = doc.metadata.get('category', 'unknown')
            category_counts[category] = category_counts.get(category, 0) + 1
        
        for category, count in category_counts.items():
            print(f"  {category}: {count} chunks")
    
    return all_docs

def init_chroma_qa():
    """Initialize Chroma vector store and QA chain"""
    try:
        print("Starting document loading...")
        documents = load_documents_from_docs()
        
        if not documents:
            print("❌ No documents loaded")
            return None
        
        print(f"Successfully loaded {len(documents)} document chunks")
        
        # Initialize embeddings
        print("Initializing embeddings...")
        embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        print("✅ Embeddings initialized successfully")
        
        # Create Chroma vector store
        print("Creating Chroma vector store...")
        vector_store = Chroma.from_documents(
            documents=documents,
            embedding=embeddings
        )
        print("✅ Chroma vector store created successfully!")
        
        # Create retriever
        retriever = vector_store.as_retriever(search_kwargs={"k": 3})
        
        # Initialize LLM
        print("Initializing LLM...")
        generator = pipeline("text2text-generation", model="google/flan-t5-base", max_length=200)
        llm = HuggingFacePipeline(pipeline=generator)
        print("✅ LLM initialized successfully")
        
        # Create prompt template
        template = PromptTemplate(
            input_variables=["context", "question"],
            template=(
                "You are a knowledgeable pediatric clinical assistant with access to comprehensive medical documentation.\n"
                "Based on the following context from clinical documents, provide a comprehensive and accurate answer.\n"
                "If the information is insufficient, say: \"I don't have sufficient information to answer this question accurately.\"\n\n"
                "Context: {context}\n\n"
                "Question: {question}\n\n"
                "Answer:"
            )
        )
        
        # Create QA chain
        print("Creating QA chain...")
        qa_chain = RetrievalQA.from_chain_type(
            llm=llm,
            retriever=retriever,
            chain_type_kwargs={"prompt": template}
        )
        print("✅ QA chain initialized successfully!")
        return qa_chain
        
    except Exception as e:
        print(f"Error initializing QA system: {e}")
        return None

# Clinical Video Links
CLINICAL_VIDEOS = {
    "urokinase procedure": [
        "https://youtu.be/YyS9c13LM14?si=yID0spLC3O8JVTDt",
        "https://youtu.be/XZ7-4Lkx_qw?si=jWbNjUNEJIomjPHQ",
        "https://youtu.be/FvaCABCOdHw?si=WEdx89rvqE0o9NLU"
    ],
    "urinary catheterisation procedure": [
        "https://youtu.be/Dkf8o_zUzd8?si=r65GISUHKwBs2GPq",
        "https://youtu.be/Stc5mzIFJBY?si=0a8dwE9FD0SEZFXQ",
        "https://youtu.be/Mq4Yh0-iozY?si=OPZQW9isCjOrWNrY"
    ],
    "insulin administration procedure": [
        "https://youtu.be/C0coWZbO-_E?si=Yh_boJzS8PBsnVh5",
        "https://youtu.be/RyGx--K75wM?si=SWkdusqnV7dG1n7_",
        "https://youtu.be/y1tul4BvK98?si=SdgwdGB99rYFq_-y"
    ]
}

# FastAPI setup
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize QA chain
print("=== Initializing QA Chain ===")
qa_chain = init_chroma_qa()
if qa_chain:
    print("✅ QA Chain initialized successfully!")
else:
    print("❌ QA Chain initialization failed!")

class QuestionRequest(BaseModel):
    question: str

@app.post("/chat")
async def ask_question(request: QuestionRequest):
    try:
        if not request.question or len(request.question.strip()) == 0:
            raise HTTPException(status_code=400, detail="Question cannot be empty")

        question = request.question.lower().strip()

        # Video request logic
        video_keywords = ["video", "show me a video", "demonstration", "procedure video"]
        if any(kw in question for kw in video_keywords):
            return {
                "answer": (
                    "Which procedure video do you want to see? Please reply with the number:\n"
                    "1. Administering of urokinase\n"
                    "2. Urinary catherisation\n"
                    "3. Administering insulin"
                ),
                "success": True,
                "video_prompt": True
            }

        # Check for user selection
        if question in ["1", "2", "3"]:
            yt_queries = {
                "1": "urokinase procedure",
                "2": "urinary catheterisation procedure",
                "3": "insulin administration procedure"
            }
            proc = yt_queries.get(question)
            links = CLINICAL_VIDEOS.get(proc, [])
            if links:
                return {
                    "answer": f"Here are 3 videos for {proc}:",
                    "video_urls": links,
                    "success": True
                }
            else:
                return {
                    "answer": f"Sorry, no curated videos found for {proc}.",
                    "success": False
                }

        # Use QA chain for document-based questions
        if qa_chain:
            try:
                result = qa_chain.run(request.question)
                return {
                    "answer": result,
                    "success": True
                }
            except Exception as e:
                print(f"Error with QA chain: {e}")
                return {
                    "answer": "Sorry, I encountered an error while processing your question.",
                    "success": False
                }
        else:
            return {
                "answer": "No documents found. Please add files to the 'docs' folder.",
                "success": False
            }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while processing your question: {str(e)}"
        )

@app.get("/quiz")
async def get_quiz():
    try:
        if qa_chain:
            sample_questions = [
                "What are the main steps in administering medication?",
                "What safety protocols should be followed?",
                "What are the key nursing procedures?",
                "What documentation is required?",
                "What are the emergency procedures?"
            ]
            
            question = random.choice(sample_questions)
            
            try:
                answer = qa_chain.run(question)
                
                options = [
                    answer[:50] + "..." if len(answer) > 50 else answer,
                    "Follow standard protocol",
                    "Consult with supervisor",
                    "Document all procedures"
                ]
                random.shuffle(options)
                
                return {
                    "question": question,
                    "options": options,
                    "answer": answer[:50] + "..." if len(answer) > 50 else answer
                }
            except Exception as e:
                print(f"Error generating quiz: {e}")
                raise HTTPException(status_code=500, detail="Failed to generate quiz question.")
        else:
            raise HTTPException(status_code=500, detail="No documents loaded for quiz generation.")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load quiz question: {str(e)}")

@app.get("/debug/status")
async def debug_status():
    """Debug endpoint to check the status of the QA system"""
    try:
        docs_exist = os.path.exists("docs")
        if docs_exist:
            file_count = 0
            for root, dirs, files in os.walk("docs"):
                for file in files:
                    if file.lower().endswith(('.pdf', '.csv', '.xlsx', '.txt')):
                        file_count += 1
        else:
            file_count = 0
        
        return {
            "qa_chain_initialized": qa_chain is not None,
            "docs_folder_exists": docs_exist,
            "supported_files_found": file_count,
            "status": "initialized" if qa_chain else "not_initialized"
        }
    except Exception as e:
        return {"error": str(e)}

@app.post("/debug/reinitialize")
async def reinitialize_qa():
    """Manually reinitialize the QA chain"""
    global qa_chain
    try:
        print("=== Manual Reinitialization ===")
        qa_chain = init_chroma_qa()
        if qa_chain:
            return {"success": True, "message": "QA chain reinitialized successfully"}
        else:
            return {"success": False, "message": "QA chain initialization failed"}
    except Exception as e:
        return {"success": False, "error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
