import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateDomainSchema = z.object({
  mxRecord: z.string().optional(),
  spfRecord: z.string().optional(),
  dkimSelector: z.string().optional(),
  dmarcRecord: z.string().optional(),
  isActive: z.boolean().optional(),
});

// GET - Ottieni un singolo dominio
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !(session.user as any).isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const domain = await prisma.mailDomain.findUnique({
      where: { id },
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !(session.user as any).isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = updateDomainSchema.parse(body);

    const domain = await prisma.mailDomain.update({
      where: { id },
      data: validatedData,
      include: {
        addresses: true,
      },
    });

    return NextResponse.json(domain);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    console.error('Error updating domain:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Elimina un dominio
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !(session.user as any).isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

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
        message: error.message || 'Errore durante l\'eliminazione del dominio',
      },
      { status: 500 }
    );
  }
}
