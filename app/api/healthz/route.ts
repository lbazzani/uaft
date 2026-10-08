import { NextResponse } from 'next/server';

// Sonda di salute per il cluster (readinessProbe e livenessProbe).
//
// Volutamente non tocca il database né il runner dell'AI: il database di
// uaft non viene migrato nel cluster (dati di prova del 16/11/2025, nessun
// uso), e il runner è un servizio condiviso che può essere in limite. Se la
// sonda dipendesse da uno dei due, il pod uscirebbe dal Service e cadrebbe
// anche la landing, che di nessuno dei due ha bisogno. Login e webmail
// falliscono da soli, pagina per pagina; la chat ha la sua risposta di riserva.

export const dynamic = 'force-dynamic';

export function GET() {
  return NextResponse.json({ ok: true });
}
