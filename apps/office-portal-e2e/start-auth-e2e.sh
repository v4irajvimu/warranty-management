#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

export VITE_USE_FIREBASE_EMULATORS=true
export VITE_FIREBASE_API_KEY=demo-api-key
export VITE_FIREBASE_AUTH_DOMAIN=localhost
export VITE_FIREBASE_PROJECT_ID=demo-office-portal
export VITE_FIREBASE_STORAGE_BUCKET=demo-office-portal.appspot.com
export VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
export VITE_FIREBASE_APP_ID=1:1234567890:web:demo

npx firebase emulators:exec \
  --only auth,firestore \
  --project demo-office-portal \
  --config apps/office-portal/firebase.json \
  "node apps/office-portal-e2e/seed-emulator.mjs && npx nx run @warranty-management/office-portal:dev -- --host=127.0.0.1 --port=4201 --strictPort"
