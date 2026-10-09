'use client';
// La landing di UAFT. È una pagina client perché i testi vengono dal contesto della lingua.
// L'impaginato e il motore di scorrimento sono quelli del sito di Blumẽa (sito.css, lib/scena.ts);
// l'idea che tiene insieme tutto è l'asterisco: ogni promessa ha la sua nota a piè di pagina.
import { useEffect } from 'react';
import Script from 'next/script';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import Apertura from '@/components/sito/Apertura';
import Payoff from '@/components/sito/Payoff';
import Servizi from '@/components/sito/Servizi';
import Metodo from '@/components/sito/Metodo';
import Coppia from '@/components/sito/Coppia';
import ChiSiamo from '@/components/sito/ChiSiamo';
import Carriere from '@/components/sito/Carriere';
import Essenza from '@/components/sito/Essenza';
import Finale from '@/components/sito/Finale';
import { useLanguage } from '@/contexts/LanguageContext';
import { avviaScena } from '@/lib/scena';
import './sito.css';

export default function Home() {
  const { t, language } = useLanguage();

  // Il motore riparte quando cambia la lingua: i testi cambiano lunghezza e le scene vanno rimisurate.
  useEffect(() => avviaScena(), [language]);
  // <html lang> segue la lingua scelta: chi legge con lo schermo sente la pronuncia giusta
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'UAFT - Una Azienda che può Fare Tutto',
    alternateName: 'UAFT',
    url: 'https://uaft.it',
    logo: 'https://uaft.it/icon.svg',
    description: 'Servizi IT innovativi con un tocco ironico ma professionale. Cloud, AI, automazione e soluzioni as-a-Service.',
    foundingDate: '2025',
    areaServed: {
      '@type': 'Country',
      name: 'Italia',
    },
    sameAs: [
      'https://twitter.com/uaft_it',
      'https://linkedin.com/company/uaft',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      availableLanguage: ['Italian', 'English'],
    },
    offers: [
      {
        '@type': 'Offer',
        name: 'Servizi Cloud as-a-Service',
        description: 'Soluzioni cloud scalabili e personalizzate',
      },
      {
        '@type': 'Offer',
        name: 'AI Pricing Calculator',
        description: 'Preventivi automatici basati su intelligenza artificiale',
      },
      {
        '@type': 'Offer',
        name: 'Consulenza IT',
        description: 'Consulenza professionale per trasformazione digitale',
      },
    ],
  };

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'UAFT',
    url: 'https://uaft.it',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://uaft.it/?s={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <div className="sito">
        <a className="salta" href="#contenuto">
          {t('sito.salta')}
        </a>
        <Header />
        <main id="contenuto" tabIndex={-1}>
          {/* Il primo atto: l'apertura resta appuntata mentre payoff e capitolo 01 le salgono sopra */}
          <div className="atto">
            <Apertura />
            <Payoff />
            <Servizi />
          </div>
          <Metodo />
          <Coppia />
          <ChiSiamo />
          <Carriere />
          <Essenza />
          <Finale />
        </main>
        <Footer />
      </div>
    </>
  );
}
