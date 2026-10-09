import { NextResponse } from 'next/server';

// Sonda di salute per il cluster (readinessProbe e livenessProbe).
//
// Volutamente non tocca il runner dell'AI: è un servizio condiviso che può
// essere in limite, e se la sonda dipendesse da lui il pod uscirebbe dal
// Service e cadrebbe anche la landing, che non ne ha bisogno. La chat ha la
// sua risposta di riserva. Database non ce n'è più: è uscito con posta, login
// e pannello admin.

export const dynamic = 'force-dynamic';

export function GET() {
  return NextResponse.json({ ok: true });
}
