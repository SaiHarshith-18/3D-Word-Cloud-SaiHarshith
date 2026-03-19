import re
import requests
from bs4 import BeautifulSoup


class CrawlError(Exception):
    pass


HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}

# Tags that add noise — strip before extracting text
NOISE_TAGS = ["script", "style", "nav", "footer", "header", "aside", "noscript", "form", "button", "svg"]


def fetch_article_text(url: str) -> str:
    """Fetch a URL and return the cleaned article text."""
    try:
        response = requests.get(url, headers=HEADERS, timeout=15, allow_redirects=True)
        response.raise_for_status()
    except requests.Timeout:
        raise CrawlError(f"Request timed out fetching: {url}")
    except requests.HTTPError as e:
        raise CrawlError(f"HTTP {e.response.status_code} error fetching: {url}")
    except requests.RequestException as e:
        raise CrawlError(f"Network error fetching {url}: {e}")

    response.encoding = response.apparent_encoding
    soup = BeautifulSoup(response.text, "lxml")

    # Remove noise tags in-place
    for tag in soup(NOISE_TAGS):
        tag.decompose()

    # Try to find the main article body in priority order
    text = ""
    for selector in ["[itemprop='articleBody']", "article", ".article-content", ".post-content", "main", "[role='main']"]:
        container = soup.select_one(selector)
        if container:
            text = container.get_text(separator=" ")
            break

    # Fall back to all <p> tags, then full body
    if not text:
        paragraphs = soup.find_all("p")
        if paragraphs:
            text = " ".join(p.get_text(separator=" ") for p in paragraphs)
        elif soup.body:
            text = soup.body.get_text(separator=" ")

    return _clean(text)


def _clean(text: str) -> str:
    """Collapse whitespace and strip the result."""
    text = re.sub(r"\s+", " ", text)
    return text.strip()
