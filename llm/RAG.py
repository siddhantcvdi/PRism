import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_community.vectorstores import FAISS
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document
from langchain.prompts import ChatPromptTemplate
from langchain.schema.runnable import RunnablePassthrough

load_dotenv()

app = FastAPI(title="Code Diff Summarization API",
            description="API for analyzing code changes using Gemini AI",
            version="1.0.0")

class DiffRequest(BaseModel):
    diff_content: str

def validate_environment():
    """Ensure required environment variables are set"""
    required_vars = ['GOOGLE_API_KEY']
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    
    if missing_vars:
        raise EnvironmentError(
            f"Missing required environment variables: {', '.join(missing_vars)}"
        )

@app.on_event("startup")
async def startup_event():
    validate_environment()

def create_rag_pipeline(diff_content: str):
    """Create RAG pipeline with FAISS and Gemini"""
    documents = [Document(page_content=diff_content, metadata={"source": "code_diff"})]
    
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        separators=["\n\n", "\n", " ", ""]
    )
    split_docs = text_splitter.split_documents(documents)

    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/text-embedding-004",
        google_api_key=os.getenv("GOOGLE_API_KEY")
    )
    
    vector_db = FAISS.from_documents(split_docs, embeddings)
    retriever = vector_db.as_retriever(search_kwargs={"k": 4})

    model = ChatGoogleGenerativeAI(
        model="gemini-1.5-pro",
        google_api_key=os.getenv("GOOGLE_API_KEY"),
        temperature=0,
        max_retries=2
    )

    template = """Human: You are a senior software engineer analyzing code changes.
    Generate a detailed summary of the following code changes between two GitHub commits.
    Focus on:
    - Major features/improvements added
    - Critical bug fixes
    - Potential breaking changes
    - Architectural modifications
    - Important refactoring efforts

    At the end of summary add a PR importance rating from 1 to 5. No other text is needed only the integer in format - PR_IMPORTANCE:1/2/3/4/5.

    Provide the summary in markdown format with clear section headers.

    Code changes:
    {context}

    Assistant:"""  
    
    prompt = ChatPromptTemplate.from_template(template)

    rag_chain = (
        {"context": retriever | format_docs, "question": RunnablePassthrough()}
        | prompt
        | model
    )
    
    return rag_chain

def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

@app.post("/summarize")
async def summarize_diff(request: DiffRequest):
    """Endpoint to summarize code diffs"""
    try:
        rag_chain = create_rag_pipeline(request.diff_content)
        response = rag_chain.invoke("Generate comprehensive summary of code changes")
        return {"summary": response.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)