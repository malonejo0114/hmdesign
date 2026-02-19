#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PORT="${1:-8000}"

if command -v python3 >/dev/null 2>&1; then
  PY_CMD="python3"
elif command -v python >/dev/null 2>&1; then
  PY_CMD="python"
else
  echo "[ERROR] python3/python 명령을 찾을 수 없습니다. Python 설치 후 다시 시도하세요." >&2
  exit 1
fi

echo "[INFO] Using: $PY_CMD"
echo "[INFO] Serving: $ROOT_DIR"
echo "[INFO] URL: http://localhost:${PORT}/web/"

cd "$ROOT_DIR"
exec "$PY_CMD" -m http.server "$PORT"
