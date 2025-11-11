# Setup Nginx + SSL per uaft.it

Guida completa per configurare nginx e SSL/HTTPS per il sito uaft.it.

## Prerequisiti

Prima di iniziare, assicurati che:

1. **DNS configurato**: I record DNS devono puntare a questo server
   ```
   uaft.it        A     <IP-del-server>
   www.uaft.it    A     <IP-del-server>
   ```

2. **Firewall aperto**: Le porte devono essere accessibili
   ```bash
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   ```

3. **Docker in esecuzione**: L'applicazione deve essere attiva su porta 3001
   ```bash
   docker ps | grep uaft-app
   ```

## Setup Automatico

### Passo 1: Esegui lo script di setup

```bash
cd /home/xpilon/uaft/deploy
sudo ./setup-nginx-ssl.sh
```

Lo script farà automaticamente:
- ✅ Copia la configurazione nginx in `/etc/nginx/sites-available/uaft.it`
- ✅ Crea il symlink in `/etc/nginx/sites-enabled/uaft.it`
- ✅ Testa la configurazione nginx
- ✅ Ricarica nginx
- ✅ Verifica/Installa certbot se necessario
- ❓ Chiede se configurare SSL

### Passo 2: Configurazione SSL

Quando lo script chiede:
```
Vuoi configurare SSL con Let's Encrypt ora? (y/n)
```

Rispondi `y` e inserisci la tua email quando richiesto.

Lo script otterrà automaticamente:
- ✅ Certificato SSL per `uaft.it`
- ✅ Certificato SSL per `www.uaft.it`
- ✅ Redirect automatico da HTTP a HTTPS
- ✅ Rinnovo automatico del certificato

## Setup Manuale

Se preferisci configurare manualmente o se lo script automatico non ha completato l'SSL:

### 1. Copia la configurazione nginx

```bash
sudo cp uaft.it.nginx.conf /etc/nginx/sites-available/uaft.it
sudo ln -s /etc/nginx/sites-available/uaft.it /etc/nginx/sites-enabled/uaft.it
```

### 2. Testa la configurazione

```bash
sudo nginx -t
```

### 3. Ricarica nginx

```bash
sudo systemctl reload nginx
```

### 4. Installa Certbot (se non installato)

```bash
sudo apt update
sudo apt install -y certbot python3-certbot-nginx
```

### 5. Ottieni certificato SSL

```bash
sudo certbot --nginx -d uaft.it -d www.uaft.it
```

Segui le istruzioni:
- Inserisci la tua email
- Accetta i termini di servizio (Y)
- Scegli se condividere l'email (opzionale)
- Certbot configurerà automaticamente HTTPS

## Verifica

### Test del sito

```bash
# Test HTTP
curl -I http://uaft.it

# Test HTTPS (dopo SSL)
curl -I https://uaft.it

# Test redirect www
curl -I http://www.uaft.it
```

### Verifica certificato SSL

```bash
# Lista certificati
sudo certbot certificates

# Test rinnovo
sudo certbot renew --dry-run
```

### Check status

```bash
# Status nginx
sudo systemctl status nginx

# Status applicazione Docker
docker ps | grep uaft

# Logs nginx
sudo tail -f /var/log/nginx/uaft.it_access.log
sudo tail -f /var/log/nginx/uaft.it_error.log

# Logs Docker
docker logs -f uaft-app
```

## Troubleshooting

### Errore: "Connection refused"

Verifica che l'applicazione Docker sia in esecuzione:
```bash
docker ps | grep uaft-app
curl http://localhost:3001
```

### Errore: "502 Bad Gateway"

1. Controlla i logs nginx:
   ```bash
   sudo tail -f /var/log/nginx/uaft.it_error.log
   ```

2. Verifica la porta dell'applicazione:
   ```bash
   ss -tuln | grep 3001
   ```

3. Riavvia l'applicazione:
   ```bash
   cd /home/xpilon/uaft/deploy
   docker-compose restart
   ```

### Errore Certbot: "Failed authorization"

1. Verifica DNS:
   ```bash
   nslookup uaft.it
   dig uaft.it
   ```

2. Verifica firewall:
   ```bash
   sudo ufw status
   ```

3. Verifica che nginx risponda sulla porta 80:
   ```bash
   curl -I http://uaft.it
   ```

### Rinnovo certificato fallito

Certbot rinnova automaticamente i certificati ogni 60 giorni. Se fallisce:

```bash
# Test manuale
sudo certbot renew --dry-run

# Forza rinnovo
sudo certbot renew --force-renewal
```

## Comandi Utili

### Nginx

```bash
# Test configurazione
sudo nginx -t

# Reload (senza downtime)
sudo systemctl reload nginx

# Restart
sudo systemctl restart nginx

# Stop/Start
sudo systemctl stop nginx
sudo systemctl start nginx

# Status
sudo systemctl status nginx

# Lista siti abilitati
ls -la /etc/nginx/sites-enabled/
```

### Certbot

```bash
# Lista certificati
sudo certbot certificates

# Rinnovo manuale
sudo certbot renew

# Rinnovo con verbose
sudo certbot renew --verbose

# Revoca certificato
sudo certbot revoke --cert-name uaft.it

# Elimina certificato
sudo certbot delete --cert-name uaft.it
```

### Docker

```bash
# Status container
docker ps

# Logs
docker logs -f uaft-app

# Restart
docker restart uaft-app

# Stop/Start
docker stop uaft-app
docker start uaft-app

# Rebuild
cd /home/xpilon/uaft/deploy
docker-compose up -d --build
```

## Sicurezza

Il file di configurazione nginx include:

- ✅ Headers di sicurezza (X-Frame-Options, X-XSS-Protection, etc.)
- ✅ Compressione gzip per performance
- ✅ Cache per assets statici
- ✅ Proxy headers corretti per Next.js
- ✅ WebSocket support per hot reload
- ✅ Timeouts appropriati
- ✅ Redirect www → non-www

## Rinnovo Automatico SSL

Certbot configura automaticamente il rinnovo tramite systemd timer:

```bash
# Verifica timer
sudo systemctl status certbot.timer

# Logs rinnovo
sudo journalctl -u certbot.renew
```

Il certificato viene rinnovato automaticamente quando mancano 30 giorni alla scadenza.

## Supporto

Per problemi o domande:
- Logs nginx: `/var/log/nginx/uaft.it_error.log`
- Logs applicazione: `docker logs uaft-app`
- Certbot logs: `/var/log/letsencrypt/letsencrypt.log`
