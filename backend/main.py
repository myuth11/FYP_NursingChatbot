from PIL import Image
import pytesseract

try:
    import pdf2image
    PDF2IMAGE_AVAILABLE = True
except ImportError:
    PDF2IMAGE_AVAILABLE = False
    print("Warning: pdf2image not available. PDF OCR will be disabled.")
# Force skip pdf2image/poppler regardless of import
PDF2IMAGE_AVAILABLE = False

def ocr_image(image_or_path):
    if isinstance(image_or_path, str):
        image = Image.open(image_or_path)
    else:
        image = image_or_path
    return pytesseract.image_to_string(image)

def ocr_pdf(path):
    """OCR a PDF using pdf2image - fallback to text extraction if not available"""
    if not PDF2IMAGE_AVAILABLE:
        print(f"Warning: Cannot perform OCR on {path} - pdf2image not available")
        # Try to extract text directly instead
        try:
            from PyPDF2 import PdfReader
            reader = PdfReader(path)
            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n\n"
            return text
        except ImportError:
            try:
                # Fallback to pdfplumber
                import pdfplumber
                with pdfplumber.open(path) as pdf:
                    text = ""
                    for page in pdf.pages:
                        text += page.extract_text() or "" + "\n\n"
                return text
            except ImportError:
                print(f"Warning: No PDF processing libraries available for {path}")
                return f"PDF file: {path} (text extraction not available)"
    
    try:
        images = pdf2image.convert_from_path(path)
        return "\n\n".join([ocr_image(img) for img in images])
    except Exception as e:
        print(f"Error processing PDF {path} with OCR: {e}")
        # Fallback to text extraction
        try:
            from PyPDF2 import PdfReader
            reader = PdfReader(path)
            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n\n"
            return text
        except Exception as e2:
            print(f"Text extraction also failed for {path}: {e2}")
            return f"PDF file: {path} (processing failed)"

def clean_medical_text(raw_text):
    text = re.sub(r"(Page \d+|HPB \d{4}|Ministry of Health)", "", raw_text)
    text = re.sub(r"\n\s*\n", "\n", text)
    text = re.sub(r"(?<!\n)\n(?!\n)", " ", text)
    text = re.sub(r"[•*–-]\s*", "• ", text)
    text = re.sub(r"[^\x00-\x7F]+", "", text)
    return text.strip()

# Updated to use client documents in DB/docs folder
# Takes the TXT, PNG, PDF files from a folder named 'docs'

import os
import re
import pandas as pd
import random
import shutil
from typing import List, Optional
import warnings
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

warnings.filterwarnings("ignore")

from langchain_community.vectorstores import Chroma
try:
    from langchain_community.vectorstores import FAISS
except ImportError:
    FAISS = None

try:
    from langchain_huggingface import HuggingFaceEmbeddings
except ImportError:
    try:
        from langchain_community.embeddings import HuggingFaceEmbeddings
    except ImportError:
        from langchain.embeddings import HuggingFaceEmbeddings

from langchain.chains import RetrievalQA  # LLMChain is not used bcoz it handles static responses well and NOT encouraged for RAG
from langchain.prompts import PromptTemplate
from langchain.schema import Document
from langchain_community.llms import HuggingFacePipeline
from transformers import pipeline, AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig, AutoModelForSeq2SeqLM

from langchain_community.document_loaders import CSVLoader, PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
# from pymongo import MongoClient
import torch
# gridfs

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests

# --------------------------- MongoDB Setup ---------------------------
# try:
    # Try to connect with longer timeout and more verbose error handling
    # client = MongoClient("mongodb://localhost:27017/",
    #                     serverSelectionTimeoutMS=10000,
    #                     connectTimeoutMS=20000)
    # Verify the connection
    # client.server_info()
    # print("Successfully connected to MongoDB")
    # db = client["my_database"]
    # fs = gridfs.GridFS(db)
    # collection = db["csv_files"]

# except Exception as e:
#     print("\nError: Could not connect to MongoDB. Please make sure MongoDB is installed and running.")
#     print("To fix this:")
#     print("1. If MongoDB is not installed:")
#     print("   - Download MongoDB Community Server from https://www.mongodb.com/try/download/community")
#     print("   - Install MongoDB as a service during installation")
#     print("\n2. If MongoDB is installed but not running:")
#     print("   - Open PowerShell as Administrator")
#     print("   - Run: net start MongoDB")
#     print("\nError details:", str(e))
#     exit(1)

# --------------------------- Configuration ---------------------------
# Optional quantization config - only use if bitsandbytes is available
try:
    QUANT_CONFIG = BitsAndBytesConfig(
        load_in_4bit=True,
        bnb_4bit_use_double_quant=True,
        bnb_4bit_quant_type="nf4",
        bnb_4bit_compute_dtype=torch.float16
    )
    print("Quantization config loaded successfully")
except Exception as e:
    print(f"Warning: Could not load quantization config (bitsandbytes not available): {e}")
    QUANT_CONFIG = None

HF_TOKEN = os.getenv("HF_TOKEN")
if not HF_TOKEN:
    raise ValueError("HF_TOKEN not set in environment variables.")

# --------------------------- Load Documents from 'docs/' ---------------------------
# Get the absolute path to the docs folder relative to this script
script_dir = os.path.dirname(os.path.abspath(__file__))
docs_path = os.path.join(script_dir, "docs")
all_docs = []

chunk_id = 0  # used for assigning unique chunk IDs

def load_documents_from_docs():
    """Load and process documents from the docs folder and all subfolders - recursively"""
    global all_docs, chunk_id
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=250,  # Increased chunk size for better context and less empty answers
        chunk_overlap=75,  # Maintain overlap for context continuity
        length_function=len,
        separators=["\n\n", "\n", ". ", " ", ""]  # Better text splitting
    )
    
    # Reset the documents list
    all_docs = []
    
    print(f"DEBUG: docs_path = {docs_path}")
    print(f"DEBUG: docs_path exists = {os.path.exists(docs_path)}")
    
    if not os.path.exists(docs_path):
        print(f"Warning: {docs_path} folder not found. Creating it...")
        os.makedirs(docs_path)
        return []
    
    # Recursively find ALL documents from the docs folder and subfolders
    print(f"Recursively scanning for documents in: {os.path.abspath(docs_path)}")

    supported_extensions = ['.pdf', '.csv', '.xlsx', '.txt', '.jpg', '.jpeg', '.png']
    loaded_files = []
    # Recursively find all supported files in docs and subfolders
    for root, dirs, files in os.walk(docs_path):
        for file in files:
            ext = os.path.splitext(file)[1].lower()
            if ext in supported_extensions:
                file_path = os.path.join(root, file)
                relative_path = os.path.relpath(file_path, docs_path)
                loaded_files.append((file_path, relative_path, file))

    # Load all found files with OCR/image support
    for file_path, relative_path, filename in loaded_files:
        subfolder = os.path.dirname(relative_path)
        ext = os.path.splitext(filename)[1].lower()
        try:
            if ext == '.pdf':
                print(f"  Loading PDF: {filename}")
                raw_text = ocr_pdf(file_path)
                cleaned_text = clean_medical_text(raw_text)
                doc = Document(page_content=cleaned_text, metadata={
                    'source': filename,
                    'source_type': 'pdf',
                    'source_path': relative_path,
                    'category': subfolder
                })
                chunks = text_splitter.split_documents([doc])
                for chunk in chunks:
                    chunk.metadata['chunk_id'] = chunk_id
                    chunk.metadata['source_type'] = 'pdf'
                    chunk.metadata['source_file'] = filename
                    chunk.metadata['source_path'] = relative_path
                    chunk.metadata['category'] = subfolder
                    chunk_id += 1
                all_docs.extend(chunks)
                print(f"  Loaded {len(chunks)} chunks from {filename}")
            elif ext == '.csv':
                print(f"  Loading CSV: {filename}")
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
            elif ext == '.xlsx':
                print(f"  Loading Excel: {filename}")
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
            elif ext in ['.jpg', '.jpeg', '.png']:
                print(f"  Loading Image (OCR): {filename}")
                raw_text = ocr_image(file_path)
                cleaned_text = clean_medical_text(raw_text)
                chunks = text_splitter.split_text(cleaned_text)
                for chunk in chunks:
                    doc = Document(page_content=chunk, metadata={
                        'chunk_id': chunk_id,
                        'source_type': 'image-ocr',
                        'source_file': filename,
                        'source_path': relative_path,
                        'category': subfolder
                    })
                    all_docs.append(doc)
                    chunk_id += 1
                print(f"  Loaded {len(chunks)} OCR chunks from {filename}")
            elif ext == '.txt':
                print(f"  Loading Text: {filename}")
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
            else:
                print(f"  Skipping unsupported file type: {filename}")
        except Exception as e:
            print(f"  Error loading file {filename}: {e}")
    # End of file loading loop
    return all_docs

def init_chroma_qa():
    """Initialize Chroma vector store and QA chain with fallback"""
    try:
        print("Starting document loading...")
        documents = load_documents_from_docs()
        
        if not documents:
            print("No documents found. Please add CSV or PDF files to the 'docs' folder.")
            return None
        
        print(f"Successfully loaded {len(documents)} document chunks")
        
        # Initialize embeddings
        print("Initializing embeddings...")
        try:
            # Try different embedding approaches
            try:
                embeddings = HuggingFaceEmbeddings(
                    model_name="all-MiniLM-L6-v2",
                    model_kwargs={'device': 'cpu'},
                    encode_kwargs={'normalize_embeddings': True}
                )
            except Exception as e:
                print(f"First embedding approach failed: {e}")
                # Fallback to simpler approach
                embeddings = HuggingFaceEmbeddings(
                    model_name="all-MiniLM-L6-v2"
                )
            print("Embeddings initialized successfully!")
        except Exception as e:
            print(f"Error initializing embeddings: {e}")
            return None
        
        # Create Chroma vector store
        print("Creating Chroma vector store...")
        vector_store = None
        try:
            persist_directory = "./chroma_db"
            # Clean up any existing chroma db if it's corrupted
            if os.path.exists(persist_directory):
                try:
                    shutil.rmtree(persist_directory)
                    print("Cleaned up existing Chroma database")
                except:
                    pass
            
            # Try creating Chroma with minimal configuration
            vector_store = Chroma.from_documents(
                documents=documents,
                embedding=embeddings,
                persist_directory=persist_directory,
                collection_name="medical_docs"
            )
            print("Chroma vector store created successfully!")
        except Exception as e:
            print(f"Error creating Chroma vector store: {e}")
            print("Trying alternative approach...")
            try:
                # Alternative approach without persist directory
                vector_store = Chroma.from_documents(
                    documents=documents,
                    embedding=embeddings
                )
                print("Chroma vector store created successfully (in-memory)!")
            except Exception as e2:
                print(f"Chroma alternative approach also failed: {e2}")
                if FAISS:
                    print("Trying FAISS as fallback...")
                    try:
                        vector_store = FAISS.from_documents(documents, embeddings)
                        print("FAISS vector store created successfully!")
                    except Exception as e3:
                        print(f"FAISS also failed: {e3}")
                        return None
                else:
                    print("No fallback vector store available")
                    return None
        
        if vector_store is None:
            print("Failed to create any vector store")
            return None
        
        # Use built-in retriever interface with k=3 for better context coverage
        print("Creating retriever...")
        retriever = vector_store.as_retriever(search_kwargs={"k": 3})
        
        # Initialize LLM with better error handling
        print("Initializing LLM...")
        try:
            # Use TinyLlama with correct text-generation pipeline and optimized parameters
            generator = pipeline(
                "text-generation",
                model="TinyLlama/TinyLlama-1.1B-Chat-v1.0",
                max_new_tokens=100,  # Reduced for cleaner responses
                do_sample=True,
                temperature=0.7,
                top_p=0.9,
                repetition_penalty=1.1,
                device=-1,  # Force CPU
                pad_token_id=50256  # Add pad token to prevent warnings
            )
            llm = HuggingFacePipeline(pipeline=generator)
            print("LLM initialized successfully!")
        except Exception as e:
            print(f"Error initializing LLM: {e}")
            return None
        
        # Create a simple, effective prompt template for TinyLlama
        print("Creating prompt template...")
        template = PromptTemplate(
            input_variables=["context", "question"],
            template=(
                "You are NurseAid, a clinical assistant for pediatric nurses. "
                "Answer the question using only the provided context. "
                "Be concise and helpful.\n\n"
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
        
        print("QA chain initialized successfully!")
        return qa_chain
        
    except ImportError as e:
        print(f"Import error: {e}")
        print("Some required packages may be missing. Please install them.")
        return None
    except Exception as e:
        print(f"Error initializing QA system: {e}")
        import traceback
        traceback.print_exc()
        return None

# ----------- Clinical Video Links (Curated) -----------
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

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://nurse-frontend.onrender.com",
        "https://nurse-backend-1pve.onrender.com",
        "https://fyp-ay25s1-nurse-chatbot.onrender.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize QA chain (will be loaded lazily)
qa_chain = None

def get_or_initialize_qa_chain():
    """Get the QA chain, initializing it if necessary"""
    global qa_chain
    if qa_chain is None:
        print("Initializing QA chain...")
        try:
            qa_chain = init_chroma_qa()
            if qa_chain is None:
                print("Failed to initialize QA chain - init_chroma_qa returned None!")
            else:
                print("QA chain initialized successfully!")
        except Exception as e:
            print(f"Exception during QA chain initialization: {e}")
            import traceback
            traceback.print_exc()
            qa_chain = None
    return qa_chain

class QuestionRequest(BaseModel):
    question: str

@app.get("/debug")
async def debug_info():
    """Debug endpoint to check document loading status"""
    try:
        import os
        current_dir = os.getcwd()
        script_dir = os.path.dirname(os.path.abspath(__file__))
        docs_path_check = os.path.join(script_dir, "docs")
        
        # Check if docs folder exists and what's in it
        docs_exists = os.path.exists(docs_path_check)
        files_found = []
        
        if docs_exists:
            for root, dirs, files in os.walk(docs_path_check):
                for file in files:
                    if file.lower().endswith(('.pdf', '.csv', '.xlsx', '.txt')):
                        files_found.append(os.path.join(root, file))
        
        # Try to load documents
        try:
            documents = load_documents_from_docs()
            doc_count = len(documents) if documents else 0
        except Exception as e:
            doc_count = f"Error loading: {str(e)}"
        
        return {
            "current_working_directory": current_dir,
            "script_directory": script_dir,
            "docs_path": docs_path_check,
            "docs_folder_exists": docs_exists,
            "files_found": files_found,
            "documents_loaded": doc_count,
            "qa_chain_initialized": qa_chain is not None
        }
    except Exception as e:
        return {"error": str(e)}

@app.get("/init_qa")
async def manual_init_qa():
    """Manually trigger QA chain initialization for debugging"""
    try:
        print("=== Manual QA Chain Initialization ===")
        current_qa_chain = get_or_initialize_qa_chain()
        if current_qa_chain:
            return {
                "success": True,
                "message": "QA chain initialized successfully!",
                "qa_chain_type": str(type(current_qa_chain))
            }
        else:
            return {
                "success": False,
                "message": "Failed to initialize QA chain",
                "qa_chain_initialized": qa_chain is not None
            }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "qa_chain_initialized": qa_chain is not None
        }

@app.post("/chat")
async def ask_question(request: QuestionRequest):
    def remove_repeated_sentences(text):
        import re
        # Split into sentences (simple split on period, exclamation, question mark)
        sentences = re.split(r'(?<=[.!?])\s+', text)
        seen = set()
        result = []
        for s in sentences:
            s_clean = s.strip().lower()
            if s_clean and s_clean not in seen:
                result.append(s.strip())
                seen.add(s_clean)
        return ' '.join(result)

    try:
        if not request.question or len(request.question.strip()) == 0:
            raise HTTPException(status_code=400, detail="Question cannot be empty")

        question = request.question.lower().strip()

        # Video request logic (curated links) - check first!
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

        # Check for user selection (expects '1', '2', or '3')
        if question in ["1", "2", "3"]:
            yt_queries = {
                "1": "urokinase procedure",
                "2": "urinary catheterisation procedure",
                "3": "insulin administration procedure"
            }
            proc = yt_queries.get(question)
            links = CLINICAL_VIDEOS.get(proc, [])
            if links:
                # Return all 3 links as a list
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

        # Use optimized QA chain for document-based questions
        current_qa_chain = get_or_initialize_qa_chain()
        if current_qa_chain:
            try:
                # Generate answer using QA chain (use invoke instead of run)
                result = current_qa_chain.invoke(request.question)
                # If result is a dict (e.g., {"query": ..., "result": ...}), extract the answer string
                answer_str = None
                if isinstance(result, dict):
                    # Try common keys
                    answer_str = result.get("result") or result.get("answer") or str(result)
                else:
                    answer_str = str(result)
                
                # Clean up the model output to remove prompt echoing
                def clean_model_output(text):
                    """Clean up TinyLlama output to remove prompt echoing and get just the answer"""
                    if not isinstance(text, str):
                        text = str(text)
                    
                    # Remove common prompt indicators
                    text = re.sub(r'^.*?Answer:\s*', '', text, flags=re.DOTALL)
                    text = re.sub(r'^.*?RESPONSE:\s*', '', text, flags=re.DOTALL)
                    text = re.sub(r'^.*?✅ RESPONSE:\s*', '', text, flags=re.DOTALL)
                    
                    # Remove the entire prompt template if it was echoed
                    text = re.sub(r'🎯 You are NurseAid.*?Answer:\s*', '', text, flags=re.DOTALL)
                    text = re.sub(r'You are NurseAid.*?Answer:\s*', '', text, flags=re.DOTALL)
                    
                    # Remove context sections
                    text = re.sub(r'Context:.*?Question:', '', text, flags=re.DOTALL)
                    text = re.sub(r'--- DOCUMENT EXCERPT ---.*?--------------------------', '', text, flags=re.DOTALL)
                    
                    # Clean up extra whitespace and newlines
                    text = re.sub(r'\n+', ' ', text)
                    text = re.sub(r'\s+', ' ', text)
                    text = text.strip()
                    
                    # If the response is too long (indicating prompt echo), truncate it
                    if len(text) > 500:
                        # Try to find the actual answer after "Answer:" or similar
                        parts = re.split(r'(?:Answer|Response):\s*', text)
                        if len(parts) > 1:
                            text = parts[-1]
                        else:
                            # Take only the first reasonable chunk
                            text = text[:200] + "..."
                    
                    return text.strip()
                
                # Clean the answer
                answer_str = clean_model_output(answer_str)
                # Post-process: If the question is about a phone number, extract phone number from the answer
                if "phone number" in question:
                    useful_lines = [line for line in answer_str.splitlines() if re.search(r"\b\d{4}-\d{4}\b", line)]
                    dept = None
                    import re as _re
                    m = _re.search(r"phone number for ([\w\s\-_/()]+)", question)
                    if m:
                        dept = m.group(1).strip().lower()
                    def normalize(s):
                        import re
                        s = s.lower()
                        s = re.sub(r"[\s\-\.:;+()\[\]/_,]", "", s)
                        s = re.sub(r"[!@#$%^&*'\"?<>~`=\\]", "", s)
                        return s
                    found_numbers = []
                    def extract_numbers(line):
                        numbers = set()
                        if ':' in line:
                            _, rest = line.split(':', 1)
                        else:
                            rest = line
                        for part in re.split(r"[,/]| and ", rest):
                            part = part.strip()
                            m = re.match(r"(\d{3,})(?:/|\\)(\d{1,4})$", part)
                            if m:
                                base, suffix = m.groups()
                                if len(suffix) < len(base):
                                    expanded = base[:-len(suffix)] + suffix
                                    numbers.add(base)
                                    numbers.add(expanded)
                                else:
                                    numbers.add(part)
                            elif re.match(r"\+?\d{4,}(?:-\d{4})?", part):
                                numbers.add(part)
                        numbers.update(re.findall(r"\+?\d{4,}(?:-\d{4})?", line))
                        return list(numbers)
                    if dept:
                        norm_dept = normalize(dept)
                        for line in useful_lines:
                            if ':' in line:
                                label, rest = line.split(':', 1)
                                norm_label = normalize(label)
                                if norm_label == norm_dept:
                                    found_numbers += extract_numbers(line)
                        if not found_numbers:
                            txt_path = os.path.join(docs_path, "Useful Phone Numbers", "KKH Useful Contact Numbers.txt")
                            if os.path.exists(txt_path):
                                with open(txt_path, "r", encoding="utf-8") as f:
                                    lines = f.readlines()
                                for line in lines:
                                    if ':' in line:
                                        label, rest = line.split(':', 1)
                                        norm_label = normalize(label)
                                        if norm_label == norm_dept:
                                            found_numbers += extract_numbers(line)
                        if not found_numbers:
                            from difflib import get_close_matches
                            txt_path = os.path.join(docs_path, "Useful Phone Numbers", "KKH Useful Contact Numbers.txt")
                            if os.path.exists(txt_path):
                                with open(txt_path, "r", encoding="utf-8") as f:
                                    lines = f.readlines()
                                labels = [line.split(':', 1)[0] for line in lines if ':' in line]
                                norm_labels = [normalize(label) for label in labels]
                                matches = get_close_matches(norm_dept, norm_labels, n=1, cutoff=0.7)
                                if matches:
                                    idx = norm_labels.index(matches[0])
                                    found_numbers += extract_numbers(lines[idx])
                        if found_numbers:
                            found_numbers = sorted(set(found_numbers))
                            return {"answer": ", ".join(found_numbers), "success": True}
                        else:
                            return {"answer": f"No valid phone number found for {dept}.", "success": False}
                    return {"answer": "Please specify a department to get the correct phone number.", "success": False}
                # Remove repeated sentences from the answer
                cleaned_answer = remove_repeated_sentences(answer_str)
                return {
                    "answer": cleaned_answer,
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
                "answer": "No documents found. Please add CSV or PDF files to the 'docs' folder.",
                "success": False
            }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while processing your question: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
