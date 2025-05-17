from langchain.vectorstores import Chroma
from langchain.schema import Document

def build_vectorstore_from_text(content: str, embedding_model, persist_dir: str = "./chroma_db"):
    documents = [Document(page_content=content, metadata={"source": "local"})]
    
    vectorstore = Chroma.from_documents(
        documents=documents,
        embedding=embedding_model,
        persist_directory=persist_dir
    )
    # บันทึกฐานข้อมูลเวกเตอร์ลงดิสก์ (Chroma จะทำให้เองตอนสร้าง)
    return vectorstore
