# Dockerfile per UAFT (uaft.it)
#
# Nato sul server sparktech_st (3/2/2026, mai committato fino al trasloco nel
# cluster), sistemato per il cluster SparkTech l'8/10/2026:
#
# - node:24-bookworm-slim invece di alpine (era node:20, fuori supporto da
#   aprile 2026: niente più patch di sicurezza; passato a 24 LTS il 9/10/2026).
#   Il package-lock si rigenera su Linux glibc (`docker run …
#   node:24-bookworm-slim npm install --package-lock-only`): un lock fatto
#   sul Mac non registra le dipendenze opzionali Linux e `npm ci` nel
#   container fallisce (trappola pagata
#   l'8/9/2026 con QuickSmart). Con alpine servirebbero in più le varianti musl
#   (@next/swc-linux-x64-musl, sharp, lightningcss), che un lock fatto su glibc
#   non garantisce. Stessa base di sparktech-web nella piattaforma.
# - openssl installato PRIMA di `prisma generate`: senza, Prisma sbaglia il
#   rilevamento e genera il query engine per openssl 1.1, mentre a runtime c'è
#   la 3.0; l'app parte ma ogni query fallisce. Oggi uaft nel cluster gira
#   senza database (login e webmail falliscono pagina per pagina), ma il giorno
#   che il database tornerà le query devono funzionare.
# - `npm ci` completo nel primo stadio (prima era `--only=production`): la
#   build ha bisogno di typescript e dei @types, che sono devDependencies.
#   L'immagine finale non ne risente: copia solo l'output `standalone`.
# - utente 10001 numerico: i namespace applicano Pod Security `restricted` e
#   i Deployment della piattaforma girano con runAsUser 10001; con l'utente
#   1001 di prima i file sarebbero stati di un altro utente.

# Stadio 1: dipendenze
FROM node:24-bookworm-slim AS deps
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates \
 && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# Stadio 2: build
FROM node:24-bookworm-slim AS builder
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates \
 && rm -rf /var/lib/apt/lists/*
COPY --from=deps /app/node_modules ./node_modules
# Il contesto arriva filtrato da .dockerignore: niente .env*, certificati,
# chiavi, .git. Next copierebbe un .env nell'output standalone, cioè
# nell'immagine finale.
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
# DATABASE_URL fittizio: prisma.config.ts fa env("DATABASE_URL") e senza la
# variabile `prisma generate` si ferma. Non si collega a niente; a runtime vale
# quella del Deployment (o nessuna: l'app parte lo stesso).
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"

RUN npx prisma generate
RUN npm run build

# Stadio 3: immagine finale
FROM node:24-bookworm-slim AS runner
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates \
 && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
# Nel cluster il runtime imposta HOSTNAME al nome del pod e questa riga NON
# basta: server.js di Next ascolterebbe solo sull'IP del pod. Il Deployment
# deve rimetterlo a 0.0.0.0 nel proprio env (come per QuickSmart e xpnews).
ENV HOSTNAME="0.0.0.0"

RUN groupadd -g 10001 app && useradd -u 10001 -g app -M -s /usr/sbin/nologin app

COPY --from=builder --chown=10001:10001 /app/public ./public
COPY --from=builder --chown=10001:10001 /app/.next/standalone ./
COPY --from=builder --chown=10001:10001 /app/.next/static ./.next/static
COPY --from=builder --chown=10001:10001 /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=10001:10001 /app/prisma ./prisma

USER 10001:10001

EXPOSE 3000

# Sonda leggera, senza database né AI: app/api/healthz/route.ts
CMD ["node", "server.js"]
