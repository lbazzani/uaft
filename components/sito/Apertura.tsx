'use client';
// Il primo atto: l'apertura navy resta appuntata mentre il foglio (payoff e capitolo 01) le sale sopra.
// Le azioni sono quelle di prima: "Inizia gratis" apre il contatto (che può passare al pagamento),
// "Scopri i servizi" porta al capitolo 01.
import { useState } from 'react';
import ContactDialog from '@/components/dialogs/ContactDialog';
import PaymentDialog from '@/components/dialogs/PaymentDialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { Asterisco, Righe } from './comuni';

// I quattro numeri della vecchia apertura, ognuno col suo segno di rimando
const NUMERI = [
  { chiave: 'uptime', segno: '*' },
  { chiave: 'support', segno: '†' },
  { chiave: 'scalability', segno: '‡' },
  { chiave: 'limits', segno: '§' },
] as const;

export default function Apertura() {
  const { t, language } = useLanguage();
  const [contatto, setContatto] = useState(false);
  const [pagamento, setPagamento] = useState(false);
  const notaAcronimo = language === 'en' ? t('hero.acronym.note') : '';

  return (
    <>
      <ContactDialog
        open={contatto}
        onClose={() => setContatto(false)}
        onOpenPayment={() => {
          setContatto(false);
          setPagamento(true);
        }}
      />
      <PaymentDialog open={pagamento} onClose={() => setPagamento(false)} />

      <section className="apertura" aria-labelledby="titolo-apertura" data-apertura>
        <div className="largo apertura__interno">
          <div className="apertura__testo">
            <p className="etichetta apertura__occhiello">{t('sito.apertura.occhiello')}</p>
            <h1 id="titolo-apertura" className="apertura__titolo">
              <Righe
                testo={t('hero.title')}
                n={3}
                coda={
                  <span className="apertura__segno">
                    <Asterisco />
                    <span className="solo-lettori">*</span>
                  </span>
                }
              />
            </h1>
            {notaAcronimo ? <p className="nota apertura__acronimo">{notaAcronimo}</p> : null}
            <p className="apertura__sotto">{t('hero.subtitle')}</p>
            <div className="apertura__azioni">
              <button type="button" className="pulsante pulsante--pieno" onClick={() => setContatto(true)}>
                {t('hero.cta.primary')} <span aria-hidden="true">→</span>
              </button>
              <a className="pulsante pulsante--contorno" href="#services">
                {t('hero.cta.secondary')}
              </a>
            </div>
            <p className="nota apertura__nota">{t('sito.apertura.nota')}</p>
          </div>

          <div className="apertura__numeri">
            <dl className="numeri">
              {NUMERI.map(({ chiave, segno }) => (
                <div className="numeri__voce" key={chiave}>
                  <dt className="etichetta">{t(`hero.stats.${chiave}`)}</dt>
                  <dd className="numeri__valore">
                    {t(`sito.numeri.${chiave}.valore`)}
                    <sup className="segno">{segno}</sup>
                  </dd>
                </div>
              ))}
            </dl>
            <ol className="note numeri__note">
              {NUMERI.map(({ chiave }) => (
                <li key={chiave} className="nota">
                  {t(`sito.numeri.${chiave}.nota`)}
                </li>
              ))}
            </ol>
          </div>
        </div>
        <i className="apertura__velo" aria-hidden="true" />
      </section>
    </>
  );
}
