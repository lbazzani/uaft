// Pezzi condivisi dalle sezioni della landing: l'asterisco, i titoli a righe, le note a piè di pagina.
import { Fragment, type ReactNode } from 'react';

// L'asterisco di UAFT: sei bracci (tre barre ruotate) in un quadrato -1..1. Le barre sono larghe 0.34:
// il finale (lib/scena.ts) conta su questo numero per sapere quando il corallo ha coperto lo schermo.
export function Bracci() {
  return (
    <>
      <rect x="-1" y="-0.17" width="2" height="0.34" rx="0.17" />
      <rect x="-1" y="-0.17" width="2" height="0.34" rx="0.17" transform="rotate(60)" />
      <rect x="-1" y="-0.17" width="2" height="0.34" rx="0.17" transform="rotate(120)" />
    </>
  );
}

export function Asterisco({ className = 'asterisco' }: { className?: string }) {
  return (
    <svg className={className} viewBox="-1 -1 2 2" aria-hidden="true" focusable="false">
      <Bracci />
    </svg>
  );
}

// I segni di rimando in coda a una frase (*, **, †, ‡, §) prendono il colore dell'accento.
const SEGNI = /([*†‡§]+)\s*$/;
export function ConSegni({ testo }: { testo: string }) {
  const m = testo.match(SEGNI);
  if (!m || m.index === undefined) return <>{testo}</>;
  return (
    <>
      {testo.slice(0, m.index)}
      <span className="segno">{m[1]}</span>
    </>
  );
}

// Le emoji del vecchio sito non stanno nella voce "da grande azienda": i testi restano quelli, le
// emoji si tolgono qui. RegExp costruita a runtime: il target ES2020 non conosce \p nei letterali.
const EMOJI = new RegExp('[\\p{Extended_Pictographic}\\u200d\\ufe0f]', 'gu');
export const senzaEmoji = (s: string) => s.replace(EMOJI, '').replace(/\s{2,}/g, ' ').trim();

// Divide un titolo in n righe il più possibile pari (minimo della riga più lunga): ogni riga è una
// maschera da cui il testo sale. I titoli sono corti, quindi si provano tutti i tagli.
export function inRighe(testo: string, n: number): string[] {
  const parole = testo.split(/\s+/).filter(Boolean);
  if (parole.length <= n) return parole;
  let migliore: string[] = [parole.join(' ')];
  let peggiore = Infinity;
  const prova = (da: number, resto: number, fatte: string[]) => {
    if (resto === 1) {
      const righe = [...fatte, parole.slice(da).join(' ')];
      const lunga = Math.max(...righe.map((r) => r.length));
      if (lunga < peggiore) {
        peggiore = lunga;
        migliore = righe;
      }
      return;
    }
    for (let fine = da + 1; fine <= parole.length - resto + 1; fine++) prova(fine, resto - 1, [...fatte, parole.slice(da, fine).join(' ')]);
  };
  prova(0, n, []);
  return migliore;
}

export function Righe({ testo, n = 2, coda }: { testo: string; n?: number; coda?: ReactNode }) {
  const righe = inRighe(testo, n);
  return (
    <>
      {righe.map((r, i) => (
        <Fragment key={i}>
          <span className="riga">
            <span>
              {r}
              {i === righe.length - 1 ? coda : null}
            </span>
          </span>
          {i < righe.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </>
  );
}

// Il filetto in testa a ogni capitolo: numero, etichetta in asse con la colonna, etichetta a destra.
export function Filetto({ numero, etichetta, destra, chiaro }: { numero: string; etichetta: string; destra: string; chiaro?: boolean }) {
  return (
    <div className={chiaro ? 'filetto filetto--chiaro rv' : 'filetto rv'}>
      <span>{numero}</span>
      <span>{etichetta}</span>
      <span>{destra}</span>
    </div>
  );
}
