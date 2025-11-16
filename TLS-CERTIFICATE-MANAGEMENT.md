# 🔐 TLS Certificate Management - SNI Implementation

## Overview

UAFT implements **SNI (Server Name Indication)** to support multiple TLS certificates for different mail domains on the same server. This allows each domain to have its own dedicated TLS certificate, improving security and trust.

---

## 🏗️ Architecture

### Components

1. **TLSCertificateManager** (`/lib/mail/tls-certificate-manager.ts`)
   - Loads and manages multiple certificates
   - Provides SNI callback for dynamic certificate selection
   - Monitors certificate expiration
   - Supports both Let's Encrypt and self-signed certificates

2. **Database Schema** (MailDomain model)
   - `tlsKeyPath` - Path to private key file
   - `tlsCertPath` - Path to certificate file
   - `tlsAutoRenew` - Enable automatic renewal with Let's Encrypt

3. **Certificate Generation Script** (`/scripts/generate-tls-certificate.ts`)
   - CLI tool for generating certificates
   - Supports both production (Let's Encrypt) and test (self-signed) certificates
   - Automatically updates database with certificate paths

4. **SMTP Server Integration** (`/lib/mail/smtp-server-production.ts`)
   - Uses TLSCertificateManager for SNI
   - Falls back to default certificate if domain-specific not found
   - Supports STARTTLS with multiple certificates

---

## 📋 How It Works

### SNI (Server Name Indication)

When a client connects to the SMTP server:

1. Client initiates TLS handshake with SNI hostname (e.g., `mail.example.com`)
2. SMTP server calls SNI callback with the hostname
3. TLSCertificateManager looks up certificate for that domain
4. Server presents the correct certificate to the client
5. TLS handshake completes with domain-specific certificate

### Certificate Storage

```
/etc/ssl/mail-certs/
├── mail.example.com.key      # Private key
├── mail.example.com.crt      # Certificate
├── mail.another.com.key
└── mail.another.com.crt

OR (Let's Encrypt):
/etc/letsencrypt/live/
├── mail.example.com/
│   ├── privkey.pem
│   └── fullchain.pem
└── mail.another.com/
    ├── privkey.pem
    └── fullchain.pem
```

---

## 🚀 Usage

### 1. Generate Certificate for a Domain

#### Production (Let's Encrypt)

```bash
# Prerequisites:
# - Domain must exist in database
# - DNS must point to server
# - Port 80 must be open for HTTP-01 challenge

npm run cert:generate -- example.com
```

This will:
- Validate domain exists in database
- Use certbot to generate certificate via HTTP-01 challenge
- Store certificate in `/etc/letsencrypt/live/mail.example.com/`
- Update database with certificate paths
- Enable auto-renewal

#### Development (Self-Signed)

```bash
npm run cert:generate -- example.com --self-signed
```

This will:
- Generate self-signed certificate with OpenSSL
- Store in `CERTIFICATES_DIR` (default: `/etc/ssl/mail-certs/`)
- Update database with certificate paths
- Valid for 365 days

### 2. Certificate Auto-Loading

The SMTP server automatically loads all certificates on startup:

```typescript
// In smtp-server-production.ts
const tlsManager = getTLSCertificateManager();
tlsManager.loadAllCertificates().catch(err => {
  console.error('❌ Failed to load TLS certificates:', err);
});
```

### 3. Manual Certificate Reload

If you add a new certificate while server is running:

```typescript
import { getTLSCertificateManager } from '@/lib/mail/tls-certificate-manager';

const manager = getTLSCertificateManager();
await manager.loadCertificate(
  'example.com',
  '/etc/letsencrypt/live/mail.example.com/privkey.pem',
  '/etc/letsencrypt/live/mail.example.com/fullchain.pem'
);
```

---

## 🔄 Certificate Renewal

### Let's Encrypt (Automatic)

Let's Encrypt certificates are valid for 90 days and auto-renew:

```bash
# Test renewal (dry-run)
sudo certbot renew --dry-run

# Manual renewal (if needed)
sudo certbot renew

# Restart SMTP server after renewal
sudo systemctl restart uaft-smtp
```

### Certificate Expiration Monitoring

TLSCertificateManager includes built-in monitoring:

```typescript
const expiring = manager.checkExpiringCertificates(30); // 30 days threshold

for (const cert of expiring) {
  console.warn(`⚠️  Certificate for ${cert.domain} expires on ${cert.expiresAt}`);
}
```

You can add this to a cron job:

```bash
# /etc/cron.daily/check-tls-certs
#!/bin/bash
cd /var/www/uaft
npm run cert:check-expiration
```

---

## 🛠️ Configuration

### Environment Variables

```env
# Default TLS certificate (fallback)
TLS_KEY_PATH=/etc/letsencrypt/live/mail.yourdomain.com/privkey.pem
TLS_CERT_PATH=/etc/letsencrypt/live/mail.yourdomain.com/fullchain.pem

# Certificate directory for self-signed certs
CERTIFICATES_DIR=/etc/ssl/mail-certs
```

### Database Setup

```sql
-- Enable TLS for a domain
UPDATE mail_domains
SET
  tls_key_path = '/etc/letsencrypt/live/mail.example.com/privkey.pem',
  tls_cert_path = '/etc/letsencrypt/live/mail.example.com/fullchain.pem',
  tls_auto_renew = true
WHERE domain = 'example.com';
```

---

## 🔍 Verification

### Test TLS Connection

```bash
# Test STARTTLS
openssl s_client -connect mail.example.com:587 -starttls smtp

# Check certificate details
openssl s_client -connect mail.example.com:587 -starttls smtp | openssl x509 -noout -text

# Verify SNI
openssl s_client -connect mail.example.com:587 -servername mail.example.com -starttls smtp
```

### Expected Output

```
CONNECTED(00000003)
depth=2 C = US, O = Internet Security Research Group, CN = ISRG Root X1
verify return:1
depth=1 C = US, O = Let's Encrypt, CN = R3
verify return:1
depth=0 CN = mail.example.com
verify return:1
---
Certificate chain
 0 s:CN = mail.example.com
   i:C = US, O = Let's Encrypt, CN = R3
---
```

---

## 📊 Monitoring

### Check Loaded Certificates

```typescript
import { getTLSCertificateManager } from '@/lib/mail/tls-certificate-manager';

const manager = getTLSCertificateManager();

// Get all loaded certificates
const certs = manager.getCertificate('example.com');
console.log('Certificate for example.com:', certs);
```

### SMTP Server Logs

```bash
# View SNI requests
sudo journalctl -u uaft-smtp -f | grep "SNI"

# Expected output:
# 🔍 SNI request for: mail.example.com
# ✅ Using certificate for domain: example.com
```

---

## 🚨 Troubleshooting

### Certificate Not Found

**Problem**: "Certificate not found for domain"

**Solution**:
1. Verify certificate files exist:
   ```bash
   ls -la /etc/letsencrypt/live/mail.example.com/
   ```

2. Check database:
   ```sql
   SELECT domain, tls_key_path, tls_cert_path
   FROM mail_domains
   WHERE domain = 'example.com';
   ```

3. Reload certificates:
   ```bash
   sudo systemctl restart uaft-smtp
   ```

### Permission Denied

**Problem**: "Error loading certificate: EACCES: permission denied"

**Solution**:
```bash
# Set correct permissions
sudo chown www-data:www-data /etc/ssl/mail-certs/*
sudo chmod 600 /etc/ssl/mail-certs/*.key
sudo chmod 644 /etc/ssl/mail-certs/*.crt
```

### Let's Encrypt Challenge Failed

**Problem**: "Certbot failed. Make sure port 80 is open"

**Solution**:
1. Verify port 80 is open:
   ```bash
   sudo ufw allow 80/tcp
   ```

2. Check DNS:
   ```bash
   dig mail.example.com
   ```

3. Verify nothing is listening on port 80:
   ```bash
   sudo lsof -i :80
   ```

### SNI Not Working

**Problem**: Server always uses default certificate

**Solution**:
1. Verify SNI callback is registered:
   ```typescript
   // In smtp-server-production.ts
   SNICallback: tlsManager.getSNICallback()
   ```

2. Test with explicit SNI hostname:
   ```bash
   openssl s_client -connect IP:587 -servername mail.example.com -starttls smtp
   ```

---

## 🔒 Security Best Practices

1. **Use Let's Encrypt in Production**
   - Free, trusted certificates
   - Automatic renewal
   - Widely supported

2. **Protect Private Keys**
   ```bash
   sudo chmod 600 /etc/ssl/mail-certs/*.key
   sudo chown www-data:www-data /etc/ssl/mail-certs/*.key
   ```

3. **Monitor Expiration**
   - Set up cron job to check certificate expiration
   - Alert 30 days before expiry
   - Test renewal process regularly

4. **Use Strong Ciphers**
   ```typescript
   ssl_protocols: ['TLSv1.2', 'TLSv1.3'],
   ssl_ciphers: 'HIGH:!aNULL:!MD5',
   ```

5. **Regular Certificate Rotation**
   - Even with auto-renewal, test manually
   - Keep backup certificates
   - Document renewal process

---

## 📚 Resources

- [RFC 6066 - TLS SNI Extension](https://tools.ietf.org/html/rfc6066#section-3)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [Node.js TLS Documentation](https://nodejs.org/api/tls.html)
- [OpenSSL s_client Manual](https://www.openssl.org/docs/man1.1.1/man1/s_client.html)

---

**Made with 🔐 by UAFT - Secure Multi-Domain Mail Server**
