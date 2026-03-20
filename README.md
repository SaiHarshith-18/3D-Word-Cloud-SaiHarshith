# WordSphere — 3D Article Visualiser

Turn any news article or Wikipedia page into an interactive 3D word cloud.
Paste a URL, and the app extracts keywords using TF-IDF, then renders them as a rotating 3D sphere you can explore.

### Tech Stack
- **Frontend:** React, TypeScript, Three.js, React Three Fiber, @react-three/drei, Vite
- **Backend:** Python, FastAPI, BeautifulSoup4, scikit-learn, NLTK

---

## Prerequisites

- **macOS**
- **Python 3.10+**
- **Node.js 18+**

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/SaiHarshith-18/3D-Word-Cloud-SaiHarshith.git
cd 3D-Word-Cloud-SaiHarshith
```

### 2. Run the setup script

From the **root** of the project directory (`3D-Word-Cloud-SaiHarshith/`), run:

```bash
chmod +x setup.sh    # make the script executable (first time only)
./setup.sh           # installs everything, starts both servers, opens the browser
```


This single script handles everything:
1. Creates a Python virtual environment and installs backend packages
2. Downloads NLTK stopwords data
3. Installs frontend Node packages
4. Starts both servers concurrently
5. Opens the app in your browser at **http://localhost:5173**

Press `Ctrl + C` to stop both servers.

---

## Manual Setup (alternative)

If you prefer to install and start each server separately:

### Install backend dependencies

```bash
cd backend
python3 -m venv .venv                                # create a virtual environment
source .venv/bin/activate                             # activate it
pip install -r requirements.txt                       # install Python packages
python3 -c "import nltk; nltk.download('stopwords')"  # download NLTK stopwords
cd ..
```

### Install frontend dependencies

```bash
cd frontend
npm install       # install React, Three.js, and other Node packages
cd ..
```

### Start the backend server

```bash
cd backend
source .venv/bin/activate
uvicorn main:app --reload --port 8000    # starts FastAPI on http://localhost:8000
```

### Start the frontend server (open a new terminal)

```bash
cd frontend
npm run dev    # starts the Vite dev server on http://localhost:5173
```

### Open the app

Go to **http://localhost:5173** in your browser. That's it!

Press `Ctrl + C` in each terminal to stop the servers.

---

## How It Works

```
You paste a URL
       ↓
┌─────────────────────────────────────────────┐
│  Frontend (React + React Three Fiber)       │
│  Sends POST /analyze { "url": "..." }       │
│  Vite proxies the request → no CORS issues  │
└──────────────────┬──────────────────────────┘
                   ↓
┌─────────────────────────────────────────────┐
│  Backend (FastAPI)                          │
│  1. Crawls the URL with BeautifulSoup       │
│  2. Strips noise (nav, footer, scripts)     │
│  3. Extracts keywords using TF-IDF          │
│  4. Returns [{ word, weight }, ...]         │
└──────────────────┬──────────────────────────┘
                   ↓
┌─────────────────────────────────────────────┐
│  3D Visualisation                           │
│  Words placed on a sphere (Fibonacci spiral)│
│  Size, color, and boldness = relevance      │
└─────────────────────────────────────────────┘
```

**Step by step:**

1. **Crawling** — The backend fetches the page, strips noise tags (`<script>`, `<nav>`, `<footer>`), and pulls article text from semantic elements like `<article>` or `<main>`.

2. **Keyword Extraction** — The text is split into sentences, each treated as a TF-IDF document. Terms that appear everywhere get penalised; distinctive terms rise to the top. A blocklist removes common artifacts (months, "isbn", "archived", etc.).

3. **3D Rendering** — Keywords are placed on a sphere using the Fibonacci golden-angle spiral for even spacing. Higher-weight words are larger, bolder, and warmer in color.

---

## Interacting with the 3D Cloud

| Action | What it does |
|--------|-------------|
| **Click + drag** | Rotate the sphere |
| **Scroll wheel** | Zoom in / out |
| **Hover a word** | Highlights it and shows its weight as a percentage |

---

## Libraries Used

| Layer | Library | Purpose |
|-------|---------|---------|
| Backend | **FastAPI** | REST API framework |
| Backend | **Uvicorn** | ASGI server |
| Backend | **Requests** | HTTP client for fetching articles |
| Backend | **BeautifulSoup4** + **lxml** | HTML parsing and text extraction |
| Backend | **scikit-learn** | TF-IDF vectorisation |
| Backend | **NLTK** | English stopword list |
| Frontend | **React** | UI framework |
| Frontend | **TypeScript** | Type-safe JavaScript |
| Frontend | **Three.js** | 3D graphics engine |
| Frontend | **React Three Fiber** | React renderer for Three.js |
| Frontend | **@react-three/drei** | OrbitControls, Billboard text, Html overlays |
| Frontend | **Axios** | HTTP client |
| Frontend | **Vite** | Dev server and bundler |

---

## API Reference

### `POST /analyze`

Send a URL, get back keywords with weights.

```json
// Request
{ "url": "https://en.wikipedia.org/wiki/Machine_learning" }

// Response
{
  "keywords": [
    { "word": "learning", "weight": 1.0 },
    { "word": "machine", "weight": 0.73 },
    { "word": "algorithm", "weight": 0.58 }
  ]
}
```

Weights are normalised to `[0.0, 1.0]` — the top keyword is always `1.0`.

### `GET /health`

Returns `{ "status": "ok" }`. Used by `setup.sh` to confirm the backend is ready before opening the browser.

---

## Additional Notes

- **macOS only** — The setup script uses `open` to launch the browser, which is macOS-specific.
- **Paywalled / JS-rendered sites** — The crawler uses simple HTTP requests, so it cannot bypass paywalls or scrape content loaded by client-side JavaScript.
- **English only** — Stopword lists and tokenisation are tuned for English text.
- **Vite proxy** — The frontend dev server proxies `/analyze` to `localhost:8000`, so there are no CORS issues during development.
