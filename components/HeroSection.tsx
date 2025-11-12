'use client';
import { useState } from 'react';
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
  Alert,
} from '@mui/material';
import {
  Rocket,
  SmartToy,
  Security,
  ArrowForward,
} from '@mui/icons-material';
import ScrollAnimation from './ScrollAnimation';
import FeatureDemo from './FeatureDemo';
import FeatureCard from './FeatureCard';
import PaymentDialog from './PaymentDialog';
import { useLanguage } from '@/contexts/LanguageContext';

const stats = [
  { value: '99.99%', label: 'Uptime' },
  { value: '24/7', label: 'Support' },
  { value: '∞', label: 'Scalabilità' },
  { value: '0', label: 'Limiti' },
];

export default function HeroSection() {
  const { t, language } = useLanguage();
  const [demoOpen, setDemoOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<'deploy' | 'ai' | 'security' | null>(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  const handleFeatureClick = (feature: 'deploy' | 'ai' | 'security') => {
    setSelectedFeature(feature);
    setDemoOpen(true);
  };
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <>
      <FeatureDemo
        open={demoOpen}
        onClose={() => setDemoOpen(false)}
        feature={selectedFeature}
        onOpenPricing={() => setPaymentDialogOpen(true)}
      />
      <PaymentDialog
        open={paymentDialogOpen}
        onClose={() => setPaymentDialogOpen(false)}
      />
      <Box
        sx={{
        background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C5A 50%, #FFA07A 100%)',
        color: 'white',
        minHeight: { xs: 'auto', md: 'calc(100vh - 80px)' },
        display: 'flex',
        alignItems: 'center',
        pt: { xs: 16, md: 12 },
        pb: { xs: 6, md: 8 },
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
                    { letter: 'U', word: 'Una', color: '#004E89', delay: 0 },
                    { letter: 'A', word: 'Azienda', color: '#1A6BA5', delay: 0.1 },
                  ].map((item, index) => (
                    <Box
                      key={item.letter}
                      sx={{
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        animation: `slideInUp 0.8s ease-out ${item.delay}s both`,
                        '@keyframes slideInUp': {
                          '0%': {
                            opacity: 0,
                            transform: 'translateY(40px)',
                          },
                          '100%': {
                            opacity: 1,
                            transform: 'translateY(0)',
                          },
                        },
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
                          animation: `float 3s ease-in-out ${item.delay + 1}s infinite`,
                          '&:hover': {
                            transform: 'scale(1.1) rotate(5deg)',
                            boxShadow: `0 12px 40px ${item.color}40`,
                          },
                          '@keyframes float': {
                            '0%, 100%': {
                              transform: 'translateY(0)',
                            },
                            '50%': {
                              transform: 'translateY(-10px)',
                            },
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
                    sx={{
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      animation: 'scaleIn 0.6s ease-out 0.2s both',
                      '@keyframes scaleIn': {
                        '0%': {
                          opacity: 0,
                          transform: 'scale(0.5)',
                        },
                        '100%': {
                          opacity: 1,
                          transform: 'scale(1)',
                        },
                      },
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
                        animation: 'pulse-glow 2s ease-in-out 1.2s infinite',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          backgroundColor: 'rgba(255,255,255,0.25)',
                        },
                        '@keyframes pulse-glow': {
                          '0%, 100%': {
                            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                          },
                          '50%': {
                            boxShadow: '0 12px 48px rgba(255,255,255,0.5)',
                          },
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
                    { letter: 'F', word: 'Fare', color: '#3B82F6', delay: 0.3 },
                    { letter: 'T', word: 'Tutto', color: '#2563EB', delay: 0.4 },
                  ].map((item) => (
                    <Box
                      key={item.letter}
                      sx={{
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        animation: `slideInUp 0.8s ease-out ${item.delay}s both`,
                        '@keyframes slideInUp': {
                          '0%': {
                            opacity: 0,
                            transform: 'translateY(40px)',
                          },
                          '100%': {
                            opacity: 1,
                            transform: 'translateY(0)',
                          },
                        },
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
                          animation: `float 3s ease-in-out ${item.delay + 1.3}s infinite`,
                          '&:hover': {
                            transform: 'scale(1.1) rotate(-5deg)',
                            boxShadow: `0 12px 40px ${item.color}40`,
                          },
                          '@keyframes float': {
                            '0%, 100%': {
                              transform: 'translateY(0)',
                            },
                            '50%': {
                              transform: 'translateY(-10px)',
                            },
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
                    sx={{
                      display: { xs: 'none', md: 'flex' },
                      alignItems: 'center',
                      ml: 1,
                      mb: 1,
                      animation: 'bounceIn 0.8s ease-out 0.5s both',
                      '@keyframes bounceIn': {
                        '0%': {
                          opacity: 0,
                          transform: 'scale(0)',
                        },
                        '50%': {
                          transform: 'scale(1.2)',
                        },
                        '100%': {
                          opacity: 1,
                          transform: 'scale(1)',
                        },
                      },
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
                        animation: 'electric-pulse 1.5s ease-in-out 1.5s infinite',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.35)',
                          transform: 'scale(1.15) rotate(10deg)',
                          boxShadow: '0 12px 48px rgba(255,255,255,0.6)',
                        },
                        '@keyframes electric-pulse': {
                          '0%, 100%': {
                            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                            filter: 'brightness(1)',
                          },
                          '50%': {
                            boxShadow: '0 12px 48px rgba(255,255,255,0.8), 0 0 30px rgba(255,255,255,0.6)',
                            filter: 'brightness(1.3)',
                          },
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
                          animation: 'glow-text 1.5s ease-in-out 1.5s infinite',
                          '@keyframes glow-text': {
                            '0%, 100%': {
                              textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                            },
                            '50%': {
                              textShadow: '0 0 20px rgba(255,255,255,0.9), 0 0 30px rgba(255,255,255,0.6)',
                            },
                          },
                        }}
                      >
                        ⚡
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </ScrollAnimation>

            {language === 'en' && t('hero.acronym.note') && (
              <ScrollAnimation delay={0.25}>
                <Alert
                  severity="info"
                  sx={{
                    mb: 3,
                    maxWidth: '700px',
                    mx: 'auto',
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(10px)',
                    '& .MuiAlert-icon': {
                      color: '#0891B2',
                    },
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {t('hero.acronym.note')}
                  </Typography>
                </Alert>
              </ScrollAnimation>
            )}

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
                {t('hero.subtitle')}
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
                    },
                  }}
                  href="#ai-pricing"
                >
                  {t('hero.cta.primary')}
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
                    },
                  }}
                  href="#services"
                >
                  {t('hero.cta.secondary')}
                </Button>
              </Box>
            </ScrollAnimation>

            <ScrollAnimation delay={0.3}>
              <Grid container spacing={3} sx={{ mt: { xs: 2, md: 4 } }}>
                {/* Deploy Istantaneo */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <FeatureCard
                    icon={Rocket}
                    title={t('hero.feature.deploy')}
                    description={t('hero.feature.deploy.desc')}
                    badge={`🎯 ${t('hero.demo.badge')}`}
                    color="#F97316"
                    onClick={() => handleFeatureClick('deploy')}
                  />
                </Grid>

                {/* AI-Powered */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <FeatureCard
                    icon={SmartToy}
                    title={t('hero.feature.ai')}
                    description={t('hero.feature.ai.desc')}
                    badge={`🤖 ${t('hero.demo.badge')}`}
                    color="#06B6D4"
                    onClick={() => handleFeatureClick('ai')}
                  />
                </Grid>

                {/* Security First */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <FeatureCard
                    icon={Security}
                    title={t('hero.feature.security')}
                    description={t('hero.feature.security.desc')}
                    badge={`🛡️ ${t('hero.demo.badge')}`}
                    color="#10B981"
                    onClick={() => handleFeatureClick('security')}
                  />
                </Grid>
              </Grid>
            </ScrollAnimation>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
    </>
  );
}
