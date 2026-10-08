import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user ID from session
    const userId = (session.user as any).id;

    if (!userId) {
      console.error('No user ID in session:', session.user);
      return NextResponse.json({ error: 'User ID not found in session' }, { status: 401 });
    }

    // Get user's mail addresses
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        mailAddresses: {
          include: {
            domain: {
              select: {
                domain: true,
                isActive: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('User mail addresses:', user.mailAddresses.length);

    // Filter only active addresses from active domains
    const activeAddresses = user.mailAddresses
      .filter((addr) => addr.isActive && addr.domain.isActive)
      .map((addr) => ({
        id: addr.id,
        address: addr.address,
        isActive: addr.isActive,
        domain: addr.domain.domain,
      }));

    console.log('Active addresses:', activeAddresses.length);

    return NextResponse.json(activeAddresses);
  } catch (error) {
    console.error('Error fetching mail addresses:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
