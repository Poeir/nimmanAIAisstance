from langchain.vectorstores import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from config import GOOGLE_API_KEY, CHROMA_DB_DIR

# โหลด embedding model
embedding_model = GoogleGenerativeAIEmbeddings(
    model="models/text-embedding-004",
    google_api_key=GOOGLE_API_KEY
)

# โหลด vectorstore
vectorstore = Chroma(
    persist_directory=CHROMA_DB_DIR,
    embedding_function=embedding_model
)

# แสดงจำนวนเอกสารทั้งหมด
print(f"📦 จำนวนเอกสารใน DB: {vectorstore._collection.count()}")

# ดึงเอกสารทั้งหมด
all_docs = vectorstore.get()

# แสดงเอกสารทั้งหมด
for i, content in enumerate(all_docs["documents"], 1):
    print(f"\n📄 เอกสาร {i}")
    print(content)
