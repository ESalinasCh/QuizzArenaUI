#!/bin/sh
# Render runtime config.json from environment variables before nginx starts.
set -e

TARGET=/usr/share/nginx/html/config.json

cat > "$TARGET" <<TMPL
{
  "production": ${APP_PRODUCTION:-false},
  "keycloak": {
    "issuer": "${KEYCLOAK_ISSUER:-http://localhost:8180/realms/quiz-arena}",
    "clientId": "${KEYCLOAK_CLIENT_ID:-quiz-arena-ui}"
  },
  "apiBaseUrl": "${API_BASE_URL:-}"
}
TMPL

echo "30-render-config.sh: wrote $TARGET"
