from langchain.prompts import ChatPromptTemplate

llm_prompt = ChatPromptTemplate.from_template(
    """คุณคือผู้ช่วยแนะนำข้อมูลการท่องเที่ยว
บริบทที่เกี่ยวข้อง:
{context}

คำถาม: {question}
"""
)
