import { NextRequest, NextResponse } from 'next/server';
import { soloUtente } from '@/lib/mail/guardie';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    // posta accesa e sessione valida; l'userId viene dal JWT, mai dalla richiesta
    const accesso = await soloUtente();
    if (!accesso.ok) return accesso.risposta;
    const userId = accesso.userId;

    // Ottieni email ricevute dall'utente
    const emails = await prisma.mailMessage.findMany({
      where: {
        receiverId: userId,
        isDeleted: false,
      },
      orderBy: {
        receivedAt: 'desc',
      },
      take: 50, // Limita a 50 email più recenti
      select: {
        id: true,
        messageId: true,
        fromAddress: true,
        subject: true,
        bodyText: true,
        isRead: true,
        isStarred: true,
        receivedAt: true,
      },
    });

    return NextResponse.json({ emails });
  } catch (error: any) {
    console.error('API /mail/inbox error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch emails' },
      { status: 500 }
    );
  }
}
