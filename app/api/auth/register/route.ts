import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { postaAttiva, nonTrovato } from '@/lib/mail/posta';

// Registrazione pubblica: crea solo utenti normali (isAdmin è fisso a false
// e dal corpo si leggono solo nome, email e password). Un utente senza
// caselle non può spedire né leggere posta altrui (lib/mail/guardie.ts e le
// route /api/mail/*), ma ogni registrazione costa un bcrypt e una riga nel
// database: limite per IP in memoria, come per la chat.
const LIMITE_IP = 5;
const FINESTRA_MS = 60 * 60_000;
const perIp = new Map<string, number[]>();

function troppe(ip: string, ora: number): boolean {
  const recenti = (perIp.get(ip) ?? []).filter((t) => ora - t < FINESTRA_MS);
  if (recenti.length >= LIMITE_IP) {
    perIp.set(ip, recenti);
    return true;
  }
  recenti.push(ora);
  perIp.set(ip, recenti);
  if (perIp.size > 5_000) {
    for (const [k, v] of perIp) if (!v.some((t) => ora - t < FINESTRA_MS)) perIp.delete(k);
  }
  return false;
}

// X-Real-IP lo riscrive ingress-nginx; X-Forwarded-For solo come ripiego
// (vedi ipDelClient in app/api/chat/route.ts)
function ipDelClient(req: NextRequest): string {
  const reale = req.headers.get('x-real-ip')?.trim();
  if (reale) return reale;
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'sconosciuto';
}

export async function POST(req: NextRequest) {
  // posta spenta (default, cluster senza database): la route non esiste
  if (!postaAttiva()) return nonTrovato();

  try {
    if (troppe(ipDelClient(req), Date.now())) {
      return NextResponse.json(
        { error: 'Troppi tentativi, riprova più tardi' },
        { status: 429, headers: { 'retry-after': String(FINESTRA_MS / 1000) } }
      );
    }

    const { name, email, password } = (await req.json()) ?? {};

    // Validazione
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Nome, email e password sono obbligatori' },
        { status: 400 }
      );
    }

    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      name.length > 100 ||
      email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return NextResponse.json({ error: 'Dati non validi' }, { status: 400 });
    }

    // il tetto evita bcrypt su megabyte di testo
    if (password.length < 8 || password.length > 200) {
      return NextResponse.json(
        { error: 'La password deve essere di almeno 8 caratteri' },
        { status: 400 }
      );
    }

    // Controlla se l'utente esiste già
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email già registrata' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Crea utente: mai admin da qui (gli admin li crea scripts/seed-admin.ts)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        isAdmin: false,
      },
    });

    // TODO: Crea automaticamente un indirizzo email per l'utente
    // quando avrà un dominio configurato

    return NextResponse.json(
      {
        success: true,
        message: 'Registrazione completata con successo',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Errore registrazione:', error);
    return NextResponse.json(
      { error: 'Errore durante la registrazione' },
      { status: 500 }
    );
  }
}
