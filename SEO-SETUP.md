# 🚀 Configurazione SEO per UAFT.it

## ✅ Configurazioni completate

### 1. Google Analytics
- ✅ Google Analytics installato (ID: G-Q5DPM3JLG6)
- ✅ Parte solo dopo il consenso agli analitici nel banner dei cookie (`app/GoogleAnalytics.tsx`, `lib/consenso.ts`): prima di una scelta non si scarica nemmeno lo script

### 2. Meta Tags e SEO Base
- ✅ L'HTML arriva intero dal server, in italiano: l'inglese c'è solo se scelto col selettore (resta in localStorage), mai dalla lingua del browser
- ✅ Title con template (`%s | UAFT`); /privacy e /terms hanno title e description propri
- ✅ Description nella voce del sito, entro 155 caratteri
- ✅ Open Graph e Twitter Card con l'immagine di `app/opengraph-image.tsx`
- ✅ Canonical e og:url relativi (`./`): ogni pagina punta a sé stessa
- ✅ Niente hreflang: italiano e inglese stanno sullo stesso URL
- ✅ Il 404 è noindex (/login e /register non esistono più)
- ✅ www.uaft.it → uaft.it con redirect 308, `/api/` escluso (`next.config.ts`)
- ✅ robots.txt configurato
- ✅ Sitemap.xml dinamico, senza lastModified

### 3. Structured Data (JSON-LD)
- ✅ Organization: UAFT, nome per esteso, logo PNG (`app/apple-icon.tsx`), founder Lorenzo Bazzani
- ✅ WebSite, inLanguage it-IT
- Nell'HTML del server (`app/(landing)/page.tsx`). Niente Offers, sameAs o SearchAction: sarebbero dati inventati

### 4. PWA Ready
- ✅ manifest configurato (`app/manifest.ts`)
- ✅ Theme color impostato
- ✅ Icona SVG (`app/icon.svg`) e apple-touch-icon PNG (`app/apple-icon.tsx`)

---

## 📋 Azioni da completare manualmente

### 1. Immagini

Niente file da creare in `/public`: immagine OG (1200×630) e logo/apple-touch-icon (180×180) li genera il codice (`app/opengraph-image.tsx`, `app/apple-icon.tsx`). Se servono PNG 192/512 per il manifest, si fanno allo stesso modo.

### 2. Google Search Console

1. Vai su [Google Search Console](https://search.google.com/search-console)
2. Aggiungi la proprietà `https://uaft.it`
3. Verifica il sito tramite:
   - Tag HTML (codice già nel metadata)
   - File HTML da caricare
   - Google Analytics (già configurato!)
4. Invia la sitemap: `https://uaft.it/sitemap.xml`

### 3. Google Verification Code

Nel `metadata` di `app/layout.tsx`, aggiungi:

```typescript
verification: {
  google: 'your-google-verification-code',
},
```

Con il tuo codice di verifica Google Search Console.

### 4. Social Media Links

UAFT non ha profili social (i pulsanti nel piede sono una battuta), quindi niente `sameAs` né `twitter:creator`. Se un giorno ci saranno profili veri, vanno nel JSON-LD di `app/(landing)/page.tsx`.

### 5. Performance Optimization

Installa pacchetto per ottimizzare le immagini:

```bash
npm install sharp
```

Questo migliorerà automaticamente le performance delle immagini Next.js.

---

## 🔍 Verifica SEO

### Strumenti di Test

1. **Google Rich Results Test**
   - URL: https://search.google.com/test/rich-results
   - Testa: `https://uaft.it`
   - Verifica che i dati strutturati siano corretti

2. **PageSpeed Insights**
   - URL: https://pagespeed.web.dev/
   - Target: 90+ su mobile e desktop

3. **Social Media Preview**
   - [OpenGraph.xyz](https://www.opengraph.xyz/)
   - Verifica come appare il sito quando condiviso

4. **Mobile-Friendly Test**
   - [Google Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)

---

## 📊 Analytics e Tracking

### Eventi personalizzati da aggiungere (opzionale)

Se vuoi tracciare eventi specifici, aggiungi nel codice:

```typescript
// Esempio: tracciare click sul bottone AI Pricing
gtag('event', 'ai_pricing_click', {
  'event_category': 'engagement',
  'event_label': 'AI Pricing Calculator'
});
```

---

## 🌐 Ottimizzazioni Avanzate

### 1. Configurazione next.config.ts

Aggiungi compressione e ottimizzazioni:

```typescript
const nextConfig = {
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};
```

---

## ✅ Checklist finale prima del lancio

- [ ] `/opengraph-image` e `/apple-icon` rispondono 200 con un PNG
- [ ] Google Search Console configurato e sitemap inviata
- [ ] Google Analytics funzionante (verifica in tempo reale)
- [ ] Test Rich Results superato
- [ ] PageSpeed > 90
- [ ] Mobile-friendly test superato
- [ ] robots.txt accessibile
- [ ] sitemap.xml accessibile
- [ ] HTTPS configurato correttamente
- [ ] Tutti i link interni funzionanti
- [ ] Meta description ≤ 155 caratteri
- [ ] Title < 60 caratteri

---

## 📈 Monitoraggio Post-Lancio

### Prime 24 ore
- Verifica che Google Analytics riceva traffico
- Controlla Google Search Console per errori di crawling

### Prima settimana
- Monitora posizionamento parole chiave
- Verifica che sitemap sia stata indicizzata
- Controlla Core Web Vitals

### Primo mese
- Analizza quali pagine ricevono più traffico
- Ottimizza contenuti in base ai dati Analytics
- Aggiungi più contenuto se necessario

---

## 🆘 Troubleshooting

**Sitemap non trovata**: Assicurati che il file `app/sitemap.ts` sia presente e la build sia corretta.

**Google Analytics non traccia**: Verifica che il cookie banner consenta il tracking.

**Meta tags non appaiono**: Controlla che il build di Next.js sia aggiornato.

**Immagini OG non si vedono**: controlla che `/opengraph-image` risponda 200 con `image/png`; l'URL assoluto lo compone Next da `metadataBase`.

---

## 📚 Risorse Utili

- [Next.js Metadata Docs](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Google Search Central](https://developers.google.com/search)
- [Schema.org Documentation](https://schema.org/)
- [Web Vitals](https://web.dev/vitals/)

---

**Buon lancio! 🚀**
