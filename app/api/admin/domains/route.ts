import { NextRequest, NextResponse } from 'next/server';
import { soloAdmin } from '@/lib/mail/guardie';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { generateDNSRecords } from '@/lib/crypto/dkim-generator';
import { nomeHostValido } from '@/lib/mail/validazione';

// La chiave privata DKIM resta nel database (la usa solo il firmatario,
// lib/mail/dkim-signer.ts): nessuna risposta verso il browser la contiene.
const SENZA_SEGRETI = { dkimPrivateKey: true } as const;

// Schema di validazione per il dominio
// Il nome finisce in record DNS, in configurazioni nginx e negli argomenti di
// certbot/openssl: oltre alla forma «nome.tld» di prima, il controllo stretto
// di lib/mail/validazione.ts (niente trattini in coda, niente maiuscole).
const domainSchema = z.object({
  domain: z
    .string()
    .trim()
    .toLowerCase()
    .min(3)
    .regex(/^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/)
    .refine(nomeHostValido),
  isActive: z.boolean().optional(),
});

// GET - Ottieni tutti i domini
export async function GET() {
  try {
    // posta accesa, sessione valida e ruolo admin (lib/mail/guardie.ts)
    const accesso = await soloAdmin();
    if (!accesso.ok) return accesso.risposta;

    const domains = await prisma.mailDomain.findMany({
      omit: SENZA_SEGRETI,
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
    // posta accesa, sessione valida e ruolo admin (lib/mail/guardie.ts)
    const accesso = await soloAdmin();
    if (!accesso.ok) return accesso.risposta;

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
      omit: SENZA_SEGRETI,
      data: {
        domain: validatedData.domain,
        mailSubdomain: dnsRecords.mailSubdomain,
        serverIp: dnsRecords.serverIP,
        aRecord: dnsRecords.aRecord || null,
        mxRecord: dnsRecords.mxRecord,
        ptrRecord: dnsRecords.ptrRecord,
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
      return NextResponse.json({ error: 'Invalid data', details: error.issues }, { status: 400 });
    }
    console.error('Error creating domain:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
