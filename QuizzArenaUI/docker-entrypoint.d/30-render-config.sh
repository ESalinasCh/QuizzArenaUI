#!/bin/sh
# Renders /config.json from environment variables at container startup so a
# single image can run in any environment (12-Factor: Config).
#
# This script is picked up automatically by the nginx image entrypoint, which
# runs every executable in /docker-entrypoint.d/ before starting nginx.
set -eu

CONFIG_PATH="/usr/share/nginx/html/config.json"

cat > "$CONFIG_PATH" <<EOF
{
  "production": ${APP_PRODUCTION:-true},
  "keycloak": {
    "issuer": "${KEYCLOAK_ISSUER:-https://auth.bsdevbo.com/realms/master}",
    "clientId": "${KEYCLOAK_CLIENT_ID:-quiz-arena-ui}"
  },
  "apiBaseUrl": "${API_BASE_URL:-}"
}
EOF

echo "Rendered runtime config to ${CONFIG_PATH}:"
cat "$CONFIG_PATH"
