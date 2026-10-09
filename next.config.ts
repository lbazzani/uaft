import type { NextConfig } from 'next';

// Intestazioni di sicurezza su ogni risposta. Niente CSP: la pagina ha script
// inline (Google Analytics, JSON-LD, lo script che sceglie il tema prima del
// primo disegno) e una policy sbagliata spegnerebbe il sito; HSTS perché
// uaft.it è servito solo in HTTPS dall'edge (Caddy).
const intestazioniSicurezza = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
  // senza includeSubDomains: mail.uaft.it e gli altri sottodomini non sono serviti
  // da qui, e un HSTS sui sottodomini dura un anno nei browser che l'hanno visto
  { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Configurazione per Docker deployment
  output: 'standalone',
  // niente «X-Powered-By: Next.js»: non serve a nessun visitatore
  poweredByHeader: false,
  // Ignora errori TypeScript durante il build (temporaneo)
  typescript: {
    ignoreBuildErrors: true,
  },
  // (la chiave `eslint` non esiste più in Next 16: tolta)
  async headers() {
    return [{ source: '/:path*', headers: intestazioniSicurezza }];
  },
};

export default nextConfig;
