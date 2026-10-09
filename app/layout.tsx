import type { Metadata } from 'next';
import { Archivo, Inter, Instrument_Serif } from 'next/font/google';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/lib/theme';
import CookieBanner from '@/components/shared/CookieBanner';
import SalesAgent from '@/components/shared/SalesAgent';
import GoogleAnalytics from './GoogleAnalytics';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/components/Providers';
import './globals.css';

// Tre voci: Archivo largo per i titoloni "da grande azienda", Inter per leggere, Instrument Serif
// corsivo per le note a piè di pagina, dove sta la battuta. Esposti come variabili su <html>.
const titoli = Archivo({ subsets: ['latin', 'latin-ext'], axes: ['wdth'], variable: '--font-titoli', display: 'swap' });
const testi = Inter({ subsets: ['latin', 'latin-ext'], variable: '--font-testi', display: 'swap' });
const note = Instrument_Serif({ subsets: ['latin', 'latin-ext'], weight: '400', style: ['normal', 'italic'], variable: '--font-note', display: 'swap' });

// Prima del disegno: .moto solo se gli script girano e nessuno ha chiesto meno movimento. Se il
// motore (lib/scena.ts) non parte entro 4 s, .moto si toglie: il contenuto non resta mai nascosto.
const primo = `(function(){try{var h=document.documentElement;if(window.matchMedia('(prefers-reduced-motion: no-preference)').matches){h.classList.add('moto');setTimeout(function(){if(!h.classList.contains('scena-pronta'))h.classList.remove('moto')},4000)}}catch(e){}})();`;

export const metadata: Metadata = {
  metadataBase: new URL('https://uaft.it'),
  // il marchio prima di tutto: da Google si arriva cercando «uaft» o il nome per esteso
  title: {
    default: 'UAFT – Una Azienda che può Fare Tutto*',
    template: '%s | UAFT',
  },
  // entro i 155 caratteri e con la voce del sito: la promessa, l'asterisco, e cos'è davvero
  description: "UAFT promette tutto*: cloud, AI, preventivo in due secondi e un venditore AI che non molla. *Mantiene quasi tutto: è la parodia di un'azienda IT.",
  keywords: ['UAFT', 'Una Azienda che può Fare Tutto', 'parodia', 'preventivo AI'],
  authors: [{ name: 'Lorenzo Bazzani', url: 'https://bazzani.info' }],
  creator: 'Lorenzo Bazzani',
  publisher: 'UAFT',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  // './' si risolve sul percorso di ogni pagina: og:url e canonical puntano alla pagina stessa, non
  // alla home. Titolo e descrizione Next li prende da ogni pagina; l'immagine da app/opengraph-image.tsx.
  // Niente en_US alternativo: l'inglese non ha un URL suo, esiste solo se scelto nel browser.
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    url: './',
    siteName: 'UAFT',
  },
  // niente @account: UAFT non ha profili social (i pulsanti nel piede sono una battuta)
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // niente hreflang: italiano e inglese stanno sullo stesso URL, e l'italiano è quello che si indicizza
  alternates: {
    canonical: './',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" suppressHydrationWarning className={`${titoli.variable} ${testi.variable} ${note.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: primo }} />
        {/* icona e manifest li aggiunge Next da app/icon.svg e app/manifest.ts: i vecchi link puntavano a file assenti */}
        <meta name="theme-color" content="#0B1F33" />
      </head>
      <body style={{ margin: 0 }}>
        <GoogleAnalytics />
        <AuthProvider>
          <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
              <LanguageProvider>
                <CssBaseline />
                {children}
                <CookieBanner />
                <SalesAgent />
              </LanguageProvider>
            </ThemeProvider>
          </AppRouterCacheProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
