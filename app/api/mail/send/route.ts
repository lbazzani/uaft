import { NextRequest, NextResponse } from 'next/server';
import { getSmtpClient } from '@/lib/mail/smtp-client';
import { prisma } from '@/lib/prisma';
import { soloUtente } from '@/lib/mail/guardie';

// Prima non chiedeva nemmeno il login: chiunque spediva come qualunque
// indirizzo dei domini gestiti, con la firma DKIM del dominio, e registrava
// il messaggio a nome dell'userId scritto nel corpo. Ora: sessione valida,
// `from` deve essere una casella attiva dell'utente, l'userId è quello della
// sessione.
const MAX_DESTINATARI = 20;
const MAX_TESTO = 200_000;

function indirizzi(valore: unknown): string[] | null {
  if (valore === undefined || valore === null || valore === '') return [];
  const lista = Array.isArray(valore) ? valore : String(valore).split(',');
  const puliti = lista.map((v) => String(v).trim()).filter(Boolean);
  if (puliti.length > MAX_DESTINATARI) return null;
  // niente a capo: un destinatario non deve poter aggiungere intestazioni.
  // Niente virgole, punti e virgola, virgolette né parentesi: nodemailer
  // divide «a@x.it,b@y.it» in più indirizzi, e un elemento dell'array così
  // scavalcava il tetto di MAX_DESTINATARI.
  if (puliti.some((v) => v.length > 254 || /[\r\n]/.test(v) || !/^[^\s@<>,;:"()\\]+@[^\s@<>,;:"()\\]+$/.test(v))) return null;
  return puliti;
}

export async function POST(req: NextRequest) {
  try {
    const accesso = await soloUtente();
    if (!accesso.ok) return accesso.risposta;

    // Parse JSON con gestione errori
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error('Failed to parse JSON:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { from, to, cc, bcc, subject, text, html } = body ?? {};
    const userId = accesso.userId;

    // Validazione base
    if (!from || !to || !subject) {
      return NextResponse.json(
        { error: 'Missing required fields: from, to, subject' },
        { status: 400 }
      );
    }

    const listaTo = indirizzi(to);
    const listaCc = indirizzi(cc);
    const listaBcc = indirizzi(bcc);
    if (
      typeof from !== 'string' ||
      typeof subject !== 'string' ||
      /[\r\n]/.test(subject) ||
      subject.length > 998 ||
      !listaTo?.length ||
      !listaCc ||
      !listaBcc ||
      (text !== undefined && (typeof text !== 'string' || text.length > MAX_TESTO)) ||
      (html !== undefined && (typeof html !== 'string' || html.length > MAX_TESTO))
    ) {
      return NextResponse.json({ error: 'Invalid message' }, { status: 400 });
    }

    // il mittente deve essere una casella attiva, su un dominio attivo, di chi è loggato
    const casella = await prisma.mailAddress.findFirst({
      where: { address: from, userId, isActive: true, domain: { isActive: true } },
      select: { id: true },
    });
    if (!casella) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Ottieni client SMTP
    const smtpClient = getSmtpClient();

    // Invia email
    const result = await smtpClient.sendEmail({
      from,
      to: listaTo,
      cc: listaCc.length ? listaCc : undefined,
      bcc: listaBcc.length ? listaBcc : undefined,
      subject,
      text,
      html,
      userId,
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        messageId: result.messageId,
        message: 'Email sent successfully',
      });
    } else {
      // il dettaglio (SMTP, rete, DKIM) resta nei log
      console.error('API /mail/send: invio non riuscito', result.error);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to send email',
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('API /mail/send error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
