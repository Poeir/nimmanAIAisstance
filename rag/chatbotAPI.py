from fastapi import FastAPI
from pydantic import BaseModel
from retriever import get_retriever
from memory import memory
from chain import create_rag_chain
from fastapi.middleware.cors import CORSMiddleware

memory.clear()
app = FastAPI()

# อนุญาต frontend ที่เชื่อมเข้ามา
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

retriever = get_retriever()
rag_chain = create_rag_chain(retriever)

class QueryRequest(BaseModel):
    question: str

#endpoint สำหรับรับคำถามจาก frontend
@app.post("/chat")
async def chat_endpoint(request: QueryRequest):
    user_input = request.question

    # รวบรวม chat history จาก memory
    history = memory.chat_memory.messages
    chat_history = ""
    for msg in history:
        role = "คุณ" if msg.type == "human" else "AI"
        chat_history += f"{role}: {msg.content}\n"

    # สร้าง context แล้วเรียก RAG chain
    response = rag_chain.invoke({
        "question": user_input,
        "chat_history": chat_history,
    })

    # บันทึกข้อความเข้า memory
    memory.chat_memory.add_user_message(user_input)
    memory.chat_memory.add_ai_message(response)

    return {"answer": response}
