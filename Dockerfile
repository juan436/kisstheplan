# ============================================================
# Stage 1: deps — solo dependencias de producción
# ============================================================
FROM node:22-alpine AS deps

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./

RUN pnpm install --frozen-lockfile --prod


# ============================================================
# Stage 2: builder — build completo de Next.js
# ============================================================
FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./

# Instalar TODAS las deps (incluyendo devDependencies) para el build
RUN pnpm install --frozen-lockfile

# Copiar código fuente
COPY . .

# Deshabilitar telemetría de Next.js
ENV NEXT_TELEMETRY_DISABLED=1

# Build de producción (usa output: 'standalone' de next.config.ts)
RUN pnpm run build


# ============================================================
# Stage 3: runner — imagen mínima para producción
# ============================================================
FROM node:22-alpine AS production

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

# Usar usuario no-root
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Copiar assets públicos
COPY --from=builder /app/public ./public

# Copiar el output standalone (incluye server.js y node_modules mínimos)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/ || exit 1

# Arrancar con el server.js generado por standalone
CMD ["node", "server.js"]
