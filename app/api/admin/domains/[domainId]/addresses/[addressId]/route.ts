import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { soloAdmin } from '@/lib/mail/guardie';

// Anche qui mancava il controllo admin: chiunque disattivava o cancellava
// caselle conoscendone gli id.

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ domainId: string; addressId: string }> }
) {
  try {
    const accesso = await soloAdmin();
    if (!accesso.ok) return accesso.risposta;

    const { domainId, addressId } = await params;
    const { isActive } = await request.json();
    if (typeof isActive !== 'boolean') {
      return NextResponse.json({ error: 'isActive deve essere true o false' }, { status: 400 });
    }

    const address = await prisma.mailAddress.update({
      where: {
        id: addressId,
        domainId: domainId,
      },
      data: { isActive },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(address);
  } catch (error: any) {
    console.error('Error updating mail address:', error);
    return NextResponse.json(
      { error: 'Errore nell\'aggiornamento dell\'indirizzo' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ domainId: string; addressId: string }> }
) {
  try {
    const accesso = await soloAdmin();
    if (!accesso.ok) return accesso.risposta;

    const { domainId, addressId } = await params;

    await prisma.mailAddress.delete({
      where: {
        id: addressId,
        domainId: domainId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting mail address:', error);
    return NextResponse.json(
      { error: 'Errore nell\'eliminazione dell\'indirizzo' },
      { status: 500 }
    );
  }
}
