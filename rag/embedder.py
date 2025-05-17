from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain.schema import Document
from langchain_community.vectorstores import Chroma
import pandas as pd

gemini_embeddings = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004")

# Create a single Document
documents = [Document(page_content=all_content, metadata={"source": "local"})]

vectorstore = Chroma.from_documents(
                     documents=documents,                 # Pass the list of Documents here
                     embedding=gemini_embeddings,    # Embedding model
                     persist_directory="./chroma_db" # Directory to save data
                     )