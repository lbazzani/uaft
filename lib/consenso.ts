// Il consenso ai cookie come lo salva il banner (components/shared/CookieBanner.tsx), letto anche da
// app/GoogleAnalytics.tsx: Analytics parte solo con gli analitici accettati, mai prima di una scelta.
export const CHIAVE_CONSENSO = 'cookieConsent';

// il banner lo lancia appena si sceglie: GA può partire subito, senza ricaricare la pagina
export const EVENTO_CONSENSO = 'uaft:consenso';

export function analyticsConsentiti(): boolean {
  try {
    const salvato = localStorage.getItem(CHIAVE_CONSENSO);
    if (!salvato) return false;
    // il formato vecchio era la stringa nuda 'accepted' / 'rejected'
    if (salvato === 'accepted') return true;
    return JSON.parse(salvato)?.analytics === true;
  } catch {
    // 'rejected', JSON rotto o localStorage negato: niente consenso
    return false;
  }
}
