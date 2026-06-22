# QuizzArenaUI — task runner
# Requires: just, docker, docker compose
# Run `just` to see available recipes.

set dotenv-load := true

compose := "docker compose"
app_dir := "QuizzArenaUI"

# List available recipes (default)
default:
    @just --list

# ── Docker env (UI + Keycloak) ─────────────────────────────────────────────────

# Build and start UI + Keycloak
up:
    {{ compose }} up -d --build
    @echo ""
    @echo "  UI        →  http://localhost:4200"
    @echo "  Keycloak  →  http://localhost:${KEYCLOAK_PORT:-8180}"
    @echo "  Admin     →  http://localhost:${KEYCLOAK_PORT:-8180}/admin  (admin / admin)"
    @echo ""

# Stop all containers (keep volumes)
down:
    {{ compose }} down

# Stop and remove volumes (clean slate — wipes Keycloak data)
down-clean:
    {{ compose }} down -v

# Rebuild the UI image and restart it without touching Keycloak
restart:
    {{ compose }} up -d --build ui

# Show live logs for all services
logs:
    {{ compose }} logs -f

# Show live logs for the UI only
logs-ui:
    {{ compose }} logs -f ui

# Show live logs for Keycloak only
logs-keycloak:
    {{ compose }} logs -f keycloak

# Show running container status
ps:
    {{ compose }} ps

# ── Dev helpers ────────────────────────────────────────────────────────────────

# Serve the app locally with Angular dev server (requires Node, uses public/config.json)
dev:
    cd {{ app_dir }} && npm run start

# Install npm dependencies
install:
    cd {{ app_dir }} && npm ci

# Run linter
lint:
    cd {{ app_dir }} && npm run lint

# Run unit tests (single run, no watch)
test:
    cd {{ app_dir }} && npm run test -- --watch=false

# Production build into dist/
build-app:
    cd {{ app_dir }} && npm run build -- --configuration production

# ── Browser shortcuts ──────────────────────────────────────────────────────────

# Open the UI in the default browser
open:
    @echo "Opening http://localhost:4200"
    xdg-open http://localhost:4200 2>/dev/null || open http://localhost:4200 2>/dev/null || true

# Open the Keycloak admin console
open-keycloak:
    @echo "Opening Keycloak admin (admin / admin)"
    xdg-open http://localhost:${KEYCLOAK_PORT:-8180}/admin 2>/dev/null || open http://localhost:${KEYCLOAK_PORT:-8180}/admin 2>/dev/null || true
