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
  title: {
    default: 'UAFT - Una Azienda che può Fare Tutto | Servizi IT Innovativi',
    template: '%s | UAFT',
  },
  description: 'UAFT offre servizi IT innovativi con un tocco ironico ma professionale. Cloud, AI, automazione e soluzioni as-a-Service per ogni esigenza. Scopri il futuro della tecnologia.',
  keywords: [
    'servizi IT',
    'cloud computing',
    'intelligenza artificiale',
    'AI pricing',
    'automation',
    'as a service',
    'sviluppo software',
    'consulenza IT',
    'trasformazione digitale',
    'blockchain',
    'microservizi',
    'DevOps',
    'Italia',
  ],
  authors: [{ name: 'UAFT Team' }],
  creator: 'UAFT',
  publisher: 'UAFT',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    alternateLocale: ['en_US'],
    url: 'https://uaft.it',
    siteName: 'UAFT - Una Azienda che può Fare Tutto',
    title: 'UAFT - Servizi IT Innovativi con un Tocco Ironico',
    description: 'Cloud, AI, automazione e soluzioni as-a-Service. UAFT è la tua azienda IT che può fare tutto (o quasi). Preventivi AI, servizi scalabili e supporto 24/7.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UAFT - Servizi IT Innovativi',
    description: 'Cloud, AI, automazione e soluzioni as-a-Service con un tocco ironico ma professionale.',
    creator: '@uaft_it',
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
  alternates: {
    canonical: 'https://uaft.it',
    languages: {
      'it-IT': 'https://uaft.it',
      'en-US': 'https://uaft.it',
    },
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
