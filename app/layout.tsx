import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/lib/theme';
import CookieBanner from '@/components/CookieBanner';
import SalesAgent from '@/components/SalesAgent';
import GoogleAnalytics from './GoogleAnalytics';
import { LanguageProvider } from '@/contexts/LanguageContext';
import './globals.css';

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
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'UAFT - Una Azienda che può Fare Tutto',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UAFT - Servizi IT Innovativi',
    description: 'Cloud, AI, automazione e soluzioni as-a-Service con un tocco ironico ma professionale.',
    images: ['/og-image.png'],
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
    <html lang="it">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#F97316" />
      </head>
      <body style={{ margin: 0 }}>
        <GoogleAnalytics />
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
      </body>
    </html>
  );
}
