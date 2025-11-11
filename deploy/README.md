# UAFT - Docker Deployment Guide

Questa cartella contiene tutti i file necessari per deployare l'applicazione UAFT in Docker.

## Prerequisiti

- Docker (versione 20.10 o superiore)
- Docker Compose (versione 2.0 o superiore)

## File inclusi

- `Dockerfile` - Configurazione Docker multi-stage ottimizzata per Next.js
- `docker-compose.yml` - Orchestrazione dei servizi
- `.dockerignore` - File da escludere dal build context
- `deploy.sh` - Script interattivo per il deployment
- `README.md` - Questa guida

## Setup Rapido

### 1. Configura le variabili d'ambiente

Crea il file `.env.local` nella root del progetto (se non esiste già):

```bash
cp ../.env.example ../.env.local
```

Modifica `.env.local` con le tue configurazioni:

```bash
OPENAI_API_KEY=your-actual-openai-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 2. Lancia l'applicazione

Usa lo script interattivo:

```bash
./deploy.sh
```

Oppure usa direttamente Docker Compose:

```bash
# Build e avvio
docker-compose up -d --build

# Solo avvio (senza rebuild)
docker-compose up -d

# Stop
docker-compose down
```

### 3. Accedi all'applicazione

Apri il browser e vai su: `http://localhost:3000`

## Comandi Utili

### Visualizza i logs
```bash
docker-compose logs -f
```

### Visualizza lo stato dei container
```bash
docker-compose ps
```

### Rebuild completo (pulisci cache)
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Entra nel container
```bash
docker exec -it uaft-app sh
```

### Rimuovi tutto (container, volumi, network)
```bash
docker-compose down -v
```

## Configurazione Avanzata

### Porta personalizzata

Modifica `docker-compose.yml`:

```yaml
ports:
  - "8080:3000"  # Cambia 8080 con la porta desiderata
```

### Variabili d'ambiente aggiuntive

Aggiungi in `docker-compose.yml` sotto `environment`:

```yaml
environment:
  - NODE_ENV=production
  - CUSTOM_VAR=value
```

### Health Check

Il container include un health check automatico che verifica lo stato dell'app ogni 30 secondi.

## Troubleshooting

### L'applicazione non si avvia

1. Verifica i logs: `docker-compose logs -f`
2. Controlla che le porte non siano già in uso
3. Verifica che `.env.local` esista e contenga le variabili necessarie

### Build fallisce

1. Pulisci la cache: `docker-compose build --no-cache`
2. Verifica lo spazio disco disponibile
3. Controlla i logs di build

### Container si ferma subito

1. Controlla i logs: `docker-compose logs uaft`
2. Verifica le variabili d'ambiente
3. Assicurati che il file `.env.local` sia nella root del progetto

## Struttura Multi-Stage Build

Il Dockerfile usa una build multi-stage per ottimizzare le dimensioni:

1. **deps** - Installa le dipendenze
2. **builder** - Builda l'applicazione Next.js
3. **runner** - Immagine finale minimale con solo i file necessari

Questo riduce significativamente la dimensione dell'immagine finale.

## Sicurezza

- Il container usa un utente non-root (`nextjs`)
- Le variabili sensibili sono caricate da `.env.local`
- `.env.local` è escluso dal version control via `.gitignore`

## Produzione

Per il deploy in produzione:

1. Usa un reverse proxy (nginx, Traefik)
2. Configura HTTPS
3. Imposta variabili d'ambiente sicure
4. Considera l'uso di secrets management (Docker Secrets, vault, ecc.)
5. Implementa monitoring e logging

## Supporto

Per problemi o domande, consulta:
- [Next.js Docker Documentation](https://nextjs.org/docs/deployment#docker-image)
- [Docker Documentation](https://docs.docker.com/)
