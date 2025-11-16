import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createGoDaddyClient } from '@/lib/dns/godaddy-client';

/**
 * POST - Configura automaticamente i DNS su GoDaddy
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !(session.user as any).isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Ottieni il dominio dal database
    const domain = await prisma.mailDomain.findUnique({
      where: { id },
    });

    if (!domain) {
      return NextResponse.json({ error: 'Domain not found' }, { status: 404 });
    }

    // Crea il client GoDaddy
    const godaddyClient = createGoDaddyClient();

    if (!godaddyClient) {
      return NextResponse.json(
        {
          error: 'GoDaddy API not configured',
          message: 'Le credenziali API di GoDaddy non sono configurate. Aggiungi GODADDY_API_KEY e GODADDY_API_SECRET al file .env',
        },
        { status: 400 }
      );
    }

    // Verifica che le credenziali siano valide
    const isValid = await godaddyClient.validateCredentials();
    if (!isValid) {
      return NextResponse.json(
        {
          error: 'Invalid GoDaddy credentials',
          message: 'Le credenziali API di GoDaddy non sono valide. Verifica la configurazione.',
        },
        { status: 400 }
      );
    }

    // Configura i record DNS automaticamente
    const result = await godaddyClient.configureMailDNS(domain.domain, {
      mxRecord: domain.mxRecord || '',
      spfRecord: domain.spfRecord || '',
      dkimSelector: domain.dkimSelector || 'default',
      dkimPublicKey: domain.dkimPublicKey || '',
      dmarcRecord: domain.dmarcRecord || '',
    });

    if (!result.success) {
      return NextResponse.json(
        {
          error: 'DNS configuration failed',
          message: result.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    console.error('Error auto-configuring DNS:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error.message || 'Errore durante la configurazione automatica',
      },
      { status: 500 }
    );
  }
}
