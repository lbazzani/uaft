import { NextResponse } from 'next/server';

// Interruttore della posta (webmail, pannello admin, login, registrazione).
//
// Nel cluster non ci sono database, SMTP né nginx (vedi il manifest di uaft
// nel repository della piattaforma): quelle pagine e API non possono
// funzionare, e lasciate raggiungibili sarebbero solo superficie d'attacco.
// Spente per default: si riaccendono solo con UAFT_POSTA=1, dove ci sono DB
// e SMTP.
//
// Niente import da Node qui: lo usa anche proxy.ts.
export function postaAttiva(): boolean {
  return process.env.UAFT_POSTA === '1';
}

// 404 senza dettagli: da fuori una funzione spenta non deve sembrare
// diversa da una che non esiste.
export function nonTrovato(): NextResponse {
  return new NextResponse('Not Found', {
    status: 404,
    headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' },
  });
}
