import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate


# =====================================================
# ENV
# =====================================================

load_dotenv()

app = FastAPI()


# =====================================================
# CORS
# =====================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://your-frontend.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =====================================================
# ROOT
# =====================================================

@app.get("/")
def home():
    return {
        "message": "WE-SPORTS Fitness RAG is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


# =====================================================
# LOAD EMBEDDINGS
# =====================================================

print("Loading embedding model...")

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2",
    model_kwargs={
        "device": "cpu"
    },
    encode_kwargs={
        "normalize_embeddings": True
    }
)

print("Embedding model loaded")


# =====================================================
# LOAD FAISS
# =====================================================

print("Loading FAISS index...")

vectorstore = FAISS.load_local(
    ".",
    embeddings,
    allow_dangerous_deserialization=True
)

print("FAISS index loaded")


# =====================================================
# RETRIEVER
# =====================================================

retriever = vectorstore.as_retriever(
    search_type="similarity",
    search_kwargs={
        "k": 5
    }
)


# =====================================================
# GROQ
# =====================================================

print("Initializing Groq...")

llm = ChatGroq(
    model="openai/gpt-oss-20b",
    temperature=0,
    api_key=os.getenv("GROQ_API_KEY")
)

print("Groq initialized")


# =====================================================
# PROMPT
# =====================================================

prompt = ChatPromptTemplate.from_template("""
You are the AI Fitness Trainer for WE-SPORTS.

Answer the user's question using ONLY the information
provided in the context.

If the context does not contain enough information,
say that you don't have enough information from the
available fitness sources.

Do not invent facts.

Context:
{context}

Question:
{question}

Give a clear, practical answer.
""")


# =====================================================
# REQUEST MODEL
# =====================================================

class QuestionRequest(BaseModel):
    question: str


# =====================================================
# ASK
# =====================================================

@app.post("/ask")
async def ask_fitness(request: QuestionRequest):

    question = request.question.strip()

    if not question:
        return {
            "answer": "Please enter a question.",
            "sources": []
        }

    print("Question:", question)

    # Retrieve relevant chunks
    docs = retriever.invoke(question)

    print("Documents retrieved:", len(docs))

    # Build context
    context = "\n\n".join(
        doc.page_content
        for doc in docs
    )

    # Create prompt
    messages = prompt.invoke({
        "context": context,
        "question": question
    })

    # Ask Groq
    response = llm.invoke(messages)

    # Sources
    sources = []

    for doc in docs:

        sources.append({
            "title": doc.metadata.get("title", ""),
            "channel": doc.metadata.get("channel", ""),
            "url": doc.metadata.get("url", ""),
            "category": doc.metadata.get("category", "")
        })

    return {
        "answer": response.content,
        "sources": sources
    }