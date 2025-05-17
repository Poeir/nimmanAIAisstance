# 📁 rag/retriever.py
from langchain.vectorstores import FAISS
from langchain.embeddings import OpenAIEmbeddings

# โหลดฐานข้อมูลเวกเตอร์
embedding = OpenAIEmbeddings()
db = FAISS.load_local("./vector_store/db", embedding)

def retrieve_documents(query: str, k: int = 3):
    return db.similarity_search(query, k=k)