// Client del servizio claude-runner della piattaforma SparkTech.
//
// Fino al trasloco nel cluster la chat del sito (agente di vendita e analisi
// del preventivo) chiamava OpenAI con una chiave nel .env di sparktech_st. Nel
// cluster l'AI si prende dal servizio interno claude-runner (repository
// server-sparktech, docs/piattaforma/claude-runner.md): `POST /prompt` lancia
// la CLI di Claude su un nodo con un abbonamento dedicato e restituisce il
// testo. Stesso protocollo dei client di QuickSmart (src/lib/sofia/runner.ts) e
// di xpnews (lib/claude-cli.js).
//
// L'abbonamento è CONDIVISO con gli altri demo della piattaforma, e i limiti
// sono per account, a finestre di cinque ore e settimanali: per questo la
// rotta che usa questo file ha un limite per IP e un tetto giornaliero.
//
// Ambiente:
//   CLAUDE_RUNNER_URLS   `nome=http://host:porta,…` (si prova in ordine di carico)
//   CLAUDE_RUNNER_TOKEN  il bearer condiviso del servizio
//   CLAUDE_RUNNER_MODEL  default `sonnet`, che il runner traduce in Sonnet 5.5
//                        (MODEL_MAP del servizio: non serve cambiarlo qui)

interface Istanza {
  name: string;
  url: string;
  running: number;
}

function istanzeConfigurate(): { name: string; url: string }[] {
  return (process.env.CLAUDE_RUNNER_URLS ?? '')
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean)
    .map((x) => {
      const i = x.indexOf('=');
      const url = (i > 0 ? x.slice(i + 1) : x).replace(/\/$/, '');
      return { name: i > 0 ? x.slice(0, i) : url, url };
    });
}

export function runnerConfigurato(): boolean {
  return istanzeConfigurate().length > 0 && !!process.env.CLAUDE_RUNNER_TOKEN;
}

export function modelloRunner(): string {
  return process.env.CLAUDE_RUNNER_MODEL || 'sonnet';
}

// /health costa una richiesta per istanza: si ricontrolla al massimo ogni
// minuto, o subito dopo un 429/503 (istanza piena, in limite o senza login).
// Serve a saltare le istanze con `auth.loggedIn: false`: all'8/10/2026 tre
// istanze su quattro erano così, e un /prompt mandato lì fallisce dopo aver
// lanciato la CLI, cioè dopo secondi e non millisecondi.
let cache: { at: number; list: Istanza[] } = { at: 0, list: [] };
const CACHE_MS = 60_000;

async function getJson(url: string, init: RequestInit, ms: number, signal?: AbortSignal) {
  const segnali = [AbortSignal.timeout(ms), ...(signal ? [signal] : [])];
  const res = await fetch(url, { ...init, signal: AbortSignal.any(segnali) });
  let body: Record<string, unknown> | null = null;
  try {
    body = (await res.json()) as Record<string, unknown>;
  } catch {
    body = null;
  }
  return { status: res.status, body };
}

/** Istanze con il login attivo e non in limite, la meno carica per prima. */
async function istanzePronte(signal?: AbortSignal): Promise<Istanza[]> {
  if (Date.now() - cache.at < CACHE_MS && cache.list.length) return cache.list;
  const token = process.env.CLAUDE_RUNNER_TOKEN ?? '';
  const list: Istanza[] = [];
  await Promise.all(
    istanzeConfigurate().map(async (r) => {
      try {
        const { status, body } = await getJson(
          `${r.url}/health`,
          { headers: { authorization: `Bearer ${token}` } },
          3_000,
          signal
        );
        const auth = body?.auth as { loggedIn?: boolean } | undefined;
        if (status !== 200 || !auth?.loggedIn) return;
        const limite = body?.rateLimit as { status?: string; resetsAt?: number } | undefined;
        if (limite?.status === 'rejected' && (limite.resetsAt ?? 0) > Date.now()) return;
        list.push({ ...r, running: Number(body?.running) || 0 });
      } catch {
        // istanza non raggiungibile (nel cluster: ENOTFOUND se il Service sta
        // in un altro namespace): si prova con le altre
      }
    })
  );
  list.sort((a, b) => a.running - b.running);
  cache = { at: Date.now(), list };
  return list;
}

export interface RunnerOpts {
  /** sostituisce il prompt di sistema (`--system-prompt` della CLI) */
  systemPrompt: string;
  /**
   * Tempo concesso al runner, coda compresa: senza `waitMs` il runner aspetta
   * in coda al massimo timeoutMs - 20 s e dà al run il resto (mai meno di
   * 20 s), quindi risponde entro timeoutMs più l'avvio della CLI.
   */
  timeoutMs: number;
  /** la richiesta del browser o la scadenza complessiva della rotta */
  signal?: AbortSignal;
}

export interface RunnerEsito {
  text: string;
  istanza: string;
  durationMs: number;
}

/** Un turno secco: restituisce il testo, o lancia un errore leggibile nei log. */
export async function runnerPrompt(prompt: string, opts: RunnerOpts): Promise<RunnerEsito> {
  const inizio = Date.now();
  const list = await istanzePronte(opts.signal);
  if (!list.length) throw new Error('runner: nessuna istanza con il login attivo');
  const token = process.env.CLAUDE_RUNNER_TOKEN ?? '';
  let ultimo = '';
  for (const r of list) {
    if (opts.signal?.aborted) break;
    try {
      // Margine di 5 s sul timeout del runner (gli altri client ne danno 15):
      // qui una persona aspetta davanti alla chat, e la scadenza complessiva
      // della rotta (opts.signal) taglia comunque prima.
      const { status, body } = await getJson(
        `${r.url}/prompt`,
        {
          method: 'POST',
          headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
          body: JSON.stringify({
            prompt,
            systemPrompt: opts.systemPrompt,
            model: modelloRunner(),
            timeoutMs: opts.timeoutMs,
            // una persona sta aspettando: passa davanti ai lavori batch in coda
            priority: 'interactive',
          }),
        },
        opts.timeoutMs + 5_000,
        opts.signal
      );
      if (status === 429 || status === 503) {
        cache.at = 0;
        ultimo = `${r.name}: ${status} ${String(body?.error ?? '')}`.trim();
        continue;
      }
      if (status !== 200 || !body?.ok) {
        ultimo = `${r.name}: ${String(body?.error ?? `http ${status}`)}`;
        continue;
      }
      const text = String(body.text ?? '').trim();
      if (!text) {
        ultimo = `${r.name}: testo vuoto`;
        continue;
      }
      return { text, istanza: r.name, durationMs: Date.now() - inizio };
    } catch (e) {
      if (opts.signal?.aborted) break;
      ultimo = `${r.name}: ${e instanceof Error && e.name === 'TimeoutError' ? 'timeout' : e instanceof Error ? e.message : String(e)}`;
    }
  }
  if (opts.signal?.aborted) throw new Error(`runner: interrotta dopo ${Date.now() - inizio} ms ${ultimo}`.trim());
  throw new Error(`runner: ${ultimo}`);
}
