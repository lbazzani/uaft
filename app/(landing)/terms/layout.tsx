import type { Metadata } from 'next';

// La pagina è client (i testi cambiano con la lingua): titolo e descrizione stanno qui, sul server.
// Solo questi due campi: openGraph, canonical e immagine restano quelli del layout radice, risolti su /terms.
export const metadata: Metadata = {
  title: 'Termini e Condizioni',
  description: "I termini d'uso di UAFT: cosa promettiamo, cosa no e chi risponde di cosa. Il preventivo AI? Un generatore di numeri casuali con pretese.",
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
