from retriever import get_retriever

retriever = get_retriever()

query = "ร้านอาหารไทย"  # เช่น "ร้านนวดที่เปิดวันอาทิตย์คือร้านใด?"
docs = retriever.get_relevant_documents(query)

print("🔍 จำนวนเอกสารที่เจอ:", len(docs))
for i, doc in enumerate(docs, 1):
    print(f"\n📄 เอกสารที่ {i}:\n{doc.page_content}")
