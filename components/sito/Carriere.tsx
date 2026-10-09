'use client';
// 04 · Lavora con noi (sabbia): le due posizioni aperte e cosa offriamo, dalla vecchia CTASection.
// Il pulsante dell'intervista AI sta nel finale, sul corallo.
import { useLanguage } from '@/contexts/LanguageContext';
import { Asterisco, ConSegni, Filetto, Righe, senzaEmoji } from './comuni';

const BENEFICI = ['1', '2', '3', '4', '5', '6'] as const;

export default function Carriere() {
  const { t } = useLanguage();
  return (
    <section id="lavora-con-noi" className="capitolo capitolo--sabbia" aria-labelledby="titolo-carriere">
      <div className="largo">
        <Filetto numero="04" etichetta={t('cta.title')} destra={senzaEmoji(t('cta.positions.title'))} />
        <h2 id="titolo-carriere" className="titolone rv">
          <Righe testo={t('cta.badge')} n={2} />
        </h2>
        <div className="colonna">
          <p className="attacco rv">{t('cta.subtitle')}</p>
          <dl className="righe">
            {(['1', '2'] as const).map((n) => (
              <div className="riga-valore rv" key={n}>
                <dt>
                  <Asterisco />
                  <span>{senzaEmoji(t(`cta.position${n}.title`))}</span>
                </dt>
                <dd>{t(`cta.position${n}.desc`)}</dd>
              </div>
            ))}
          </dl>

          <h3 className="sottotitolo rv">{t('cta.benefits')}</h3>
          <ul className="benefici">
            {BENEFICI.map((n) => (
              <li className="rv" key={n}>
                <ConSegni testo={senzaEmoji(t(`cta.benefit${n}`))} />
              </li>
            ))}
          </ul>
          <p className="nota nota--sotto rv">{t('cta.disclaimer')}</p>
          <p className="nota rv">{senzaEmoji(t('cta.stats'))}</p>
        </div>
      </div>
    </section>
  );
}
