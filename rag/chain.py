from langchain_core.runnables import RunnableMap, RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain_google_genai import ChatGoogleGenerativeAI
from rag.prompt import llm_prompt
from rag.config import GOOGLE_API_KEY

def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

def create_rag_chain(retriever):
    llm = ChatGoogleGenerativeAI(
        model="gemini-1.5-flash-latest",
        google_api_key=GOOGLE_API_KEY,
        convert_system_message_to_human=True
    )
    return (
        RunnableMap({
            "context": retriever | format_docs,
            "question": RunnablePassthrough()
        }) | llm_prompt | llm | StrOutputParser()
    )
