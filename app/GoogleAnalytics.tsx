'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { analyticsConsentiti, EVENTO_CONSENSO } from '@/lib/consenso';

// Google Analytics solo dopo il consenso agli analitici («Accetta tutto», o attivati in Personalizza):
// prima di una scelta non si scarica nemmeno lo script di Google. Spento sul server e al primo
// disegno; dopo il montaggio legge la scelta salvata e ascolta quella fatta adesso nel banner.
export default function GoogleAnalytics() {
  const [consentito, setConsentito] = useState(false);

  useEffect(() => {
    const aggiorna = () => setConsentito(analyticsConsentiti());
    aggiorna();
    window.addEventListener(EVENTO_CONSENSO, aggiorna);
    return () => window.removeEventListener(EVENTO_CONSENSO, aggiorna);
  }, []);

  if (!consentito) return null;

  return (
    <>
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-Q5DPM3JLG6"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-Q5DPM3JLG6');
          `,
        }}
      />
    </>
  );
}
