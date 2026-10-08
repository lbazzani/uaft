import nodemailer, { Transporter } from 'nodemailer';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';
import { getDKIMCredentials, signEmailWithDKIM } from './dkim-signer';

export interface SendEmailOptions {
  from: string;
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject: string;
  text?: string;
  html?: string;
  userId?: string;
}

/**
 * UAFT SMTP Client per inviare email
 */
export class UaftSmtpClient {
  private transporter: Transporter;

  constructor() {
    console.log('🔧 Initializing UaftSmtpClient...');

    // Usa sempre il server SMTP locale per l'invio
    // Il server locale gestirà il relay verso destinatari esterni
    const smtpHost = process.env.SMTP_HOST || 'localhost';
    const smtpPort = parseInt(process.env.SMTP_PORT || '587');

    console.log(`📬 Using SMTP server: ${smtpHost}:${smtpPort}`);

    this.transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: false, // STARTTLS su porta 587
      auth: undefined, // Nessuna autenticazione per localhost
      requireTLS: true,
      ignoreTLS: false,
      tls: {
        rejectUnauthorized: false, // Accetta certificati self-signed
      },
    });
  }

  /**
   * Invia un'email con firma DKIM
   */
  async sendEmail(options: SendEmailOptions): Promise<{
    success: boolean;
    messageId: string;
    error?: string;
    dkimSigned?: boolean;
  }> {
    const messageId = `<${uuidv4()}@uaft.com>`;

    try {
      console.log('📤 Sending email to:', options.to);
      console.log('📤 Subject:', options.subject);

      // Estrai il dominio dal mittente
      const fromDomain = options.from.split('@')[1];

      // Ottieni credenziali DKIM per il dominio
      const dkimCredentials = await getDKIMCredentials(fromDomain);
      let dkimSigned = false;

      // Configurazione email di base
      const mailOptions: any = {
        from: options.from,
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        cc: options.cc,
        bcc: options.bcc,
        subject: options.subject,
        text: options.text,
        html: options.html,
        messageId,
      };

      // Se abbiamo le credenziali DKIM, firma l'email
      if (dkimCredentials) {
        console.log('🔐 Signing email with DKIM for domain:', fromDomain);

        try {
          // Firma DKIM
          const dkimSignature = await signEmailWithDKIM(
            {
              from: options.from,
              to: options.to,
              subject: options.subject,
              body: options.text || options.html || '',
            },
            dkimCredentials
          );

          // Aggiungi header DKIM
          mailOptions.headers = {
            ...mailOptions.headers,
            'DKIM-Signature': dkimSignature,
          };

          dkimSigned = true;
          console.log('✅ DKIM signature added');
        } catch (dkimError) {
          console.warn('⚠️  DKIM signing failed:', dkimError);
          // Continua comunque con l'invio senza firma DKIM
        }
      } else {
        console.warn(`⚠️  No DKIM credentials found for domain: ${fromDomain}`);
      }

      // Invia email
      const info = await this.transporter.sendMail(mailOptions);

      console.log('✅ Email sent successfully:', info.messageId);
      if (dkimSigned) {
        console.log('🔐 Email was DKIM signed');
      }

      // Salva nel database come email inviata
      await this.saveToDatabase(options, messageId, 'success');

      // Log nel database
      await this.logEmail(options, 'success');

      return {
        success: true,
        messageId: info.messageId,
        dkimSigned,
      };
    } catch (error) {
      console.error('❌ Error sending email:', error);

      // Salva nel database come failed
      await this.saveToDatabase(options, messageId, 'failed', error as Error);

      // Log errore
      await this.logEmail(options, 'failed', error as Error);

      return {
        success: false,
        messageId,
        error: (error as Error).message,
      };
    }
  }

  /**
   * Salva l'email inviata nel database
   */
  private async saveToDatabase(
    options: SendEmailOptions,
    messageId: string,
    status: 'success' | 'failed',
    error?: Error
  ): Promise<void> {
    try {
      const toAddresses = Array.isArray(options.to) ? options.to : [options.to];
      const ccAddresses = options.cc
        ? Array.isArray(options.cc)
          ? options.cc
          : [options.cc]
        : [];
      const bccAddresses = options.bcc
        ? Array.isArray(options.bcc)
          ? options.bcc
          : [options.bcc]
        : [];

      // Check if message already exists (duplicate prevention)
      const existing = await prisma.mailMessage.findUnique({
        where: { messageId },
      });

      if (existing) {
        console.log('⚠️  Message already saved in database, skipping:', messageId);
        return;
      }

      await prisma.mailMessage.create({
        data: {
          messageId,
          fromAddress: options.from,
          toAddresses,
          ccAddresses,
          bccAddresses,
          subject: options.subject,
          bodyText: options.text || '',
          bodyHtml: options.html || '',
          headers: {
            status,
            error: error?.message,
          },
          size: Buffer.byteLength((options.text || '') + (options.html || '')),
          senderId: options.userId || null,
          sentAt: new Date(),
        },
      });
    } catch (dbError) {
      console.error('Failed to save email to database:', dbError);
      // Non propagare l'errore - l'email è comunque stata inviata
    }
  }

  /**
   * Log email nel database
   */
  private async logEmail(
    options: SendEmailOptions,
    status: 'success' | 'failed',
    error?: Error
  ): Promise<void> {
    try {
      const toAddress = Array.isArray(options.to) ? options.to[0] : options.to;

      await prisma.mailLog.create({
        data: {
          type: 'outgoing',
          from: options.from,
          to: toAddress,
          subject: options.subject,
          status,
          error: error?.message || null,
          metadata: {
            cc: options.cc,
            bcc: options.bcc,
          },
        },
      });
    } catch (logError) {
      console.error('Failed to log email:', logError);
    }
  }

  /**
   * Verifica connessione SMTP
   */
  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('✅ SMTP connection verified');
      return true;
    } catch (error) {
      console.error('❌ SMTP connection failed:', error);
      return false;
    }
  }
}

// Export singleton instance
let smtpClientInstance: UaftSmtpClient | null = null;

export function getSmtpClient(): UaftSmtpClient {
  if (!smtpClientInstance) {
    smtpClientInstance = new UaftSmtpClient();
  }
  return smtpClientInstance;
}
