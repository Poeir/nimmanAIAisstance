from retriever import get_retriever
from memory import memory
from chain import create_rag_chain
import sys

retriever = get_retriever()
rag_chain = create_rag_chain(retriever)

def rag_with_memory(user_input):
    history = memory.chat_memory.messages
    chat_context = ""
    for msg in history:
        role = "คุณ" if msg.type == "human" else "AI"
        chat_context += f"{role}: {msg.content}\n"

    response = rag_chain.invoke(user_input)
    memory.chat_memory.add_user_message(user_input)
    memory.chat_memory.add_ai_message(response)
    return response

def main():
    while True:
        q = input("You: ")
        if q.lower() in ["exit", "quit", "พอ", "หยุด", "stop"]:
            break
        a = rag_with_memory(q)
        print("AI:", a)

if __name__ == "__main__":
    main()
