# Dockerfile per UAFT - Next.js Application
# Multi-stage build per ottimizzare le dimensioni dell'immagine

# Stage 1: Dependencies
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copia i file di package
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Builder
FROM node:22-alpine AS builder
WORKDIR /app

# Copia le dipendenze dalla fase precedente
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disabilita telemetry durante il build
ENV NEXT_TELEMETRY_DISABLED=1

# Build dell'applicazione
RUN npm run build

# Crea cartella public se non esiste
RUN mkdir -p /app/public

# Stage 3: Runner
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Crea un utente non-root per sicurezza
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copia i file necessari dal builder
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Imposta i permessi corretti
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
# 24/10/2026 (aggiornamento generale): pacchetti di sistema aggiornati e npm/npx/corepack tolti.
# A runtime npm non serve (CMD node) e le sue dipendenze (brace-expansion, tar, pacote, sigstore…) erano una
# buona parte delle high di Trivy; i pacchetti del sistema prendono le correzioni uscite dopo la base.
USER root
RUN apk upgrade --no-cache \
 && rm -rf /usr/local/lib/node_modules/npm /usr/local/lib/node_modules/corepack /usr/local/bin/npm /usr/local/bin/npx /usr/local/bin/corepack
USER nextjs

CMD ["node", "server.js"]
