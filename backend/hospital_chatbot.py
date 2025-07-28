import os
import random
import pandas as pd
from langchain_community.vectorstores import FAISS
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.prompts import PromptTemplate
from langchain.chains import RetrievalQA
from transformers import pipeline
from langchain.llms import HuggingFacePipeline
from langchain.docstore.document import Document


def clean_text(text):
    if pd.isna(text):
        return ""
    return str(text).strip().replace("\n", " ").replace("\r", " ")


def preprocess_hospital_data(df):
    documents = []
    for _, row in df.iterrows():
        content = f"""Hospital Name: {clean_text(row['Hospital Name'])}
Address: {clean_text(row['Address'])}
Type: {clean_text(row['Hospital Type'])}
Ownership: {clean_text(row['Hospital Ownership'])}
Emergency Services: {clean_text(row['Emergency Services'])}
Rating: {clean_text(row['Hospital overall rating'])}
City: {clean_text(row['City'])}
State: {clean_text(row['State'])}
"""
        documents.append(Document(page_content=content))
    return documents


def load_and_process_hospital_data(csv_path):
    df = pd.read_csv(csv_path)
    print(f"Loaded CSV with {len(df)} rows and columns: {df.columns.tolist()}")
    documents = preprocess_hospital_data(df)
    return documents, df


def get_random_hospital_question_with_mcq(df):
    if df.empty:
        print("DataFrame is empty!")
        return None, None, None

    # Select a random hospital row
    row = df.sample(1).iloc[0]
    correct_name = row["Hospital Name"]
    if pd.isna(correct_name):
        print("Selected hospital has no name, retrying...")
        return None, None, None

    question_templates = [
        f"Which hospital is located in {row['City']}, {row['State']} and is a {row['Hospital Type']}?",
        f"Identify the hospital that operates in {row['City']}, {row['State']} and has the type '{row['Hospital Type']}'.",
        f"What is the name of the {row['Hospital Type']} hospital situated in {row['City']}, {row['State']}?",
        f"Name the hospital found in {row['City']}, {row['State']} classified as a {row['Hospital Type']}.",
        f"In which hospital would you find in {row['City']}, {row['State']} that is categorized under '{row['Hospital Type']}'?"
    ]

    # Pick a random question format
    question = random.choice(question_templates)

    # Get 3 incorrect hospital names
    incorrect_names = df[df["Hospital Name"] != correct_name]["Hospital Name"].dropna().sample(3).tolist()

    options = incorrect_names + [correct_name]
    random.shuffle(options)

    return question, correct_name, options



def init_hospital_qa():
    embedding = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    csv_path = os.path.join("archive", "HospInfo.csv")
    documents, df = load_and_process_hospital_data(csv_path)
    vector_store = FAISS.from_documents(documents, embedding)
    retriever = vector_store.as_retriever()

    generator = pipeline("text2text-generation", model="google/flan-t5-base", max_length=100)
    llm = HuggingFacePipeline(pipeline=generator)

    template = PromptTemplate(
        input_variables=["context", "question"],
        template=(
            "You are a helpful hospital assistant.\n"
            "Use the context below to answer the question.\n"
            "If the answer cannot be found in the context, say you don't know.\n\n"
            "Context: \n{context}\n\n"
            "Question: {question}\nAnswer:"
        )
    )

    qa_chain = RetrievalQA.from_chain_type(llm=llm, retriever=retriever, chain_type_kwargs={"prompt": template})
    return qa_chain, df


if __name__ == "__main__":
    qa_chain, df = init_hospital_qa()

    print("Start typing... Type 'bye' to end chat.\n")
    while True:
        print("\nBot: Would you like to:")
        print("1. Quiz yourself?")
        print("2. Ask hospital related questions?")
        print("Type 'bye' to end the chat.")
        query = input("You: ").strip().lower()
        if query == "bye":
            print("Goodbye!")
            break
        elif query == "1" or query == "quiz yourself":
            # Quiz is disabled here
            print("Bot: Quiz functionality is currently disabled.")
            continue
        elif query == "2" or query == "ask hospital related questions":
            user_question = input("Ask your question: ")
            response = qa_chain.invoke(user_question)
            print(f"Bot: {response}")
        else:
            print("Bot: Invalid choice, please try again.")
