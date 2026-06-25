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

# ── Setup ──────────────────────────────────────────────────────────────────────

# Register git hooks — run once after cloning the repo (also done by `npm ci`)
install-hooks:
    git config core.hooksPath {{ app_dir }}/.husky
    chmod +x {{ app_dir }}/.husky/commit-msg {{ app_dir }}/.husky/pre-commit {{ app_dir }}/.husky/pre-push {{ app_dir }}/.husky/lint-staged.sh
    @echo "✔  git hooks registered (core.hooksPath = {{ app_dir }}/.husky)"

# ── Dev helpers ────────────────────────────────────────────────────────────────

# Serve the app locally with Angular dev server (requires Node, uses public/config.json)
dev:
    cd {{ app_dir }} && npm run start

# Install npm dependencies (the prepare script also registers the git hooks)
install:
    cd {{ app_dir }} && npm ci

# Production build into dist/
build-app:
    cd {{ app_dir }} && npm run build -- --configuration production

# ── Static analysis ────────────────────────────────────────────────────────────

# Lint all TypeScript/HTML with ESLint (mirrors CI)
lint:
    cd {{ app_dir }} && npm run lint

# Auto-fix ESLint issues where possible
lint-fix:
    cd {{ app_dir }} && npm run lint:fix

# Check Prettier formatting across src — fails on any diff (run `just format-fix` to fix)
format:
    cd {{ app_dir }} && npm run format

# Auto-format src with Prettier in place
format-fix:
    cd {{ app_dir }} && npm run format:fix

# Type-check the app with tsc (no output emitted)
type-check:
    cd {{ app_dir }} && npm run type-check

# Lint + format-check ONLY the staged source files (fast — used by pre-commit)
lint-staged:
    bash {{ app_dir }}/.husky/lint-staged.sh

# ── Unit tests ─────────────────────────────────────────────────────────────────

# Run unit tests once, no watch (used by the pre-push hook and local dev)
test:
    cd {{ app_dir }} && npm run test -- --watch=false

# Run unit tests with coverage (requires a coverage provider, e.g. @vitest/coverage-v8)
test-coverage:
    cd {{ app_dir }} && npm run test -- --watch=false --coverage

# ── Secret scanning ────────────────────────────────────────────────────────────

# Scan the full git history for accidentally committed secrets (requires Docker)
scan-secrets:
    @echo "Scanning git history for secrets with gitleaks…"
    docker run --rm \
        -v "$(pwd):/repo" \
        zricethezav/gitleaks:latest detect \
            --source /repo \
            --config /repo/.gitleaks.toml \
            --verbose \
            --exit-code 1

# Scan only staged changes — run this before committing (pre-commit guard)
scan-secrets-staged:
    @echo "Scanning staged changes for secrets…"
    docker run --rm \
        -v "$(pwd):/repo" \
        zricethezav/gitleaks:latest protect \
            --source /repo \
            --config /repo/.gitleaks.toml \
            --staged \
            --verbose

# ── Security audit ─────────────────────────────────────────────────────────────

# Audit npm dependencies for known CVEs — fails on high/critical severity
audit:
    cd {{ app_dir }} && npm audit --audit-level=high

# ── All quality gates ──────────────────────────────────────────────────────────

# Run every quality gate in sequence: lint → format → type-check → test → scan-secrets → audit
check-all: lint format type-check test scan-secrets audit
    @echo ""
    @echo "✅  All quality gates passed."

# ── Browser shortcuts ──────────────────────────────────────────────────────────

# Open the UI in the default browser
open:
    @echo "Opening http://localhost:4200"
    xdg-open http://localhost:4200 2>/dev/null || open http://localhost:4200 2>/dev/null || true

# Open the Keycloak admin console
open-keycloak:
    @echo "Opening Keycloak admin (admin / admin)"
    xdg-open http://localhost:${KEYCLOAK_PORT:-8180}/admin 2>/dev/null || open http://localhost:${KEYCLOAK_PORT:-8180}/admin 2>/dev/null || true
