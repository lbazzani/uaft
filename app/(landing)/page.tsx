// La home è una pagina server: così il JSON-LD sta nell'HTML che arriva ai motori di ricerca (con
// next/script arrivava solo dopo l'idratazione). Testi e scene sono nella landing client (Landing.tsx).
import Landing from './Landing';

const SITO = 'https://uaft.it';

// Chi è UAFT: il marchio, il nome per esteso e chi c'è dietro. Niente offerte, sameAs né SearchAction:
// sarebbero dati inventati (non ci sono profili social, e il sito non ha una ricerca).
const datiStrutturati = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITO}/#organizzazione`,
      name: 'UAFT',
      alternateName: 'Una Azienda che può Fare Tutto',
      url: SITO,
      // PNG 180×180 di app/apple-icon.tsx: per il logo Google vuole almeno 112×112 px
      logo: `${SITO}/apple-icon`,
      founder: { '@type': 'Person', name: 'Lorenzo Bazzani', url: 'https://bazzani.info' },
    },
    {
      '@type': 'WebSite',
      '@id': `${SITO}/#sito`,
      name: 'UAFT',
      alternateName: 'Una Azienda che può Fare Tutto',
      url: SITO,
      inLanguage: 'it-IT',
      publisher: { '@id': `${SITO}/#organizzazione` },
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        // "<" come \u003c: nessuna stringa del JSON può chiudere lo <script>
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datiStrutturati).replace(/</g, '\\u003c') }}
      />
      <Landing />
    </>
  );
}
