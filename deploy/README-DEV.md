# Ambiente di Test/Sviluppo - dev.uaft.it

## Configurazione

L'ambiente di test è configurato su **https://dev.uaft.it** e punta alla porta **3010**.

### Componenti configurati:
- ✅ Script npm: `npm run test` (porta 3010)
- ✅ Nginx: configurato per dev.uaft.it
- ✅ SSL: certificato Let's Encrypt valido fino al 14/02/2026
- ✅ Hot Module Replacement (HMR) abilitato per sviluppo

## Come usare

### 1. Avviare il server di test

```bash
npm run test
```

Questo avvierà Next.js in modalità sviluppo sulla porta 3010.

### 2. Accedere al sito

Apri il browser e vai su:
- **https://dev.uaft.it** (pubblico con SSL)
- **http://localhost:3010** (locale)

### 3. Sviluppo

Le modifiche al codice verranno ricaricate automaticamente grazie al Hot Module Replacement.

## Workflow consigliato

1. **Sviluppa localmente**: Modifica il codice
2. **Testa su dev**: `npm run test` e verifica su https://dev.uaft.it
3. **Deploy in produzione**: Quando tutto funziona, esegui `cd deploy && docker-compose up -d --build`

## Differenze tra ambienti

| Ambiente | URL | Porta | Modalità | Hot Reload |
|----------|-----|-------|----------|------------|
| **Sviluppo** | https://dev.uaft.it | 3010 | Development | ✅ |
| **Produzione** | https://uaft.it | 3001 | Production | ❌ |

## Configurazione nginx

Il file di configurazione si trova in:
```
deploy/dev.uaft.it.nginx.conf
```

Per aggiornare la configurazione nginx:
```bash
cd deploy
sudo cp dev.uaft.it.nginx.conf /etc/nginx/sites-available/dev.uaft.it
sudo nginx -t
sudo systemctl reload nginx
```

## SSL/Certificato

Il certificato SSL è gestito automaticamente da Certbot e si rinnova automaticamente.

Per verificare lo stato:
```bash
sudo certbot certificates | grep dev.uaft.it
```

## Troubleshooting

### Il sito non risponde
1. Verifica che il server di test sia avviato: `npm run test`
2. Controlla i log nginx: `sudo tail -f /var/log/nginx/dev.uaft.it.error.log`
3. Verifica che la porta 3010 sia aperta: `netstat -tlnp | grep 3010`

### Errore 502 Bad Gateway
Il server Next.js probabilmente non è in esecuzione. Avvia con `npm run test`.

### Problemi SSL
Verifica che il certificato sia valido:
```bash
sudo certbot certificates | grep dev.uaft.it
```

## Note importanti

⚠️ **Non usare l'ambiente di test per produzione!**
- Il server di sviluppo non è ottimizzato per produzione
- Non ha le stesse ottimizzazioni e caching del build di produzione
- Potrebbe essere più lento e consumare più risorse
