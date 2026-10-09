'use client';
// Il finale: l'asterisco, piccolo al centro del palco navy, cresce finché il corallo riempie lo
// schermo; lì arrivano il titolo, l'invito all'intervista AI (come nella vecchia CTASection, con i
// suoi messaggi al passaggio del mouse) e l'ultima nota. Fermo: una sezione corallo piena.
import { useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import InterviewChatbot from '@/components/shared/InterviewChatbot';
import { useLanguage } from '@/contexts/LanguageContext';
import { Bracci, ConSegni } from './comuni';

const MESSAGGI = ['1', '2', '3', '4', '5', '6'] as const;

export default function Finale() {
  const { t } = useLanguage();
  const [intervista, setIntervista] = useState(false);
  const [passaggi, setPassaggi] = useState(0);
  const [suggerimento, setSuggerimento] = useState(false);

  return (
    <>
      <section className="quando" aria-labelledby="titolo-quando" data-scena="quando">
        <div className="quando__palco">
          <svg className="quando__cielo" aria-hidden="true" focusable="false">
            <g className="quando__stella">
              <Bracci />
            </g>
          </svg>
          <div className="largo quando__interno">
            <p className="etichetta quando__occhiello">{t('sito.finale.occhiello')}</p>
            <h2 id="titolo-quando" className="quando__titolo">
              <ConSegni testo={t('sito.finale.titolo')} />
            </h2>
            <p className="quando__testo">{t('sito.finale.testo')}</p>
            <div className="quando__azioni">
              <Tooltip title={t(`cta.hover${MESSAGGI[passaggi % MESSAGGI.length]}`)} open={suggerimento} placement="top" arrow>
                <button
                  type="button"
                  className="pulsante pulsante--navy"
                  onClick={() => setIntervista(true)}
                  onMouseEnter={() => {
                    setSuggerimento(true);
                    setPassaggi((n) => n + 1);
                  }}
                  onMouseLeave={() => setSuggerimento(false)}
                >
                  {t('cta.button')} <span aria-hidden="true">→</span>
                </button>
              </Tooltip>
            </div>
            <p className="nota quando__nota">{t('sito.finale.nota')}</p>
          </div>
        </div>
      </section>
      <InterviewChatbot open={intervista} onClose={() => setIntervista(false)} />
    </>
  );
}
