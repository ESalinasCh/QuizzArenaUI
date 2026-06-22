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

FROM node:24-alpine AS build
WORKDIR /app

ENV HUSKY=0

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build:i18n

FROM node:24-alpine AS final
WORKDIR /app

RUN npm install -g serve

COPY --from=build /app/dist/QuizzArenaUI/browser ./dist
COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

EXPOSE 8080

ENTRYPOINT ["./docker-entrypoint.sh"]
