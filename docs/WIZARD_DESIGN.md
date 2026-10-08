# Wizard Configurazione Dominio Email - Design Completo

## Architettura DNS Corretta

### Scenario: uaft.it

```
Dominio principale: uaft.it
Sito web: https://uaft.it (nginx su porta 443, certificato esistente)
Mail server: mail.uaft.it (SMTP su porte 25, 587, 465, certificato separato)
IP Server: 135.236.155.164
```

### Separazione Web vs Mail

**IMPORTANTE**: Dobbiamo separare completamente:
- **Certificati Web**: Gestiti da nginx per uaft.it (porta 443)
- **Certificati Mail**: Gestiti dal mail server per mail.uaft.it (porte SMTP)

Questo evita conflitti e permette configurazioni indipendenti.

## Record DNS Richiesti

### 1. Record A (Indirizzo IP)
```
Tipo: A
Nome: mail
Valore: 135.236.155.164
TTL: 3600

Risultato: mail.uaft.it → 135.236.155.164
```

**Importante**: Questo crea il sottodominio `mail.uaft.it` separato dal sito web `uaft.it`

### 2. Record MX (Mail Exchange)
```
Tipo: MX
Nome: @ (o vuoto, per uaft.it)
Priorità: 10
Valore: mail.uaft.it
TTL: 3600

Risultato: Email per @uaft.it vengono inviate a mail.uaft.it
```

**Nota**: MX punta al sottodominio `mail.uaft.it`, NON all'IP direttamente

### 3. Record PTR (Reverse DNS)
```
Tipo: PTR
IP: 135.236.155.164
Valore: mail.uaft.it
```

**CRITICO**: Il PTR NON si configura nel pannello DNS del dominio!
- Deve essere configurato dal provider hosting/ISP (es: Azure, AWS, DigitalOcean)
- È il "reverse lookup" dell'IP verso il dominio
- Fondamentale per evitare lo spam

**Come verificare**: `dig -x 135.236.155.164`

### 4. Record SPF (Sender Policy Framework)
```
Tipo: TXT
Nome: @ (o vuoto)
Valore: v=spf1 mx ip4:135.236.155.164 ~all
TTL: 3600

Significato:
- v=spf1: Versione SPF 1
- mx: Autorizza i server MX del dominio
- ip4:135.236.155.164: Autorizza l'IP specifico
- ~all: Soft fail per tutti gli altri
```

### 5. Record DKIM (DomainKeys Identified Mail)
```
Tipo: TXT
Nome: default._domainkey
Valore: v=DKIM1; k=rsa; p=<chiave_pubblica_generata>
TTL: 3600

La chiave viene generata automaticamente dal sistema
```

### 6. Record DMARC (Domain-based Message Authentication)
```
Tipo: TXT
Nome: _dmarc
Valore: v=DMARC1; p=quarantine; rua=mailto:postmaster@uaft.it; pct=100
TTL: 3600

Significato:
- p=quarantine: Metti in quarantena email sospette
- rua=mailto:postmaster@uaft.it: Invia report a postmaster
- pct=100: Applica la policy al 100% delle email
```

## Flusso Wizard Aggiornato

### Step 1: Inserisci Dominio
- Input: `uaft.it`
- Sistema genera automaticamente:
  - Mail subdomain: `mail.uaft.it`
  - IP server: `135.236.155.164`
  - Tutti i record DNS

### Step 2: Configura Record DNS
Mostra 6 sezioni in ordine:

1. **Record A** ⭐ NUOVO
   - Spiega che crea il sottodominio mail
   - Mostra come configurarlo
   - Bottone "Copia Valore"

2. **Record MX**
   - Spiega che punta a mail.uaft.it
   - Mostra priorità 10
   - Bottone "Copia Valore"

3. **Record PTR (Reverse DNS)** ⭐ NUOVO
   - ⚠️ Banner speciale: "Da configurare nel pannello del provider hosting"
   - Link a documentazione per Azure/AWS/DigitalOcean
   - Comando per verificare: `dig -x IP`

4. **Record SPF**
   - Include l'IP del server
   - Bottone "Copia Valore"

5. **Record DKIM**
   - Chiave generata automaticamente
   - Bottone "Copia Valore"

6. **Record DMARC**
   - Policy di quarantena
   - Bottone "Copia Valore"

### Step 3: Genera Certificato SSL per Mail
⭐ NUOVO STEP

Prima di completare, chiediamo:
- Email per Let's Encrypt
- Auto-rinnovo (sì/no)

Genera certificato per `mail.uaft.it` (NON per uaft.it)

### Step 4: Verifica e Completa
- Checklist di tutti i record configurati
- Verifica DNS (opzionale)
- Completa configurazione

## Interfaccia Wizard - Componenti Chiave

### Banner PTR Record
```tsx
<Alert severity="warning" icon={<Warning />}>
  <Typography variant="body2" fontWeight={600}>
    ⚠️ Il record PTR deve essere configurato dal tuo provider hosting
  </Typography>
  <Typography variant="body2" sx={{ mt: 1 }}>
    Il record PTR (Reverse DNS) non si configura nel pannello DNS del dominio,
    ma nel pannello del provider che gestisce l'IP del server.
  </Typography>
  <Box sx={{ mt: 2 }}>
    <Typography variant="caption" fontWeight={600}>
      Provider comuni:
    </Typography>
    <List dense>
      <ListItem>
        <ListItemText
          primary="Azure: Impostazioni → Networking → DNS name label"
          secondary="Configura PTR in Azure Portal"
        />
      </ListItem>
      <ListItem>
        <ListItemText
          primary="AWS: Route 53 → Hosted Zones → PTR Record"
          secondary="Richiedi PTR tramite AWS Support"
        />
      </ListItem>
      <ListItem>
        <ListItemText
          primary="DigitalOcean: Droplet Settings → Networking"
          secondary="Imposta Reverse DNS in droplet settings"
        />
      </ListItem>
    </List>
  </Box>
  <Typography variant="caption" sx={{ mt: 2, display: 'block' }}>
    💡 Per verificare se il PTR è configurato:
    <br />
    <code>dig -x {serverIp}</code>
  </Typography>
</Alert>
```

### Record A (nuovo)
```tsx
<Paper variant="outlined" sx={{ p: 3 }}>
  <Typography variant="h6">
    🌐 0. Record A (Indirizzo Mail Subdomain)
  </Typography>

  <Alert severity="info" sx={{ mt: 2 }}>
    Questo record crea il sottodominio <strong>mail.{domain}</strong>
    separato dal tuo sito web principale. Questo permette di:
    <ul>
      <li>Avere certificati SSL separati per web e mail</li>
      <li>Gestire indipendentemente web server e mail server</li>
      <li>Migliorare la deliverability delle email</li>
    </ul>
  </Alert>

  <Box sx={{ mt: 2, p: 1.5, bgcolor: 'grey.100', borderRadius: 1 }}>
    <Typography variant="caption" display="block">Tipo: A</Typography>
    <Typography variant="caption" display="block">Nome/Host: mail</Typography>
    <Typography variant="caption" display="block">Valore: {serverIp}</Typography>
    <Typography variant="caption" display="block">TTL: 3600</Typography>
  </Box>

  <Button
    size="small"
    startIcon={<ContentCopy />}
    onClick={() => copyToClipboard(serverIp, 'a-record')}
    sx={{ mt: 2 }}
  >
    Copia IP
  </Button>
</Paper>
```

## Gestione Certificati

### Certificati Web (esistenti)
- Dominio: `uaft.it`
- Gestito da: nginx
- Porta: 443 (HTTPS)
- Let's Encrypt: Configurato manualmente o con certbot

### Certificati Mail (nuovi)
- Dominio: `mail.uaft.it`  ⭐ NUOVO
- Gestito da: TLS Certificate Manager (lib/mail/tls-certificate-manager.ts)
- Porte: 25, 587, 465 (SMTP/STARTTLS)
- Let's Encrypt: Configurato tramite wizard

### Separazione
Il TLS Certificate Manager deve:
1. Generare certificati SOLO per `mail.{domain}`
2. Salvarli in path separati da nginx
3. Non interferire con i certificati web esistenti

## Verifica DNS

Implementare endpoint `/api/admin/domains/[id]/verify-dns` che:
1. Verifica record A: `dig mail.uaft.it`
2. Verifica record MX: `dig uaft.it MX`
3. Verifica record SPF: `dig uaft.it TXT`
4. Verifica record DKIM: `dig default._domainkey.uaft.it TXT`
5. Verifica record DMARC: `dig _dmarc.uaft.it TXT`
6. Verifica PTR: `dig -x 135.236.155.164`

Mostra risultati con:
- ✅ Configurato correttamente
- ⚠️ In propagazione (non ancora visibile)
- ❌ Non configurato o errato

## Database Schema

```prisma
model MailDomain {
  domain          String   // uaft.it
  mailSubdomain   String?  // mail.uaft.it ⭐ NUOVO
  serverIp        String?  // 135.236.155.164 ⭐ NUOVO
  aRecord         String?  // 135.236.155.164 ⭐ NUOVO
  mxRecord        String?  // 10 mail.uaft.it
  ptrRecord       String?  // mail.uaft.it ⭐ NUOVO
  spfRecord       String?
  dkimPublicKey   String?
  dkimPrivateKey  String?
  dkimSelector    String?
  dmarcRecord     String?

  // Certificati SOLO per mail subdomain
  tlsKeyPath      String?  // /etc/letsencrypt/live/mail.uaft.it/privkey.pem
  tlsCertPath     String?  // /etc/letsencrypt/live/mail.uaft.it/fullchain.pem
  tlsAutoRenew    Boolean
  tlsCertStatus   String?
  tlsCertExpiry   DateTime?
  tlsCertEmail    String?
}
```

## Priorità Implementazione

1. ✅ Schema database aggiornato
2. ✅ API creazione dominio con nuovi campi
3. ✅ Generatore DNS con A e PTR records
4. 🔄 Wizard UI con record A e PTR
5. ⏳ Step certificato SSL per mail subdomain
6. ⏳ Endpoint verifica DNS
7. ⏳ Aggiornare TLS Certificate Manager per usare mail subdomain
8. ⏳ Testare end-to-end
