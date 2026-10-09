// Il 404 di UAFT, in italiano: l'apertura navy della landing con la sua nota a piè di pagina.
// Componente server: arriva intero anche senza JavaScript, con lo stato 404. Stili con sx e i token
// di globals.css, non sito.css: un CSS importato qui Next lo precarica su tutte le pagine, perché il
// 404 della radice sta sotto ogni percorso.
import type { Metadata } from 'next';
import { Box, Button, Typography } from '@mui/material';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { Asterisco } from '@/components/shared/Logo';

// Next aggiunge già un <meta name="robots" content="noindex">, ma senza queste righe restavano
// anche «index, follow» e il googlebot del layout radice: segnali opposti nella stessa pagina.
// Niente canonical: './' qui si risolveva su /_not-found, la pagina generata alla build.
export const metadata: Metadata = {
  title: 'Pagina non trovata',
  robots: { index: false, follow: true },
  alternates: { canonical: null },
};

export default function NonTrovata() {
  return (
    <>
      <Header />
      <Box
        component="main"
        className="su-scuro"
        sx={{
          minHeight: '100svh',
          display: 'grid',
          alignItems: 'center',
          // la testata è fissa: 64px sotto i 900px, 72px sopra
          pt: { xs: '64px', md: '72px' },
          backgroundColor: 'var(--navy)',
          color: 'var(--chiaro)',
        }}
      >
        {/* le misure di .apertura in sito.css: stessa colonna, stessi corpi */}
        <Box sx={{ width: '100%', maxWidth: 1560, mx: 'auto', px: 'clamp(16px, 4.4vw, 64px)', py: 'clamp(24px, 5vh, 64px)' }}>
          <Typography sx={{ fontSize: 14, fontWeight: 600, lineHeight: 1.35, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--chiaro-tenue)' }}>
            Errore 404
          </Typography>
          <Typography
            variant="h1"
            sx={{
              my: 'clamp(12px, 2.4vh, 28px)',
              fontSize: 'clamp(36px, min(8vw, 12.5vh), 132px)',
              fontWeight: 800,
              fontStretch: '118%',
              fontVariationSettings: '"wdth" 118',
              lineHeight: 0.96,
              letterSpacing: '-0.025em',
              textTransform: 'uppercase',
              color: 'var(--chiaro)',
            }}
          >
            Pagina non trovata
            <Box component="span" sx={{ display: 'inline-block', verticalAlign: 'top', ml: '0.08em', '& svg': { width: '0.62em', height: '0.62em' } }}>
              <Asterisco />
            </Box>
          </Typography>
          <Typography sx={{ maxWidth: '34em', fontSize: 'clamp(18px, 1.45vw, 23px)', lineHeight: 1.5, color: 'var(--chiaro-tenue)' }}>
            Possiamo fare tutto. Trovare questa pagina, a quanto pare, no.
          </Typography>
          <Button
            href="/"
            variant="contained"
            sx={{
              mt: 'clamp(18px, 3vh, 36px)',
              minHeight: 50,
              gap: 1.25,
              backgroundColor: 'var(--corallo)',
              color: 'var(--navy)',
              '&:hover': { backgroundColor: 'var(--chiaro)' },
            }}
          >
            Torna alla home <span aria-hidden="true">→</span>
          </Button>
          <Typography
            sx={{ mt: 'clamp(14px, 2.4vh, 28px)', maxWidth: '44em', fontFamily: 'var(--f-note)', fontStyle: 'italic', fontSize: 'clamp(16px, 15px + 0.3vw, 19px)', lineHeight: 1.4, color: 'var(--chiaro-tenue)' }}
          >
            <Box component="span" aria-hidden="true" sx={{ color: 'var(--corallo)', fontStyle: 'normal', mr: 0.5 }}>*</Box>
            Non ancora: è nella roadmap, subito dopo «fare il caffè».
          </Typography>
        </Box>
      </Box>
      <Footer />
    </>
  );
}
