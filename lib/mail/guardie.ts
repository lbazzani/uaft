import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { postaAttiva, nonTrovato } from '@/lib/mail/posta';

// Controlli comuni alle API di posta e admin, lato server: il proxy li fa
// già per le pagine, ma una route raggiunta per un percorso che il matcher
// non vede (o con il proxy cambiato) deve rifiutare da sola.

type Esito = { ok: true; userId: string; isAdmin: boolean } | { ok: false; risposta: NextResponse };

async function sessione(): Promise<Esito> {
  if (!postaAttiva()) return { ok: false, risposta: nonTrovato() };
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: unknown; isAdmin?: unknown } | undefined;
  if (!user || typeof user.id !== 'string' || !user.id) {
    return { ok: false, risposta: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
  return { ok: true, userId: user.id, isAdmin: user.isAdmin === true };
}

// Utente autenticato (webmail): la proprietà di caselle e messaggi la
// verifica la route, con l'userId che arriva da qui e MAI dal corpo.
export async function soloUtente(): Promise<Esito> {
  return sessione();
}

// Amministratore: isAdmin viene dal JWT firmato con NEXTAUTH_SECRET.
export async function soloAdmin(): Promise<Esito> {
  const esito = await sessione();
  if (esito.ok && !esito.isAdmin) {
    return { ok: false, risposta: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
  }
  return esito;
}
