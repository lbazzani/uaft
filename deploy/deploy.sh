#!/bin/bash

# Script di deploy per UAFT Docker Application
# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== UAFT Docker Deployment ===${NC}"

# Verifica che Docker sia installato
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Errore: Docker non è installato${NC}"
    exit 1
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null 2>&1; then
    echo -e "${RED}Errore: Docker Compose non è installato${NC}"
    exit 1
fi

# Determina il comando docker compose
if docker compose version &> /dev/null 2>&1; then
    DOCKER_COMPOSE="docker compose"
else
    DOCKER_COMPOSE="docker-compose"
fi

# Directory di lavoro
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo -e "${YELLOW}Directory del progetto: ${PROJECT_DIR}${NC}"

# Funzione per trovare una porta libera tra 3000 e 4000
find_free_port() {
    for port in {3000..4000}; do
        if ! ss -tuln | grep -q ":${port} "; then
            echo "$port"
            return 0
        fi
    done
    echo -e "${RED}Errore: Nessuna porta libera trovata tra 3000 e 4000${NC}"
    exit 1
}

# Trova una porta libera se UAFT_PORT non è già impostata
if [ -z "$UAFT_PORT" ]; then
    UAFT_PORT=$(find_free_port)
    export UAFT_PORT
    echo -e "${GREEN}Porta libera trovata: ${UAFT_PORT}${NC}"
else
    echo -e "${GREEN}Utilizzo porta specificata: ${UAFT_PORT}${NC}"
fi

# Verifica che esista il file .env.local
if [ ! -f "$PROJECT_DIR/.env.local" ]; then
    echo -e "${YELLOW}Attenzione: File .env.local non trovato${NC}"
    echo -e "${YELLOW}Vuoi crearlo ora dal template .env.example? (y/n)${NC}"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        if [ -f "$PROJECT_DIR/.env.example" ]; then
            cp "$PROJECT_DIR/.env.example" "$PROJECT_DIR/.env.local"
            echo -e "${GREEN}File .env.local creato. Modifica le variabili necessarie e rilancia lo script.${NC}"
            exit 0
        else
            echo -e "${RED}File .env.example non trovato${NC}"
            exit 1
        fi
    fi
fi

# Naviga nella directory deploy
cd "$SCRIPT_DIR" || exit 1

# Opzioni di deploy
echo ""
echo "Scegli un'opzione:"
echo "1) Build e avvio (prima volta o dopo modifiche)"
echo "2) Solo avvio (usa immagini esistenti)"
echo "3) Stop e rimozione container"
echo "4) Rebuild completo (pulisci cache)"
echo "5) Visualizza logs"
read -p "Scelta: " choice

case $choice in
    1)
        echo -e "${GREEN}Building e avvio dei container...${NC}"
        $DOCKER_COMPOSE up -d --build
        ;;
    2)
        echo -e "${GREEN}Avvio dei container...${NC}"
        $DOCKER_COMPOSE up -d
        ;;
    3)
        echo -e "${YELLOW}Stop e rimozione dei container...${NC}"
        $DOCKER_COMPOSE down
        echo -e "${GREEN}Container fermati e rimossi${NC}"
        exit 0
        ;;
    4)
        echo -e "${YELLOW}Rebuild completo con pulizia cache...${NC}"
        $DOCKER_COMPOSE down
        $DOCKER_COMPOSE build --no-cache
        $DOCKER_COMPOSE up -d
        ;;
    5)
        echo -e "${GREEN}Visualizzazione logs...${NC}"
        $DOCKER_COMPOSE logs -f
        exit 0
        ;;
    *)
        echo -e "${RED}Scelta non valida${NC}"
        exit 1
        ;;
esac

# Verifica lo stato
echo ""
echo -e "${GREEN}Verifica stato container...${NC}"
sleep 3
$DOCKER_COMPOSE ps

echo ""
echo -e "${GREEN}=== Applicazione disponibile su: http://localhost:${UAFT_PORT} ===${NC}"
echo ""

# Mostra i logs
echo -e "${GREEN}Ultimi logs (premi Ctrl+C per uscire):${NC}"
$DOCKER_COMPOSE logs -f --tail=50
