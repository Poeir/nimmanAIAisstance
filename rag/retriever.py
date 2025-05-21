from langchain_community.vectorstores import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from config import GOOGLE_API_KEY, CHROMA_DB_DIR

def get_retriever():
    embedding_model = GoogleGenerativeAIEmbeddings(
        model="models/text-embedding-004",
        google_api_key=GOOGLE_API_KEY
    )
    vectorstore = Chroma(
        persist_directory=CHROMA_DB_DIR,
        embedding_function=embedding_model
    )
    return vectorstore.as_retriever(search_kwargs={"k": 5})

def add_docs_to_vectorstore(docs):
    embedding_model = GoogleGenerativeAIEmbeddings(
        model="models/text-embedding-004",
        google_api_key=GOOGLE_API_KEY
    )
    vectorstore = Chroma(
        persist_directory=CHROMA_DB_DIR,
        embedding_function=embedding_model
    )
    vectorstore.add_documents(docs)
    vectorstore.persist()
