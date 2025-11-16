import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createGoDaddyClient } from '@/lib/dns/godaddy-client';

/**
 * GET - Ottieni la lista dei domini GoDaddy
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !(session.user as any).isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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
        error: error.message || 'Internal server error',
        configured: true,
        valid: false,
      },
      { status: 500 }
    );
  }
}
