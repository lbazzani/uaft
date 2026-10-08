import crypto from 'crypto';

/**
 * Genera una coppia di chiavi RSA per DKIM
 */
export async function generateDKIMKeys(): Promise<{
  publicKey: string;
  privateKey: string;
}> {
  return new Promise((resolve, reject) => {
    // Genera coppia di chiavi RSA 2048 bit
    crypto.generateKeyPair(
      'rsa',
      {
        modulusLength: 2048,
        publicKeyEncoding: {
          type: 'spki',
          format: 'pem',
        },
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem',
        },
      },
      (err, publicKey, privateKey) => {
        if (err) {
          reject(err);
          return;
        }

        // Estrai solo la parte base64 della chiave pubblica per il record DNS
        const publicKeyBase64 = publicKey
          .replace(/-----BEGIN PUBLIC KEY-----/, '')
          .replace(/-----END PUBLIC KEY-----/, '')
          .replace(/\n/g, '')
          .trim();

        resolve({
          publicKey: publicKeyBase64,
          privateKey: privateKey,
        });
      }
    );
  });
}

/**
 * Formatta la chiave pubblica per il record DNS TXT
 */
export function formatDKIMPublicKey(publicKeyBase64: string): string {
  return `v=DKIM1; k=rsa; p=${publicKeyBase64}`;
}

/**
 * Ottiene l'IP pubblico del server
 */
export async function getServerPublicIP(): Promise<string> {
  try {
    // Prova a ottenere l'IP pubblico da servizi esterni
    const response = await fetch('https://api.ipify.org?format=json', {
      signal: AbortSignal.timeout(5000), // Timeout di 5 secondi
    });

    if (response.ok) {
      const data = await response.json();
      return data.ip;
    }
  } catch (error) {
    console.error('Could not fetch public IP:', error);
  }

  // Fallback: usa localhost (per sviluppo)
  return 'localhost';
}

/**
 * Genera i record DNS ottimali per un dominio
 */
export async function generateDNSRecords(domain: string, selector: string = 'default') {
  // Genera chiavi DKIM
  const { publicKey, privateKey } = await generateDKIMKeys();
  const dkimPublicKeyFormatted = formatDKIMPublicKey(publicKey);

  // Ottieni IP del server
  const serverIP = await getServerPublicIP();

  // Determina l'hostname MX
  // In produzione: mail.dominio.com punta all'IP del server
  // In sviluppo: localhost
  const mxHostname = serverIP === 'localhost' ? 'localhost' : `mail.${domain}`;
  const mailSubdomain = serverIP === 'localhost' ? null : `mail.${domain}`;

  // Genera il reverse DNS (PTR) per l'IP
  // Nota: Il PTR deve essere configurato dal provider hosting/ISP
  // Generiamo il valore consigliato
  const reverseDnsValue = mxHostname;

  return {
    // Record A per mail.dominio.com (se non localhost)
    ...(serverIP !== 'localhost' && {
      aRecord: serverIP,
      aRecordDetails: {
        type: 'A',
        name: 'mail',
        value: serverIP,
        ttl: 3600,
      },
    }),

    // Record MX
    mxRecord: `10 ${mxHostname}`,
    mxRecordDetails: {
      type: 'MX',
      name: '@',
      priority: 10,
      value: mxHostname,
      ttl: 3600,
    },

    // Record PTR (Reverse DNS)
    // IMPORTANTE: Questo deve essere configurato dal provider hosting/ISP
    ptrRecord: reverseDnsValue,
    ptrRecordDetails: {
      type: 'PTR',
      ip: serverIP,
      value: reverseDnsValue,
      note: 'Deve essere configurato dal provider hosting/ISP, non nel pannello DNS del dominio',
    },

    // Record SPF
    spfRecord: `v=spf1 mx ip4:${serverIP} ~all`,
    spfRecordDetails: {
      type: 'TXT',
      name: '@',
      value: `v=spf1 mx ip4:${serverIP} ~all`,
      ttl: 3600,
    },

    // Record DKIM
    dkimPublicKey: dkimPublicKeyFormatted,
    dkimPrivateKey: privateKey,
    dkimSelector: selector,
    dkimRecordDetails: {
      type: 'TXT',
      name: `${selector}._domainkey`,
      value: dkimPublicKeyFormatted,
      ttl: 3600,
    },

    // Record DMARC
    dmarcRecord: `v=DMARC1; p=quarantine; rua=mailto:postmaster@${domain}; pct=100`,
    dmarcRecordDetails: {
      type: 'TXT',
      name: '_dmarc',
      value: `v=DMARC1; p=quarantine; rua=mailto:postmaster@${domain}; pct=100`,
      ttl: 3600,
    },

    // Informazioni server
    serverIP,
    mxHostname,
    mailSubdomain,
  };
}
