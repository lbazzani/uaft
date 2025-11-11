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
} from '@mui/material';
import { AttachMoney, SmartToy, CheckCircle, TrendingUp, Speed, Security } from '@mui/icons-material';
import ScrollAnimation from './ScrollAnimation';

const NUDGE_MESSAGES = [
  '💡 Psst! La nostra AI sta aspettando di stupir ti con un preventivo super accurato... (o quasi)!',
  '🎯 Dai, scrivi qualcosa! Anche "voglio conquistare il mondo" va benissimo. Abbiamo un servizio anche per quello!',
  '⏰ Fun fact: ogni secondo che passa senza richiedere un preventivo è un secondo perso. Probabilmente.',
  '🚀 La nostra AI si sta annoiando... Dalle qualcosa da fare! È addestrata per calcolare prezzi incredibili!',
  '💼 Non essere timido! Descrivici il tuo progetto. Spoiler: costa meno di quello che pensi. (Forse)',
  '📊 Il 94% degli utenti che NON richiedono un preventivo si pentono. È una statistica che ci siamo inventati ora.',
  '🎪 Offerta speciale: se scrivi qualcosa nei prossimi 30 secondi... beh, non cambia nulla ma sembra più urgente!',
  '🤔 Ancora lì a pensare? L\'AI è già pronta! È velocissima! (A calcolare prezzi, non a fare caffè)',
  '✨ Pro tip: più parole usi nella descrizione, più il prezzo sembra professionale. È scienza!',
  '🎯 Coraggio! Cosa potrebbe andare storto? (A parte tutto, ma siamo ottimisti)',
];

const BENEFITS = [
  { icon: <Speed />, text: 'Preventivo istantaneo in 2 secondi' },
  { icon: <SmartToy />, text: 'Analisi AI avanzata (davvero!)' },
  { icon: <TrendingUp />, text: 'Prezzi competitivi* (*per noi)' },
  { icon: <Security />, text: 'Accuratezza al 99%** (**±50%)' },
];

export default function AIPricingSection() {
  const [prompt, setPrompt] = useState('');
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [nudgeMessage, setNudgeMessage] = useState<string>('');
  const [showNudge, setShowNudge] = useState(false);
  const nudgeTimerRef = useRef<NodeJS.Timeout | null>(null);

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
        }),
      });

      const data = await response.json();

      const basePrice = 99;
      const randomFactor = Math.random() * 900;
      const wordCount = prompt.split(' ').length;
      const complexity = prompt.includes('AI') || prompt.includes('blockchain') ? 2 : 1;
      const price = Math.round((basePrice + randomFactor + wordCount * 10) * complexity);

      setEstimatedPrice(price);
      if (data.message) {
        setAiAnalysis(data.message);
      }
    } catch (error) {
      console.error('Errore:', error);
      const basePrice = 99;
      const randomFactor = Math.random() * 900;
      const wordCount = prompt.split(' ').length;
      const complexity = prompt.includes('AI') || prompt.includes('blockchain') ? 2 : 1;
      const price = Math.round((basePrice + randomFactor + wordCount * 10) * complexity);
      setEstimatedPrice(price);
      setAiAnalysis('L\'analisi AI non è disponibile al momento, ma il prezzo è comunque accurato al 99%! (O forse meno)');
    } finally {
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
                <Typography variant="body2">Powered by Advanced AI</Typography>
              </Box>
            </Fade>
            <Typography variant="h2" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
              AI Pricing Engine
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4, fontWeight: 400, maxWidth: '800px', mx: 'auto' }}>
              Descrivi il servizio che ti serve, la nostra AI analizzerà la richiesta e
              calcolerà un preventivo in tempo reale. Magicamente accurato!
            </Typography>
          </Box>
        </ScrollAnimation>

        <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' }, alignItems: 'flex-start' }}>
          {/* Colonna sinistra - Benefits */}
          <Box sx={{ flex: 1 }}>
            <ScrollAnimation delay={0.1}>
              <Paper elevation={3} sx={{ p: 4, borderRadius: 4, backgroundColor: 'white' }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                  Perché usare il nostro AI Pricing?
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
                    🎉 Offerta Speciale!
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Richiedi un preventivo ora e riceverai... un preventivo!
                    È esattamente quello che ti aspettavi, ma con stile!
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
                  placeholder="Esempio: Voglio un'app che gestisce inventory con ML predictions, real-time analytics e mobile app..."
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
                  {isCalculating ? 'L\'AI sta pensando intensamente...' : 'Calcola il Prezzo Magico ✨'}
                </Button>

                {estimatedPrice !== null && (
                  <Fade in={true}>
                    <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <Box
                        sx={{
                          p: 4,
                          backgroundColor: '#F97316',
                          color: 'white',
                          borderRadius: 3,
                          textAlign: 'center',
                          boxShadow: '0 8px 32px rgba(249, 115, 22, 0.3)',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
                          <CheckCircle />
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Preventivo Calcolato!
                          </Typography>
                        </Box>
                        <Typography variant="h2" sx={{ fontWeight: 800, my: 2 }}>
                          €{estimatedPrice.toLocaleString()}<Typography component="span" variant="h5">/mese</Typography>
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          Prezzo basato su analisi AI, algoritmi proprietari, e un pizzico di magia nera
                        </Typography>
                      </Box>

                      {aiAnalysis && (
                        <Paper
                          elevation={0}
                          sx={{
                            p: 3,
                            backgroundColor: '#F0F9FF',
                            border: '2px solid #06B6D4',
                            borderRadius: 3,
                          }}
                        >
                          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600, color: '#0891B2' }}>
                            <SmartToy /> Analisi dell'AI
                          </Typography>
                          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, color: 'text.primary' }}>
                            {aiAnalysis}
                          </Typography>
                        </Paper>
                      )}
                    </Box>
                  </Fade>
                )}
              </Paper>
            </ScrollAnimation>
          </Box>
        </Box>
      </Container>

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
