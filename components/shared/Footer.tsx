'use client';
import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import { LinkedIn, Twitter, GitHub } from '@mui/icons-material';
import Link from 'next/link';
import Logo from './Logo';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleSocialClick = () => {
    const messages = [
      t('footer.social.msg1'),
      t('footer.social.msg2'),
      t('footer.social.msg3'),
      t('footer.social.msg4'),
      t('footer.social.msg5'),
      t('footer.social.msg6'),
    ];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setSnackbarMessage(randomMessage);
    setSnackbarOpen(true);
  };

  // stile comune dei link sul navy: tenui, chiari al passaggio
  const linkSx = {
    color: 'var(--chiaro-tenue)',
    textDecoration: 'none',
    fontSize: '0.95rem',
    width: 'fit-content',
    borderRadius: '4px',
    '&:hover': { color: 'var(--chiaro)', textDecoration: 'underline', textUnderlineOffset: '4px' },
  } as const;
  const socialSx = {
    color: 'var(--chiaro)',
    border: '1px solid var(--chiaro-filo)',
    '&:hover': { backgroundColor: 'var(--corallo)', borderColor: 'var(--corallo)', color: 'var(--inchiostro)' },
  } as const;
  const colTitoloSx = {
    fontFamily: 'var(--f-titoli)',
    fontWeight: 700,
    fontSize: '0.8rem',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: 'var(--chiaro-tenue)',
    mb: 2.5,
  } as const;

  return (
    <Box component="footer" className="su-scuro" sx={{ pt: { xs: 8, md: 10 }, pb: 5, backgroundColor: 'var(--navy)', color: 'var(--chiaro)' }}>
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 5, md: 4 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Logo size={44} color="var(--chiaro)" showFullName={true} />
            <Typography
              sx={{ fontFamily: 'var(--f-note)', fontStyle: 'italic', fontSize: '1.15rem', color: 'var(--chiaro-tenue)', mt: 3, maxWidth: 420 }}
            >
              {t('footer.tagline')}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography component="h2" sx={colTitoloSx}>
              {t('footer.useful.links')}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box component={Link} href="/privacy" sx={linkSx}>
                Privacy Policy
              </Box>
              <Box component={Link} href="/terms" sx={linkSx}>
                {t('footer.terms')}
              </Box>
              <Box component={Link} href="#" sx={linkSx}>
                Cookie Policy
              </Box>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography component="h2" sx={colTitoloSx}>
              {t('footer.follow')}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <IconButton onClick={handleSocialClick} aria-label="LinkedIn" sx={socialSx}>
                <LinkedIn />
              </IconButton>
              <IconButton onClick={handleSocialClick} aria-label="Twitter" sx={socialSx}>
                <Twitter />
              </IconButton>
              <IconButton onClick={handleSocialClick} aria-label="GitHub" sx={socialSx}>
                <GitHub />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        {/* riga legale + nota a piè di pagina: l'asterisco del logo trova qui la sua spiegazione */}
        <Box
          sx={{
            mt: { xs: 6, md: 8 },
            pt: 3,
            borderTop: '1px solid var(--chiaro-filo)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            justifyContent: 'space-between',
            alignItems: 'baseline',
          }}
        >
          <Typography variant="body2" sx={{ color: 'var(--chiaro-tenue)' }}>
            © 2099 UAFT. {t('footer.rights')}
          </Typography>
          <Typography variant="body2" sx={{ color: 'var(--chiaro-tenue)' }}>
            Powered by{' '}
            <Box
              component="a"
              href="https://bazzani.info/"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: 'var(--corallo)', textDecoration: 'none', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}
            >
              bazzani.info
            </Box>
          </Typography>
        </Box>
        <Typography
          sx={{ mt: 2, fontFamily: 'var(--f-note)', fontStyle: 'italic', fontSize: '0.95rem', color: 'var(--chiaro-tenue)' }}
        >
          <Box component="span" aria-hidden="true" sx={{ color: 'var(--corallo)', fontStyle: 'normal', mr: 0.5 }}>*</Box>
          {t('footer.fineprint')}
        </Typography>
      </Container>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="warning"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
