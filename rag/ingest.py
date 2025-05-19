import pandas as pd
from retriever import add_docs_to_vectorstore
from docs_loader import load_documents_from_df

# 1. โหลดข้อมูล (เช่นจากไฟล์ CSV)
df = pd.read_csv("FinalGoogleAPIData.csv")  # เปลี่ยน path ตามจริง

# 2. แปลงเป็น Document
docs = load_documents_from_df(df)

# 3. เพิ่มเข้า VectorStore และ Persist
add_docs_to_vectorstore(docs)

print("✅ ข้อมูลถูกเพิ่มเข้า Vector DB เรียบร้อยแล้ว")