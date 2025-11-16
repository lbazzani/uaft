import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;

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
