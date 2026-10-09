import { NextRequest, NextResponse } from 'next/server';
import { soloAdmin } from '@/lib/mail/guardie';
import { prisma } from '@/lib/prisma';

export async function GET(_request: NextRequest) {
  try {
    // Il controllo admin era commentato «per debug»: chiunque leggeva nomi
    // ed email di tutti gli utenti. E il log stampava la sessione intera.
    const accesso = await soloAdmin();
    if (!accesso.ok) return accesso.risposta;

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: {
        email: 'asc',
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
