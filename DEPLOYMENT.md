# 🚀 UAFT Production Deployment Guide

Guida completa per il deployment di UAFT Mail Server in produzione.

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

# PostgreSQL 14+
sudo apt-get install -y postgresql postgresql-contrib

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

### 1. Configurazione PostgreSQL

```bash
# Crea database e utente
sudo -u postgres psql << EOF
CREATE DATABASE uaft;
CREATE USER uaftuser WITH ENCRYPTED PASSWORD 'password_sicura';
GRANT ALL PRIVILEGES ON DATABASE uaft TO uaftuser;
\q
EOF
```

### 2. Certificati TLS/SSL

**Opzione A: Let's Encrypt (Raccomandato)**
```bash
# Per HTTPS (web)
sudo certbot --nginx -d tuodominio.com -d www.tuodominio.com

# Per SMTP (mail)
sudo certbot certonly --standalone -d mail.tuodominio.com
```

**Opzione B: Certificati Self-Signed (Solo per test)**
```bash
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/ssl/private/mail.key \
  -out /etc/ssl/certs/mail.crt
```

### 3. Variabili d'Ambiente

Crea `/var/www/uaft/.env.production`:

```env
# ==================== DATABASE ====================
DATABASE_URL="postgresql://uaftuser:password_sicura@localhost:5432/uaft"

# ==================== NEXTAUTH ====================
NEXTAUTH_URL="https://tuodominio.com"
NEXTAUTH_SECRET="genera_con_openssl_rand_base64_32"

# ==================== ADMIN ====================
ADMIN_EMAIL="admin@tuodominio.com"
ADMIN_PASSWORD="password_admin_sicura"

# ==================== TLS/SSL ====================
TLS_KEY_PATH="/etc/letsencrypt/live/mail.tuodominio.com/privkey.pem"
TLS_CERT_PATH="/etc/letsencrypt/live/mail.tuodominio.com/fullchain.pem"

# ==================== SMTP SERVER ====================
SMTP_PORT=25
SMTP_SUBMISSION_PORT=587
SMTP_HOSTNAME="mail.tuodominio.com"

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
- ✅ Setup servizi systemd
- ✅ Verifica configurazione mail server
- ✅ Avvio servizi

### 3. Verifica Servizi

```bash
# Status
sudo systemctl status uaft-web uaft-smtp

# Logs
sudo journalctl -u uaft-web -f
sudo journalctl -u uaft-smtp -f
```

---

## 🌐 Configurazione DNS

### Record Necessari

Aggiungi questi record DNS nel pannello del tuo provider:

#### 1. Record A
```
Type: A
Name: @
Value: IP_DEL_TUO_SERVER
TTL: 3600
```

```
Type: A
Name: mail
Value: IP_DEL_TUO_SERVER
TTL: 3600
```

#### 2. Record MX
```
Type: MX
Name: @
Value: mail.tuodominio.com
Priority: 10
TTL: 3600
```

#### 3. Record SPF (TXT)
```
Type: TXT
Name: @
Value: v=spf1 mx ip4:IP_DEL_TUO_SERVER ~all
TTL: 3600
```

#### 4. Record DKIM (TXT)

Il sistema genera automaticamente le chiavi DKIM quando crei un dominio nell'admin panel.

```
Type: TXT
Name: default._domainkey
Value: [GENERATO_AUTOMATICAMENTE_NELL'ADMIN_PANEL]
TTL: 3600
```

#### 5. Record DMARC (TXT)
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=quarantine; rua=mailto:postmaster@tuodominio.com; pct=100
TTL: 3600
```

### Auto-Configurazione GoDaddy

Se usi GoDaddy, puoi configurare automaticamente tutti i record DNS:

1. Vai su **Admin Panel → Settings → DNS Providers**
2. Inserisci API Key e Secret di GoDaddy
3. Nel wizard di creazione dominio, clicca **"Configura Automaticamente con GoDaddy"**

---

## 🔥 Configurazione Firewall

```bash
# Porte web
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS

# Porte mail
sudo ufw allow 25/tcp    # SMTP (ricezione)
sudo ufw allow 587/tcp   # SMTP Submission (invio con auth)

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

### 1. Verifica Mail Server

```bash
cd /var/www/uaft
npm run mail:verify
```

Output atteso:
```
✅ Database Connection - Connected to database
✅ Env: DATABASE_URL - Configured
✅ TLS Certificates - TLS key and certificate found
✅ Mail Domains - 1 active domain(s), 1 with DKIM configured
✅ DNS MX: tuodominio.com - MX record found
✅ DNS SPF: tuodominio.com - SPF record found
✅ DKIM: tuodominio.com - DKIM keys configured

📈 Summary: 8 passed, 0 warnings, 0 failed
```

### 2. Test Invio Email

```bash
# Via API
curl -X POST https://tuodominio.com/api/mail/send \
  -H "Content-Type: application/json" \
  -d '{
    "from": "test@tuodominio.com",
    "to": "destinatario@example.com",
    "subject": "Test Email",
    "text": "Questo è un test"
  }'
```

### 3. Verifica DKIM

Usa [MXToolbox DKIM](https://mxtoolbox.com/dkim.aspx) per verificare che la firma DKIM sia valida.

---

## 📊 Monitoring

### Logs

```bash
# Web Application
sudo journalctl -u uaft-web -f

# SMTP Server
sudo journalctl -u uaft-smtp -f

# Nginx
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### Database Logs

```sql
-- Email ricevute oggi
SELECT COUNT(*) FROM mail_messages
WHERE received_at >= CURRENT_DATE;

-- Ultimi errori
SELECT * FROM mail_logs
WHERE status = 'failed'
ORDER BY created_at DESC
LIMIT 10;

-- Rate limiting
SELECT from_address, COUNT(*) as count
FROM mail_logs
WHERE created_at >= NOW() - INTERVAL '1 hour'
GROUP BY from_address
ORDER BY count DESC;
```

---

## 🔧 Manutenzione

### Aggiornamento

```bash
cd /var/www/uaft
sudo git pull
sudo ./deploy/deploy.sh
```

### Backup Database

```bash
# Backup
sudo -u postgres pg_dump uaft > backup_$(date +%Y%m%d).sql

# Restore
sudo -u postgres psql uaft < backup_20231115.sql
```

### Rinnovo Certificati

```bash
# Let's Encrypt si rinnova automaticamente
# Verifica:
sudo certbot renew --dry-run
```

---

## 🚨 Troubleshooting

### Email Non Arrivano

1. **Verifica DNS**:
   ```bash
   dig MX tuodominio.com
   dig TXT tuodominio.com
   ```

2. **Verifica Firewall**:
   ```bash
   sudo ufw status
   netstat -tulpn | grep :25
   ```

3. **Check Logs**:
   ```bash
   sudo journalctl -u uaft-smtp -n 100
   ```

### Email Finiscono in Spam

1. Verifica SPF, DKIM, DMARC con [MXToolbox](https://mxtoolbox.com)
2. Controlla che l'IP non sia in blacklist: [MultiRBL](https://multirbl.valli.org/)
3. Usa [Mail-Tester](https://www.mail-tester.com/) per score completo

### Porte Bloccate

Se il provider blocca la porta 25:

1. Usa servizio SMTP relay (SendGrid, Amazon SES)
2. Configura in `.env`:
   ```env
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASS=your_api_key
   ```

---

## 📚 Comandi Utili

```bash
# Restart servizi
sudo systemctl restart uaft-web
sudo systemctl restart uaft-smtp

# Stop/Start
sudo systemctl stop uaft-web
sudo systemctl start uaft-web

# Disabilita servizio
sudo systemctl disable uaft-smtp

# Ricarica systemd
sudo systemctl daemon-reload

# Check porta in uso
sudo lsof -i :587
sudo netstat -tulpn | grep :587
```

---

## 🔒 Sicurezza

### Checklist Produzione

- [ ] Firewall configurato (solo porte necessarie)
- [ ] TLS/SSL attivo su HTTPS e SMTP
- [ ] Password database forti
- [ ] NEXTAUTH_SECRET generato con `openssl rand -base64 32`
- [ ] Rate limiting attivo (configurato di default)
- [ ] Anti-spam attivo (configurato di default)
- [ ] Backup automatici configurati
- [ ] Monitoring logs attivo
- [ ] DNS records (SPF, DKIM, DMARC) configurati
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

**Made with ❤️ by UAFT - Production Ready Mail Server**
