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
    // Configurazione SMTP per invio
    // In produzione, configura con il tuo SMTP server reale
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'localhost',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: process.env.SMTP_USER
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          }
        : undefined,
      // Per sviluppo locale senza auth
      ignoreTLS: process.env.NODE_ENV === 'development',
      requireTLS: process.env.NODE_ENV === 'production',
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
