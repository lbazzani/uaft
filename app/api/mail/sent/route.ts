import { NextRequest, NextResponse } from 'next/server';
import { soloUtente } from '@/lib/mail/guardie';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    // posta accesa e sessione valida; l'userId viene dal JWT, mai dalla richiesta
    const accesso = await soloUtente();
    if (!accesso.ok) return accesso.risposta;
    const userId = accesso.userId;

    // Recupera i messaggi inviati dall'utente
    const sentMessages = await prisma.mailMessage.findMany({
      where: {
        senderId: userId,
      },
      orderBy: {
        sentAt: 'desc',
      },
      take: 50, // Limite ai primi 50 messaggi
    });

    return NextResponse.json({ messages: sentMessages });
  } catch (error: any) {
    console.error('API /mail/sent error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sent messages' },
      { status: 500 }
    );
  }
}
