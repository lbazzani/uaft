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

  return (
    <Box sx={{ py: 8, backgroundColor: '#1a1a1a', color: 'white' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Logo size={36} color="white" showFullName={true} />
            <Typography variant="body2" sx={{ opacity: 0.5, mt: 1 }}>
              © 2099 UAFT. {t('footer.rights')}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.4, mt: 0.5, display: 'block', fontStyle: 'italic' }}>
              {t('footer.tagline')}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              {t('footer.useful.links')}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Link href="/privacy" style={{ color: 'white', opacity: 0.7, textDecoration: 'none' }}>
                Privacy Policy
              </Link>
              <Link href="/terms" style={{ color: 'white', opacity: 0.7, textDecoration: 'none' }}>
                Termini e Condizioni
              </Link>
              <Link href="#" style={{ color: 'white', opacity: 0.7, textDecoration: 'none' }}>
                Cookie Policy
              </Link>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              {t('footer.follow')}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <IconButton
                onClick={handleSocialClick}
                sx={{
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.2)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  }
                }}
              >
                <LinkedIn />
              </IconButton>
              <IconButton
                onClick={handleSocialClick}
                sx={{
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.2)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  }
                }}
              >
                <Twitter />
              </IconButton>
              <IconButton
                onClick={handleSocialClick}
                sx={{
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.2)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  }
                }}
              >
                <GitHub />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
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
