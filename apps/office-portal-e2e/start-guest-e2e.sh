#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

# Guest tests expect the unconfigured Firebase screen.
# Nx reloads apps/office-portal/.env into the build, so call Vite directly.
# Unset any VITE_FIREBASE_* already exported in the shell, then let
# apps/office-portal/.env.e2e override .env.
exec env \
  -u VITE_FIREBASE_API_KEY \
  -u VITE_FIREBASE_AUTH_DOMAIN \
  -u VITE_FIREBASE_PROJECT_ID \
  -u VITE_FIREBASE_STORAGE_BUCKET \
  -u VITE_FIREBASE_MESSAGING_SENDER_ID \
  -u VITE_FIREBASE_APP_ID \
  -u VITE_USE_FIREBASE_EMULATORS \
  bash -c '
    npx vite build --config apps/office-portal/vite.config.mts --mode e2e
    npx vite preview --config apps/office-portal/vite.config.mts --port 4300 --strictPort
  '
