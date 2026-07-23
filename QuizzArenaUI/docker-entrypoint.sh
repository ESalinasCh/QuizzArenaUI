#!/bin/sh
set -eu

DIST_DIR="/app/dist"
find "$DIST_DIR" -name "config.json" | while read -r CONFIG_PATH; do
cat > "$CONFIG_PATH" <<CONF
{
  "production": ${APP_PRODUCTION:-true},
  "keycloak": {
    "issuer": "${KEYCLOAK_ISSUER:-https://auth.bsdevbo.com/realms/master}",
    "clientId": "${KEYCLOAK_CLIENT_ID:-quiz-arena-ui}"
  },
  "apiBaseUrl": "${API_BASE_URL:-}"
}
CONF
echo "Rendered runtime config to ${CONFIG_PATH}:"
cat "$CONFIG_PATH"
done

exec serve "$DIST_DIR" --listen tcp://0.0.0.0:8080
