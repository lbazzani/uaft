import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { generateDNSRecords } from '@/lib/crypto/dkim-generator';

// Schema di validazione per il dominio
const domainSchema = z.object({
  domain: z.string().min(3).regex(/^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/),
  isActive: z.boolean().optional(),
});

// GET - Ottieni tutti i domini
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !(session.user as any).isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const domains = await prisma.mailDomain.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        addresses: {
          select: {
            id: true,
            address: true,
            isActive: true,
          },
        },
      },
    });

    return NextResponse.json(domains);
  } catch (error) {
    console.error('Error fetching domains:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Crea un nuovo dominio
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !(session.user as any).isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = domainSchema.parse(body);

    // Verifica se il dominio esiste già
    const existingDomain = await prisma.mailDomain.findUnique({
      where: { domain: validatedData.domain },
    });

    if (existingDomain) {
      return NextResponse.json({ error: 'Domain already exists' }, { status: 400 });
    }

    // Genera automaticamente tutti i record DNS ottimizzati per il server
    const dnsRecords = await generateDNSRecords(validatedData.domain, 'default');

    const domain = await prisma.mailDomain.create({
      data: {
        domain: validatedData.domain,
        mxRecord: dnsRecords.mxRecord,
        spfRecord: dnsRecords.spfRecord,
        dkimPublicKey: dnsRecords.dkimPublicKey,
        dkimPrivateKey: dnsRecords.dkimPrivateKey,
        dkimSelector: dnsRecords.dkimSelector,
        dmarcRecord: dnsRecords.dmarcRecord,
        isActive: validatedData.isActive ?? true,
      },
      include: {
        addresses: true,
      },
    });

    return NextResponse.json(domain, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    console.error('Error creating domain:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
