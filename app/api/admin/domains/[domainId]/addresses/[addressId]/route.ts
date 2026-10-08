import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ domainId: string; addressId: string }> }
) {
  try {
    const { domainId, addressId } = await params;
    const { isActive } = await request.json();

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
