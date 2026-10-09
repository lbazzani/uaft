'use client';
// La fascia corallo: è l'orlo del foglio che sale sull'apertura. Tre promesse, ognuna col suo
// asterisco; ognuna apre la demo che prima stava nelle schede dell'apertura (FeatureDemo).
import { useState } from 'react';
import FeatureDemo from '@/components/home/FeatureDemo';
import PaymentDialog from '@/components/dialogs/PaymentDialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { ConSegni } from './comuni';

const PROMESSE = ['deploy', 'ai', 'security'] as const;
type Promessa = (typeof PROMESSE)[number];

export default function Payoff() {
  const { t } = useLanguage();
  const [scelta, setScelta] = useState<Promessa | null>(null);
  const [aperta, setAperta] = useState(false);
  const [pagamento, setPagamento] = useState(false);

  return (
    <>
      <FeatureDemo open={aperta} onClose={() => setAperta(false)} feature={scelta} onOpenPricing={() => setPagamento(true)} />
      <PaymentDialog open={pagamento} onClose={() => setPagamento(false)} />

      <div className="payoff">
        <ul className="largo payoff__interno" aria-label={t('sito.payoff.etichetta')}>
          {PROMESSE.map((p) => (
            <li key={p}>
              <button
                type="button"
                className="payoff__voce"
                onClick={() => {
                  setScelta(p);
                  setAperta(true);
                }}
              >
                <span className="payoff__promessa">
                  <ConSegni testo={t(`sito.payoff.${p}`)} />
                </span>
                <span className="payoff__demo">
                  {t('hero.demo.badge')} <span aria-hidden="true">→</span>
                </span>
              </button>
              <p className="nota payoff__nota">{t(`sito.payoff.${p}.nota`)}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
