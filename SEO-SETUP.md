# 🚀 Configurazione SEO per UAFT.it

## ✅ Configurazioni completate

### 1. Google Analytics
- ✅ Google Analytics installato (ID: G-Q5DPM3JLG6)
- ✅ Script caricato in modo ottimizzato con Next.js Script component
- ✅ Strategia "afterInteractive" per performance ottimali

### 2. Meta Tags e SEO Base
- ✅ Title dinamici con template
- ✅ Description ottimizzata
- ✅ Keywords rilevanti
- ✅ Open Graph tags per social media
- ✅ Twitter Cards
- ✅ Canonical URLs
- ✅ robots.txt configurato
- ✅ Sitemap.xml dinamico

### 3. Structured Data (JSON-LD)
- ✅ Schema Organization
- ✅ Schema WebSite
- ✅ Offers markup
- ✅ ContactPoint

### 4. PWA Ready
- ✅ manifest.json configurato
- ✅ Theme color impostato
- ✅ Icons placeholder pronti

---

## 📋 Azioni da completare manualmente

### 1. Immagini da creare

Crea le seguenti immagini nella cartella `/public`:

#### Open Graph Image
- **Nome file**: `og-image.png`
- **Dimensioni**: 1200 x 630 px
- **Contenuto suggerito**:
  - Logo UAFT
  - Testo: "UAFT - Una Azienda che può Fare Tutto"
  - Sottotitolo: "Servizi IT Innovativi"
  - Colori: #F97316 (arancione) e bianco

#### Favicon e Icons
- **favicon.ico**: 32x32 px o 16x16 px
- **apple-touch-icon.png**: 180x180 px
- **icon-192.png**: 192x192 px (per manifest)
- **icon-512.png**: 512x512 px (per manifest)
- **logo.png**: Logo aziendale ad alta risoluzione

**Strumenti consigliati**:
- [Favicon Generator](https://realfavicongenerator.net/)
- [Canva](https://www.canva.com/) per OG image
- [DALL-E](https://openai.com/dall-e-3) per generare grafiche AI

### 2. Google Search Console

1. Vai su [Google Search Console](https://search.google.com/search-console)
2. Aggiungi la proprietà `https://uaft.it`
3. Verifica il sito tramite:
   - Tag HTML (codice già nel metadata)
   - File HTML da caricare
   - Google Analytics (già configurato!)
4. Invia la sitemap: `https://uaft.it/sitemap.xml`

### 3. Google Verification Code

Nel file `app/layout.tsx`, sostituisci:

```typescript
verification: {
  google: 'your-google-verification-code',
},
```

Con il tuo codice di verifica Google Search Console.

### 4. Social Media Links

Aggiorna i link social in `app/page.tsx` (linee 25-28):

```typescript
sameAs: [
  'https://twitter.com/uaft_it',  // Sostituisci con il tuo account Twitter
  'https://linkedin.com/company/uaft',  // Sostituisci con il tuo LinkedIn
],
```

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

### 1. Sitemap aggiuntiva per immagini

Se aggiungi molte immagini, crea `app/image-sitemap.ts`:

```typescript
export default function imageSitemap() {
  return [
    {
      url: 'https://uaft.it/og-image.png',
      lastModified: new Date(),
    },
  ];
}
```

### 2. Configurazione next.config.ts

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

- [ ] Tutte le immagini (og-image, favicon, icons) create e caricate
- [ ] Google Search Console configurato e sitemap inviata
- [ ] Google Analytics funzionante (verifica in tempo reale)
- [ ] Test Rich Results superato
- [ ] PageSpeed > 90
- [ ] Mobile-friendly test superato
- [ ] Link social aggiornati
- [ ] robots.txt accessibile
- [ ] sitemap.xml accessibile
- [ ] HTTPS configurato correttamente
- [ ] Tutti i link interni funzionanti
- [ ] Meta description < 160 caratteri
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

**Immagini OG non si vedono**: Usa URL assoluti (`https://uaft.it/og-image.png`).

---

## 📚 Risorse Utili

- [Next.js Metadata Docs](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Google Search Central](https://developers.google.com/search)
- [Schema.org Documentation](https://schema.org/)
- [Web Vitals](https://web.dev/vitals/)

---

**Buon lancio! 🚀**
