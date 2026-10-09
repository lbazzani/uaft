'use client';
// 03 · Chi siamo (navy): la genesi, il dream team, la roadmap lungo lo stelo e le metriche. I testi
// sono quelli di AboutSection; i numeri sono i suoi valori di partenza, fermi: qui le battute stanno
// nelle note a piè di pagina, non nei contatori.
import { useLanguage } from '@/contexts/LanguageContext';
import { Asterisco, ConSegni, Filetto, Righe } from './comuni';

const ROADMAP = [
  { q: 'q1', v: { value1: 0, value2: 0, value3: 147 } },
  { q: 'q2', v: { value1: 2, value2: 5000, value3: 178 } },
  { q: 'q3', v: { value1: 47, value2: '2.5', value3: 73 } },
  { q: 'q4', v: { value1: 10000, value2: '1.5', value3: 12 } },
] as const;

const METRICHE = ['founded', 'team', 'offices', 'revenue', 'clients', 'satisfaction'] as const;

export default function ChiSiamo() {
  const { t, language } = useLanguage();
  // le migliaia col separatore della lingua, come faceva toLocaleString() nella vecchia sezione
  const cifra = (n: number | string) => (typeof n === 'number' && n >= 1000 ? n.toLocaleString(language === 'it' ? 'it-IT' : 'en-US') : n);
  // gli stessi valori di partenza della vecchia sezione
  const valori: Record<(typeof METRICHE)[number], string> = {
    founded: t('about.stats.founded.value'),
    team: t('about.stats.team.value'),
    offices: t('about.stats.offices.value'),
    revenue: t('about.stats.revenue.value', { value: 147 }),
    clients: t('about.stats.clients.value', { value: 0 }),
    satisfaction: t('about.stats.satisfaction.value', { value: 101 }),
  };

  return (
    <section id="about" className="capitolo capitolo--navy" aria-labelledby="titolo-chi">
      <div className="largo">
        <Filetto numero="03" etichetta={t('header.about')} destra={t('sito.about.destra')} chiaro />
        <h2 id="titolo-chi" className="titolone titolone--chiaro rv">
          <Righe testo={t('about.title')} n={2} />
        </h2>
        <div className="colonna">
          <p className="attacco attacco--chiaro rv">{t('about.subtitle')}</p>

          {/* la genesi */}
          <h3 className="sottotitolo rv">{t('about.origin.title')}</h3>
          <div className="testo-lungo">
            <p className="rv">{t('about.origin.p1')}</p>
            <p className="rv">{t('about.origin.p2')}</p>
            <p className="rv">{t('about.origin.p3')}</p>
            <p className="nota rv">{t('about.origin.disclaimer')}</p>
          </div>

          {/* il dream team: una persona e molte AI */}
          <h3 className="sottotitolo rv">{t('about.team.title')}</h3>
          <p className="sottotitolo__sotto rv">{t('about.team.subtitle')}</p>
          <dl className="righe righe--chiare">
            <div className="riga-valore rv">
              <dt>
                <Asterisco />
                <span>
                  {t('about.team.human.title')}
                  <small>{t('about.team.human.role')}</small>
                </span>
              </dt>
              <dd>
                <p>{t('about.team.human.desc', { years: '25' })}</p>
                <p className="nota">
                  3 {t('about.team.stats.ideas')} · 7 {t('about.team.stats.coffee')}
                </p>
              </dd>
            </div>
            <div className="riga-valore rv">
              <dt>
                <Asterisco />
                <span>
                  {t('about.team.ai.title')}
                  <small>{t('about.team.ai.role')}</small>
                </span>
              </dt>
              <dd>
                <p>{t('about.team.ai.desc')}</p>
                <p className="nota">
                  {cifra(2847)} {t('about.team.stats.code')} · 42 {t('about.team.stats.bugs')}
                </p>
              </dd>
            </div>
          </dl>

          {/* la roadmap lungo lo stelo: la linea scende e accende un trimestre alla volta */}
          <h3 className="sottotitolo rv">{t('about.roadmap.title')}</h3>
          <p className="sottotitolo__sotto rv">{t('about.roadmap.subtitle')}</p>
          <dl className="righe righe--chiare righe--stelo" data-stelo>
            {ROADMAP.map(({ q, v }) => (
              <div className="riga-valore rv" key={q}>
                <dt>
                  <Asterisco />
                  <span>{t(`about.roadmap.${q}.title`)}</span>
                </dt>
                <dd>
                  <ul className="metriche">
                    <li>{t(`about.roadmap.${q}.metric1`, { value: cifra(v.value1) })}</li>
                    <li>{t(`about.roadmap.${q}.metric2`, { value: v.value2 })}</li>
                    <li>{t(`about.roadmap.${q}.metric3`, { value: v.value3 })}</li>
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
          <p className="nota nota--sotto rv">{t('about.roadmap.note')}</p>
        </div>

        {/* le metriche: numeri grandi, ognuno con la sua nota */}
        <div className="colonna">
          <h3 className="sottotitolo rv">
            <ConSegni testo={t('about.stats.title')} />
          </h3>
        </div>
        <dl className="numeri numeri--sei">
          {METRICHE.map((m) => (
            <div className="numeri__voce rv" key={m}>
              <dt className="etichetta">{t(`about.stats.${m}`)}</dt>
              <dd className="numeri__valore">
                <ConSegni testo={valori[m]} />
              </dd>
              <dd className="nota">{t(`about.stats.${m}.alt`)}</dd>
            </div>
          ))}
        </dl>
        <div className="colonna">
          <p className="nota nota--sotto rv">{t('sito.about.metriche.nota')}</p>
        </div>
      </div>
    </section>
  );
}
