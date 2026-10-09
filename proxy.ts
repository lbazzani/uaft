import { withAuth, type NextRequestWithAuth } from 'next-auth/middleware';
import { NextResponse, type NextFetchEvent, type NextRequest } from 'next/server';
import { postaAttiva, nonTrovato } from '@/lib/mail/posta';

// Posta, admin, login e registrazione: con UAFT_POSTA diverso da '1' (il
// default, e il caso del cluster: niente DB né SMTP) rispondono 404 qui,
// prima di qualunque pagina o route. Landing, /privacy, /terms, /api/chat,
// /api/healthz, /api/auth/* di NextAuth (la landing usa useSession), file
// statici, icone e immagine OG non passano dal proxy (vedi matcher).
// Le route API ricontrollano da sole (lib/mail/guardie.ts): se un percorso
// sfugge al matcher, rifiutano comunque.
const PREFISSI_POSTA = [
  '/admin',
  '/mail',
  '/login',
  '/register',
  '/api/admin',
  '/api/mail',
  '/api/auth/register',
];

function sotto(percorso: string, prefisso: string): boolean {
  return percorso === prefisso || percorso.startsWith(prefisso + '/');
}

// Comportamento di prima, con la posta accesa: /mail richiede il login,
// /admin anche il ruolo admin.
const conLogin = withAuth(
  function proxy(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    if (sotto(path, '/admin') && !token?.isAdmin) {
      return NextResponse.redirect(new URL('/mail/inbox', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export default function proxy(req: NextRequest, event: NextFetchEvent) {
  const path = req.nextUrl.pathname;

  if (!PREFISSI_POSTA.some((p) => sotto(path, p))) return NextResponse.next();
  if (!postaAttiva()) return nonTrovato();

  // API: sessione, ruolo e proprietà li verifica ogni route
  if (path.startsWith('/api/')) return NextResponse.next();
  // login e registrazione restano pubblici, come prima
  if (sotto(path, '/login') || sotto(path, '/register')) return NextResponse.next();

  return conLogin(req as NextRequestWithAuth, event);
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/mail/:path*',
    '/login/:path*',
    '/register/:path*',
    '/api/admin/:path*',
    '/api/mail/:path*',
    '/api/auth/register/:path*',
  ],
};
