/*
 * UAFT · il motore di scorrimento della landing. Nessuna libreria: è il motore del sito di Blumẽa
 * (sito.js) portato in TypeScript e adattato alle scene di qui.
 *
 * Senza questo file la pagina si legge comunque per intero, ferma: lo script in <head> (app/layout.tsx)
 * mette su <html> la classe .moto solo se gli script girano e nessuno ha chiesto meno movimento, e il
 * CSS nasconde o appunta qualcosa solo sotto quella classe. Qui si fa tutto il resto:
 *
 *   1. le comparse (.rv): ciò che entra nello schermo si mostra; ciò che era già sopra lo schermo
 *      all'arrivo (ricarica, ancora, tasto Fine) si mostra subito, senza transizione.
 *   2. un solo motore: a ogni fotogramma legge UNA cosa, window.scrollY, e scrive variabili sulla
 *      radice di ogni scena (mai su <html>). Le misure si prendono a parte: all'avvio, quando i font
 *      sono pronti, al load, ai ridimensionamenti veri e quando la pagina cambia altezza (il motore
 *      dei preventivi che si allunga, la lingua che cambia). Lo scorrimento resta quello del sistema.
 *        scena = un contenitore alto con un palco appuntato dentro: p va da 0 a 1 lungo la corsa
 *        vista = un elemento che attraversa lo schermo: p va da 0 a 1 fra due altezze dello schermo
 *   3. le scene: il sipario dell'apertura, lo stelo, i passi, la coppia, l'essenza, il finale
 *      dove l'asterisco cresce finché il corallo riempie lo schermo.
 *
 * Le parole dell'essenza arrivano già divise in <span> dal JSX: qui non si riscrive mai il testo
 * (React ne è il padrone e lo cambia con la lingua).
 */

type Dati = Record<string, number>;
type Voce = {
  el: HTMLElement;
  tipo: 'scena' | 'vista' | 'apertura';
  disegna: (p: number, v: Voce) => void;
  misura?: (v: Voce) => void;
  d: Dati;
  top: number;
  alt: number;
  palco: number;
  p: number;
  da: number;
  a: number;
};

const lim = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const tra = (p: number, a: number, b: number) => lim((p - a) / (b - a));
const dolce = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2); // entra ed esce piano

export function avviaScena(): () => void {
  if (typeof window === 'undefined') return () => {};
  const radice = document.documentElement;
  // senza .moto la pagina è ferma e tutta visibile: non c'è niente da fare
  if (!radice.classList.contains('moto')) return () => {};

  const q = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
  const qq = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll<T>(s));

  const puntatoreFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const TAU = puntatoreFine ? 110 : 0; // ms di "coda" dietro la rotella; col dito nessuna
  const palchi = window.matchMedia('(min-height: 520px)'); // sotto, le scene non si appuntano (vedi sito.css)

  const pulizie: Array<() => void> = [];
  const ascolta = (bersaglio: EventTarget, evento: string, fn: EventListener, opz?: AddEventListenerOptions) => {
    bersaglio.addEventListener(evento, fn, opz);
    pulizie.push(() => bersaglio.removeEventListener(evento, fn, opz));
  };

  // ── 1. le comparse ──────────────────────────────────────────────────────
  const daMostrare = qq('.rv');
  daMostrare.forEach((el) => {
    // i fratelli entrano a scalare: l'indice si conta fra i .rv dello stesso genitore
    const fratelli = Array.from(el.parentElement?.children ?? []).filter((f) => f.classList.contains('rv'));
    el.style.setProperty('--i', String(Math.min(fratelli.indexOf(el), 6)));
  });
  if ('IntersectionObserver' in window) {
    const osservatore = new IntersectionObserver(
      (voci) => {
        voci.forEach((voce) => {
          if (!voce.isIntersecting) return;
          voce.target.classList.add('dentro');
          osservatore.unobserve(voce.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );
    daMostrare.forEach((el) => {
      if (!el.classList.contains('dentro')) osservatore.observe(el);
    });
    pulizie.push(() => osservatore.disconnect());
  } else {
    daMostrare.forEach((el) => el.classList.add('dentro'));
  }

  // comparse saltate: chi arriva a metà pagina non deve trovare, risalendo, blocchi ancora nascosti
  let inAttesa: Array<{ el: HTMLElement; fondo: number }> = [];
  const recupera = (y: number) => {
    while (inAttesa.length && inAttesa[0].fondo < y) {
      const e = inAttesa.shift()!.el;
      if (!e.classList.contains('dentro')) e.classList.add('subito', 'dentro');
    }
  };

  // ── 2. le scene ─────────────────────────────────────────────────────────
  let vh = 0;
  const voci: Voce[] = [];
  const nuova = (el: HTMLElement, tipo: Voce['tipo'], disegna: Voce['disegna'], d: Dati = {}, misura?: Voce['misura'], da = 0, a = 0): Voce => {
    const v: Voce = { el, tipo, disegna, misura, d, top: 0, alt: 0, palco: 0, p: -1, da, a };
    voci.push(v);
    return v;
  };
  const scena = (el: HTMLElement | null, disegna: Voce['disegna'], d?: Dati, misura?: Voce['misura']) => (el ? nuova(el, 'scena', disegna, d, misura) : null);
  const vista = (el: HTMLElement | null, da: number, a: number, disegna: Voce['disegna'], d?: Dati) => (el ? nuova(el, 'vista', disegna, d, undefined, da, a) : null);

  // il sipario: l'apertura resta appuntata mentre il foglio le sale sopra; il testo arretra e
  // svanisce, un velo scuro cala. Coperta del tutto, sparisce e le sue animazioni si fermano.
  const apertura = q('[data-apertura]');
  const atto = apertura?.parentElement ?? null;
  if (apertura && atto) {
    nuova(atto, 'apertura', (p) => {
      apertura.style.setProperty('--p', p.toFixed(4));
      apertura.classList.toggle('coperta', p >= 1);
    });
  }

  // lo stelo: la linea scende lungo la lista; ogni asterisco si accende quando la linea lo raggiunge
  qq('[data-stelo]').forEach((lista) => {
    const righe = qq('.riga-valore', lista);
    vista(lista, 0.78, 0.42, (p, v) => {
      lista.style.setProperty('--p', p.toFixed(4));
      const n = Math.floor(p * righe.length + 0.5);
      if (n !== v.d.n) {
        v.d.n = n;
        righe.forEach((r, i) => r.classList.toggle('toccata', i < n));
      }
    }, { n: -1, conAltezza: 1 });
  });

  // i passi: il palco resta fermo e i quattro passi del preventivo si accendono uno dopo l'altro
  const passi = q('[data-scena="passi"]');
  if (passi) {
    const tappe = qq('.passo', passi);
    const numeri = qq('.passi__numero', passi);
    scena(passi, (p, v) => {
      passi.style.setProperty('--p', p.toFixed(4));
      const n = Math.min(tappe.length - 1, Math.floor(tra(p, 0.06, 0.9) * tappe.length));
      if (n !== v.d.passo) {
        v.d.passo = n;
        tappe.forEach((t, i) => {
          t.classList.toggle('raggiunta', i <= n);
          t.classList.toggle('attiva', i === n);
        });
        numeri.forEach((t, i) => t.classList.toggle('attiva', i === n));
      }
    }, { passo: -1 });
  }

  // la coppia: la promessa da sola, poi la consegna le si affianca e l'asterisco cresce
  const coppia = q('[data-scena="coppia"]');
  let vCoppia: Voce | null = null;
  if (coppia) {
    vCoppia = scena(coppia, (p) => {
      const s = coppia.style;
      s.setProperty('--entra', dolce(tra(p, 0.1, 0.52)).toFixed(4));
      s.setProperty('--testo', tra(p, 0.36, 0.56).toFixed(3));
      s.setProperty('--ampl', dolce(tra(p, 0.58, 0.92)).toFixed(4));
    }, {}, (v) => {
      // sul telefono il primo blocco si appunta: se è più alto dello schermo, resta agganciato al fondo
      const primo = q('.blocco--navy', coppia);
      v.d.bloccoTop = Math.min(0, vh - (primo?.offsetHeight ?? 0));
    });
  }

  // l'essenza: la frase resta ferma e si accende parola per parola; poi il finale le sale sopra
  const essenza = q('[data-scena="essenza"]');
  if (essenza) {
    const parole = qq('.parola', essenza);
    scena(essenza, (p, v) => {
      const accese = Math.round(tra(p, 0.02, 0.38) * parole.length);
      if (accese !== v.d.accese) {
        v.d.accese = accese;
        parole.forEach((parola, i) => parola.classList.toggle('accesa', i < accese));
      }
      essenza.style.setProperty('--copre', tra(p, v.d.inizioCopre, 1).toFixed(4));
    }, { accese: -1, inizioCopre: 0.5 }, (v) => {
      // il finale comincia a coprire quando alla corsa manca uno schermo
      v.d.inizioCopre = Math.max(0.4, 1 - v.palco / Math.max(1, v.alt - v.palco));
    });
  }

  // il finale: l'asterisco, piccolo al centro del palco navy, cresce in modo geometrico (la velocità
  // percepita resta uguale) finché il suo mozzo pieno copre l'angolo più lontano: lì il corallo ha
  // riempito lo schermo e arrivano le scritte. Si scala un <g> SVG in pixel: il bordo resta nitido.
  const quando = q('[data-scena="quando"]');
  if (quando) {
    const stella = q<SVGGElement>('.quando__stella', quando);
    const palco = q('.quando__palco', quando);
    scena(quando, (p, v) => {
      const d = v.d;
      if (!palchi.matches || !stella) {
        quando.classList.remove('aperta');
        return;
      }
      const e = dolce(tra(p, 0.04, 0.66));
      const s = d.s0 * Math.exp(d.ks * e);
      stella.setAttribute('transform', `translate(${d.cx} ${d.cy}) rotate(${(e * 60).toFixed(2)}) scale(${s.toFixed(2)})`);
      quando.classList.toggle('aperta', p >= 0.7);
    }, {}, (v) => {
      const d = v.d;
      const W = palco?.offsetWidth ?? window.innerWidth;
      const H = palco?.offsetHeight ?? window.innerHeight;
      d.cx = Math.round(W / 2);
      d.cy = Math.round(H / 2);
      d.s0 = Math.round(Math.max(26, Math.min(W, H) * 0.075)); // il raggio dell'asterisco piccolo, in px
      // 0.34: il raggio del mozzo pieno di un asterisco a sei bracci larghi 0.34 (0.17 / sin 30°)
      d.ks = Math.log((Math.hypot(W / 2, H / 2) / 0.34) * 1.06 / d.s0);
    });
  }

  // ── le misure: mai dentro il fotogramma ─────────────────────────────────
  // Prima tutte le letture, poi tutte le scritture: un solo ricalcolo d'impaginato.
  const misura = () => {
    const y = window.scrollY;
    vh = window.innerHeight;
    const aperturaAlta = apertura ? apertura.offsetHeight : 0;
    inAttesa = qq('.rv:not(.dentro)')
      .map((el) => ({ el, fondo: el.getBoundingClientRect().bottom + y }))
      .sort((a, b) => a.fondo - b.fondo);
    voci.forEach((v) => {
      const r = v.el.getBoundingClientRect();
      v.top = r.top + y;
      v.alt = r.height;
      v.p = -1;
      if (v.tipo === 'scena') v.palco = q('.scena__palco, .coppia__palco, .essenza__palco, .quando__palco', v.el)?.offsetHeight ?? 0;
      if (v.tipo === 'apertura') v.alt = aperturaAlta;
      v.misura?.(v);
    });
    // le scritture
    if (apertura) apertura.style.setProperty('--apertura-top', `${Math.min(0, vh - aperturaAlta)}px`);
    if (coppia && vCoppia) coppia.style.setProperty('--blocco-top', `${vCoppia.d.bloccoTop ?? 0}px`);
    sveglia();
  };

  const grezzo = (v: Voce, y: number) => {
    if (v.tipo === 'scena') return lim((y - v.top) / Math.max(1, v.alt - v.palco));
    if (v.tipo === 'apertura') {
      // da quando il foglio entra dal basso a quando ha coperto tutto
      const fine = v.top + v.alt;
      const inizio = Math.max(0, fine - vh);
      return lim((y - inizio) / Math.max(1, fine - inizio));
    }
    const inizio = v.top - vh * v.da;
    const fine = v.top - vh * v.a + (v.d.conAltezza ? v.alt : 0);
    return lim((y - inizio) / Math.max(1, fine - inizio));
  };

  // ── il fotogramma ───────────────────────────────────────────────────────
  let inCorso = false;
  let ultimoT = 0;
  let raf = 0;
  const fotogramma = (t: number) => {
    const dt = Math.min(64, Math.max(1, t - ultimoT));
    ultimoT = t;
    const y = window.scrollY;
    const k = TAU ? 1 - Math.exp(-dt / TAU) : 1;
    let ancora = false;
    for (const v of voci) {
      const g = grezzo(v, y);
      let p = v.p < 0 ? g : v.p + (g - v.p) * k;
      if (Math.abs(g - p) < 0.0005) p = g;
      if (p !== v.p) {
        v.p = p;
        v.disegna(p, v);
      }
      if (p !== g) ancora = true;
    }
    recupera(y);
    if (ancora) raf = window.requestAnimationFrame(fotogramma);
    else inCorso = false;
  };
  function sveglia() {
    if (inCorso) return;
    inCorso = true;
    ultimoT = performance.now();
    raf = window.requestAnimationFrame(fotogramma);
  }
  ascolta(window, 'scroll', sveglia, { passive: true });

  // Le misure si rifanno quando cambia la LARGHEZZA o l'altezza cambia di molto: la barra degli
  // indirizzi del telefono che entra ed esce (±60-100px) non deve far saltare le scene.
  let attesa = 0;
  const rimisura = () => {
    window.clearTimeout(attesa);
    attesa = window.setTimeout(misura, 120);
  };
  let vecchiaLarghezza = radice.clientWidth;
  let vecchiaAltezza = window.innerHeight;
  ascolta(window, 'resize', () => {
    if (radice.clientWidth === vecchiaLarghezza && Math.abs(window.innerHeight - vecchiaAltezza) < 140) return;
    vecchiaLarghezza = radice.clientWidth;
    vecchiaAltezza = window.innerHeight;
    rimisura();
  });
  ascolta(palchi, 'change', rimisura);
  ascolta(window, 'load', misura);
  // la pagina cambia altezza da sola (risultati del preventivo, lingua, font): le scene sotto si spostano
  const pagina = q('.sito');
  if (pagina && 'ResizeObserver' in window) {
    let altezza = pagina.offsetHeight;
    const ro = new ResizeObserver(() => {
      const h = pagina.offsetHeight;
      if (Math.abs(h - altezza) < 2) return;
      altezza = h;
      rimisura();
    });
    ro.observe(pagina);
    pulizie.push(() => ro.disconnect());
  }
  let vivo = true;
  document.fonts?.ready.then(() => {
    if (vivo) misura();
  });

  misura();
  radice.classList.add('scena-pronta');

  return () => {
    vivo = false;
    pulizie.forEach((f) => f());
    window.clearTimeout(attesa);
    window.cancelAnimationFrame(raf);
    inCorso = false;
    // 'scena-pronta' resta: serve solo alla rete di sicurezza dei 4 s, e il motore è comunque partito
  };
}
