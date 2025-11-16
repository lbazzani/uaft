# 📬 UAFT Mail Server

Custom SMTP mail server integrato con Next.js e PostgreSQL con **DKIM signing**, **TLS/SSL**, e **anti-spam**.

## 🎯 Features

- ✅ **DKIM Signing** - Tutte le email in uscita sono firmate automaticamente
- ✅ **TLS/SSL Support** - Connessioni criptate per sicurezza
- ✅ **Autenticazione Obbligatoria** - Previene open relay
- ✅ **Rate Limiting** - Protezione contro spam (100 email/ora per IP)
- ✅ **Anti-Spam** - Filtri automatici per email in arrivo
- ✅ **Auto-configurazione DNS** - Integrazione con GoDaddy API
- ✅ **Generazione Chiavi DKIM** - Automatica per ogni dominio
- ✅ **Production Ready** - Systemd services e deployment automatico

## 🚀 Quick Start (Sviluppo)

### 1. Configurazione Database

Il database PostgreSQL è già configurato e migrato. Controlla le tabelle:

```bash
npm run prisma:studio
```

Tabelle disponibili:
- `mail_domains` - Domini email configurabili
- `mail_addresses` - Indirizzi email per utenti
- `mail_messages` - Messaggi email (inbox/sent)
- `mail_attachments` - Allegati email
- `mail_labels` - Label/folder personalizzate
- `mail_logs` - Log SMTP per debugging

### 2. Avviare il Server SMTP

Per ricevere email in arrivo:

```bash
npm run smtp:start
```

Il server SMTP sarà in ascolto sulla porta 25 (o configurabile con `SMTP_PORT`).

### 3. Testare l'Invio Email

Per inviare un'email di test:

```bash
npm run smtp:test
```

## 📝 Configurazione

### Variabili d'Ambiente

Aggiungi al file `.env`:

```env
# Database (già configurato)
DATABASE_URL="postgresql://xpilonapp:xpilonsec11@localhost:5432/uaft"

# SMTP Server (ricezione)
SMTP_PORT=25
SMTP_HOSTNAME="localhost"

# SMTP Client (invio) - Opzionale
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

## 🔧 API Routes

### Inviare Email

**POST** `/api/mail/send`

```typescript
{
  "from": "sender@uaft.com",
  "to": "recipient@example.com", // or ["email1", "email2"]
  "cc": "cc@example.com", // optional
  "bcc": "bcc@example.com", // optional
  "subject": "Email Subject",
  "text": "Plain text body",
  "html": "<h1>HTML body</h1>", // optional
  "userId": "user-id" // optional, for tracking
}
```

**Esempio con fetch:**

```typescript
const response = await fetch('/api/mail/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    from: 'test@uaft.com',
    to: 'user@example.com',
    subject: 'Hello from UAFT',
    text: 'This is a test email',
  }),
});

const data = await response.json();
console.log(data.messageId); // Email ID
```

## 🛠️ Architettura

### Server SMTP (Ricezione)

File: `lib/mail/smtp-server.ts`

- Riceve email sulla porta 25/587
- Parsa email con `mailparser`
- Salva automaticamente su PostgreSQL
- Supporta allegati e HTML
- Log completo di tutte le operazioni

### Client SMTP (Invio)

File: `lib/mail/smtp-client.ts`

- Invia email via Nodemailer
- Supporta HTML e plain text
- Tracking su database
- Log di invio/errori

### Database Models

Definiti in `prisma/schema.prisma`:

```prisma
model MailMessage {
  id            String   @id @default(cuid())
  messageId     String   @unique
  fromAddress   String
  toAddresses   String[]
  subject       String?
  bodyText      String?
  bodyHtml      String?
  headers       Json?
  size          Int?
  isRead        Boolean  @default(false)
  isStarred     Boolean  @default(false)
  // ... altri campi
}
```

## 🧪 Testing

### Test Ricezione Email

1. Avvia il server SMTP:
   ```bash
   npm run smtp:start
   ```

2. Invia email di test con telnet:
   ```bash
   telnet localhost 25
   EHLO test
   MAIL FROM:<test@example.com>
   RCPT TO:<user@uaft.local>
   DATA
   Subject: Test Email

   This is a test email body.
   .
   QUIT
   ```

3. Controlla il database:
   ```bash
   npm run prisma:studio
   ```

### Test Invio Email

```bash
npm run smtp:test
```

Oppure tramite API:

```bash
curl -X POST http://localhost:3000/api/mail/send \
  -H "Content-Type: application/json" \
  -d '{
    "from": "test@uaft.com",
    "to": "recipient@example.com",
    "subject": "Test",
    "text": "Hello!"
  }'
```

## 📦 Struttura File

```
uaft/
├── lib/
│   ├── prisma.ts              # Prisma client
│   └── mail/
│       ├── smtp-server.ts     # Server SMTP (ricezione)
│       └── smtp-client.ts     # Client SMTP (invio)
├── scripts/
│   ├── start-smtp-server.ts   # Script per avviare server
│   └── test-send-email.ts     # Script test invio
├── app/
│   ├── api/
│   │   └── mail/
│   │       └── send/route.ts  # API invio email
│   ├── (mail)/                # UI Webmail
│   └── (admin)/               # Admin panel
└── prisma/
    └── schema.prisma          # Database schema
```

## 🔐 Sicurezza

### Produzione

Prima di andare in produzione:

1. **Abilita TLS/SSL:**
   ```typescript
   // In smtp-server.ts
   secure: true,
   key: fs.readFileSync('path/to/key.pem'),
   cert: fs.readFileSync('path/to/cert.pem'),
   ```

2. **Abilita autenticazione:**
   ```typescript
   authOptional: false,
   onAuth(auth, session, callback) {
     // Implementa logica autenticazione
   }
   ```

3. **Configura SPF, DKIM, DMARC:**
   - Aggiungi record DNS per il tuo dominio
   - Salva chiavi DKIM in `mail_domains`

4. **Rate limiting:**
   - Limita numero email per IP
   - Implementa anti-spam

## 🌐 Configurazione Domini

### Aggiungere un Dominio

```typescript
await prisma.mailDomain.create({
  data: {
    domain: 'uaft.com',
    mxRecord: 'mail.uaft.com',
    spfRecord: 'v=spf1 mx ~all',
    isActive: true,
  },
});
```

### Aggiungere Indirizzo Email per Utente

```typescript
await prisma.mailAddress.create({
  data: {
    address: 'lorenzo@uaft.com',
    userId: 'user-id',
    domainId: 'domain-id',
    isActive: true,
  },
});
```

## 📊 Monitoring

### Log Email

Tutti gli eventi SMTP sono loggati in `mail_logs`:

```sql
SELECT * FROM mail_logs
WHERE type = 'incoming'
ORDER BY created_at DESC
LIMIT 10;
```

### Statistiche

```sql
-- Email ricevute oggi
SELECT COUNT(*) FROM mail_messages
WHERE received_at >= CURRENT_DATE;

-- Email per utente
SELECT user_id, COUNT(*) as total
FROM mail_messages
GROUP BY user_id;
```

## 🚨 Troubleshooting

### Porta 25 già in uso

```bash
# Linux/Mac - Trova processo
sudo lsof -i :25

# Usa porta alternativa
SMTP_PORT=2525 npm run smtp:start
```

### Email non arrivano

1. Controlla log server SMTP
2. Verifica DNS/MX records
3. Controlla firewall
4. Verifica mail_logs nel database

### Errori database

```bash
# Reset database
npm run prisma:migrate reset

# O riapplica migrations
npm run prisma:migrate
```

## 📚 Risorse

- [Nodemailer Docs](https://nodemailer.com/)
- [smtp-server NPM](https://www.npmjs.com/package/smtp-server)
- [RFC 5321 - SMTP](https://tools.ietf.org/html/rfc5321)
- [Prisma Docs](https://www.prisma.io/docs)

## 🚀 Deployment in Produzione

Per il deployment completo in produzione, consulta [DEPLOYMENT.md](DEPLOYMENT.md).

### Quick Deploy

```bash
# 1. Clona su server
git clone https://github.com/tuouser/uaft.git /var/www/uaft

# 2. Configura .env.production

# 3. Deploy
sudo ./deploy/deploy.sh
```

### Scripts Disponibili

```bash
# Sviluppo
npm run dev                 # Next.js dev server
npm run smtp:dev           # SMTP server (no TLS, no auth)

# Produzione
npm run build              # Build Next.js
npm run smtp:prod          # SMTP server (TLS + auth)

# Utilità
npm run mail:verify        # Verifica configurazione mail server
npm run admin:seed         # Crea admin iniziale
npm run prisma:studio      # Database GUI
```

## 📊 Production Features

### 🔐 DKIM Signing

Tutte le email in uscita sono automaticamente firmate con DKIM:

1. Crea un dominio nell'admin panel
2. Il sistema genera automaticamente:
   - Chiave privata RSA 2048-bit (salvata nel DB)
   - Chiave pubblica (per record DNS)
   - Record DNS ottimizzati per il server
3. Le email vengono firmate automaticamente prima dell'invio

### 🛡️ Security Features

**Server SMTP Production:**
- ✅ Autenticazione obbligatoria (utenti devono autenticarsi)
- ✅ TLS/STARTTLS support
- ✅ Rate limiting: 10 email/ora per IP
- ✅ Anti-spam filters (keywords, URL count, uppercase ratio)
- ✅ Connection timeout: 60 secondi
- ✅ Max email size: 25MB

**Development vs Production:**

| Feature | Development | Production |
|---------|-------------|------------|
| Port | 25 | 587 (submission) |
| Auth | Optional | **Required** |
| TLS | Disabled | **Enabled** |
| Rate Limit | No | **Yes (10/hour)** |
| Anti-Spam | No | **Yes** |

### 📈 Monitoring

```bash
# Systemd logs
sudo journalctl -u uaft-smtp -f

# Database logs
SELECT * FROM mail_logs WHERE status = 'failed';

# Rate limit stats
SELECT COUNT(*) FROM mail_logs
WHERE created_at >= NOW() - INTERVAL '1 hour'
GROUP BY from_address;
```

## 🧪 Testing

### Test DKIM Signature

Invia email a [Mail-Tester](https://www.mail-tester.com/) per verificare:
- ✅ DKIM signature validity
- ✅ SPF alignment
- ✅ DMARC compliance
- ✅ Spam score

### Test con Telnet

```bash
# Connect
telnet mail.tuodominio.com 587

# Commands
EHLO test
STARTTLS
AUTH LOGIN
[base64_username]
[base64_password]
MAIL FROM:<test@tuodominio.com>
RCPT TO:<dest@example.com>
DATA
Subject: Test

Test email body
.
QUIT
```

## 🎯 Roadmap Completato

- [x] ✅ Autenticazione SMTP
- [x] ✅ Supporto DKIM completo
- [x] ✅ UI Webmail
- [x] ✅ Admin panel per gestione domini
- [x] ✅ Filtri anti-spam
- [x] ✅ Auto-configurazione DNS (GoDaddy)
- [x] ✅ Rate limiting
- [x] ✅ TLS/SSL support
- [x] ✅ Production deployment
- [ ] Supporto POP3/IMAP
- [ ] Queue system con Redis/Bull

---

**Made with ❤️ by UAFT - Production Ready Mail Server**
