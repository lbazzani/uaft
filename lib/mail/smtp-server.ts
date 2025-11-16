import { SMTPServer, SMTPServerSession } from 'smtp-server';
import { simpleParser, ParsedMail } from 'mailparser';
import { Readable } from 'stream';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

interface EmailData {
  from: string;
  to: string[];
  subject: string;
  text: string;
  html: string;
  headers: Record<string, any>;
  messageId: string;
}

/**
 * UAFT SMTP Server per ricevere email
 * Porta: 25 (SMTP standard) o 587 (submission)
 */
export class UaftSmtpServer {
  private server: SMTPServer;
  private port: number;

  constructor(port: number = 25) {
    this.port = port;

    this.server = new SMTPServer({
      // Autenticazione opzionale per testing
      authOptional: true,

      // Disabilita TLS per sviluppo locale (abilita in produzione!)
      secure: false,
      disabledCommands: ['STARTTLS'],

      // Banner del server
      banner: 'UAFT Mail Server - The mail server that probably works',

      // Callback quando arriva un'email
      onData: this.handleEmailData.bind(this),

      // Logging
      logger: process.env.NODE_ENV === 'development',

      // Size limit: 10MB
      size: 10 * 1024 * 1024,
    });

    this.setupErrorHandlers();
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
      console.log('📧 Receiving email from:', session.envelope.mailFrom);
      console.log('📧 To:', session.envelope.rcptTo);

      // Parse email usando mailparser
      const parsed = await simpleParser(stream);

      // Estrai dati email
      const emailData = this.extractEmailData(parsed, session);

      // Salva nel database
      await this.saveToDatabase(emailData);

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
  private async saveToDatabase(emailData: EmailData): Promise<void> {
    // Trova il receiver (user) basato sull'indirizzo email destinatario
    // Per ora salviamo senza associare a un utente specifico se non trovato
    const receiverEmail = emailData.to[0]; // Prendi il primo destinatario

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

    // Crea il record email
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
        receiverId: receiver?.id,
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
        console.log(`🚀 UAFT SMTP Server listening on port ${this.port}`);
        console.log(`📬 Ready to receive emails!`);
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
let smtpServerInstance: UaftSmtpServer | null = null;

export function getSmtpServer(port?: number): UaftSmtpServer {
  if (!smtpServerInstance) {
    smtpServerInstance = new UaftSmtpServer(port);
  }
  return smtpServerInstance;
}
