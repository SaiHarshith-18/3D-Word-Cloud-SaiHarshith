#!/usr/bin/env bash
set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"

echo "=== Setting up 3D Word Cloud ==="

# ── Backend ──
echo ""
echo "▸ Installing Python dependencies..."
cd "$ROOT/backend"
if [ ! -d .venv ]; then
  python3 -m venv .venv
fi
source .venv/bin/activate
pip install -q -r requirements.txt
python3 -c "
import ssl, urllib.request, nltk
try:
    import certifi
    ctx = ssl.create_default_context(cafile=certifi.where())
    urllib.request.install_opener(
        urllib.request.build_opener(urllib.request.HTTPSHandler(context=ctx))
    )
except ImportError:
    pass
nltk.download('stopwords', quiet=True)
"
deactivate
cd "$ROOT"

# ── Frontend ──
echo ""
echo "▸ Installing Node dependencies..."
cd "$ROOT/frontend"
npm install --silent
cd "$ROOT"

# ── Launch both servers ──
echo ""
echo "▸ Starting servers..."

(cd "$ROOT/backend" && source .venv/bin/activate && uvicorn main:app --reload --port 8000) &
BACKEND_PID=$!

(cd "$ROOT/frontend" && npm run dev) &
FRONTEND_PID=$!

# Clean shutdown on Ctrl+C
trap "echo ''; echo 'Shutting down...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" INT TERM

# Wait for backend health check
echo "▸ Waiting for backend to be ready..."
READY=false
for i in $(seq 1 30); do
  if curl -sf http://localhost:8000/health > /dev/null 2>&1; then
    echo "✓ Backend ready"
    READY=true
    break
  fi
  sleep 0.5
done

if [ "$READY" = false ]; then
  echo "⚠ Backend did not respond within 15 seconds — check for errors above"
fi

# Open browser (macOS)
open http://localhost:5173 2>/dev/null || true

echo ""
echo "=== Ready ==="
echo "  Frontend → http://localhost:5173"
echo "  Backend  → http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop both servers."

wait
