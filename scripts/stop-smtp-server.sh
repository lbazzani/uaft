#!/bin/bash

# UAFT Mail Server - Stop Script
# Ferma il server SMTP in esecuzione

echo "🛑 Stopping UAFT SMTP Server..."

# Trova e termina il processo del server SMTP
PID=$(pgrep -f "start-smtp-server-production.ts")

if [ -z "$PID" ]; then
    echo "❌ SMTP Server is not running"
    exit 1
fi

echo "📍 Found SMTP Server process: PID $PID"
kill $PID

# Aspetta che il processo termini
sleep 2

# Verifica se il processo è stato terminato
if pgrep -f "start-smtp-server-production.ts" > /dev/null; then
    echo "⚠️  Process still running, forcing termination..."
    kill -9 $PID
    sleep 1
fi

if pgrep -f "start-smtp-server-production.ts" > /dev/null; then
    echo "❌ Failed to stop SMTP Server"
    exit 1
else
    echo "✅ SMTP Server stopped successfully"
fi
