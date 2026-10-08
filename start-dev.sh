#!/bin/bash

# Script per avviare il server di sviluppo con Node.js 20 usando nvm

# Rimuovi le variabili d'ambiente npm che interferiscono con nvm
unset npm_config_prefix
unset NPM_CONFIG_PREFIX

# Controlla se nvm è installato
if [ ! -f "$HOME/.nvm/nvm.sh" ]; then
    echo "❌ nvm non trovato. Installazione..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
fi

# Carica nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# Installa Node.js 20 se non presente
if ! nvm ls 20 >/dev/null 2>&1; then
    echo "📦 Installando Node.js 20..."
    nvm install 20
fi

# Usa Node.js 20
echo "🔄 Usando Node.js 20..."
nvm use 20

# Verifica la versione
node --version

# Avvia il server di sviluppo
echo "🚀 Avviando server di sviluppo sulla porta 3010..."
cd "$(dirname "$0")" && PORT=3010 npx next dev
