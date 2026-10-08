# Dockerfile per UAFT (uaft.com)
# Multi-stage build per ottimizzare le dimensioni

# Stage 1: Dipendenze
FROM node:20-alpine AS deps
WORKDIR /app

# Copia file di configurazione
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app

# Copia dipendenze dal primo stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Variabili d'ambiente per il build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
# Dummy DATABASE_URL per Prisma generate (verrà sovrascritto a runtime)
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"

# Genera Prisma Client
RUN npx prisma generate

# Build Next.js
RUN npm run build

# Stage 3: Runner (immagine finale)
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Crea utente non-root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copia file necessari
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

# Cambia ownership
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
