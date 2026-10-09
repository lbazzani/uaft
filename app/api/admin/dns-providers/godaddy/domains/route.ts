import { NextRequest, NextResponse } from 'next/server';
import { soloAdmin } from '@/lib/mail/guardie';
import { createGoDaddyClient } from '@/lib/dns/godaddy-client';

/**
 * GET - Ottieni la lista dei domini GoDaddy
 */
export async function GET() {
  try {
    // posta accesa, sessione valida e ruolo admin (lib/mail/guardie.ts)
    const accesso = await soloAdmin();
    if (!accesso.ok) return accesso.risposta;

    const godaddyClient = createGoDaddyClient();

    if (!godaddyClient) {
      return NextResponse.json(
        {
          error: 'GoDaddy API not configured',
          configured: false,
        },
        { status: 200 }
      );
    }

    // Verifica credenziali
    const isValid = await godaddyClient.validateCredentials();
    if (!isValid) {
      return NextResponse.json(
        {
          error: 'Invalid credentials',
          configured: true,
          valid: false,
        },
        { status: 200 }
      );
    }

    // Ottieni i domini
    const domains = await godaddyClient.getDomains();

    return NextResponse.json({
      configured: true,
      valid: true,
      domains,
    });
  } catch (error: any) {
    console.error('Error fetching GoDaddy domains:', error);
    return NextResponse.json(
      {
        // il testo dell'errore di GoDaddy resta nei log
        error: 'Internal server error',
        configured: true,
        valid: false,
      },
      { status: 500 }
    );
  }
}
