'use client';
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Paper,
  Chip,
  TextField,
  InputAdornment,
  Divider,
  Alert,
  Zoom,
} from '@mui/material';
import {
  Close,
  CreditCard,
  Lock,
  TrendingUp,
  CheckCircle,
  Star,
  Rocket,
} from '@mui/icons-material';

interface PaymentDialogProps {
  open: boolean;
  onClose: () => void;
  selectedService?: 'cloud' | 'ai' | 'security' | 'speed' | 'code' | 'deploy' | null;
}

interface PricingPlan {
  id: string;
  name: string;
  basePrice: number;
  features: string[];
  icon: React.ReactElement;
  color: string;
  badge?: string;
}

const PLANS: PricingPlan[] = [
  {
    id: 'basic',
    name: 'Base',
    basePrice: 99,
    features: [
      'Deploy quando capita',
      'Support via email (risposta in 3-5 giorni lavorativi)',
      'Documentazione (se la troviamo)',
      '1 bug fix al mese*',
      'Coffee break incluso (virtuale)',
    ],
    icon: <Star />,
    color: '#6B7280',
  },
  {
    id: 'standard',
    name: 'Standard',
    basePrice: 299,
    features: [
      'Deploy quasi istantaneo',
      'Support 24/7* (*nei giorni che finiamo con "dì")',
      'Documentazione completa (forse)',
      '5 bug fix al mese',
      'Consulenza strategica (15 minuti)',
      'Dashboard con grafici inutili',
    ],
    icon: <CheckCircle />,
    color: '#3B82F6',
    badge: 'Più Popolare',
  },
  {
    id: 'enterprise',
    name: 'Super Enterprise',
    basePrice: 999,
    features: [
      'Deploy istantaneo garantito*',
      'Support 25/8 (abbiamo trovato ore extra)',
      'Documentazione scritta da copywriter professionisti',
      'Bug fix illimitati (anche quelli che non esistono)',
      'Consulenza strategica daily',
      'Dashboard con ML che prevede quando vorrai caffè',
      'Dedicated account manager (che ti chiama anche il weekend)',
      'Logo sulla nostra homepage',
    ],
    icon: <Rocket />,
    color: '#F59E0B',
    badge: 'CEO Choice',
  },
];

const PAYMENT_MESSAGES = [
  'Non preoccuparti, accettiamo anche carte scadute!',
  'I tuoi dati sono sicuri (probabilmente)',
  'Transazione crittografata con algoritmo militare (Excel password)',
  'SSL Certificate: Sì (l\'abbiamo comprato su eBay)',
  'Politica rimborsi: 100% garantita* (*nei primi 0.5 secondi)',
];

const SERVICE_NAMES: Record<string, string> = {
  cloud: 'Cloud as a Cloud',
  ai: 'AI Artificialmente Intelligente',
  security: 'Sicurezza Esagerata',
  speed: 'Velocità Supersonica',
  code: 'Codice Automagico',
  deploy: 'Deploy Istantaneo',
};

export default function PaymentDialog({ open, onClose, selectedService }: PaymentDialogProps) {
  const [selectedPlan, setSelectedPlan] = useState<string>('standard');
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);
  const [paymentStep, setPaymentStep] = useState<'plans' | 'payment' | 'success'>('plans');
  const [messageIndex, setMessageIndex] = useState(0);
  const [priceIncreaseCount, setPriceIncreaseCount] = useState(0);

  useEffect(() => {
    // Inizializza i prezzi base
    const initialPrices: Record<string, number> = {};
    PLANS.forEach(plan => {
      initialPrices[plan.id] = plan.basePrice;
    });
    setPrices(initialPrices);
  }, []);

  useEffect(() => {
    if (paymentStep === 'payment') {
      // Rotazione messaggi ogni 3 secondi
      const timer = setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % PAYMENT_MESSAGES.length);
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [paymentStep]);

  const handlePlanHover = (planId: string) => {
    setHoveredPlan(planId);
    // Aumenta il prezzo del 15-25% quando hover
    setPrices(prev => ({
      ...prev,
      [planId]: Math.round(prev[planId] * (1 + Math.random() * 0.1 + 0.15)),
    }));
    setPriceIncreaseCount(prev => prev + 1);
  };

  const handlePlanLeave = (planId: string) => {
    setHoveredPlan(null);
  };

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    setPaymentStep('payment');
  };

  const handlePaymentSubmit = () => {
    setPaymentStep('success');
    setTimeout(() => {
      onClose();
      // Reset dopo chiusura
      setTimeout(() => {
        setPaymentStep('plans');
        setPriceIncreaseCount(0);
      }, 500);
    }, 4000);
  };

  const handleDialogClose = () => {
    if (paymentStep === 'success') {
      return; // Non permettere chiusura durante success
    }
    onClose();
    // Reset
    setTimeout(() => {
      setPaymentStep('plans');
      setPriceIncreaseCount(0);
    }, 500);
  };

  const selectedPlanData = PLANS.find(p => p.id === selectedPlan);

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          minHeight: '70vh',
        },
      }}
    >
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C5A 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 3,
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
            {paymentStep === 'plans' && '💳 Scegli il Tuo Piano'}
            {paymentStep === 'payment' && '🔒 Checkout Sicuro*'}
            {paymentStep === 'success' && '🎉 Congratulazioni!'}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.95 }}>
            {paymentStep === 'plans' && 'Prezzi dinamici basati sul tuo livello di interesse'}
            {paymentStep === 'payment' && '*Sicurezza non garantita, ma ci proviamo'}
            {paymentStep === 'success' && 'Hai fatto la scelta giusta (forse)'}
          </Typography>
        </Box>
        {paymentStep !== 'success' && (
          <IconButton onClick={handleDialogClose} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        )}
      </DialogTitle>

      <DialogContent sx={{ p: 4, backgroundColor: '#FAFBFC' }}>
        {paymentStep === 'plans' && (
          <>
            {priceIncreaseCount > 3 && (
              <Alert severity="warning" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  📊 Nota: Abbiamo notato {priceIncreaseCount} aumenti di prezzo.
                  Questo è completamente normale e fa parte della nostra "strategia di pricing dinamico"
                  (leggi: i prezzi aumentano quando ci passi il mouse sopra)
                </Typography>
              </Alert>
            )}

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
              {PLANS.map((plan) => (
                <Paper
                  key={plan.id}
                  elevation={hoveredPlan === plan.id ? 12 : 4}
                  onMouseEnter={() => handlePlanHover(plan.id)}
                  onMouseLeave={() => handlePlanLeave(plan.id)}
                  sx={{
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    cursor: 'pointer',
                    border: selectedPlan === plan.id ? `3px solid ${plan.color}` : '3px solid transparent',
                    transition: 'all 0.3s ease',
                    transform: hoveredPlan === plan.id ? 'scale(1.05) translateY(-8px)' : 'scale(1)',
                    '&:hover': {
                      boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
                    },
                  }}
                  onClick={() => handleSelectPlan(plan.id)}
                >
                  {plan.badge && (
                    <Chip
                      label={plan.badge}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: -12,
                        right: 20,
                        backgroundColor: plan.color,
                        color: 'white',
                        fontWeight: 600,
                      }}
                    />
                  )}

                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: 3,
                      backgroundColor: `${plan.color}20`,
                      color: plan.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                    }}
                  >
                    {plan.icon}
                  </Box>

                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                    {plan.name}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 2 }}>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: plan.color }}>
                      €{prices[plan.id] || plan.basePrice}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      /mese
                    </Typography>
                    {hoveredPlan === plan.id && (
                      <Zoom in>
                        <Chip
                          icon={<TrendingUp />}
                          label="+15%"
                          size="small"
                          color="error"
                          sx={{ ml: 1 }}
                        />
                      </Zoom>
                    )}
                  </Box>

                  <Divider sx={{ mb: 2 }} />

                  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {plan.features.map((feature, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
                        <CheckCircle sx={{ fontSize: 18, color: '#10B981', mt: 0.3 }} />
                        <Typography variant="body2" color="text.secondary">
                          {feature}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  <Button
                    variant={selectedPlan === plan.id ? 'contained' : 'outlined'}
                    fullWidth
                    sx={{
                      mt: 3,
                      backgroundColor: selectedPlan === plan.id ? plan.color : 'transparent',
                      borderColor: plan.color,
                      color: selectedPlan === plan.id ? 'white' : plan.color,
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: plan.color,
                        color: 'white',
                      },
                    }}
                  >
                    {selectedPlan === plan.id ? 'Selezionato' : 'Seleziona'}
                  </Button>
                </Paper>
              ))}
            </Box>
          </>
        )}

        {paymentStep === 'payment' && selectedPlanData && (
          <Box>
            <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: '#FFF7ED', border: '2px solid #FF6B35' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: 2,
                    backgroundColor: selectedPlanData.color,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {selectedPlanData.icon}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Piano {selectedPlanData.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Fatturazione mensile (cancellabile mai)
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 800, color: selectedPlanData.color }}>
                  €{prices[selectedPlan]}/mese
                </Typography>
              </Box>
            </Paper>

            <Alert severity="info" icon={<Lock />} sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {PAYMENT_MESSAGES[messageIndex]}
              </Typography>
            </Alert>

            <Box sx={{ display: 'grid', gap: 3 }}>
              <TextField
                fullWidth
                label="Numero Carta di Credito"
                placeholder="1234 5678 9012 3456"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CreditCard />
                    </InputAdornment>
                  ),
                }}
              />

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <TextField
                  label="Scadenza"
                  placeholder="MM/YY"
                />
                <TextField
                  label="CVV"
                  placeholder="123"
                  helperText="I 3 numeri dietro (o davanti, chi se lo ricorda)"
                />
              </Box>

              <TextField
                fullWidth
                label="Nome sul Carta"
                placeholder="Mario Rossi"
                helperText="Usa il nome vero, o uno inventato, funziona uguale"
              />

              <Divider />

              <TextField
                fullWidth
                label="Email"
                placeholder="tuaemail@example.com"
                helperText="Per inviarti 47 email promozionali al giorno"
              />

              <Paper sx={{ p: 2, backgroundColor: '#E0F2FE' }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  💡 <strong>Garanzia Soddisfatti o Rimborsati*</strong>
                  <br />
                  *Rimborso disponibile entro 30 giorni, previa compilazione di 47 moduli, invio via fax,
                  approvazione del CEO, e superamento di un quiz sulla storia dell'IT
                </Typography>
              </Paper>
            </Box>
          </Box>
        )}

        {paymentStep === 'success' && (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Box
              component="div"
              sx={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                backgroundColor: '#10B98120',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                animation: 'successPulse 2s infinite',
                '@keyframes successPulse': {
                  '0%, 100%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.1)' },
                },
              }}
            >
              <CheckCircle sx={{ fontSize: 80, color: '#10B981' }} />
            </Box>

            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
              Contratto Sottoscritto con Successo!
            </Typography>

            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
              (Anche se hai solo provato a chiudere la finestra)
            </Typography>

            <Paper elevation={3} sx={{ p: 3, maxWidth: 500, margin: '0 auto', backgroundColor: '#FFF7ED' }}>
              <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
                🎉 Congratulazioni! Hai appena sottoscritto il piano <strong>{selectedPlanData?.name}</strong>
                <br />
                <br />
                📧 Riceverai una email di conferma (o forse no)
                <br />
                💳 Il primo addebito arriverà... sorpresa!
                <br />
                📱 Il nostro team ti contatterà (preparati)
              </Typography>
              <Typography variant="body2" sx={{ fontStyle: 'italic', opacity: 0.8, mt: 2 }}>
                P.S. Scherziamo! Questo è tutto finto. Ma ammetti che ci stava cascando, vero? 😄
              </Typography>
            </Paper>
          </Box>
        )}
      </DialogContent>

      {paymentStep !== 'success' && (
        <DialogActions sx={{ p: 3, backgroundColor: 'white', borderTop: '1px solid #E5E7EB' }}>
          <Button
            onClick={handleDialogClose}
            sx={{ color: 'text.secondary' }}
          >
            {paymentStep === 'plans' ? 'Annulla (Vigliacco)' : 'Indietro'}
          </Button>
          {paymentStep === 'plans' && (
            <Button
              variant="contained"
              size="large"
              onClick={() => setPaymentStep('payment')}
              disabled={!selectedPlan}
              sx={{
                backgroundColor: '#FF6B35',
                px: 4,
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: '#E8552E',
                },
              }}
            >
              Procedi al Checkout
            </Button>
          )}
          {paymentStep === 'payment' && (
            <Button
              variant="contained"
              size="large"
              onClick={handlePaymentSubmit}
              sx={{
                backgroundColor: '#10B981',
                px: 4,
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: '#059669',
                },
              }}
            >
              Conferma Pagamento €{prices[selectedPlan]}
            </Button>
          )}
        </DialogActions>
      )}
    </Dialog>
  );
}
