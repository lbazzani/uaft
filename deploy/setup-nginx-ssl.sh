#!/bin/bash

# Script per configurare Nginx e SSL/Certbot per uaft.it
set -e

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}Setup Nginx + SSL per uaft.it${NC}"
echo -e "${GREEN}================================${NC}"
echo ""

# Verifica che lo script sia eseguito come root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}Questo script deve essere eseguito come root (usa sudo)${NC}"
    exit 1
fi

# Directory di lavoro
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Verifica che nginx sia installato
if ! command -v nginx &> /dev/null; then
    echo -e "${RED}Nginx non è installato!${NC}"
    echo -e "${YELLOW}Vuoi installarlo ora? (y/n)${NC}"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        apt update
        apt install -y nginx
        echo -e "${GREEN}Nginx installato con successo${NC}"
    else
        exit 1
    fi
fi

echo -e "${BLUE}1. Copia configurazione Nginx...${NC}"
# Copia il file di configurazione
cp "$SCRIPT_DIR/uaft.it.nginx.conf" /etc/nginx/sites-available/uaft.it

# Crea symlink se non esiste
if [ ! -L /etc/nginx/sites-enabled/uaft.it ]; then
    ln -s /etc/nginx/sites-available/uaft.it /etc/nginx/sites-enabled/uaft.it
    echo -e "${GREEN}✓ Configurazione Nginx copiata e abilitata${NC}"
else
    echo -e "${YELLOW}Configurazione già abilitata, aggiornata${NC}"
fi

echo ""
echo -e "${BLUE}2. Test configurazione Nginx...${NC}"
if nginx -t; then
    echo -e "${GREEN}✓ Configurazione Nginx valida${NC}"
else
    echo -e "${RED}✗ Errore nella configurazione Nginx${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}3. Reload Nginx...${NC}"
systemctl reload nginx
echo -e "${GREEN}✓ Nginx ricaricato${NC}"

echo ""
echo -e "${BLUE}4. Verifica installazione Certbot...${NC}"
if ! command -v certbot &> /dev/null; then
    echo -e "${YELLOW}Certbot non trovato. Installazione in corso...${NC}"
    apt update
    apt install -y certbot python3-certbot-nginx
    echo -e "${GREEN}✓ Certbot installato${NC}"
else
    echo -e "${GREEN}✓ Certbot già installato${NC}"
fi

echo ""
echo -e "${YELLOW}================================${NC}"
echo -e "${YELLOW}IMPORTANTE: Configurazione SSL${NC}"
echo -e "${YELLOW}================================${NC}"
echo ""
echo "Prima di procedere con Certbot, assicurati che:"
echo "1. Il dominio uaft.it punti all'IP di questo server"
echo "2. Il dominio www.uaft.it punti all'IP di questo server"
echo "3. La porta 80 e 443 siano aperte nel firewall"
echo ""
echo -e "${BLUE}Vuoi configurare SSL con Let's Encrypt ora? (y/n)${NC}"
read -r response

if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo ""
    echo -e "${BLUE}5. Configurazione certificato SSL...${NC}"
    echo -e "${YELLOW}Inserisci la tua email per Let's Encrypt:${NC}"
    read -r email

    if [ -z "$email" ]; then
        echo -e "${RED}Email richiesta per Certbot${NC}"
        exit 1
    fi

    echo ""
    echo -e "${BLUE}Ottenimento certificato SSL da Let's Encrypt...${NC}"
    certbot --nginx -d uaft.it -d www.uaft.it --non-interactive --agree-tos --email "$email" --redirect

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Certificato SSL configurato con successo!${NC}"
        echo ""
        echo -e "${GREEN}Certbot ha configurato automaticamente:${NC}"
        echo "  - Certificati SSL per uaft.it e www.uaft.it"
        echo "  - Redirect automatico da HTTP a HTTPS"
        echo "  - Rinnovo automatico del certificato"
    else
        echo -e "${RED}✗ Errore durante la configurazione SSL${NC}"
        echo -e "${YELLOW}Verifica che:${NC}"
        echo "  - Il DNS punti correttamente a questo server"
        echo "  - Le porte 80 e 443 siano aperte"
        echo ""
        echo -e "${YELLOW}Puoi riprovare manualmente con:${NC}"
        echo "  sudo certbot --nginx -d uaft.it -d www.uaft.it"
        exit 1
    fi
else
    echo ""
    echo -e "${YELLOW}Configurazione SSL saltata.${NC}"
    echo -e "${YELLOW}Per configurarla in seguito, esegui:${NC}"
    echo "  sudo certbot --nginx -d uaft.it -d www.uaft.it"
fi

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}Setup completato!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo -e "${GREEN}Il sito è ora accessibile su:${NC}"
echo "  - http://uaft.it"
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo "  - https://uaft.it (con SSL)"
fi
echo ""
echo -e "${BLUE}Comandi utili:${NC}"
echo "  - Test configurazione: sudo nginx -t"
echo "  - Reload nginx: sudo systemctl reload nginx"
echo "  - Status nginx: sudo systemctl status nginx"
echo "  - Logs nginx: sudo tail -f /var/log/nginx/uaft.it_access.log"
echo "  - Rinnovo SSL: sudo certbot renew --dry-run"
echo "  - Lista certificati: sudo certbot certificates"
echo ""
