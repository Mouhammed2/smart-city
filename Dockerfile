FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
# Try the strict clean install first; if it fails (lockfile/version mismatch
# between host and container npm), fall back to a standard install so the
# Docker build can proceed. We keep no-audit/no-fund to reduce noise in CI.
RUN sh -c "npm ci --legacy-peer-deps || npm install --no-audit --no-fund --legacy-peer-deps"
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80