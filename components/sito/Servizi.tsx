'use client';
// 01 · Servizi: le sei promesse come righe di una tabella. Ogni riga apre la sua demo (ServiceDemo)
// e da lì il pagamento, esattamente come le vecchie schede.
import { useState } from 'react';
import ServiceDemo from '@/components/home/ServiceDemo';
import PaymentDialog from '@/components/dialogs/PaymentDialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { Asterisco, Filetto, Righe } from './comuni';

const SERVIZI = ['cloud', 'ai', 'security', 'speed', 'code', 'deploy'] as const;
type Servizio = (typeof SERVIZI)[number];

export default function Servizi() {
  const { t } = useLanguage();
  const [demo, setDemo] = useState(false);
  const [pagamento, setPagamento] = useState(false);
  const [scelto, setScelto] = useState<Servizio | null>(null);

  return (
    <>
      <ServiceDemo open={demo} onClose={() => setDemo(false)} service={scelto} onOpenPayment={() => setPagamento(true)} />
      <PaymentDialog open={pagamento} onClose={() => setPagamento(false)} selectedService={scelto} />

      <section id="services" className="capitolo capitolo--carta" aria-labelledby="titolo-servizi">
        <div className="largo">
          <Filetto numero="01" etichetta={t('header.services')} destra={t('sito.servizi.destra')} />
          <h2 id="titolo-servizi" className="titolone rv">
            <Righe testo={t('services.title')} n={2} />
          </h2>
          <div className="colonna">
            <p className="attacco rv">{t('services.subtitle')}</p>
            <dl className="righe">
              {SERVIZI.map((s) => (
                <div className="riga-valore rv" key={s}>
                  <dt>
                    <Asterisco />
                    <span>{t(`services.${s}.title`)}</span>
                  </dt>
                  <dd>
                    <p>{t(`services.${s}.desc`)}</p>
                    <button
                      type="button"
                      className="pulsante pulsante--linea pulsante--piccolo"
                      onClick={() => {
                        setScelto(s);
                        setDemo(true);
                      }}
                    >
                      {t('services.demo.badge')}
                      <span className="solo-lettori">: {t(`services.${s}.title`)}</span> <span aria-hidden="true">→</span>
                    </button>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </>
  );
}
