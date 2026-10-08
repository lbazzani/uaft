#!/bin/bash

# Script per configurare nginx e SSL per dev.uaft.it

set -e

echo "=== Configurazione nginx e SSL per dev.uaft.it ==="
echo ""

# Controlla se nginx è installato
if ! command -v nginx &> /dev/null; then
    echo "❌ Nginx non trovato. Installalo prima di continuare."
    exit 1
fi

echo "✓ Nginx trovato"

# Copia la configurazione nginx
NGINX_CONFIG="/etc/nginx/sites-available/dev.uaft.it"
if [ -f "$NGINX_CONFIG" ]; then
    echo "⚠️  Configurazione nginx per dev.uaft.it già esistente"
    read -p "Vuoi sovrascriverla? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Operazione annullata"
        exit 0
    fi
fi

echo "📝 Copiando configurazione nginx..."
sudo cp dev.uaft.it.nginx.conf "$NGINX_CONFIG"

# Abilita il sito
if [ ! -L "/etc/nginx/sites-enabled/dev.uaft.it" ]; then
    echo "🔗 Abilitando il sito..."
    sudo ln -sf "$NGINX_CONFIG" /etc/nginx/sites-enabled/
fi

# Testa la configurazione nginx
echo "🧪 Testando configurazione nginx..."
if sudo nginx -t; then
    echo "✓ Configurazione nginx valida"
else
    echo "❌ Errore nella configurazione nginx"
    exit 1
fi

# Ricarica nginx
echo "🔄 Ricaricando nginx..."
sudo systemctl reload nginx

echo ""
echo "✓ Nginx configurato correttamente"
echo ""

# Controlla se certbot è installato
if ! command -v certbot &> /dev/null; then
    echo "⚠️  Certbot non trovato. Vuoi installarlo? (y/n)"
    read -p "" -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "📦 Installando certbot..."
        sudo apt-get update
        sudo apt-get install -y certbot python3-certbot-nginx
    else
        echo "⚠️  Certbot non installato. Dovrai configurare SSL manualmente."
        exit 0
    fi
fi

echo "✓ Certbot trovato"
echo ""

# Chiedi conferma per ottenere il certificato SSL
echo "🔐 Vuoi ottenere il certificato SSL per dev.uaft.it? (y/n)"
read -p "" -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📜 Ottenendo certificato SSL..."
    echo "⚠️  Assicurati che il DNS per dev.uaft.it punti a questo server!"
    echo ""

    sudo certbot --nginx -d dev.uaft.it

    echo ""
    echo "✓ Certificato SSL configurato"
    echo ""

    # Testa il rinnovo automatico
    echo "🧪 Testando rinnovo automatico certificato..."
    sudo certbot renew --dry-run

    echo ""
    echo "✓ Rinnovo automatico configurato correttamente"
fi

echo ""
echo "=========================================="
echo "✅ Configurazione completata!"
echo ""
echo "Il sito dev.uaft.it è configurato su https://dev.uaft.it"
echo "Punta alla porta 3010 (localhost:3010)"
echo ""
echo "Per avviare il server di test esegui:"
echo "  npm run test"
echo ""
echo "Certificati SSL rinnovati automaticamente da certbot"
echo "=========================================="
