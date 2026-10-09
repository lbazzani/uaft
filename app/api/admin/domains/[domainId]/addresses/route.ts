import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { soloAdmin } from '@/lib/mail/guardie';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ domainId: string }> }
) {
  try {
    // Mancava qualunque controllo: chiunque creava utenti con password a
    // scelta e caselle su qualsiasi dominio.
    const accesso = await soloAdmin();
    if (!accesso.ok) return accesso.risposta;

    const { domainId } = await params;
    const { localPart, userId, userName, userEmail, password } = await request.json();

    // Validate input
    if (typeof localPart !== 'string' || !/^[a-z0-9._+-]{1,64}$/i.test(localPart) || localPart.startsWith('.')) {
      return NextResponse.json(
        { error: 'La parte locale dell\'email è obbligatoria' },
        { status: 400 }
      );
    }

    // Get domain
    const domain = await prisma.mailDomain.findUnique({
      where: { id: domainId },
    });

    if (!domain) {
      return NextResponse.json(
        { error: 'Dominio non trovato' },
        { status: 404 }
      );
    }

    // Create full email address
    const fullAddress = `${localPart}@${domain.domain}`;

    // Check if address already exists
    const existingAddress = await prisma.mailAddress.findUnique({
      where: { address: fullAddress },
    });

    if (existingAddress) {
      return NextResponse.json(
        { error: 'Questo indirizzo email esiste già' },
        { status: 400 }
      );
    }

    let user;

    // Check if userId is provided (existing user)
    if (userId) {
      user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return NextResponse.json(
          { error: 'Utente non trovato' },
          { status: 404 }
        );
      }
    } else {
      // Create new user or find existing by email
      if (typeof userEmail !== 'string' || typeof password !== 'string' || !userEmail || !password) {
        return NextResponse.json(
          { error: 'Email e password sono obbligatori per creare un nuovo utente' },
          { status: 400 }
        );
      }
      // stessa regola della registrazione; il tetto evita bcrypt su megabyte
      if (password.length < 8 || password.length > 200 || userEmail.length > 254) {
        return NextResponse.json(
          { error: 'La password deve essere di almeno 8 caratteri' },
          { status: 400 }
        );
      }

      user = await prisma.user.findUnique({
        where: { email: userEmail },
      });

      if (!user) {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create new user
        user = await prisma.user.create({
          data: {
            email: userEmail,
            name: userName || null,
            password: hashedPassword,
          },
        });
      }
    }

    // Create mail address
    const mailAddress = await prisma.mailAddress.create({
      data: {
        address: fullAddress,
        userId: user.id,
        domainId: domain.id,
        isActive: true,
      },
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

    return NextResponse.json(mailAddress, { status: 201 });
  } catch (error: any) {
    console.error('Error creating mail address:', error);
    return NextResponse.json(
      { error: 'Errore nella creazione dell\'indirizzo email' },
      { status: 500 }
    );
  }
}
