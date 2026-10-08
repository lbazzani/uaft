import nodemailer, { Transporter } from 'nodemailer';
import dns from 'dns/promises';

/**
 * Direct SMTP Client - Invia email direttamente al server MX di destinazione
 * Questo è il comportamento corretto per un mail server (non relay)
 */
export class DirectSmtpClient {
  /**
   * Risolve il record MX per un dominio
   */
  async resolveMX(domain: string): Promise<string> {
    try {
      const mxRecords = await dns.resolveMx(domain);
      
      if (mxRecords.length === 0) {
        throw new Error(`No MX records found for domain: ${domain}`);
      }
      
      // Ordina per priorità (più basso = più alto priority)
      mxRecords.sort((a, b) => a.priority - b.priority);
      
      const mxHost = mxRecords[0].exchange;
      console.log(`📬 Resolved MX for ${domain}: ${mxHost} (priority: ${mxRecords[0].priority})`);
      
      return mxHost;
    } catch (error) {
      console.error(`❌ Failed to resolve MX for ${domain}:`, error);
      throw error;
    }
  }
  
  /**
   * Crea un transporter per un server MX specifico
   */
  createTransporter(mxHost: string): Transporter {
    return nodemailer.createTransport({
      host: mxHost,
      port: 25, // Porta standard per MX-to-MX delivery
      secure: false,
      requireTLS: true, // Usa STARTTLS se disponibile
      tls: {
        rejectUnauthorized: false, // Accetta certificati self-signed (per ora)
      },
    });
  }
  
  /**
   * Invia email direttamente al server MX
   */
  async sendDirect(options: {
    from: string;
    to: string;
    subject: string;
    text?: string;
    html?: string;
    headers?: Record<string, string>;
  }): Promise<{
    success: boolean;
    messageId?: string;
    error?: string;
  }> {
    try {
      // Estrai dominio destinatario
      const toDomain = options.to.split('@')[1];
      
      console.log(`📤 Sending direct SMTP to ${options.to}`);
      
      // Risolvi MX
      const mxHost = await this.resolveMX(toDomain);
      
      // Crea transporter per questo MX
      const transporter = this.createTransporter(mxHost);
      
      // Invia email
      const info = await transporter.sendMail({
        from: options.from,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
        headers: options.headers,
      });
      
      console.log(`✅ Email delivered to ${mxHost}: ${info.messageId}`);
      
      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error) {
      console.error(`❌ Direct SMTP delivery failed:`, error);
      return {
        success: false,
        error: (error as Error).message,
      };
    }
  }
}

// Export singleton
let directSmtpInstance: DirectSmtpClient | null = null;

export function getDirectSmtpClient(): DirectSmtpClient {
  if (!directSmtpInstance) {
    directSmtpInstance = new DirectSmtpClient();
  }
  return directSmtpInstance;
}
