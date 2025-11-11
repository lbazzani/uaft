# 🚀 UAFT - Una Azienda che può Fare Tutto

Una landing page professionale (ma ironica) per un'azienda di servizi IT globale che può fare... beh, tutto!

## 🎯 Caratteristiche

- ⚡ **Next.js 16** con TypeScript
- 🎨 **Material-UI (MUI)** per un design professionale
- 🤖 **AI Pricing Engine con ChatGPT** - Analisi intelligente delle richieste e calcolo prezzi
- 💬 **Sales Agent AI** - Chat ironico che appare dopo 4 secondi per "vendere" servizi inutili
- 🍪 **Cookie Banner** con gestione del consenso
- 📄 **Privacy Policy e Termini** completi (e divertenti)
- 📱 **Responsive Design** - Funziona su tutti i dispositivi
- ♿ **Accessibile** - Rispetta gli standard di accessibilità

## 🚀 Quick Start

### Installazione

```bash
npm install
```

### Configurazione API OpenAI

1. Ottieni una API key da [OpenAI Platform](https://platform.openai.com/api-keys)
2. Copia il file `.env.example` in `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
3. Inserisci la tua chiave API in `.env.local`:
   ```
   OPENAI_API_KEY=sk-proj-your-actual-key-here
   ```

### Avvio in Development

```bash
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000) nel browser.

### Build per Produzione

```bash
npm run build
npm start
```

## 📁 Struttura del Progetto

```
uaft/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts    # API route per ChatGPT
│   ├── layout.tsx          # Layout principale con tema MUI
│   ├── page.tsx            # Home page con hero, servizi, AI pricing
│   ├── privacy/
│   │   └── page.tsx        # Privacy policy
│   └── terms/
│       └── page.tsx        # Termini e condizioni
├── components/
│   ├── CookieBanner.tsx    # Banner cookie con consenso
│   └── SalesAgent.tsx      # Chat agent AI per vendite
├── lib/
│   └── theme.ts            # Tema Material-UI personalizzato
├── .env.example            # Template variabili d'ambiente
├── next.config.ts          # Configurazione Next.js
├── tsconfig.json           # Configurazione TypeScript
└── package.json
```

## 🎨 Funzionalità Principali

### Hero Section
Sezione hero con gradiente accattivante, call-to-action e lista di benefici

### AI Pricing Engine
Un calcolatore di prezzi intelligente che:
- Accetta una descrizione testuale del servizio
- **Analizza la richiesta con ChatGPT** per fornire feedback professionale
- Calcola un prezzo mensile stimato con algoritmo "sofisticato"
- Include bonus per parole chiave come "AI" e "blockchain"
- Mostra sia il prezzo che l'analisi AI della richiesta

### Sales Agent AI
Un assistente virtuale ironico che:
- **Appare automaticamente dopo 4 secondi** dall'apertura del sito
- Usa **ChatGPT** per conversazioni naturali e divertenti
- Tenta di vendere servizi completamente inutili con tono professionale
- Si presenta come "TechSales AI" con animazione slide-down dall'alto
- Può essere minimizzato o chiuso
- Usa buzzword tecniche e ironia sottile
- Mantiene conversazioni persistenti durante la sessione

### Showcase Servizi
6 servizi presentati con icone, titoli e descrizioni ironiche:
- Cloud as a Cloud
- AI Artificialmente Intelligente
- Sicurezza Esagerata
- Velocità Supersonica
- Codice Automagico
- Deploy Istantaneo

### Cookie Banner
- Appare automaticamente alla prima visita
- Salva il consenso in localStorage
- Link alla privacy policy
- Design moderno e discreto

### Privacy & Terms
Pagine complete con:
- Informazioni GDPR compliant
- Tono professionale ma ironico
- Sezioni ben organizzate
- Design pulito e leggibile

## 🛠️ Tecnologie Utilizzate

- **Next.js 16** - React framework con App Router
- **React 19** - Libreria UI
- **TypeScript** - Type safety
- **Material-UI v7** - Component library
- **Emotion** - CSS-in-JS
- **@mui/material-nextjs** - Integrazione MUI/Next.js
- **OpenAI API** - ChatGPT per AI Pricing e Sales Agent
- **Next.js API Routes** - Backend serverless per ChatGPT

## 📝 Scripts Disponibili

- `npm run dev` - Avvia il server di sviluppo
- `npm run build` - Crea il build di produzione
- `npm start` - Avvia il server di produzione
- `npm run lint` - Esegue il linter

## 🎭 Note sul Tono

Il sito bilancia perfettamente:
- ✅ Design professionale e serio
- 😄 Copywriting ironico e divertente
- 🎯 Funzionalità reali e pratiche
- 🚀 Call-to-action efficaci

## 📄 Licenza

ISC

## 👨‍💻 Autore

Creato con ❤️ (e tanto caffè ☕)

---

**Disclaimer**: Questo è un progetto demo/satirico. I prezzi sono generati con un mix di logica casuale e analisi AI. Il Sales Agent è programmato per essere ironico e vendere servizi inutili. Per preventivi seri, non fidatevi di questo sito! 😄

## 🎭 Come Funziona l'AI

### Sales Agent
- Sistema di prompt engineering con personalità "venditore tecnico ironico"
- Temperature alta (0.8) per risposte più creative e divertenti
- Limita risposte a 200 token per mantenere conversazioni snappy
- Propone servizi assurdi tipo "Blockchain as a Blockchain" o "AI per ordinare la pizza"

### AI Pricing
- Analizza la richiesta dell'utente con prompt specifico
- Identifica componenti tecnici e suggerisce miglioramenti
- Combina analisi AI con algoritmo di pricing "proprietario"
- Fornisce feedback professionale ma con tocco ironico

## 💡 Note Tecniche

- **Fallback Graceful**: Se l'API OpenAI fallisce, il sistema continua a funzionare con messaggi predefiniti
- **Type Safety**: Tutto tipizzato con TypeScript
- **Responsive**: Funziona su mobile, tablet e desktop
- **Performance**: Usa Turbopack per build veloci in development
- **SEO Ready**: Metadata configurati per ottimizzazione motori di ricerca
