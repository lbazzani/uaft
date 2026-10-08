#!/bin/bash

# Script per generare certificati SSL per domini mail usando Let's Encrypt
# Uso: ./generate-mail-cert.sh <domain> <email>

set -e

# Colori
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Parametri
DOMAIN=$1
EMAIL=$2
CERT_DIR="${CERT_DIR:-$(pwd)/certs}"

if [ -z "$DOMAIN" ]; then
    echo -e "${RED}Errore: dominio richiesto${NC}"
    echo "Uso: $0 <domain> <email>"
    exit 1
fi

if [ -z "$EMAIL" ]; then
    echo -e "${RED}Errore: email richiesta${NC}"
    echo "Uso: $0 <domain> <email>"
    exit 1
fi

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Generazione Certificato SSL per Mail${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "Dominio: ${GREEN}$DOMAIN${NC}"
echo -e "Email: ${GREEN}$EMAIL${NC}"
echo -e "Directory certificati: ${GREEN}$CERT_DIR${NC}"
echo ""

# Crea directory per i certificati se non esiste
mkdir -p "$CERT_DIR/$DOMAIN"
chmod 700 "$CERT_DIR"

# Verifica se certbot è installato
if ! command -v certbot &> /dev/null; then
    echo -e "${YELLOW}Certbot non trovato. Installazione...${NC}"
    if [ "$EUID" -ne 0 ]; then
        echo -e "${RED}Errore: servono permessi root per installare certbot${NC}"
        echo "Esegui: sudo apt install certbot"
        exit 1
    fi
    apt update
    apt install -y certbot
fi

echo -e "${BLUE}1. Verifica DNS per $DOMAIN...${NC}"
# Verifica che il dominio punti a questo server
DOMAIN_IP=$(dig +short $DOMAIN | tail -n1)
SERVER_IP=$(curl -s ifconfig.me)

if [ "$DOMAIN_IP" != "$SERVER_IP" ]; then
    echo -e "${YELLOW}⚠️  ATTENZIONE: Il dominio $DOMAIN punta a $DOMAIN_IP${NC}"
    echo -e "${YELLOW}   Il server ha IP $SERVER_IP${NC}"
    echo -e "${YELLOW}   Assicurati che il DNS sia configurato correttamente${NC}"
    echo ""
fi

echo -e "${BLUE}2. Generazione certificato Let's Encrypt...${NC}"

# Usa certbot in modalità standalone (richiede porta 80 libera)
# Oppure usa --webroot se hai già un web server

CERT_PATH="$CERT_DIR/$DOMAIN"

if [ "$EUID" -ne 0 ]; then
    echo -e "${YELLOW}⚠️  Non hai permessi root. Usando certbot con sudo...${NC}"
    CERTBOT_CMD="sudo certbot"
else
    CERTBOT_CMD="certbot"
fi

# Genera certificato
$CERTBOT_CMD certonly \
    --standalone \
    --preferred-challenges http \
    -d "$DOMAIN" \
    --email "$EMAIL" \
    --agree-tos \
    --non-interactive \
    --cert-path "$CERT_PATH/cert.pem" \
    --key-path "$CERT_PATH/privkey.pem" \
    --fullchain-path "$CERT_PATH/fullchain.pem" \
    --chain-path "$CERT_PATH/chain.pem" \
    || {
        echo -e "${RED}❌ Errore nella generazione del certificato${NC}"
        echo -e "${YELLOW}Possibili cause:${NC}"
        echo "  - Il dominio non punta a questo server"
        echo "  - La porta 80 non è accessibile dall'esterno"
        echo "  - Firewall blocca le connessioni"
        echo ""
        echo -e "${YELLOW}Verifica con:${NC}"
        echo "  dig $DOMAIN"
        echo "  curl http://$DOMAIN"
        exit 1
    }

# Copia i certificati nella directory del progetto
# Trova la directory del certificato (potrebbe essere $DOMAIN o $DOMAIN-0001, etc.)
LETSENCRYPT_DIR=$(ls -dt /etc/letsencrypt/live/$DOMAIN* 2>/dev/null | head -1)

if [ -n "$LETSENCRYPT_DIR" ] && [ -d "$LETSENCRYPT_DIR" ]; then
    echo -e "${BLUE}3. Copia certificati dalla directory $LETSENCRYPT_DIR...${NC}"

    if [ "$EUID" -ne 0 ]; then
        sudo cp "$LETSENCRYPT_DIR/privkey.pem" "$CERT_PATH/privkey.pem"
        sudo cp "$LETSENCRYPT_DIR/fullchain.pem" "$CERT_PATH/fullchain.pem"
        sudo cp "$LETSENCRYPT_DIR/cert.pem" "$CERT_PATH/cert.pem"
        sudo cp "$LETSENCRYPT_DIR/chain.pem" "$CERT_PATH/chain.pem"
        sudo chown $USER:$USER "$CERT_PATH"/*.pem
    else
        cp "$LETSENCRYPT_DIR/privkey.pem" "$CERT_PATH/privkey.pem"
        cp "$LETSENCRYPT_DIR/fullchain.pem" "$CERT_PATH/fullchain.pem"
        cp "$LETSENCRYPT_DIR/cert.pem" "$CERT_PATH/cert.pem"
        cp "$LETSENCRYPT_DIR/chain.pem" "$CERT_PATH/chain.pem"
    fi

    chmod 600 "$CERT_PATH/privkey.pem"
    chmod 644 "$CERT_PATH"/*.pem

    echo -e "${GREEN}✅ Certificati copiati con successo${NC}"
else
    echo -e "${RED}❌ Errore: directory certificati non trovata${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Certificato generato con successo!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "Percorsi certificati:"
echo -e "  Chiave privata: ${GREEN}$CERT_PATH/privkey.pem${NC}"
echo -e "  Certificato: ${GREEN}$CERT_PATH/fullchain.pem${NC}"
echo ""

# Mostra data di scadenza
if command -v openssl &> /dev/null; then
    EXPIRY=$(openssl x509 -enddate -noout -in "$CERT_PATH/fullchain.pem" 2>/dev/null | cut -d= -f2)
    if [ -n "$EXPIRY" ]; then
        echo -e "Scadenza: ${YELLOW}$EXPIRY${NC}"
    fi
fi

echo ""
echo -e "${BLUE}Prossimi passi:${NC}"
echo "1. Aggiorna il database con i percorsi dei certificati"
echo "2. Riavvia il server SMTP per caricare i nuovi certificati"
echo ""
echo -e "${YELLOW}Note:${NC}"
echo "  - I certificati Let's Encrypt scadono dopo 90 giorni"
echo "  - Configura il rinnovo automatico con: sudo certbot renew --dry-run"
echo "  - Il rinnovo automatico è configurato in /etc/cron.d/certbot"
echo ""
