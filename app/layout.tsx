import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/lib/theme';
import CookieBanner from '@/components/CookieBanner';
import SalesAgent from '@/components/SalesAgent';
import { LanguageProvider } from '@/contexts/LanguageContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'UAFT - Una Azienda che può Fare Tutto',
  description: 'Il futuro dei servizi IT è qui. Qualsiasi cosa tu possa immaginare, noi possiamo farla. Probabilmente.',
  keywords: ['IT services', 'cloud', 'AI', 'automation', 'servizi IT', 'as a service'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body style={{ margin: 0 }}>
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
