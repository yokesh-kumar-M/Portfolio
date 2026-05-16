# ══════════════════════════════════════════════
# Stage 1: Build
# ══════════════════════════════════════════════
FROM node:20-alpine AS build

WORKDIR /app

# Install deps first (layer caching)
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# Copy source and build
COPY index.html vite.config.js eslint.config.js ./
COPY public ./public
COPY src ./src

RUN npm run build

# ══════════════════════════════════════════════
# Stage 2: Production — minimal nginx image
# ══════════════════════════════════════════════
FROM nginx:1.27-alpine

# Security: ensure non-root nginx user exists and remove default config in one layer
RUN addgroup -g 101 -S nginx 2>/dev/null || true \
    && adduser -S -D -H -u 101 -h /var/cache/nginx -s /sbin/nologin -G nginx -g nginx nginx 2>/dev/null || true \
    && rm -rf /usr/share/nginx/html/* /etc/nginx/conf.d/default.conf

# Copy built assets
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -qO- http://localhost/health || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
