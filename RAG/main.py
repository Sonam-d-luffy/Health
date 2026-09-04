import os

from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv

from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate

from fastapi.middleware.cors import CORSMiddleware

load_dotenv()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)


vectorstore = FAISS.load_local(
    ".",
    embeddings,
    allow_dangerous_deserialization=True
)

retriever = vectorstore.as_retriever(
    search_type="similarity",
    search_kwargs={"k": 5}
)

llm = ChatGroq(
    model="openai/gpt-oss-20b",
    temperature=0
)


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

class QuestionRequest(BaseModel):
    question: str

@app.post("/ask")
async def ask_fitness(request: QuestionRequest):

    question = request.question

    docs = retriever.invoke(question)

    context = "\n\n".join(
        doc.page_content
        for doc in docs
    )

    messages = prompt.invoke({
        "context": context,
        "question": question
    })

    response = llm.invoke(messages)

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


@app.get("/")
def home():
    return {
        "message": "WE-SPORTS Fitness RAG is running"
    }