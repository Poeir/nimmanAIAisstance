from langchain.vectorstores import Chroma

def load_vectorstore(persist_directory: str, embedding_function):
    vectorstore = Chroma(
        persist_directory=persist_directory,
        embedding_function=embedding_function
    )
    retriever = vectorstore.as_retriever(search_kwargs={"k": 1})
    return retriever
