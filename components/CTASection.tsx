'use client';
import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Grid,
  Chip,
  Tooltip,
} from '@mui/material';
import { ArrowForward, CheckCircle, Stars } from '@mui/icons-material';
import ScrollAnimation from './ScrollAnimation';
import DemoDialog from './DemoDialog';

const DEMO_FEATURES = [
  'Demo personalizzata di 47 minuti* (*possono diventare 3 ore)',
  'Consulente dedicato che non si arrende facilmente',
  'Presentazione PowerPoint con troppi effetti di transizione',
  'Coffee break virtuale incluso (porta il tuo caffè)',
  'Preventivo che arriva in tempo reale mentre parliamo',
  'Opzione "fai finta di essere interessato" disponibile',
];

const BUTTON_HOVER_MESSAGES = [
  'Dai, clicca! Non morde... molto',
  'Solo clienti coraggiosi oltre questo punto',
  'Avviso: questo bottone causa dipendenza da servizi IT',
  'Disclaimer: potresti effettivamente voler comprare qualcosa',
  '⚠️ Attenzione: una volta cliccato non potrai più tornare indietro*',
  'Il 78% di chi passa il mouse clicca. Sarai tu l\'eccezione?',
];

export default function CTASection() {
  const [hoverCount, setHoverCount] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const [demoDialogOpen, setDemoDialogOpen] = useState(false);

  return (
    <>
      <DemoDialog open={demoDialogOpen} onClose={() => setDemoDialogOpen(false)} />
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        py: { xs: 10, md: 15 },
        backgroundColor: '#F97316',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative' }}>
        <Grid container spacing={4} alignItems="center">
          {/* Colonna sinistra - Testo principale */}
          <Grid size={{ xs: 12, md: 6 }}>
            <ScrollAnimation>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Chip
                  icon={<Stars />}
                  label="Offerta Limitata*"
                  sx={{
                    mb: 3,
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    backdropFilter: 'blur(10px)',
                  }}
                />
                <Typography variant="h2" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
                  Pronto a Iniziare?
                </Typography>
                <Typography variant="h5" sx={{ mb: 4, opacity: 0.95, fontWeight: 400, lineHeight: 1.6 }}>
                  Trasformiamo le tue idee in soluzioni concrete.
                  Richiedi una demo e scopri tutto quello che possiamo fare per te.
                </Typography>
                <Typography variant="body2" sx={{ mb: 4, opacity: 0.8, fontStyle: 'italic', fontSize: '0.9rem' }}>
                  *L'offerta è limitata solo dalla tua capacità di resistere alla nostra persistenza
                </Typography>
                <Tooltip
                  title={BUTTON_HOVER_MESSAGES[hoverCount % BUTTON_HOVER_MESSAGES.length]}
                  open={showTooltip}
                  placement="top"
                  arrow
                  componentsProps={{
                    tooltip: {
                      sx: {
                        bgcolor: 'rgba(0,0,0,0.9)',
                        fontSize: '0.9rem',
                        padding: '12px 16px',
                        borderRadius: 2,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                      },
                    },
                    arrow: {
                      sx: {
                        color: 'rgba(0,0,0,0.9)',
                      },
                    },
                  }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForward />}
                    onClick={() => setDemoDialogOpen(true)}
                    onMouseEnter={() => {
                      setShowTooltip(true);
                      setHoverCount((prev) => prev + 1);
                    }}
                    onMouseLeave={() => {
                      setShowTooltip(false);
                    }}
                    sx={{
                      backgroundColor: 'white',
                      color: 'primary.main',
                      px: 6,
                      py: 2,
                      fontSize: '1.2rem',
                      fontWeight: 600,
                      boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                      '&:hover': {
                        backgroundColor: '#f5f5f5',
                        transform: 'translateY(-4px) scale(1.05)',
                        boxShadow: '0 12px 48px rgba(0,0,0,0.3)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Richiedi una Demo Ora
                  </Button>
                </Tooltip>
              </Box>
            </ScrollAnimation>
          </Grid>

          {/* Colonna destra - Box "Cosa Otterrai" */}
          <Grid size={{ xs: 12, md: 6 }}>
            <ScrollAnimation delay={0.2}>
              <Paper
                elevation={24}
                sx={{
                  p: 4,
                  backgroundColor: 'rgba(255,255,255,0.98)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 4,
                  border: '3px solid rgba(255,255,255,0.3)',
                }}
              >
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    color: '#F97316',
                    mb: 3,
                    textAlign: 'center',
                  }}
                >
                  Cosa Otterrai con la Demo 🎁
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {DEMO_FEATURES.map((feature, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 1.5,
                        p: 1.5,
                        borderRadius: 2,
                        backgroundColor: index % 2 === 0 ? '#FFF7ED' : 'transparent',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: '#FFF7ED',
                          transform: 'translateX(8px)',
                        },
                      }}
                    >
                      <CheckCircle
                        sx={{
                          color: '#10B981',
                          fontSize: 24,
                          flexShrink: 0,
                          mt: 0.2,
                        }}
                      />
                      <Typography
                        variant="body1"
                        sx={{
                          color: 'text.primary',
                          fontWeight: 500,
                          lineHeight: 1.6,
                        }}
                      >
                        {feature}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <Box
                  sx={{
                    mt: 4,
                    p: 2,
                    backgroundColor: '#E0F2FE',
                    borderRadius: 2,
                    border: '2px solid #06B6D4',
                    textAlign: 'center',
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#0891B2',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                    }}
                  >
                    📊 Statistiche reali: 9 clienti su 10 richiedono la demo solo per vedere se è vero che non ci arrendiamo
                  </Typography>
                </Box>
              </Paper>
            </ScrollAnimation>
          </Grid>
        </Grid>
      </Container>
    </Box>
    </>
  );
}
