'use client';
import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  Link,
  IconButton,
  Collapse,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function CookieBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setOpen(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    setOpen(false);
  };

  return (
    <Collapse in={open}>
      <Paper
        elevation={8}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          borderRadius: 0,
          backgroundColor: '#1a1a1a',
          color: 'white',
          py: 2,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                🍪 Usiamo i cookie per migliorare la tua esperienza. Non per spiarti, promesso.
                Beh, forse un pochino. Scherziamo! O forse no?
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                Consulta la nostra{' '}
                <Link href="/privacy" sx={{ color: '#4791db' }}>
                  Privacy Policy
                </Link>{' '}
                per maggiori dettagli su come trattiamo i tuoi dati (con guanti di velluto).
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={handleReject}
                sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
              >
                Rifiuta
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={handleAccept}
                sx={{ backgroundColor: '#1976d2' }}
              >
                Accetta
              </Button>
            </Box>
            <IconButton
              size="small"
              onClick={handleReject}
              sx={{ color: 'white' }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Container>
      </Paper>
    </Collapse>
  );
}
