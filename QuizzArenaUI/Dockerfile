# syntax=docker/dockerfile:1

FROM node:24-alpine AS build
WORKDIR /app

ENV HUSKY=0

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build:i18n

FROM nginx:alpine
COPY --from=build /app/dist/QuizzArenaUI/browser /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY docker-entrypoint.d/ /docker-entrypoint.d/
RUN chmod +x /docker-entrypoint.d/*.sh

EXPOSE 8080
