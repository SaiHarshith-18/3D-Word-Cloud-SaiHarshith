import ssl
import certifi
import urllib.request
import nltk
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer, ENGLISH_STOP_WORDS

# Fix macOS SSL issue for NLTK downloads; no-op if already downloaded
try:
    _ctx = ssl.create_default_context(cafile=certifi.where())
    urllib.request.install_opener(
        urllib.request.build_opener(urllib.request.HTTPSHandler(context=_ctx))
    )
    nltk.download("stopwords", quiet=True)
except Exception:
    pass  # Already downloaded or network unavailable — proceed anyway

from nltk.corpus import stopwords


def extract_keywords(text: str, top_n: int = 50) -> list[dict]:
    """
    Extract the top_n keywords from text using TF-IDF.

    The article is split into sentences so each sentence is treated as a
    separate document — this gives real IDF variance and naturally penalises
    terms that appear in every sentence (common filler words that survive
    stopword lists).

    Returns a list of {"word": str, "weight": float} dicts sorted descending,
    with weights normalised to [0.0, 1.0].
    """
    # Split into sentences; filter out empty strings
    sentences = [s.strip() for s in text.replace("!", ".").replace("?", ".").split(".")]
    sentences = [s for s in sentences if len(s) > 10]

    if not sentences:
        return []

    # Build combined stopword set: sklearn + NLTK English
    nltk_stops = set(stopwords.words("english"))
    combined_stops = list(set(ENGLISH_STOP_WORDS) | nltk_stops)

    vectorizer = TfidfVectorizer(
        stop_words=combined_stops,
        max_features=top_n,
        ngram_range=(1, 1),
        min_df=1,
        token_pattern=r"[a-zA-Z]{3,}",  # letters only, minimum 3 chars
    )

    try:
        tfidf_matrix = vectorizer.fit_transform(sentences)
    except ValueError:
        return []

    # Sum TF-IDF scores across all sentence-documents per term
    scores = np.asarray(tfidf_matrix.sum(axis=0)).flatten()
    terms = vectorizer.get_feature_names_out()

    # Normalise to [0.0, 1.0]
    max_score = scores.max()
    if max_score == 0:
        return []

    # Post-TF-IDF noise filter: remove short words and Wikipedia/article artifacts
    _BLOCKLIST = {
        "isbn", "cid", "archived", "retrieved", "august",
        "january", "february", "march", "april", "june", "july", "september",
        "october", "november", "december", "pdf", "edit", "new", "original",
        "based", "used", "article", "also", "like", "just", "that", "this", "with",
    }

    results = [
        {"word": term, "weight": round(float(score / max_score), 4)}
        for term, score in zip(terms, scores)
        if len(term) >= 4 and term.lower() not in _BLOCKLIST
    ]

    return sorted(results, key=lambda x: x["weight"], reverse=True)
