import type { Metadata } from 'next';

// La pagina è client (i testi cambiano con la lingua): titolo e descrizione stanno qui, sul server.
// Solo questi due campi: openGraph, canonical e immagine restano quelli del layout radice, risolti su /privacy.
export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Quali dati raccoglie UAFT e cosa ne fa: cookie tecnici, dati di navigazione, testi del preventivo AI. Spoiler: niente di losco, promesso.',
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
