# 🚀 UAFT Production Deployment Guide

Guida al deployment di UAFT su un server con nginx e systemd.

> **Nel cluster SparkTech** l'immagine si costruisce dal `Dockerfile` nella radice: servono solo `CLAUDE_RUNNER_URLS` e `CLAUDE_RUNNER_TOKEN` (vedi `.env.example`) e `HOSTNAME=0.0.0.0` nel Deployment; la sonda è `/api/healthz`.
>
> **Niente posta:** webmail, pannello admin, login, database e server SMTP sono usciti dal codice il 9/10/2026. Non ci sono più PostgreSQL, certificati per `mail.`, record MX/SPF/DKIM/DMARC né porte 25/587 da configurare.

## 📋 Prerequisiti

### Sistema Operativo
- **Ubuntu 22.04 LTS** (raccomandato) o Debian 11+
- Server con almeno **2GB RAM** e **20GB disco**
- Accesso SSH come root o sudo

### Software Richiesto
```bash
# Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Nginx (reverse proxy)
sudo apt-get install -y nginx

# Certbot (per certificati SSL)
sudo apt-get install -y certbot python3-certbot-nginx
```

### Domini e DNS
- Dominio registrato (es: `tuodominio.com`)
- Accesso al pannello DNS del provider
- Indirizzo IP pubblico statico del server

---

## 🔧 Setup Iniziale

### 1. Certificati TLS/SSL

**Let's Encrypt**
```bash
sudo certbot --nginx -d tuodominio.com -d www.tuodominio.com
```

### 2. Variabili d'Ambiente

Crea `/var/www/uaft/.env.production`:

```env
# ==================== AI (claude-runner) ====================
# Senza, la chat risponde con le frasi di riserva
CLAUDE_RUNNER_URLS="nome=http://host:porta"
CLAUDE_RUNNER_TOKEN="il-bearer-del-runner"

# ==================== NODE ====================
NODE_ENV=production
```

---

## 📦 Deployment

### 1. Clona il Repository

```bash
cd /var/www
sudo git clone https://github.com/tuouser/uaft.git
cd uaft
sudo chown -R www-data:www-data .
```

### 2. Esegui lo Script di Deployment

```bash
sudo ./deploy/deploy.sh
```

Lo script eseguirà automaticamente:
- ✅ Build dell'applicazione Next.js
- ✅ Installazione dipendenze
- ✅ Configurazione permessi
- ✅ Setup servizio systemd
- ✅ Avvio servizio

### 3. Verifica Servizio

```bash
# Status
sudo systemctl status uaft-web

# Logs
sudo journalctl -u uaft-web -f
```

---

## 🌐 Configurazione DNS

### Record Necessari

Aggiungi questo record DNS nel pannello del tuo provider:

```
Type: A
Name: @
Value: IP_DEL_TUO_SERVER
TTL: 3600
```

---

## 🔥 Configurazione Firewall

```bash
# Porte web
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS

# SSH
sudo ufw allow 22/tcp

# Attiva firewall
sudo ufw enable
```

---

## 🔄 Nginx Reverse Proxy

Crea `/etc/nginx/sites-available/uaft`:

```nginx
# HTTP → HTTPS redirect
server {
    listen 80;
    server_name tuodominio.com www.tuodominio.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS
server {
    listen 443 ssl http2;
    server_name tuodominio.com www.tuodominio.com;

    # SSL Certificates
    ssl_certificate /etc/letsencrypt/live/tuodominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tuodominio.com/privkey.pem;

    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Proxy to Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Max upload size
    client_max_body_size 25M;
}
```

Attiva il sito:
```bash
sudo ln -s /etc/nginx/sites-available/uaft /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## ✅ Verifica Configurazione

```bash
curl -s https://tuodominio.com/api/healthz
```

Output atteso:
```
{"ok":true}
```

---

## 📊 Monitoring

### Logs

```bash
# Web Application
sudo journalctl -u uaft-web -f

# Nginx
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

---

## 🔧 Manutenzione

### Aggiornamento

```bash
cd /var/www/uaft
sudo git pull
sudo ./deploy/deploy.sh
```

### Rinnovo Certificati

```bash
# Let's Encrypt si rinnova automaticamente
# Verifica:
sudo certbot renew --dry-run
```

---

## 📚 Comandi Utili

```bash
# Restart servizio
sudo systemctl restart uaft-web

# Stop/Start
sudo systemctl stop uaft-web
sudo systemctl start uaft-web

# Ricarica systemd
sudo systemctl daemon-reload

# Check porta in uso
sudo lsof -i :3000
```

---

## 🔒 Sicurezza

### Checklist Produzione

- [ ] Firewall configurato (solo porte necessarie)
- [ ] TLS/SSL attivo su HTTPS
- [ ] Backup automatici configurati
- [ ] Monitoring logs attivo
- [ ] Fail2ban installato per protezione SSH
- [ ] Aggiornamenti sistema automatici

### Hardening Aggiuntivo

```bash
# Fail2ban per SSH
sudo apt-get install fail2ban

# Aggiornamenti automatici
sudo apt-get install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

---

**Made with ❤️ by UAFT**
