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
      { error: error?.message || 'Failed to fetch sent messages' },
      { status: 500 }
    );
  }
}
