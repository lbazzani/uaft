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

export default function AIPricingSection() {
  const { t, language } = useLanguage();

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
    <Box id="ai-pricing" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: { xs: 10, md: 15 }, backgroundColor: 'background.default', position: 'relative' }}>
      <Container maxWidth="lg">
        <ScrollAnimation>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Fade in={true}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2,
                  py: 1,
                  borderRadius: 10,
                  backgroundColor: '#FFF7ED',
                  color: '#F97316',
                  mb: 3,
                  fontWeight: 600,
                }}
              >
                <SmartToy sx={{ fontSize: 20 }} />
                <Typography variant="body2">{t('pricing.badge')}</Typography>
              </Box>
            </Fade>
            <Typography variant="h2" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
              {t('pricing.title')}
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4, fontWeight: 400, maxWidth: '800px', mx: 'auto' }}>
              {t('pricing.subtitle')}
            </Typography>
          </Box>
        </ScrollAnimation>

        <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' }, alignItems: 'flex-start' }}>
          {/* Colonna sinistra - Benefits */}
          <Box sx={{ flex: 1 }}>
            <ScrollAnimation delay={0.1}>
              <Paper elevation={3} sx={{ p: 4, borderRadius: 4, backgroundColor: 'white' }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                  {t('pricing.benefits.title')}
                </Typography>
                <List>
                  {BENEFITS.map((benefit, index) => (
                    <Grow in={true} timeout={500 + index * 200} key={index}>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon sx={{ color: 'primary.main', minWidth: 40 }}>
                          {benefit.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={benefit.text}
                          primaryTypographyProps={{
                            fontWeight: 500,
                            fontSize: '1rem',
                          }}
                        />
                      </ListItem>
                    </Grow>
                  ))}
                </List>

                <Box sx={{ mt: 4, p: 3, backgroundColor: '#FFF7ED', borderRadius: 2, border: '2px solid #F97316' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#EA580C', mb: 1 }}>
                    {t('pricing.special.title')}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {t('pricing.special.desc')}
                  </Typography>
                </Box>
              </Paper>
            </ScrollAnimation>
          </Box>

          {/* Colonna destra - Form */}
          <Box sx={{ flex: 1.2 }}>
            <ScrollAnimation delay={0.2}>
              <Paper elevation={8} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, position: 'relative' }}>
                {/* Nudge Message */}
                <Fade in={showNudge}>
                  <Alert
                    severity="info"
                    sx={{
                      mb: 3,
                      backgroundColor: '#E0F2FE',
                      '& .MuiAlert-icon': {
                        color: '#0891B2',
                      }
                    }}
                    onClose={() => setShowNudge(false)}
                  >
                    {nudgeMessage}
                  </Alert>
                </Fade>

                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  variant="outlined"
                  placeholder={t('pricing.placeholder')}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      fontSize: '1.1rem',
                      backgroundColor: isFocused ? '#FFFBF5' : 'white',
                      transition: 'background-color 0.3s ease',
                      '&:hover': {
                        backgroundColor: '#FFFBF5',
                      }
                    }
                  }}
                />

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={calculatePrice}
                  disabled={!prompt || isCalculating}
                  startIcon={isCalculating ? <SmartToy className="rotating" /> : <AttachMoney />}
                  sx={{
                    py: 2,
                    fontSize: '1.1rem',
                    backgroundColor: '#F97316',
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: '#EA580C',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 24px rgba(249, 115, 22, 0.3)',
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
            </ScrollAnimation>
          </Box>
        </Box>
      </Container>

      {/* AI Pricing Result Dialog */}
      <Dialog
        open={analysisDialogOpen}
        onClose={() => !isCalculating && setAnalysisDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            maxHeight: '90vh',
            minHeight: '500px',
          },
        }}
      >
        <DialogTitle
          sx={{
            background: isCalculating
              ? 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)'
              : 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 3,
            transition: 'background 0.5s ease',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <SmartToy sx={{ fontSize: 32, animation: isCalculating ? 'rotate 2s linear infinite' : 'none' }} />
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {isCalculating ? t('pricing.button.calculating') : t('pricing.result.title')}
            </Typography>
          </Box>
          {!isCalculating && (
            <IconButton onClick={() => setAnalysisDialogOpen(false)} sx={{ color: 'white' }}>
              <Close />
            </IconButton>
          )}
        </DialogTitle>

        <DialogContent sx={{ p: 4, backgroundColor: '#F0F9FF', minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
          {isCalculating ? (
            // Animazione di caricamento
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, justifyContent: 'center' }}>
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
                    elevation={loadingStep === step ? 8 : 2}
                    sx={{
                      p: 2,
                      backgroundColor: loadingStep === step ? '#FFF7ED' : 'white',
                      borderLeft: loadingStep === step ? '4px solid #F97316' : '4px solid transparent',
                      transform: loadingStep === step ? 'scale(1.02)' : 'scale(1)',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: loadingStep === step ? 600 : 400,
                        color: loadingStep === step ? '#F97316' : 'text.secondary',
                        fontFamily: 'monospace',
                      }}
                    >
                      {t(stepKey)}
                    </Typography>
                  </Paper>
                </Fade>
              ))}
            </Box>
          ) : (
            // Risultato finale
            <Fade in={!isCalculating} timeout={800}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Prezzo */}
                <Paper
                  elevation={8}
                  sx={{
                    p: 4,
                    background: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)',
                    color: 'white',
                    borderRadius: 3,
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 2, opacity: 0.9 }}>
                    {t('pricing.result.title')}
                  </Typography>
                  <Typography variant="h2" sx={{ fontWeight: 800, mb: 1 }}>
                    €{estimatedPrice?.toLocaleString()}<Typography component="span" variant="h5">{t('pricing.result.month')}</Typography>
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.9rem' }}>
                    {t('pricing.result.disclaimer')}
                  </Typography>
                </Paper>

                {/* Analisi AI */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    backgroundColor: 'white',
                    borderRadius: 3,
                    border: '2px solid #06B6D4',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Lightbulb sx={{ color: '#F97316' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#0891B2' }}>
                      {t('pricing.result.analysis')}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{
                      whiteSpace: 'pre-wrap',
                      lineHeight: 1.8,
                      color: 'text.primary',
                      fontSize: '1.05rem',
                    }}
                  >
                    {aiAnalysis}
                  </Typography>
                </Paper>
              </Box>
            </Fade>
          )}
        </DialogContent>

        {!isCalculating && (
          <DialogActions sx={{ p: 3, backgroundColor: 'white' }}>
            <Button
              onClick={() => setAnalysisDialogOpen(false)}
              variant="contained"
              size="large"
              sx={{
                backgroundColor: '#10B981',
                px: 4,
                '&:hover': {
                  backgroundColor: '#059669',
                },
              }}
            >
              {t('demo.close')}
            </Button>
          </DialogActions>
        )}
      </Dialog>

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
