import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

/**
 * DKIM Signer - Firma le email con DKIM per autenticazione
 *
 * RFC 6376: DomainKeys Identified Mail (DKIM) Signatures
 */

export interface DKIMSignOptions {
  domain: string;
  selector: string;
  privateKey: string;
  headers?: string[];
}

export interface EmailToSign {
  from: string;
  to: string | string[];
  subject: string;
  body: string;
  headers?: Record<string, string>;
}

/**
 * Genera la firma DKIM per un'email
 */
export async function signEmailWithDKIM(
  email: EmailToSign,
  options: DKIMSignOptions
): Promise<string> {
  // Headers da includere nella firma (standard)
  const headersToSign = options.headers || [
    'from',
    'to',
    'subject',
    'date',
    'message-id',
  ];

  // Canonicalizza gli headers
  const canonicalHeaders = canonicalizeHeaders(email, headersToSign);

  // Canonicalizza il body
  const canonicalBody = canonicalizeBody(email.body);

  // Calcola hash del body
  const bodyHash = crypto
    .createHash('sha256')
    .update(canonicalBody)
    .digest('base64');

  // Costruisci la DKIM signature header (senza signature)
  const dkimHeader = buildDKIMHeader({
    domain: options.domain,
    selector: options.selector,
    bodyHash,
    headers: headersToSign,
  });

  // Dati da firmare: headers canonicalizzati + DKIM header
  const dataToSign = canonicalHeaders + dkimHeader;

  // Firma con chiave privata RSA
  const signature = crypto
    .createSign('RSA-SHA256')
    .update(dataToSign)
    .sign(options.privateKey, 'base64');

  // Restituisci l'header DKIM completo
  return `${dkimHeader} b=${signature};`;
}

/**
 * Ottiene le credenziali DKIM per un dominio dal database
 */
export async function getDKIMCredentials(
  domain: string
): Promise<DKIMSignOptions | null> {
  const mailDomain = await prisma.mailDomain.findUnique({
    where: { domain, isActive: true },
    select: {
      domain: true,
      dkimSelector: true,
      dkimPrivateKey: true,
    },
  });

  if (!mailDomain || !mailDomain.dkimPrivateKey || !mailDomain.dkimSelector) {
    return null;
  }

  return {
    domain: mailDomain.domain,
    selector: mailDomain.dkimSelector,
    privateKey: mailDomain.dkimPrivateKey,
  };
}

/**
 * Canonicalizza gli headers secondo RFC 6376
 */
function canonicalizeHeaders(
  email: EmailToSign,
  headersToSign: string[]
): string {
  const headers: Record<string, string> = {
    from: email.from,
    to: Array.isArray(email.to) ? email.to.join(', ') : email.to,
    subject: email.subject,
    date: new Date().toUTCString(),
    'message-id': `<${Date.now()}@${email.from.split('@')[1]}>`,
    ...email.headers,
  };

  let canonical = '';
  for (const header of headersToSign) {
    const value = headers[header.toLowerCase()];
    if (value) {
      // Canonicalize: lowercase header name, trim spaces
      canonical += `${header.toLowerCase()}:${value.trim()}\r\n`;
    }
  }

  return canonical;
}

/**
 * Canonicalizza il body secondo RFC 6376 (simple canonicalization)
 */
function canonicalizeBody(body: string): string {
  // Remove trailing whitespace from lines
  let canonical = body
    .split('\r\n')
    .map((line) => line.trimEnd())
    .join('\r\n');

  // Remove trailing empty lines
  canonical = canonical.replace(/(\r\n)+$/, '\r\n');

  return canonical;
}

/**
 * Costruisce l'header DKIM (senza la signature)
 */
function buildDKIMHeader(params: {
  domain: string;
  selector: string;
  bodyHash: string;
  headers: string[];
}): string {
  const timestamp = Math.floor(Date.now() / 1000);

  return (
    `DKIM-Signature: v=1; a=rsa-sha256; c=relaxed/simple; ` +
    `d=${params.domain}; s=${params.selector}; ` +
    `t=${timestamp}; ` +
    `bh=${params.bodyHash}; ` +
    `h=${params.headers.join(':')}; `
  );
}

/**
 * Verifica se un dominio ha DKIM configurato
 */
export async function isDKIMConfigured(domain: string): Promise<boolean> {
  const credentials = await getDKIMCredentials(domain);
  return credentials !== null;
}

/**
 * Aggiunge l'header DKIM a un messaggio email completo
 */
export function addDKIMHeaderToEmail(
  rawEmail: string,
  dkimHeader: string
): string {
  // Inserisce il DKIM-Signature header all'inizio delle headers
  const headerEndIndex = rawEmail.indexOf('\r\n\r\n');
  if (headerEndIndex === -1) {
    throw new Error('Invalid email format: no header/body separator found');
  }

  const headers = rawEmail.substring(0, headerEndIndex);
  const body = rawEmail.substring(headerEndIndex);

  return dkimHeader + '\r\n' + headers + body;
}
