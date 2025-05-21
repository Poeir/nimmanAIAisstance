from langchain_core.runnables import RunnableMap, RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain_google_genai import ChatGoogleGenerativeAI
from prompt import llm_prompt
from config import GOOGLE_API_KEY
from langchain_core.runnables import RunnableLambda


def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

def create_rag_chain(retriever):
    llm = ChatGoogleGenerativeAI(
        model="gemini-1.5-flash-latest",
        google_api_key=GOOGLE_API_KEY,
        convert_system_message_to_human=True,
        temperature=0.2
    )
    return (
        RunnableMap({
            "context": RunnableLambda(lambda x: x["question"]) | retriever | format_docs,
            "question": RunnableLambda(lambda x: x["question"]),
            "chat_history": RunnableLambda(lambda x: x["chat_history"])
        }) | llm_prompt | llm | StrOutputParser()
    )
