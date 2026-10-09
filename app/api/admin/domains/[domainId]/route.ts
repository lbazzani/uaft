import { NextRequest, NextResponse } from 'next/server';
import { soloAdmin } from '@/lib/mail/guardie';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// La chiave privata DKIM non esce mai verso il browser.
const SENZA_SEGRETI = { dkimPrivateKey: true } as const;

// Valori che finiscono nei record DNS (auto-configure): lunghezze da record
// TXT e, per il selettore, una sola etichetta DNS.
const updateDomainSchema = z.object({
  mxRecord: z.string().max(255).optional(),
  spfRecord: z.string().max(2048).optional(),
  dkimSelector: z.string().regex(/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i).optional(),
  dmarcRecord: z.string().max(2048).optional(),
  isActive: z.boolean().optional(),
});

// GET - Ottieni un singolo dominio
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ domainId: string }> }
) {
  try {
    // posta accesa, sessione valida e ruolo admin (lib/mail/guardie.ts)
    const accesso = await soloAdmin();
    if (!accesso.ok) return accesso.risposta;

    const { domainId: id } = await params;

    const domain = await prisma.mailDomain.findUnique({
      where: { id },
      omit: SENZA_SEGRETI,
      include: {
        addresses: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!domain) {
      return NextResponse.json({ error: 'Domain not found' }, { status: 404 });
    }

    return NextResponse.json(domain);
  } catch (error) {
    console.error('Error fetching domain:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH - Aggiorna un dominio
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ domainId: string }> }
) {
  try {
    // posta accesa, sessione valida e ruolo admin (lib/mail/guardie.ts)
    const accesso = await soloAdmin();
    if (!accesso.ok) return accesso.risposta;

    const { domainId: id } = await params;
    const body = await request.json();
    const validatedData = updateDomainSchema.parse(body);

    const domain = await prisma.mailDomain.update({
      where: { id },
      omit: SENZA_SEGRETI,
      data: validatedData,
      include: {
        addresses: true,
      },
    });

    return NextResponse.json(domain);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.issues }, { status: 400 });
    }
    console.error('Error updating domain:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Elimina un dominio
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ domainId: string }> }
) {
  try {
    // posta accesa, sessione valida e ruolo admin (lib/mail/guardie.ts)
    const accesso = await soloAdmin();
    if (!accesso.ok) return accesso.risposta;

    const { domainId: id } = await params;

    // Verifica che il dominio esista
    const domain = await prisma.mailDomain.findUnique({
      where: { id },
      include: {
        addresses: true,
      },
    });

    if (!domain) {
      return NextResponse.json({ error: 'Domain not found' }, { status: 404 });
    }

    // Verifica se ci sono indirizzi email associati
    if (domain.addresses.length > 0) {
      return NextResponse.json(
        {
          error: 'Cannot delete domain with active email addresses',
          message: `Il dominio ha ${domain.addresses.length} indirizzo/i email associato/i. Elimina prima gli indirizzi email.`,
        },
        { status: 400 }
      );
    }

    await prisma.mailDomain.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting domain:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Errore durante l\'eliminazione del dominio',
      },
      { status: 500 }
    );
  }
}
