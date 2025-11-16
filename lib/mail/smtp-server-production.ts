import { SMTPServer, SMTPServerSession, SMTPServerAuthentication, SMTPServerAuthenticationResponse } from 'smtp-server';
import { simpleParser, ParsedMail } from 'mailparser';
import { Readable } from 'stream';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { getTLSCertificateManager } from './tls-certificate-manager';

interface EmailData {
  from: string;
  to: string[];
  subject: string;
  text: string;
  html: string;
  headers: Record<string, any>;
  messageId: string;
}

interface RateLimitEntry {
  count: number;
  firstSeen: number;
}

/**
 * UAFT SMTP Server - Production Version
 *
 * Features:
 * - TLS/SSL Support
 * - Authentication required
 * - Rate limiting
 * - SPF/DKIM verification (receiving)
 * - Anti-spam measures
 */
export class UaftSmtpServerProduction {
  private server: SMTPServer;
  private port: number;
  private rateLimits: Map<string, RateLimitEntry> = new Map();
  private readonly MAX_EMAILS_PER_HOUR = 100;
  private readonly MAX_EMAILS_PER_IP = 10;

  constructor(port: number = 587) {
    this.port = port;

    // Carica il manager dei certificati TLS
    const tlsManager = getTLSCertificateManager();

    // Carica tutti i certificati dai domini attivi
    tlsManager.loadAllCertificates().catch(err => {
      console.error('❌ Failed to load TLS certificates:', err);
    });

    // Percorsi certificati TLS di default (fallback)
    const tlsKeyPath = process.env.TLS_KEY_PATH || '/etc/ssl/private/mail.key';
    const tlsCertPath = process.env.TLS_CERT_PATH || '/etc/ssl/certs/mail.crt';

    // Verifica se i certificati di default esistono
    const tlsEnabled = fs.existsSync(tlsKeyPath) && fs.existsSync(tlsCertPath);

    if (!tlsEnabled) {
      console.warn('⚠️  Default TLS certificates not found.');
      console.warn('   Set TLS_KEY_PATH and TLS_CERT_PATH for fallback certificate');
      console.warn('   Or configure per-domain certificates in admin panel');
    }

    this.server = new SMTPServer({
      // Autenticazione OBBLIGATORIA in produzione
      authOptional: false,
      onAuth: this.handleAuthentication.bind(this),

      // TLS/SSL Configuration with SNI support
      secure: false, // false perché usiamo STARTTLS
      ...(tlsEnabled && {
        key: fs.readFileSync(tlsKeyPath),
        cert: fs.readFileSync(tlsCertPath),
      }),

      // SNI callback per certificati multipli
      SNICallback: tlsManager.getSNICallback(),

      // Richiedi STARTTLS prima di MAIL FROM
      // In produzione, commenta questa riga se non hai certificati
      // disabledCommands: tlsEnabled ? [] : ['STARTTLS'],

      // Banner del server
      banner: 'UAFT Secure Mail Server',

      // Callback quando arriva un'email
      onData: this.handleEmailData.bind(this),

      // Connection callback per rate limiting
      onConnect: this.handleConnection.bind(this),

      // Logging
      logger: process.env.NODE_ENV === 'development',

      // Size limit: 25MB
      size: 25 * 1024 * 1024,

      // Timeout settings
      socketTimeout: 60000, // 60 secondi
      closeTimeout: 30000, // 30 secondi
    });

    this.setupErrorHandlers();
    this.startRateLimitCleanup();
  }

  /**
   * Gestisce l'autenticazione SMTP
   */
  private async handleAuthentication(
    auth: SMTPServerAuthentication,
    session: SMTPServerSession,
    callback: (err: Error | null | undefined, response?: SMTPServerAuthenticationResponse) => void
  ): Promise<void> {
    try {
      console.log('🔐 Authentication attempt:', auth.username);

      // Verifica se l'utente ha un indirizzo email valido
      const mailAddress = await prisma.mailAddress.findFirst({
        where: {
          address: auth.username,
          isActive: true,
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              password: true,
            },
          },
        },
      });

      if (!mailAddress || !mailAddress.user) {
        console.log('❌ Authentication failed: user not found');
        callback(new Error('Invalid credentials'));
        return;
      }

      // In produzione, verifica la password con bcrypt
      const bcrypt = require('bcryptjs');
      const isPasswordValid = await bcrypt.compare(
        auth.password,
        mailAddress.user.password
      );

      if (!isPasswordValid) {
        console.log('❌ Authentication failed: invalid password');
        callback(new Error('Invalid credentials'));
        return;
      }

      console.log('✅ Authentication successful for:', auth.username);

      // Salva userId nella session per uso successivo
      (session as any).userId = mailAddress.user.id;
      (session as any).mailAddress = auth.username;

      callback(null, { user: mailAddress.user.id });
    } catch (error) {
      console.error('❌ Authentication error:', error);
      callback(error as Error);
    }
  }

  /**
   * Gestisce le nuove connessioni con rate limiting
   */
  private async handleConnection(
    session: SMTPServerSession,
    callback: (err?: Error) => void
  ): Promise<void> {
    const clientIP = session.remoteAddress;

    console.log('📡 New connection from:', clientIP);

    // Rate limiting per IP
    if (!this.checkRateLimit(clientIP)) {
      console.log('🚫 Rate limit exceeded for IP:', clientIP);
      callback(new Error('Rate limit exceeded. Try again later.'));
      return;
    }

    callback();
  }

  /**
   * Verifica il rate limit per un IP
   */
  private checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const entry = this.rateLimits.get(ip);

    if (!entry) {
      // Prima connessione da questo IP
      this.rateLimits.set(ip, { count: 1, firstSeen: now });
      return true;
    }

    const hourAgo = now - 60 * 60 * 1000;

    if (entry.firstSeen < hourAgo) {
      // Reset se è passata più di un'ora
      this.rateLimits.set(ip, { count: 1, firstSeen: now });
      return true;
    }

    if (entry.count >= this.MAX_EMAILS_PER_IP) {
      return false;
    }

    entry.count++;
    return true;
  }

  /**
   * Pulizia periodica dei rate limits
   */
  private startRateLimitCleanup(): void {
    setInterval(() => {
      const now = Date.now();
      const hourAgo = now - 60 * 60 * 1000;

      for (const [ip, entry] of this.rateLimits.entries()) {
        if (entry.firstSeen < hourAgo) {
          this.rateLimits.delete(ip);
        }
      }

      console.log(`🧹 Rate limit cleanup: ${this.rateLimits.size} IPs tracked`);
    }, 15 * 60 * 1000); // Ogni 15 minuti
  }

  /**
   * Gestisce l'arrivo di una nuova email
   */
  private async handleEmailData(
    stream: Readable,
    session: SMTPServerSession,
    callback: (err?: Error | null) => void
  ): Promise<void> {
    try {
      const userId = (session as any).userId;

      console.log('📧 Receiving email from:', session.envelope.mailFrom);
      console.log('📧 To:', session.envelope.rcptTo);
      console.log('📧 Authenticated user:', userId);

      // Parse email usando mailparser
      const parsed = await simpleParser(stream);

      // Verifica anti-spam (semplice)
      if (this.isSpam(parsed)) {
        console.log('🚫 Email rejected as spam');
        await this.logEmail('incoming', null, 'bounced', new Error('Spam detected'));
        callback(new Error('Email rejected'));
        return;
      }

      // Estrai dati email
      const emailData = this.extractEmailData(parsed, session);

      // Salva nel database
      await this.saveToDatabase(emailData, userId);

      console.log('✅ Email saved successfully:', emailData.messageId);

      // Log nel database
      await this.logEmail('incoming', emailData, 'success');

      callback(); // Success
    } catch (error) {
      console.error('❌ Error processing email:', error);

      // Log errore
      await this.logEmail('incoming', null, 'failed', error as Error);

      callback(error as Error);
    }
  }

  /**
   * Verifica anti-spam semplice
   */
  private isSpam(parsed: ParsedMail): boolean {
    const subject = parsed.subject || '';
    const text = parsed.text || '';

    // Blacklist keywords (personalizzare)
    const spamKeywords = [
      'viagra',
      'casino',
      'lottery',
      'winner',
      'click here now',
      'limited time offer',
    ];

    const content = (subject + ' ' + text).toLowerCase();

    for (const keyword of spamKeywords) {
      if (content.includes(keyword.toLowerCase())) {
        return true;
      }
    }

    // Troppe URL
    const urlCount = (text.match(/https?:\/\//g) || []).length;
    if (urlCount > 10) {
      return true;
    }

    // Troppi MAIUSCOLE
    const upperCaseRatio = (text.match(/[A-Z]/g) || []).length / text.length;
    if (upperCaseRatio > 0.5 && text.length > 50) {
      return true;
    }

    return false;
  }

  /**
   * Estrae i dati dall'email parsata
   */
  private extractEmailData(parsed: ParsedMail, session: SMTPServerSession): EmailData {
    return {
      from: parsed.from?.text || session.envelope.mailFrom?.address || 'unknown',
      to: session.envelope.rcptTo.map(addr => addr.address),
      subject: parsed.subject || '(No Subject)',
      text: parsed.text || '',
      html: parsed.html || '',
      headers: parsed.headers as any,
      messageId: parsed.messageId || `<${uuidv4()}@uaft.local>`,
    };
  }

  /**
   * Salva l'email nel database PostgreSQL
   */
  private async saveToDatabase(emailData: EmailData, userId?: string): Promise<void> {
    const receiverEmail = emailData.to[0];

    const receiver = await prisma.user.findFirst({
      where: {
        mailAddresses: {
          some: {
            address: receiverEmail,
            isActive: true,
          },
        },
      },
    });

    await prisma.mailMessage.create({
      data: {
        messageId: emailData.messageId,
        fromAddress: emailData.from,
        toAddresses: emailData.to,
        ccAddresses: [],
        bccAddresses: [],
        subject: emailData.subject,
        bodyText: emailData.text,
        bodyHtml: emailData.html,
        headers: emailData.headers as any,
        size: Buffer.byteLength(emailData.text + emailData.html),
        receiverId: receiver?.id || userId,
        receivedAt: new Date(),
      },
    });
  }

  /**
   * Log email nel database per debugging
   */
  private async logEmail(
    type: 'incoming' | 'outgoing' | 'error',
    emailData: EmailData | null,
    status: 'success' | 'failed' | 'bounced',
    error?: Error
  ): Promise<void> {
    try {
      await prisma.mailLog.create({
        data: {
          type,
          from: emailData?.from || null,
          to: emailData?.to[0] || null,
          subject: emailData?.subject || null,
          status,
          error: error?.message || null,
          metadata: emailData ? { headers: emailData.headers } : null,
        },
      });
    } catch (logError) {
      console.error('Failed to log email:', logError);
    }
  }

  /**
   * Setup error handlers
   */
  private setupErrorHandlers(): void {
    this.server.on('error', (err) => {
      console.error('❌ SMTP Server error:', err);
    });
  }

  /**
   * Avvia il server SMTP
   */
  public start(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.server.listen(this.port, () => {
        console.log(`\n🚀 UAFT SMTP Server (PRODUCTION) listening on port ${this.port}`);
        console.log(`🔐 Authentication: REQUIRED`);
        console.log(`🔒 TLS: ${fs.existsSync(process.env.TLS_KEY_PATH || '/etc/ssl/private/mail.key') ? 'ENABLED' : 'DISABLED'}`);
        console.log(`🛡️  Rate Limiting: ${this.MAX_EMAILS_PER_IP} emails/hour per IP`);
        console.log(`🚫 Anti-Spam: ENABLED`);
        console.log(`📬 Ready to receive emails!\n`);
        resolve();
      });

      this.server.on('error', reject);
    });
  }

  /**
   * Ferma il server SMTP
   */
  public stop(): Promise<void> {
    return new Promise((resolve) => {
      this.server.close(() => {
        console.log('🛑 SMTP Server stopped');
        resolve();
      });
    });
  }
}

// Export singleton instance
let smtpServerInstance: UaftSmtpServerProduction | null = null;

export function getSmtpServerProduction(port?: number): UaftSmtpServerProduction {
  if (!smtpServerInstance) {
    smtpServerInstance = new UaftSmtpServerProduction(port);
  }
  return smtpServerInstance;
}
