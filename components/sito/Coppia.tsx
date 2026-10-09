'use client';
// La coppia: su schermi larghi la promessa (navy) sta da sola, poi la consegna (corallo) le si
// affianca e l'asterisco della promessa cresce. Altrove: due blocchi pieni, uno sotto l'altro.
import { useLanguage } from '@/contexts/LanguageContext';
import { Asterisco, ConSegni } from './comuni';

export default function Coppia() {
  const { t } = useLanguage();
  return (
    <section className="coppia" aria-label={t('sito.coppia.etichetta')} data-scena="coppia">
      <div className="coppia__palco">
        <article className="blocco blocco--navy">
          <div className="blocco__testi">
            <p className="etichetta blocco__numero">{t('sito.coppia.1.etichetta')}</p>
            <h2 className="blocco__titolo">{t('sito.coppia.1.titolo')}</h2>
            <p className="blocco__testo">{t('sito.coppia.1.testo')}</p>
          </div>
          <Asterisco className="blocco__forma" />
        </article>
        <article className="blocco blocco--corallo">
          <div className="blocco__testi">
            <p className="etichetta blocco__numero">{t('sito.coppia.2.etichetta')}</p>
            <h2 className="blocco__titolo">
              <ConSegni testo={t('sito.coppia.2.titolo')} />
            </h2>
            <p className="blocco__testo">{t('sito.coppia.2.testo')}</p>
            <p className="nota blocco__nota">{t('sito.coppia.2.nota')}</p>
          </div>
          <Asterisco className="blocco__forma" />
        </article>
      </div>
    </section>
  );
}
