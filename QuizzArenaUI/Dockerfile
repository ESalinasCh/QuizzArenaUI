# syntax=docker/dockerfile:1

# ============================================================
# QuizzArenaUI (Angular SPA) container image
#
# Build context is this project folder (QuizzArenaUI/QuizzArenaUI).
#
#   docker build -t quizzarena-ui .
#   docker run --rm -p 8080:8080 quizzarena-ui
#   # open http://localhost:8080
# ============================================================

# ---------- Build stage ----------
FROM node:24-alpine AS build
WORKDIR /app

# Skip the Husky git-hook install that runs on the npm "prepare" script.
ENV HUSKY=0

# Install dependencies from the lockfile first for better layer caching.
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the source and produce an optimized production build.
COPY . .
RUN npm run build -- --configuration production

# ---------- Runtime stage ----------
# Unprivileged nginx: runs as a non-root user and listens on 8080 by default.
FROM nginxinc/nginx-unprivileged:alpine AS final

USER root

# SPA routing config (fallback to index.html).
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Angular's application builder emits browser assets under dist/<project>/browser.
COPY --from=build /app/dist/QuizzArenaUI/browser /usr/share/nginx/html

# Startup script renders /config.json from environment variables. Make config.json
# owned by the runtime user so the (non-root) entrypoint can overwrite it.
COPY docker-entrypoint.d/30-render-config.sh /docker-entrypoint.d/30-render-config.sh
RUN chmod +x /docker-entrypoint.d/30-render-config.sh \
    && touch /usr/share/nginx/html/config.json \
    && chown nginx:nginx /usr/share/nginx/html/config.json

USER nginx

EXPOSE 8080
