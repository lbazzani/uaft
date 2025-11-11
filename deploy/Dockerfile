# Dockerfile per UAFT - Next.js Application
# Multi-stage build per ottimizzare le dimensioni dell'immagine

# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copia i file di package
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app

# Copia le dipendenze dalla fase precedente
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disabilita telemetry durante il build
ENV NEXT_TELEMETRY_DISABLED 1

# Build dell'applicazione
RUN npm run build

# Crea cartella public se non esiste
RUN mkdir -p /app/public

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

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

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
