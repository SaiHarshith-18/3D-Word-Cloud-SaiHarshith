from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from services.crawler import fetch_article_text, CrawlError
from services.keyword_extractor import extract_keywords

app = FastAPI(title="3D Word Cloud API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class AnalyzeRequest(BaseModel):
    url: str


@app.get("/health")
def health():
    return {"status": "ok"}

# Endpoint to analyze a URL and return extracted keywords
@app.post("/analyze")
def analyze(body: AnalyzeRequest):
    try:
        text = fetch_article_text(body.url)
    except CrawlError as e:
        raise HTTPException(status_code=422, detail=str(e))

    if not text:
        raise HTTPException(status_code=422, detail="No readable text found at the provided URL.")

    keywords = extract_keywords(text, top_n=60)

    if not keywords:
        raise HTTPException(status_code=422, detail="Could not extract keywords from the article.")

    return {"keywords": keywords}
