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
import { ArrowForward, CheckCircle, Stars, Person, SmartToy } from '@mui/icons-material';
import ScrollAnimation from '../shared/ScrollAnimation';
import { useLanguage } from '@/contexts/LanguageContext';
import InterviewChatbot from '../shared/InterviewChatbot';

export default function CTASection() {
  const { t } = useLanguage();
  const [hoverCount, setHoverCount] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const [interviewOpen, setInterviewOpen] = useState(false);

  const BENEFITS = [
    t('cta.benefit1'),
    t('cta.benefit2'),
    t('cta.benefit3'),
    t('cta.benefit4'),
    t('cta.benefit5'),
    t('cta.benefit6'),
  ];

  const BUTTON_HOVER_MESSAGES = [
    t('cta.hover1'),
    t('cta.hover2'),
    t('cta.hover3'),
    t('cta.hover4'),
    t('cta.hover5'),
    t('cta.hover6'),
  ];

  return (
    <>
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
                    label={t('cta.badge')}
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
                    {t('cta.title')}
                  </Typography>
                  <Typography variant="h5" sx={{ mb: 4, opacity: 0.95, fontWeight: 400, lineHeight: 1.6 }}>
                    {t('cta.subtitle')}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 4, opacity: 0.8, fontStyle: 'italic', fontSize: '0.9rem' }}>
                    {t('cta.disclaimer')}
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
                      onClick={() => setInterviewOpen(true)}
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
                        },
                      }}
                    >
                      {t('cta.button')}
                    </Button>
                  </Tooltip>
                </Box>
              </ScrollAnimation>
            </Grid>

            {/* Colonna destra - Posizioni Aperte */}
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
                    {t('cta.positions.title')}
                  </Typography>

                  {/* Position 1 - Human Visionary */}
                  <Paper
                    elevation={2}
                    sx={{
                      p: 3,
                      mb: 3,
                      backgroundColor: '#FFF7ED',
                      border: '2px solid #FED7AA',
                      borderRadius: 3,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Person sx={{ fontSize: 32, color: '#F97316' }} />
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                        {t('cta.position1.title')}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                      {t('cta.position1.desc')}
                    </Typography>
                  </Paper>

                  {/* Position 2 - AI Agent */}
                  <Paper
                    elevation={2}
                    sx={{
                      p: 3,
                      mb: 3,
                      backgroundColor: '#EFF6FF',
                      border: '2px solid #BFDBFE',
                      borderRadius: 3,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <SmartToy sx={{ fontSize: 32, color: '#3B82F6' }} />
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                        {t('cta.position2.title')}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                      {t('cta.position2.desc')}
                    </Typography>
                  </Paper>

                  {/* Benefits Section */}
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: '#F97316',
                        mb: 2,
                        textAlign: 'center',
                      }}
                    >
                      {t('cta.benefits')}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {BENEFITS.map((benefit, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 1.5,
                            p: 1,
                          }}
                        >
                          <CheckCircle
                            sx={{
                              color: '#10B981',
                              fontSize: 20,
                              flexShrink: 0,
                              mt: 0.2,
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              color: 'text.primary',
                              fontWeight: 500,
                              lineHeight: 1.6,
                            }}
                          >
                            {benefit}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>

                  {/* Stats */}
                  <Box
                    sx={{
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
                      {t('cta.stats')}
                    </Typography>
                  </Box>
                </Paper>
              </ScrollAnimation>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Interview Chatbot Dialog */}
      <InterviewChatbot open={interviewOpen} onClose={() => setInterviewOpen(false)} />
    </>
  );
}
