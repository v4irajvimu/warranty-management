#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

java_major() {
  "$1/bin/java" -version 2>&1 | awk -F '"' '/version/ { split($2, v, "."); print v[1]; exit }'
}

use_jdk_21() {
  local home major
  local candidates=()
  if [[ -n "${JAVA_HOME:-}" && -x "${JAVA_HOME}/bin/java" ]]; then
    candidates+=("$JAVA_HOME")
  fi
  if home="$(/usr/libexec/java_home -v 21 2>/dev/null)"; then
    candidates+=("$home")
  fi
  local cached
  for cached in "$HOME"/.cache/warranty-management/jdk-21*/Contents/Home; do
    candidates+=("$cached")
  done

  for home in "${candidates[@]}"; do
    [[ -x "$home/bin/java" ]] || continue
    major="$(java_major "$home")"
    if [[ "$major" =~ ^[0-9]+$ && "$major" -ge 21 ]]; then
      export JAVA_HOME="$home"
      export PATH="$JAVA_HOME/bin:$PATH"
      return 0
    fi
  done

  echo "Firebase emulators need JDK 21 or newer. Install one, or set JAVA_HOME to it." >&2
  exit 1
}

use_jdk_21

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
