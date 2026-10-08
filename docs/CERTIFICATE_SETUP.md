# Configurazione Certificato SSL/TLS - Guida Completa

## Architettura

Il sistema UAFT Mail Server separa completamente i certificati SSL per web e mail:

- **Web Server (nginx)**: Certificato per `uaft.it` sulla porta 443
- **Mail Server (SMTP)**: Certificato per `mail.uaft.it` sulle porte 25, 587, 465

Questa separazione garantisce:
- Gestione indipendente dei certificati
- Nessun conflitto tra servizi
- Miglior sicurezza e isolamento

## Processo Automatico

Quando l'utente clicca "Genera Certificato SSL" nel wizard, il sistema esegue automaticamente:

### Step 1: Configurazione Nginx (Automatica)

**API**: `POST /api/admin/domains/[domainId]/setup-nginx`

**Azioni**:
1. Crea configurazione nginx minimale per `mail.uaft.it`:
   ```nginx
   server {
       listen 80;
       server_name mail.uaft.it;

       # Allow Let's Encrypt ACME challenge
       location /.well-known/acme-challenge/ {
           root /var/www/letsencrypt;
       }
   }
   ```
2. Copia in `/etc/nginx/sites-available/mail.uaft.it`
3. Crea symlink in `/etc/nginx/sites-enabled/`
4. Crea directory `/var/www/letsencrypt`
5. Ricarica nginx

### Step 2: Generazione Certificato Let's Encrypt (Automatica)

**API**: `POST /api/admin/domains/[domainId]/certificate`

**Azioni**:
1. Esegue: `sudo certbot certonly --nginx -d mail.uaft.it --email <user_email>`
2. Certbot usa il plugin nginx (nessun conflitto porta 80)
3. Certificato salvato in: `/etc/letsencrypt/live/mail.uaft.it/`
4. Aggiorna database con:
   - `tlsKeyPath`: `/etc/letsencrypt/live/mail.uaft.it/privkey.pem`
   - `tlsCertPath`: `/etc/letsencrypt/live/mail.uaft.it/fullchain.pem`
   - `tlsCertStatus`: 'valid'
   - `tlsCertExpiry`: Data + 90 giorni

### Step 3: Caricamento Certificato nel Server SMTP

Il TLS Certificate Manager carica automaticamente il certificato e lo rende disponibile tramite SNI (Server Name Indication) per tutte le connessioni SMTP su `mail.uaft.it`.

## Prerequisiti

Prima di generare il certificato, l'utente deve:

1. **Configurare il Record A nel DNS**:
   ```
   Tipo: A
   Nome: mail
   Valore: 135.236.155.164
   TTL: 3600
   ```

2. **Attendere la propagazione DNS** (15-60 minuti):
   ```bash
   dig mail.uaft.it
   # Deve restituire: 135.236.155.164
   ```

3. **Verificare che la porta 80 sia accessibile** dall'esterno (per ACME challenge)

## Interfaccia Utente

### Wizard - Step 2: Configurazione DNS

Il wizard mostra il Record A con un alert chiaro:

```
🔐 Dopo la configurazione DNS

Una volta che il record A sarà propagato, potrai generare il certificato SSL
cliccando sull'icona lucchetto nella lista domini. Il sistema configurerà
automaticamente nginx per mail.uaft.it e genererà il certificato Let's Encrypt
senza bisogno di altri interventi manuali.
```

### Wizard - Step 3: Completa Configurazione

Mostra una sezione dedicata al certificato SSL:

```
📋 Prossimi passi:
1. Attendi la propagazione DNS (15-60 minuti)
2. Genera il certificato SSL/TLS
   → Vai nella lista domini → Clicca sull'icona lucchetto → Genera Certificato
3. Crea indirizzi email per questo dominio
4. Inizia a inviare e ricevere email!

🔒 Certificato SSL/TLS - Processo Automatico

Il sistema configurerà automaticamente tutto il necessario:
✨ Configurazione nginx (Server block per mail.uaft.it)
✨ Generazione certificato Let's Encrypt (Gratuito, valido 90 giorni)
✨ Configurazione server SMTP con TLS (Porte 25, 587, 465)

💡 Importante: Il certificato sarà generato per mail.uaft.it (separato
dal certificato web di uaft.it). Questo garantisce la separazione tra
web server e mail server.
```

### Dialog Certificato

Quando l'utente clicca sull'icona lucchetto nella lista domini:

```
🔄 Processo automatico di configurazione:
1. Configurazione automatica nginx per mail.uaft.it
2. Generazione certificato Let's Encrypt
3. Il processo può richiedere alcuni minuti

Prerequisiti:
• Il record DNS A deve essere configurato (mail.uaft.it → IP server)
• La porta 80 deve essere accessibile dall'esterno

[Genera Certificato]
```

## File Coinvolti

### Backend
- `app/api/admin/domains/[domainId]/setup-nginx/route.ts` - Configura nginx
- `app/api/admin/domains/[domainId]/certificate/route.ts` - Genera certificato
- `lib/mail/tls-certificate-manager.ts` - Gestisce certificati TLS con SNI

### Frontend
- `app/admin/domains/page.tsx` - Wizard e interfaccia

### Configurazione
- `/etc/nginx/sites-available/mail.{domain}` - Config nginx (generata dinamicamente)
- `/etc/letsencrypt/live/mail.{domain}/` - Certificati Let's Encrypt

## Troubleshooting

### Errore: "Could not bind TCP port 80"
**Causa**: Nginx già in ascolto sulla porta 80
**Soluzione**: Il sistema usa `--nginx` invece di `--standalone` per evitare conflitti

### Errore: "DNS resolution failed"
**Causa**: Record A non propagato
**Soluzione**: Verifica con `dig mail.uaft.it` e attendi propagazione

### Errore: "Connection timeout"
**Causa**: Porta 80 non accessibile
**Soluzione**: Verifica firewall e security groups del cloud provider

## Rinnovo Automatico

Let's Encrypt genera certificati validi 90 giorni. Il sistema include un flag `tlsAutoRenew` nel database che può essere usato per implementare il rinnovo automatico con un cron job:

```bash
# Cron job (da implementare)
0 0 * * * certbot renew --nginx --quiet
```

## Sicurezza

- I certificati sono salvati con permessi root (0600 per chiavi private)
- La directory `/var/www/letsencrypt` è di proprietà di `www-data`
- Nginx serve solo la directory ACME challenge, niente altro
- Separazione completa tra certificati web e mail

## Testing

Dopo la generazione del certificato, testa la connessione TLS:

```bash
# Test STARTTLS sulla porta 587
openssl s_client -connect mail.uaft.it:587 -starttls smtp

# Test TLS diretto sulla porta 465
openssl s_client -connect mail.uaft.it:465

# Verifica certificato
openssl s_client -connect mail.uaft.it:465 | openssl x509 -noout -dates
```
