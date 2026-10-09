'use client';
// L'essenza: una frase sola, ferma al centro, che si accende parola per parola. Le parole sono già
// <span> qui (il motore non riscrive il testo); chi legge con lo schermo sente la frase intera.
import { useLanguage } from '@/contexts/LanguageContext';

export default function Essenza() {
  const { t } = useLanguage();
  const frase = t('sito.essenza.frase');
  const parole = frase.split(/\s+/).filter(Boolean);
  return (
    <section className="essenza" aria-label={t('sito.essenza.etichetta')} data-scena="essenza">
      <div className="essenza__palco">
        <div className="largo">
          <blockquote className="essenza__frase">
            <span className="solo-lettori">{frase}</span>
            <span aria-hidden="true">
              {parole.map((p, i) => (
                <span key={`${i}-${p}`}>
                  <span className="parola">{p}</span>
                  {i < parole.length - 1 ? ' ' : null}
                </span>
              ))}
            </span>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
