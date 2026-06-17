# 12-Factor App Compliance Report — QuizzArenaUI

Date: 2026-06-10

Scope: `QuizzArenaUI` — an Angular 21 single-page application (SPA) authenticating against Keycloak via OIDC (`angular-oauth2-oidc`).

## A note on applicability

The 12-Factor methodology was written for backend services that run as long-lived server processes. A browser SPA is different: it is built into a bundle of static assets, shipped to a CDN/web server, and executed in the user's browser. Several factors (stateless processes, concurrency, disposability, admin processes) apply only indirectly or shift to the hosting layer. Where a factor doesn't map cleanly, this report says so rather than forcing a grade. The most meaningful factors for an SPA are Config, Build/Release/Run, Dev/Prod Parity, and Dependencies.

## Summary

> **Update (2026-06-10):** The project has since been containerized (multi-stage Docker build served by nginx) and migrated to **runtime configuration** — environment values are no longer compiled into the bundle but loaded from `/config.json`, which the container renders from environment variables at startup. The sections below reflect the current state; the original gaps are noted as "Previously" where resolved.

The project has clean dependency management and a sensible Angular structure. Its former biggest gap — build-time configuration — has been resolved: a single built artifact now runs in any environment via runtime config. The main remaining gap is in CI, which still does not produce or publish a production build artifact.

### Scorecard

| # | Factor | Status | Notes |
|---|--------|--------|-------|
| 1 | Codebase | ✅ Compliant | Single repo, one app |
| 2 | Dependencies | ✅ Compliant | npm + lockfile, `npm ci`, pinned package manager |
| 3 | Config | ✅ Compliant | Runtime `config.json` rendered from env vars at startup |
| 4 | Backing services | 🟡 Partial | Keycloak + API URL now env-configurable; no API client yet |
| 5 | Build, release, run | ✅ Compliant | CI builds + publishes Docker image to GHCR |
| 6 | Processes | ✅ Compliant (by nature) | Browser app; no server-side session |
| 7 | Port binding | ✅ Compliant | nginx container serves on port 8080 |
| 8 | Concurrency | 🟡 N/A | Scales via static hosting/CDN, not process model |
| 9 | Disposability | ✅ Compliant (by nature) | Stateless static assets, fast load |
| 10 | Dev/prod parity | ✅ Compliant | One artifact; per-deploy values from runtime config |
| 11 | Logs | 🟡 Partial | Ad-hoc `console.error`; no structured client logging |
| 12 | Admin processes | 🟡 N/A | No migrations/admin tasks for a frontend |

Legend: ✅ Compliant · 🟡 Partial / Not applicable · ❌ Non-compliant

---

## I. Codebase — ✅ Compliant

One codebase tracked in Git, one deployable app.

- `QuizzArenaUI` is its own Git repository containing a single Angular application (`angular.json` defines one project, `QuizzArenaUI`).
- The frontend and backend live in separate repos, which is a valid choice — each is one codebase per app.

No action required.

## II. Dependencies — ✅ Compliant

Dependencies are explicitly declared and isolated.

- `package.json` declares all runtime and dev dependencies; `package-lock.json` pins the full tree.
- CI installs with `npm ci` (`.github/workflows/build.yml`), which installs strictly from the lockfile — reproducible builds.
- The package manager itself is pinned: `"packageManager": "npm@11.2.0"`.
- `node_modules` is gitignored. Isolation is handled by npm.

Minor note: runtime dependencies use caret ranges (e.g. `@angular/core: ^21.2.0`), but the lockfile pins exact versions, so reproducibility holds as long as `npm ci` is used.

## III. Config — ✅ Compliant

Config that varies between deploys now comes from the environment at runtime, not from the compiled artifact.

- Per-deploy values live in `/config.json`, loaded by `src/main.ts` (via `fetch('config.json')`) **before** Angular bootstraps. The parsed config is provided through the `APP_CONFIG` injection token (`src/app/core/config/app-config.ts`) and consumed by `src/app/app.config.ts` to build the OAuth/Keycloak configuration.
- The container renders `config.json` at startup from environment variables via `docker-entrypoint.d/30-render-config.sh`: `KEYCLOAK_ISSUER`, `KEYCLOAK_CLIENT_ID`, `API_BASE_URL`, and `APP_PRODUCTION`. nginx serves it with `Cache-Control: no-cache` so redeploys take effect immediately.
- `src/environments/environment.ts` / `environment.prod.ts` are reduced to a single build-time `production` flag — no per-deploy values are compiled into the bundle anymore.
- `public/config.json` provides local-dev defaults so `ng serve` works without the container.

Result: one built artifact runs in any environment by changing environment variables only — no rebuild required.

Previously: the Keycloak issuer and client ID were hard-coded in `environment.ts` and swapped at build time via `angular.json` `fileReplacements`, requiring a rebuild per environment.

## IV. Backing Services — 🟡 Partial

Backing services should be attached resources referenced by config.

- **Keycloak** (OIDC provider) is now an attached resource configured purely through runtime config (`KEYCLOAK_ISSUER` / `KEYCLOAK_CLIENT_ID`), so it can be swapped per deploy without rebuilding.
- An `apiBaseUrl` value is now part of the runtime config (`API_BASE_URL`), so the backend API endpoint is configurable. However, there is not yet an API client/service in the app that consumes it — the HTTP stack and `authInterceptor` are wired, but no feature calls the backend through a configured base URL.

Recommendations:
- Add an API service that reads `apiBaseUrl` from `APP_CONFIG` and routes all backend calls through it.

## V. Build, Release, Run — ✅ Compliant

These stages are now strictly separated.

- **Build:** CI runs `npm ci`, `npm run lint`, `npm run test`, and `npm run build -- --configuration production`. The `dist/QuizzArenaUI/browser` output is uploaded as a GitHub Actions artifact.
- **Release:** The `docker` job builds and pushes an immutable image to GitHub Container Registry (`ghcr.io`) tagged with the branch name, short SHA, and `latest` on the default branch. Only runs on `push`, not PRs.
- **Run:** The `nginxinc/nginx-unprivileged` container serves static assets on port 8080. The same image runs in any environment via runtime config — no rebuilds required to change environments.

Previously: CI ran only lint and tests; there was no production build, no artifact, and no Docker image.

## VI. Processes — ✅ Compliant (by nature)

Apps should be stateless and share-nothing.

- A browser SPA holds no server-side session. Auth state is kept in memory via Angular signals (`auth.service.ts` uses `signal<AuthState>`), and tokens are managed by `angular-oauth2-oidc` in browser storage — per-user, per-browser, not shared server state.
- There is no server process to keep state in, so the factor is satisfied by the nature of the app.

No action required.

## VII. Port Binding — ✅ Compliant

A 12-factor app exports services via port binding and is self-contained.

- The production image is self-contained: `nginxinc/nginx-unprivileged` serves the built app and binds port `8080` (`nginx/default.conf`, `EXPOSE 8080`), running as a non-root user.
- In development, `ng serve` binds port `4200`.

No action required.

## VIII. Concurrency — 🟡 Not applicable

Scale out via the process model.

- An SPA does not scale by forking processes; it scales by serving static assets from a CDN/web server to many browsers. Concurrency is a property of the hosting layer, not the app.

No action required at the app level; ensure the chosen static host/CDN scales.

## IX. Disposability — ✅ Compliant (by nature)

Fast startup and graceful shutdown.

- Static assets have no startup/shutdown lifecycle on a server. Production builds use `outputHashing: all` for cache-busting, and the app bootstraps quickly in the browser (`main.ts` → `bootstrapApplication`).
- Initial-bundle budgets in `angular.json` (warn 500 kB / error 1 MB) help keep load fast.

No action required.

## X. Dev/Prod Parity — ✅ Compliant

Keep development, staging, and production as similar as possible.

- A single built artifact is now promoted across environments; the only differences are the runtime config values injected per deploy (factor III). Development can point at a dev Keycloak realm while production points at the prod realm, without separate builds.
- `public/config.json` carries dev defaults (`production: false`); the container renders production values from environment variables.

Previously: `environment.ts` and `environment.prod.ts` were byte-for-byte identical, so development authenticated against the production Keycloak realm, and config divergence was enforced by duplication rather than a single promoted artifact.

## XI. Logs — 🟡 Partial

Treat logs as event streams; don't manage log routing in the app.

- Logging is ad-hoc: `main.ts` uses `console.error((err) => ...)` for bootstrap failures and `auth.service.ts` swallows auth errors with `.catch(() => true)`.
- For a browser app, writing to the console is the natural equivalent of stdout, so this isn't a hard violation — but there's no structured client logging or error-reporting integration (e.g. Sentry), and silently swallowing auth errors hides failures.

Recommendations:
- Add a lightweight logging/error-reporting service and avoid silently discarding errors (at least log the caught auth error).

## XII. Admin Processes — 🟡 Not applicable

Run admin/management tasks as one-off processes.

- A frontend has no database migrations, seeding, or one-off maintenance tasks. Angular CLI schematics (`ng generate`) are development-time scaffolding, not runtime admin processes.

No action required.

---

## Priority Recommendations

Resolved since the initial assessment:
- ✅ Externalized runtime configuration via `/config.json` rendered from environment variables at container startup (Factors III, IV, X).
- ✅ Added a production serving story — multi-stage Docker build served by non-root nginx on port 8080 (Factors V, VII).
- ✅ CI now runs a production build (`ng build --configuration production`) and builds/pushes a Docker image to GHCR on every push (Factor V).

Remaining:
1. Add a production build and Docker image build/publish step to CI so releases are immutable and versioned. (Factor V)
2. Add an API service that consumes `apiBaseUrl` from `APP_CONFIG` for all backend calls. (Factor IV)
3. Point development at a non-production Keycloak realm via `public/config.json`. (Factor X)
4. Add structured client-side logging/error reporting and stop silently swallowing auth errors in `auth.service.ts`. (Factor XI)
