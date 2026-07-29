#!/usr/bin/env bash
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

# Build admin with test Firebase config
cd "$ROOT/packages/cms"
VITE_FIREBASE_API_KEY=test-api-key \
VITE_FIREBASE_AUTH_DOMAIN=test-project.firebaseapp.com \
VITE_FIREBASE_PROJECT_ID=test-project \
VITE_FIREBASE_STORAGE_BUCKET=test-project.appspot.com \
VITE_FIREBASE_APP_ID=1:000000000000:web:0000000000000000000000 \
  npx vite build --config src/admin/vite.config.ts > /dev/null 2>&1

# Serve the built admin
node "$ROOT/scripts/serve-spa.mjs" "$ROOT/packages/cms/dist/admin" 3500
