'use client';
// La landing di UAFT. È un componente client perché i testi vengono dal contesto della lingua
// (italiano sul server, inglese solo se scelto). La pagina server attorno (page.tsx) aggiunge il JSON-LD.
// L'impaginato e il motore di scorrimento sono quelli del sito di Blumẽa (sito.css, lib/scena.ts);
// l'idea che tiene insieme tutto è l'asterisco: ogni promessa ha la sua nota a piè di pagina.
import { useEffect } from 'react';
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

export default function Landing() {
  const { t, language } = useLanguage();

  // Il motore riparte quando cambia la lingua: i testi cambiano lunghezza e le scene vanno rimisurate.
  useEffect(() => avviaScena(), [language]);

  return (
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
  );
}
