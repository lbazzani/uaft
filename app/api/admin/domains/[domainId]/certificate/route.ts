import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getTLSCertificateManager } from '@/lib/mail/tls-certificate-manager';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

/**
 * GET - Verifica lo stato del certificato
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ domainId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !(session.user as any).isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { domainId } = await params;

    const domain = await prisma.mailDomain.findUnique({
      where: { id: domainId },
      select: {
        domain: true,
        tlsKeyPath: true,
        tlsCertPath: true,
        tlsCertStatus: true,
        tlsCertExpiry: true,
        tlsCertEmail: true,
        tlsAutoRenew: true,
      },
    });

    if (!domain) {
      return NextResponse.json({ error: 'Domain not found' }, { status: 404 });
    }

    // Verifica lo stato del certificato se esiste
    let status = domain.tlsCertStatus || 'missing';
    let expiryDate = domain.tlsCertExpiry;
    let daysUntilExpiry = null;

    if (domain.tlsCertPath) {
      try {
        // Leggi il certificato e verifica la data di scadenza
        const certContent = await fs.readFile(domain.tlsCertPath, 'utf8');
        const cert = new crypto.X509Certificate(certContent);
        const validTo = new Date(cert.validTo);
        expiryDate = validTo;

        const now = new Date();
        daysUntilExpiry = Math.floor((validTo.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        if (daysUntilExpiry < 0) {
          status = 'expired';
        } else if (daysUntilExpiry < 30) {
          status = 'expiring';
        } else {
          status = 'valid';
        }

        // Aggiorna lo stato nel database se è cambiato
        if (status !== domain.tlsCertStatus || expiryDate.toISOString() !== domain.tlsCertExpiry?.toISOString()) {
          await prisma.mailDomain.update({
            where: { id: domainId },
            data: {
              tlsCertStatus: status,
              tlsCertExpiry: expiryDate,
            },
          });
        }
      } catch (error) {
        console.error('Error reading certificate:', error);
        status = 'invalid';
      }
    }

    return NextResponse.json({
      status,
      expiryDate,
      daysUntilExpiry,
      email: domain.tlsCertEmail,
      autoRenew: domain.tlsAutoRenew,
      paths: {
        key: domain.tlsKeyPath,
        cert: domain.tlsCertPath,
      },
    });
  } catch (error) {
    console.error('Error checking certificate:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST - Genera un nuovo certificato Let's Encrypt
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ domainId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !(session.user as any).isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { domainId } = await params;
    const { email, autoRenew } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required for Let\'s Encrypt' },
        { status: 400 }
      );
    }

    const domain = await prisma.mailDomain.findUnique({
      where: { id: domainId },
      select: { domain: true, mailSubdomain: true },
    });

    if (!domain) {
      return NextResponse.json({ error: 'Domain not found' }, { status: 404 });
    }

    const domainName = domain.domain;
    const tlsManager = getTLSCertificateManager();

    console.log(`🔐 Generating Let's Encrypt certificate for ${domain.mailSubdomain || domainName} with email ${email}`);

    try {
      // Usa il TLS Certificate Manager per generare il certificato
      // Questo genererà il certificato per mail.{domain} se mailSubdomain è impostato
      const { keyPath, certPath } = await tlsManager.generateLetsEncryptCertificate(
        domainName,
        email,
        autoRenew || false
      );

      console.log(`✅ Certificate generated successfully for ${domain.mailSubdomain || domainName}`);

      // Leggi la data di scadenza dal database (già aggiornata da generateLetsEncryptCertificate)
      const updatedDomain = await prisma.mailDomain.findUnique({
        where: { id: domainId },
        select: { tlsCertExpiry: true },
      });

      return NextResponse.json({
        success: true,
        message: 'Certificate generated successfully',
        expiryDate: updatedDomain?.tlsCertExpiry,
        paths: { keyPath, certPath },
      });
    } catch (certError: any) {
      console.error('Error generating certificate:', certError);

      return NextResponse.json(
        {
          error: 'Failed to generate certificate',
          message: certError.message || 'Unknown error',
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error generating certificate:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Rimuovi certificato
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ domainId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !(session.user as any).isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { domainId } = await params;

    const domain = await prisma.mailDomain.findUnique({
      where: { id: domainId },
      select: {
        domain: true,
        tlsKeyPath: true,
        tlsCertPath: true,
      },
    });

    if (!domain) {
      return NextResponse.json({ error: 'Domain not found' }, { status: 404 });
    }

    // Rimuovi i file del certificato
    try {
      if (domain.tlsKeyPath) {
        await fs.unlink(domain.tlsKeyPath).catch(() => {});
      }
      if (domain.tlsCertPath) {
        await fs.unlink(domain.tlsCertPath).catch(() => {});
      }

      // Rimuovi la directory del dominio se vuota
      const domainCertDir = path.join(process.cwd(), 'certs', domain.domain);
      try {
        await fs.rmdir(domainCertDir);
      } catch (error) {
        // Directory non vuota o non esiste, ignora
      }
    } catch (error) {
      console.error('Error removing certificate files:', error);
    }

    // Aggiorna il database
    await prisma.mailDomain.update({
      where: { id: domainId },
      data: {
        tlsKeyPath: null,
        tlsCertPath: null,
        tlsCertStatus: 'missing',
        tlsCertExpiry: null,
      },
    });

    return NextResponse.json({ success: true, message: 'Certificate removed' });
  } catch (error) {
    console.error('Error removing certificate:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
