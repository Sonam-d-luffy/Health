import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

from langchain_community.vectorstores import FAISS
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate


# --------------------------------------------------
# ENVIRONMENT
# --------------------------------------------------

load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GOOGLE_API_KEY:
    raise RuntimeError("GOOGLE_API_KEY is not set")

if not GROQ_API_KEY:
    raise RuntimeError("GROQ_API_KEY is not set")


# --------------------------------------------------
# APP
# --------------------------------------------------

app = FastAPI(
    title="WE-SPORTS Fitness RAG",
    version="1.0"
)


# --------------------------------------------------
# CORS
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",

        # Add your Vercel frontend URL here later
        # "https://your-frontend.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# GEMINI EMBEDDINGS
# --------------------------------------------------

print("Loading Gemini embeddings...")

embeddings = GoogleGenerativeAIEmbeddings(
    model="gemini-embedding-001",
    google_api_key=GOOGLE_API_KEY
)

print("Gemini embeddings loaded")


# --------------------------------------------------
# LOAD FAISS
# --------------------------------------------------

print("Loading FAISS index...")

vectorstore = FAISS.load_local(
    ".",
    embeddings,
    allow_dangerous_deserialization=True
)

print("FAISS index loaded")


# --------------------------------------------------
# RETRIEVER
# --------------------------------------------------

retriever = vectorstore.as_retriever(
    search_type="similarity",
    search_kwargs={
        "k": 5
    }
)


# --------------------------------------------------
# GROQ LLM
# --------------------------------------------------

print("Loading Groq LLM...")

llm = ChatGroq(
    model="openai/gpt-oss-20b",
    temperature=0,
    api_key=GROQ_API_KEY
)

print("Groq LLM loaded")


# --------------------------------------------------
# PROMPT
# --------------------------------------------------

prompt = ChatPromptTemplate.from_template("""
You are the AI Fitness Trainer for WE-SPORTS.

Answer the user's question using ONLY the information
provided in the context.

If the context does not contain enough information
to answer the question, say:

"I don't have enough information from the available
fitness sources to answer that."

Do not invent facts.

Give clear, practical and easy-to-understand answers.

Context:
{context}

Question:
{question}

Answer:
""")


# --------------------------------------------------
# REQUEST MODEL
# --------------------------------------------------

class QuestionRequest(BaseModel):
    question: str


# --------------------------------------------------
# ASK ENDPOINT
# --------------------------------------------------

@app.post("/ask")
async def ask_fitness(request: QuestionRequest):

    question = request.question.strip()

    if not question:
        return {
            "answer": "Please enter a fitness question.",
            "sources": []
        }

    try:

        print(f"Question: {question}")

        # ------------------------------------------
        # RETRIEVE RELEVANT DOCUMENTS
        # ------------------------------------------

        docs = retriever.invoke(question)

        print(f"Retrieved documents: {len(docs)}")

        # ------------------------------------------
        # BUILD CONTEXT
        # ------------------------------------------

        context_parts = []

        for doc in docs:

            title = doc.metadata.get(
                "title",
                "Unknown source"
            )

            channel = doc.metadata.get(
                "channel",
                "Unknown channel"
            )

            context_parts.append(
                f"""
Source: {title}
Channel: {channel}

Content:
{doc.page_content}
"""
            )

        context = "\n\n".join(context_parts)

        # ------------------------------------------
        # GENERATE ANSWER
        # ------------------------------------------

        messages = prompt.invoke({
            "context": context,
            "question": question
        })

        response = llm.invoke(messages)

        # ------------------------------------------
        # SOURCES
        # ------------------------------------------

        sources = []

        seen_urls = set()

        for doc in docs:

            url = doc.metadata.get("url", "")

            # Avoid duplicate sources
            if url in seen_urls:
                continue

            seen_urls.add(url)

            sources.append({
                "title": doc.metadata.get(
                    "title",
                    ""
                ),

                "channel": doc.metadata.get(
                    "channel",
                    ""
                ),

                "url": url,

                "category": doc.metadata.get(
                    "category",
                    ""
                )
            })

        return {
            "answer": response.content,
            "sources": sources
        }

    except Exception as e:

        print("ERROR:", str(e))

        return {
            "answer": "Sorry, something went wrong while processing your question.",
            "sources": []
        }


# --------------------------------------------------
# HEALTH CHECK
# --------------------------------------------------

@app.get("/")
def home():

    return {
        "message": "WE-SPORTS Fitness RAG is running",
        "status": "healthy"
    }


@app.get("/health")
def health():

    return {
        "status": "ok"
    }