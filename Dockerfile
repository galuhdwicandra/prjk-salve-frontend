# ========= Frontend: React (Vite build -> Nginx) =========
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN npm ci || npm install

COPY . .

# Build-time env untuk Vite (sesuai .env frontend Anda) 
ARG VITE_API_BASE_URL
ARG VITE_FILES_BASE_URL
ARG VITE_DEBUG_HTTP=false

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL \
    VITE_FILES_BASE_URL=$VITE_FILES_BASE_URL

RUN npm run build

FROM nginx:alpine
# SPA fallback config inline (tanpa file tambahan)
RUN rm -f /etc/nginx/conf.d/default.conf \
 && printf '%s\n' \
'server {' \
'  listen 80;' \
'  server_name _;' \
'  root /usr/share/nginx/html;' \
'  index index.html;' \
'' \
'  location / {' \
'    try_files $uri $uri/ /index.html;' \
'  }' \
'}' \
> /etc/nginx/conf.d/app.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
