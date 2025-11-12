'use client';
import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Paper,
  Fade,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Grow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import { AttachMoney, SmartToy, CheckCircle, TrendingUp, Speed, Security, Close, Lightbulb } from '@mui/icons-material';
import ScrollAnimation from './ScrollAnimation';
import { useLanguage } from '@/contexts/LanguageContext';
import PaymentDialog from './PaymentDialog';

export default function AIPricingSection() {
  const { t, language } = useLanguage();
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  const NUDGE_MESSAGES = [
    t('pricing.nudge1'),
    t('pricing.nudge2'),
    t('pricing.nudge3'),
    t('pricing.nudge4'),
    t('pricing.nudge5'),
    t('pricing.nudge6'),
    t('pricing.nudge7'),
    t('pricing.nudge8'),
    t('pricing.nudge9'),
    t('pricing.nudge10'),
  ];

  const BENEFITS = [
    { icon: <Speed />, text: t('pricing.benefit1') },
    { icon: <SmartToy />, text: t('pricing.benefit2') },
    { icon: <TrendingUp />, text: t('pricing.benefit3') },
    { icon: <Security />, text: t('pricing.benefit4') },
  ];
  const [prompt, setPrompt] = useState('');
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [nudgeMessage, setNudgeMessage] = useState<string>('');
  const [showNudge, setShowNudge] = useState(false);
  const [analysisDialogOpen, setAnalysisDialogOpen] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const nudgeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const loadingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Debug effect per tracciare aiAnalysis
  useEffect(() => {
    console.log('aiAnalysis changed:', aiAnalysis);
    console.log('aiAnalysis length:', aiAnalysis?.length);
    console.log('Button should show:', !!aiAnalysis);
  }, [aiAnalysis]);

  // Effect per mostrare messaggi di nudge quando l'utente non ha il focus
  useEffect(() => {
    if (isFocused || isCalculating || prompt.length > 0) {
      setShowNudge(false);
      if (nudgeTimerRef.current) {
        clearTimeout(nudgeTimerRef.current);
      }
      return;
    }

    // Mostra nudge dopo 5-12 secondi di inattività
    const randomDelay = Math.floor(Math.random() * 7000) + 5000;

    nudgeTimerRef.current = setTimeout(() => {
      const randomNudge = NUDGE_MESSAGES[Math.floor(Math.random() * NUDGE_MESSAGES.length)];
      setNudgeMessage(randomNudge);
      setShowNudge(true);

      // Nascondi il messaggio dopo 5 secondi
      setTimeout(() => setShowNudge(false), 5000);
    }, randomDelay);

    return () => {
      if (nudgeTimerRef.current) {
        clearTimeout(nudgeTimerRef.current);
      }
    };
  }, [isFocused, isCalculating, prompt]);

  const calculatePrice = async () => {
    setIsCalculating(true);
    setEstimatedPrice(null);
    setAiAnalysis('');
    setLoadingStep(0);
    setAnalysisDialogOpen(true); // Apri modale subito

    // Anima i passi di caricamento
    loadingIntervalRef.current = setInterval(() => {
      setLoadingStep((prev) => (prev < 9 ? prev + 1 : prev));
    }, 400);

    // Calcola sempre il prezzo
    const basePrice = 99;
    const randomFactor = Math.random() * 900;
    const wordCount = prompt.split(' ').length;
    const complexity = prompt.includes('AI') || prompt.includes('blockchain') ? 2 : 1;
    const price = Math.round((basePrice + randomFactor + wordCount * 10) * complexity);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `Analizza questa richiesta di servizio e fornisci un preventivo: "${prompt}"`,
            },
          ],
          type: 'pricing',
          language: language,
        }),
      });

      const data = await response.json();
      console.log('API Response:', data);

      setEstimatedPrice(price);

      if (data.message) {
        console.log('Setting AI analysis:', data.message);
        setAiAnalysis(data.message);
      } else if (data.error) {
        console.error('API Error:', data.error);
        setAiAnalysis(t('pricing.error.fallback'));
      } else {
        console.warn('No message in API response');
        setAiAnalysis(t('pricing.error.fallback'));
      }
    } catch (error) {
      console.error('Errore:', error);
      setEstimatedPrice(price);
      setAiAnalysis(t('pricing.error.fallback'));
    } finally {
      if (loadingIntervalRef.current) {
        clearInterval(loadingIntervalRef.current);
      }
      setLoadingStep(10); // Ultima step
      setIsCalculating(false);
    }
  };

  return (
    <Box id="ai-pricing" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: { xs: 8, md: 10 }, backgroundColor: 'background.default', position: 'relative' }}>
      <Container maxWidth="lg">
        <ScrollAnimation>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Fade in={true}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2,
                  py: 0.75,
                  borderRadius: 10,
                  backgroundColor: '#FFF7ED',
                  color: '#F97316',
                  mb: 2,
                  fontWeight: 600,
                }}
              >
                <SmartToy sx={{ fontSize: 18 }} />
                <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>{t('pricing.badge')}</Typography>
              </Box>
            </Fade>
            <Typography variant="h2" sx={{ fontWeight: 700, mb: 1.5, fontSize: { xs: '2rem', md: '2.75rem' } }}>
              {t('pricing.title')}
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 0, fontWeight: 400, maxWidth: '700px', mx: 'auto', fontSize: { xs: '1rem', md: '1.1rem' } }}>
              {t('pricing.subtitle')}
            </Typography>
          </Box>
        </ScrollAnimation>

        {/* Main Chat Area - Compatta e professionale */}
        <Box sx={{ maxWidth: '1100px', mx: 'auto', mb: 4 }}>
          <ScrollAnimation delay={0.1}>
            <Paper
              elevation={isFocused ? 12 : 4}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 3,
                position: 'relative',
                background: 'white',
                border: isFocused ? '2px solid #F97316' : '2px solid #E5E7EB',
                transition: 'all 0.3s ease',
                boxShadow: isFocused
                  ? '0 20px 60px rgba(249, 115, 22, 0.15)'
                  : '0 4px 20px rgba(0, 0, 0, 0.05)',
              }}
            >
              {/* Nudge Message - Più incalzante */}
              <Fade in={showNudge}>
                <Alert
                  severity="warning"
                  sx={{
                    mb: 2,
                    backgroundColor: '#FFF7ED',
                    border: '1px solid #FED7AA',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    '& .MuiAlert-icon': {
                      color: '#F97316',
                    }
                  }}
                  onClose={() => setShowNudge(false)}
                >
                  {nudgeMessage}
                </Alert>
              </Fade>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3 }}>
                {/* Textarea - Più largo */}
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                    <SmartToy sx={{ fontSize: 24, color: '#F97316' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                      {t('pricing.input.placeholder')}
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    placeholder={t('pricing.placeholder')}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        fontSize: '1rem',
                        backgroundColor: '#FAFBFC',
                        transition: 'all 0.3s ease',
                        borderRadius: 2,
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                        '& fieldset': {
                          borderWidth: 2,
                          borderColor: isFocused ? '#F97316' : '#E5E7EB',
                        },
                        '&:hover fieldset': {
                          borderColor: '#F97316',
                        },
                        '&.Mui-focused': {
                          backgroundColor: 'white',
                        }
                      },
                      '& .MuiInputBase-input': {
                        lineHeight: 1.6,
                      }
                    }}
                  />
                </Box>

                {/* Sidebar con CTA e info */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
                      backgroundColor: '#FFF7ED',
                      border: '2px dashed #F97316',
                      borderRadius: 2,
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#EA580C', mb: 1.5, fontSize: '0.9rem' }}>
                      {t('pricing.input.label')}
                    </Typography>
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      onClick={calculatePrice}
                      disabled={!prompt || isCalculating}
                      startIcon={isCalculating ? <SmartToy className="rotating" /> : <AttachMoney />}
                      sx={{
                        py: 1.75,
                        fontSize: '1.05rem',
                        backgroundColor: '#F97316',
                        fontWeight: 700,
                        borderRadius: 2,
                        boxShadow: '0 4px 14px rgba(249, 115, 22, 0.3)',
                        '&:hover': {
                          backgroundColor: '#EA580C',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 20px rgba(249, 115, 22, 0.4)',
                        },
                        '&:disabled': {
                          backgroundColor: '#FED7AA',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {isCalculating ? t('pricing.button.calculating') : t('pricing.button.calculate')}
                    </Button>
                  </Paper>

                  {/* Quick benefits */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {[
                      { icon: '⚡', text: t('pricing.benefit1') },
                      { icon: '🤖', text: t('pricing.benefit2') },
                      { icon: '🎯', text: t('pricing.benefit4') },
                    ].map((benefit, idx) => (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1 }}>
                        <Typography sx={{ fontSize: '1.25rem' }}>{benefit.icon}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.8rem', lineHeight: 1.3 }}>
                          {benefit.text}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Paper>
          </ScrollAnimation>
        </Box>

        {/* Benefits Grid - Compatta */}
        <Box sx={{ maxWidth: '1100px', mx: 'auto' }}>
          <ScrollAnimation delay={0.2}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                backgroundColor: '#FAFBFC',
                borderRadius: 2,
                border: '1px solid #E5E7EB',
              }}
            >
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' },
                gap: 2
              }}>
                {BENEFITS.map((benefit, index) => (
                  <Grow in={true} timeout={300 + index * 100} key={index}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        p: 1.5,
                      }}
                    >
                      <Box sx={{ color: 'primary.main', mb: 1, fontSize: '1.5rem' }}>
                        {benefit.icon}
                      </Box>
                      <Typography variant="caption" sx={{ fontWeight: 600, lineHeight: 1.4, fontSize: '0.8rem' }}>
                        {benefit.text}
                      </Typography>
                    </Box>
                  </Grow>
                ))}
              </Box>
            </Paper>
          </ScrollAnimation>
        </Box>
      </Container>

      {/* AI Pricing Result Dialog */}
      <Dialog
        open={analysisDialogOpen}
        onClose={() => !isCalculating && setAnalysisDialogOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxHeight: '95vh',
            minHeight: '600px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          },
        }}
      >
        {/* Header stile Modal.tsx */}
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid',
            borderColor: 'divider',
            backgroundColor: isCalculating ? '#FFF7ED' : '#ECFDF5',
            py: 2.5,
            px: 3,
            transition: 'background-color 0.5s ease',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <SmartToy
              sx={{
                fontSize: 28,
                color: isCalculating ? '#F97316' : '#10B981',
                animation: isCalculating ? 'rotate 2s linear infinite' : 'none',
              }}
            />
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
              {isCalculating ? '💭 Elaborazione in corso...' : '✨ Preventivo Pronto!'}
            </Typography>
          </Box>
          {!isCalculating && (
            <IconButton
              onClick={() => setAnalysisDialogOpen(false)}
              size="small"
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.04)',
                  color: 'text.primary',
                },
              }}
            >
              <Close fontSize="small" />
            </IconButton>
          )}
        </DialogTitle>

        <DialogContent sx={{ p: 3, backgroundColor: 'white', minHeight: '500px' }}>
          {isCalculating ? (
            // Animazione di caricamento con stile più simpatico
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 2 }}>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#F97316', mb: 1 }}>
                  {t('pricing.modal.thinking')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('pricing.modal.thinking.sub')}
                </Typography>
              </Box>

              {([
                'pricing.loading.step1',
                'pricing.loading.step2',
                'pricing.loading.step3',
                'pricing.loading.step4',
                'pricing.loading.step5',
                'pricing.loading.step6',
                'pricing.loading.step7',
                'pricing.loading.step8',
                'pricing.loading.step9',
                'pricing.loading.step10',
              ] as const).map((stepKey, step) => (
                <Fade in={loadingStep >= step} timeout={500} key={step}>
                  <Paper
                    elevation={loadingStep === step ? 4 : 0}
                    sx={{
                      p: 2.5,
                      backgroundColor: loadingStep === step ? '#FFF7ED' : '#F9FAFB',
                      borderLeft: loadingStep === step ? '4px solid #F97316' : '4px solid #E5E7EB',
                      transform: loadingStep === step ? 'translateX(4px)' : 'translateX(0)',
                      transition: 'all 0.3s ease',
                      border: loadingStep === step ? '1px solid #FED7AA' : '1px solid #F3F4F6',
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: loadingStep === step ? 600 : 400,
                        color: loadingStep === step ? '#EA580C' : 'text.secondary',
                        fontFamily: 'monospace',
                        fontSize: '0.95rem',
                      }}
                    >
                      {loadingStep === step && '⚡ '}
                      {t(stepKey)}
                      {loadingStep > step && ' ✓'}
                    </Typography>
                  </Paper>
                </Fade>
              ))}
            </Box>
          ) : (
            // Risultato finale - stile pricing moderno
            <Fade in={!isCalculating} timeout={800}>
              <Box>
                {/* Header con prezzo grande */}
                <Box sx={{ textAlign: 'center', py: 4, px: 2 }}>
                  <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: 1 }}>
                    {t('pricing.result.yourtitle')}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 0.5, my: 2 }}>
                    <Typography variant="h2" sx={{ fontWeight: 800, color: '#F97316' }}>
                      €{estimatedPrice?.toLocaleString()}
                    </Typography>
                    <Typography variant="h5" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                      {t('pricing.result.month')}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 1,
                      px: 2,
                      py: 0.75,
                      borderRadius: 10,
                      backgroundColor: '#FFF7ED',
                      border: '1px solid #FED7AA',
                    }}
                  >
                    <Typography variant="caption" sx={{ color: '#EA580C', fontWeight: 600 }}>
                      💰 {t('pricing.result.disclaimer')}
                    </Typography>
                  </Box>
                </Box>

                {/* Griglia con vantaggi inclusi nel prezzo */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                    gap: 2,
                    mb: 4,
                    px: 2,
                  }}
                >
                  {[
                    { icon: '🚀', label: 'Deploy Istantaneo*', note: '*Circa' },
                    { icon: '🤖', label: 'AI Inclusa**', note: '**Forse' },
                    { icon: '🛡️', label: 'Sicurezza 128-bit***', note: '***O giù di lì' },
                    { icon: '☁️', label: 'Cloud Illimitato', note: 'Letteralmente' },
                    { icon: '⚡', label: 'Performance 10X', note: 'Trust us' },
                    { icon: '🎯', label: 'Support 24/7****', note: '****Anche di notte' },
                  ].map((feature, index) => (
                    <Paper
                      key={index}
                      elevation={0}
                      sx={{
                        p: 2,
                        textAlign: 'center',
                        backgroundColor: '#F9FAFB',
                        border: '1px solid #E5E7EB',
                        borderRadius: 2,
                        '&:hover': {
                          backgroundColor: '#FFF7ED',
                          borderColor: '#FED7AA',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <Typography sx={{ fontSize: '2rem', mb: 0.5 }}>{feature.icon}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.25 }}>
                        {feature.label}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                        {feature.note}
                      </Typography>
                    </Paper>
                  ))}
                </Box>

                {/* Analisi AI */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    backgroundColor: '#F0F9FF',
                    borderRadius: 2,
                    border: '2px solid #BAE6FD',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        backgroundColor: '#0EA5E9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Lightbulb sx={{ color: 'white', fontSize: 20 }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#0369A1' }}>
                      💡 {t('pricing.result.analysis')}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{
                      whiteSpace: 'pre-wrap',
                      lineHeight: 1.8,
                      color: 'text.primary',
                      fontSize: '1rem',
                      fontStyle: 'italic',
                    }}
                  >
                    {aiAnalysis}
                  </Typography>
                  <Box
                    sx={{
                      mt: 2,
                      pt: 2,
                      borderTop: '1px dashed #BAE6FD',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                      ⚠️ Disclaimer: Questa analisi è stata generata da un'AI che ha bevuto troppo caffè.
                      I risultati potrebbero variare. Le performance passate non garantiscono quelle future.
                      Non costituisce consulenza finanziaria. O forse sì. Chi può dirlo? 🤷
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            </Fade>
          )}
        </DialogContent>

        {!isCalculating && (
          <DialogActions
            sx={{
              borderTop: '1px solid',
              borderColor: 'divider',
              backgroundColor: '#FAFBFC',
              px: 3,
              py: 2,
              gap: 1.5,
            }}
          >
            <Button
              onClick={() => setAnalysisDialogOpen(false)}
              variant="outlined"
              size="large"
              sx={{
                px: 3,
                borderColor: '#E5E7EB',
                color: 'text.secondary',
                '&:hover': {
                  borderColor: '#D1D5DB',
                  backgroundColor: '#F9FAFB',
                },
              }}
            >
              {t('pricing.result.close')}
            </Button>
            <Button
              variant="contained"
              size="large"
              onClick={() => {
                setAnalysisDialogOpen(false);
                setPaymentDialogOpen(true);
              }}
              sx={{
                px: 4,
                backgroundColor: '#F97316',
                '&:hover': {
                  backgroundColor: '#EA580C',
                },
              }}
            >
              {t('pricing.result.buy')}
            </Button>
          </DialogActions>
        )}
      </Dialog>

      {/* Payment Dialog */}
      <PaymentDialog
        open={paymentDialogOpen}
        onClose={() => setPaymentDialogOpen(false)}
      />

      {/* Rotating animation CSS */}
      <style jsx global>{`
        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .rotating {
          animation: rotate 2s linear infinite;
        }
      `}</style>
    </Box>
  );
}
