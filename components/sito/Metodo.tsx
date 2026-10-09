'use client';
// 02 · Come funziona: il palco dei passi resta fermo e i quattro tempi del preventivo AI si accendono
// uno alla volta; sotto c'è il motore vero (AIPricingSection), per provarlo davvero.
import AIPricingSection from '@/components/home/AIPricingSection';
import { useLanguage } from '@/contexts/LanguageContext';
import { ConSegni, Filetto, Righe } from './comuni';

const PASSI = ['1', '2', '3', '4'] as const;

export default function Metodo() {
  const { t } = useLanguage();
  return (
    <section id="come-funziona" className="capitolo capitolo--sabbia capitolo--passi" aria-labelledby="titolo-passi">
      <div className="largo">
        <Filetto numero="02" etichetta={t('sito.passi.etichetta')} destra={t('sito.passi.destra')} />
        <h2 id="titolo-passi" className="titolone rv">
          <Righe testo={t('pricing.title')} n={2} />
        </h2>
        <div className="colonna">
          <p className="attacco rv">{t('pricing.subtitle')}</p>
        </div>
      </div>

      {/* Con lo script il palco si appunta e i passi si accendono; senza, quattro tappe in griglia. */}
      <div className="scena scena--passi" data-scena="passi">
        <div className="scena__palco">
          <div className="largo passi">
            <div className="passi__numeri" aria-hidden="true">
              {PASSI.map((n) => (
                <span className="passi__numero" key={n}>
                  0{n}
                </span>
              ))}
              <i className="passi__barra" />
            </div>
            <ol className="passi__lista">
              {PASSI.map((n) => (
                <li className="passo" key={n}>
                  <span className="passo__numero" aria-hidden="true">
                    0{n}
                  </span>
                  <h3 className="passo__titolo">
                    <ConSegni testo={t(`sito.passi.${n}.titolo`)} />
                  </h3>
                  <p className={n === '4' ? 'passo__testo nota' : 'passo__testo'}>{t(`sito.passi.${n}.testo`)}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      <div className="passi__prova">
        <AIPricingSection />
      </div>
    </section>
  );
}
