from fastapi import FastAPI
from pydantic import BaseModel
from rag.retriever import get_retriever
from rag.memory import memory
from rag.chain import create_rag_chain
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
# อนุญาต frontend ที่เชื่อมเข้ามา (เช่น localhost หรือโดเมนจริง)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # หรือใส่เฉพาะ origin ที่เชื่อมมาจริง เช่น ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],  # หรือระบุเฉพาะที่ใช้ เช่น ["POST"]
    allow_headers=["*"],
)
retriever = get_retriever()
rag_chain = create_rag_chain(retriever)

class QueryRequest(BaseModel):
    question: str

@app.post("/chat")
async def chat_endpoint(request: QueryRequest):
    user_input = request.question
    
    # เพิ่มข้อความ user เข้า memory
    memory.chat_memory.add_user_message(user_input)

    # เรียก chain เพื่อตอบกลับ
    response = rag_chain.invoke(user_input)

    # เพิ่มข้อความ AI เข้า memory
    memory.chat_memory.add_ai_message(response)

    return {"answer": response}
