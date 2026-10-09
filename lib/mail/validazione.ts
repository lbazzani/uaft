import path from 'path';

// Valori che finiscono in argomenti di comandi (certbot, openssl, nginx) o in
// file di configurazione: si accettano solo forme strette, il resto si rifiuta.

// Nome host: etichette [a-z0-9-] senza trattino in testa o in coda, almeno
// due etichette, in tutto al massimo 253 caratteri. Niente spazi, virgolette,
// punti e virgola, slash: niente che una shell o nginx possano interpretare.
const ETICHETTA = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;

export function nomeHostValido(valore: unknown): valore is string {
  if (typeof valore !== 'string' || valore.length === 0 || valore.length > 253) return false;
  const etichette = valore.split('.');
  if (etichette.length < 2) return false;
  return etichette.every((e) => ETICHETTA.test(e));
}

export function richiediNomeHost(valore: unknown): string {
  if (!nomeHostValido(valore)) throw new Error('Nome host non valido');
  return valore;
}

// Email per Let's Encrypt: finisce dopo --email, quindi niente che inizi con
// un trattino (sarebbe un'altra opzione di certbot) né caratteri strani.
const EMAIL = /^[A-Za-z0-9._%+][A-Za-z0-9._%+-]{0,63}@([a-z0-9.-]+)$/;

export function emailValida(valore: unknown): valore is string {
  if (typeof valore !== 'string' || valore.length > 254) return false;
  const m = EMAIL.exec(valore);
  return !!m && nomeHostValido(m[1]);
}

// Percorso che deve stare dentro una delle cartelle ammesse (dopo
// path.resolve, quindi niente ../ per uscirne).
export function percorsoDentro(valore: unknown, cartelle: string[]): string | null {
  if (typeof valore !== 'string' || !valore || valore.includes('\0')) return null;
  const assoluto = path.resolve(valore);
  for (const cartella of cartelle) {
    const base = path.resolve(cartella);
    if (assoluto.startsWith(base + path.sep)) return assoluto;
  }
  return null;
}

export const CARTELLA_LETSENCRYPT = '/etc/letsencrypt/live';
