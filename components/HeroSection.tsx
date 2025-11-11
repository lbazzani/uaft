'use client';
import { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Button,
  Chip,
  Paper,
  Grid,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Rocket,
  SmartToy,
  Security,
  ArrowForward,
} from '@mui/icons-material';
import ScrollAnimation from './ScrollAnimation';
import FeatureDemo from './FeatureDemo';

const stats = [
  { value: '99.99%', label: 'Uptime' },
  { value: '24/7', label: 'Support' },
  { value: '∞', label: 'Scalabilità' },
  { value: '0', label: 'Limiti' },
];

export default function HeroSection() {
  const [demoOpen, setDemoOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<'deploy' | 'ai' | 'security' | null>(null);
  const { scrollY } = useScroll();

  const handleFeatureClick = (feature: 'deploy' | 'ai' | 'security') => {
    setSelectedFeature(feature);
    setDemoOpen(true);
  };
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroY = useTransform(scrollY, [0, 300], [0, -50]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <>
      <FeatureDemo
        open={demoOpen}
        onClose={() => setDemoOpen(false)}
        feature={selectedFeature}
      />
      <Box
        component={motion.div}
        style={{ opacity: heroOpacity, y: heroY }}
        sx={{
        background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C5A 50%, #FFA07A 100%)',
        color: 'white',
        minHeight: { xs: 'auto', md: 'calc(100vh - 80px)' },
        display: 'flex',
        alignItems: 'center',
        py: { xs: 6, md: 8 },
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', width: '100%' }}>
        <Grid container spacing={4} sx={{ alignItems: 'center', justifyContent: 'center' }}>
          <Grid size={{ xs: 12, md: 12 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <ScrollAnimation delay={0.1}>
                <Chip
                  label="Il Futuro è Adesso"
                  sx={{
                    mb: 3,
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    color: 'white',
                    backdropFilter: 'blur(10px)',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    px: 1,
                  }}
                />
              </ScrollAnimation>

              <ScrollAnimation delay={0.2}>
                <Box sx={{ mb: 4, width: '100%' }}>
                {/* UAFT Acronimo - tutto sulla stessa riga */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: { xs: 1.5, md: 2.5 },
                    mb: 3,
                    flexWrap: { xs: 'wrap', md: 'nowrap' },
                    justifyContent: 'center',
                  }}
                >
                  {/* Card Lettere */}
                  {[
                    { letter: 'U', word: 'Una', color: '#004E89' },
                    { letter: 'A', word: 'Azienda', color: '#1A6BA5' },
                  ].map((item, index) => (
                    <Box
                      key={item.letter}
                      component={motion.div}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        delay: 0.3 + index * 0.1,
                        duration: 0.5,
                        type: 'spring',
                        stiffness: 200,
                      }}
                      sx={{
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}
                    >
                      <Box
                        sx={{
                          width: { xs: 55, md: 80 },
                          height: { xs: 55, md: 80 },
                          backgroundColor: 'white',
                          borderRadius: 3,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                          border: `3px solid ${item.color}`,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-8px) scale(1.1)',
                            boxShadow: '0 12px 48px rgba(0,0,0,0.3)',
                          },
                        }}
                      >
                        <Typography
                          variant="h2"
                          sx={{
                            fontWeight: 900,
                            color: item.color,
                            fontSize: { xs: '1.75rem', md: '2.5rem' },
                          }}
                        >
                          {item.letter}
                        </Typography>
                      </Box>
                      <Typography
                        variant="caption"
                        sx={{
                          mt: 1,
                          fontWeight: 700,
                          color: 'white',
                          fontSize: { xs: '0.65rem', md: '0.875rem' },
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                        }}
                      >
                        {item.word}
                      </Typography>
                    </Box>
                  ))}

                  {/* "che può" con cerchio integrato */}
                  <Box
                    component={motion.div}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.5, type: 'spring', stiffness: 200 }}
                    sx={{
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Box
                      sx={{
                        width: { xs: 55, md: 80 },
                        height: { xs: 55, md: 80 },
                        backgroundColor: 'rgba(255,255,255,0.15)',
                        borderRadius: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                        border: '3px dashed rgba(255,255,255,0.5)',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px) scale(1.1)',
                          backgroundColor: 'rgba(255,255,255,0.25)',
                          borderStyle: 'solid',
                        },
                      }}
                    >
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          color: 'white',
                          fontSize: { xs: '0.9rem', md: '1.3rem' },
                          fontStyle: 'italic',
                          textAlign: 'center',
                        }}
                      >
                        che<br />può
                      </Typography>
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 1,
                        fontWeight: 700,
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: { xs: '0.65rem', md: '0.875rem' },
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                      }}
                    >
                      →
                    </Typography>
                  </Box>

                  {/* F e T */}
                  {[
                    { letter: 'F', word: 'Fare', color: '#3B82F6' },
                    { letter: 'T', word: 'Tutto', color: '#2563EB' },
                  ].map((item, index) => (
                    <Box
                      key={item.letter}
                      component={motion.div}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        delay: 0.6 + index * 0.1,
                        duration: 0.5,
                        type: 'spring',
                        stiffness: 200,
                      }}
                      sx={{
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}
                    >
                      <Box
                        sx={{
                          width: { xs: 55, md: 80 },
                          height: { xs: 55, md: 80 },
                          backgroundColor: 'white',
                          borderRadius: 3,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                          border: `3px solid ${item.color}`,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-8px) scale(1.1)',
                            boxShadow: '0 12px 48px rgba(0,0,0,0.3)',
                          },
                        }}
                      >
                        <Typography
                          variant="h2"
                          sx={{
                            fontWeight: 900,
                            color: item.color,
                            fontSize: { xs: '1.75rem', md: '2.5rem' },
                          }}
                        >
                          {item.letter}
                        </Typography>
                      </Box>
                      <Typography
                        variant="caption"
                        sx={{
                          mt: 1,
                          fontWeight: 700,
                          color: 'white',
                          fontSize: { xs: '0.65rem', md: '0.875rem' },
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                        }}
                      >
                        {item.word}
                      </Typography>
                    </Box>
                  ))}

                  {/* Badge finale "Fare Tutto!" */}
                  <Box
                    component={motion.div}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    sx={{
                      display: { xs: 'none', md: 'flex' },
                      alignItems: 'center',
                      ml: 1,
                      mb: 1,
                    }}
                  >
                    <Box
                      sx={{
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        px: 3,
                        py: 1,
                        borderRadius: 3,
                        border: '3px solid rgba(255,255,255,0.5)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          backgroundColor: 'rgba(255,255,255,0.3)',
                        },
                      }}
                    >
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 900,
                          fontSize: { md: '1.8rem' },
                          color: 'white',
                          textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                        }}
                      >
                        ⚡
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </ScrollAnimation>

            <ScrollAnimation delay={0.3}>
              <Typography variant="h6" sx={{
                mb: 4,
                opacity: 0.95,
                fontWeight: 400,
                lineHeight: 1.7,
                fontSize: { xs: '1.05rem', md: '1.3rem' },
                textAlign: 'center',
                maxWidth: '800px',
                mx: 'auto',
              }}>
                Servizi IT enterprise-grade. Soluzioni professionali per aziende che vogliono fare tutto.
              </Typography>
            </ScrollAnimation>

            <ScrollAnimation delay={0.4}>
              <Box sx={{
                display: 'flex',
                gap: 2,
                flexWrap: 'wrap',
                mb: 5,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  sx={{
                    backgroundColor: 'white',
                    color: 'primary.main',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.05rem',
                    fontWeight: 600,
                    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                  href="#ai-pricing"
                >
                  Prova l'AI Pricing
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: 'white',
                    borderWidth: 2,
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.05rem',
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: 'white',
                      borderWidth: 2,
                      backgroundColor: 'rgba(255,255,255,0.15)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                  href="#services"
                >
                  Scopri i Servizi
                </Button>
              </Box>
            </ScrollAnimation>

            <ScrollAnimation delay={0.3}>
              <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 3,
                mt: { xs: 4, md: 6 },
                width: '100%',
              }}>
                {/* Deploy Istantaneo */}
                <Paper
                  elevation={24}
                  onClick={() => handleFeatureClick('deploy')}
                  sx={{
                    p: 3,
                    backgroundColor: 'rgba(255,255,255,0.98)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 3,
                    border: '1px solid rgba(255,255,255,0.3)',
                    transition: 'all 0.3s ease',
                    flex: 1,
                    cursor: 'pointer',
                    position: 'relative',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                    }
                  }}
                >
                  <Chip
                    label="🎯 Prova la Demo!"
                    size="small"
                    sx={{
                      position: 'absolute',
                      bottom: 12,
                      right: 12,
                      bgcolor: '#F97316',
                      color: 'white',
                      fontWeight: 600,
                      animation: 'pulse 2s ease-in-out infinite',
                      '@keyframes pulse': {
                        '0%, 100%': { transform: 'scale(1)' },
                        '50%': { transform: 'scale(1.05)' },
                      },
                    }}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                    <Box sx={{
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: '#F97316',
                      color: 'white',
                      flexShrink: 0,
                    }}>
                      <Rocket sx={{ fontSize: 32 }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
                        Deploy Istantaneo
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1.5 }}>
                        Da idea a produzione in minuti
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip label="CI/CD" size="small" sx={{ bgcolor: '#FFF7ED', color: '#F97316' }} />
                        <Chip label="Auto-scaling" size="small" sx={{ bgcolor: '#FFF7ED', color: '#F97316' }} />
                      </Box>
                    </Box>
                  </Box>
                </Paper>

                {/* AI-Powered */}
                <Paper
                  elevation={24}
                  onClick={() => handleFeatureClick('ai')}
                  sx={{
                    p: 3,
                    backgroundColor: 'rgba(255,255,255,0.98)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 3,
                    border: '1px solid rgba(255,255,255,0.3)',
                    transition: 'all 0.3s ease',
                    flex: 1,
                    cursor: 'pointer',
                    position: 'relative',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                    }
                  }}
                >
                  <Chip
                    label="🤖 Prova la Demo!"
                    size="small"
                    sx={{
                      position: 'absolute',
                      bottom: 12,
                      right: 12,
                      bgcolor: '#06B6D4',
                      color: 'white',
                      fontWeight: 600,
                      animation: 'pulse 2s ease-in-out infinite',
                      '@keyframes pulse': {
                        '0%, 100%': { transform: 'scale(1)' },
                        '50%': { transform: 'scale(1.05)' },
                      },
                    }}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                    <Box sx={{
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: '#06B6D4',
                      color: 'white',
                      flexShrink: 0,
                    }}>
                      <SmartToy sx={{ fontSize: 32 }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
                        AI-Powered
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1.5 }}>
                        Automazione intelligente
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip label="ML Ops" size="small" sx={{ bgcolor: '#ECFEFF', color: '#0891B2' }} />
                        <Chip label="Predictive" size="small" sx={{ bgcolor: '#ECFEFF', color: '#0891B2' }} />
                      </Box>
                    </Box>
                  </Box>
                </Paper>

                {/* Security First */}
                <Paper
                  elevation={24}
                  onClick={() => handleFeatureClick('security')}
                  sx={{
                    p: 3,
                    backgroundColor: 'rgba(255,255,255,0.98)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 3,
                    border: '1px solid rgba(255,255,255,0.3)',
                    transition: 'all 0.3s ease',
                    flex: 1,
                    cursor: 'pointer',
                    position: 'relative',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                    }
                  }}
                >
                  <Chip
                    label="🛡️ Prova la Demo!"
                    size="small"
                    sx={{
                      position: 'absolute',
                      bottom: 12,
                      right: 12,
                      bgcolor: '#10B981',
                      color: 'white',
                      fontWeight: 600,
                      animation: 'pulse 2s ease-in-out infinite',
                      '@keyframes pulse': {
                        '0%, 100%': { transform: 'scale(1)' },
                        '50%': { transform: 'scale(1.05)' },
                      },
                    }}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                    <Box sx={{
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: '#10B981',
                      color: 'white',
                      flexShrink: 0,
                    }}>
                      <Security sx={{ fontSize: 32 }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
                        Security First
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1.5 }}>
                        Compliance enterprise
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip label="SOC 2" size="small" sx={{ bgcolor: '#ECFDF5', color: '#059669' }} />
                        <Chip label="GDPR" size="small" sx={{ bgcolor: '#ECFDF5', color: '#059669' }} />
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              </Box>
            </ScrollAnimation>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
    </>
  );
}
