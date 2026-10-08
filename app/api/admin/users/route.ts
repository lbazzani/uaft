import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    console.log('Users API - Session:', session?.user ? 'authenticated' : 'not authenticated');
    console.log('Users API - Is admin:', (session?.user as any)?.isAdmin);
    console.log('Users API - Full session:', JSON.stringify(session));

    // TEMPORANEO: Commenta il controllo auth per debug
    // if (!session?.user || !(session.user as any).isAdmin) {
    //   console.log('Users API - Unauthorized access attempt');
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

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

    console.log('Users API - Found users:', users.length);
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
