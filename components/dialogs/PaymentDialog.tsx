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
import { useLanguage } from '@/contexts/LanguageContext';

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

// Helper to get plan configuration with translation keys
const getPlanConfig = () => [
  {
    id: 'basic',
    nameKey: 'payment.plan.basic.name' as const,
    basePrice: 99,
    featureKeys: [
      'payment.plan.basic.feature1',
      'payment.plan.basic.feature2',
      'payment.plan.basic.feature3',
      'payment.plan.basic.feature4',
      'payment.plan.basic.feature5',
    ] as const,
    icon: <Star />,
    color: '#6B7280',
  },
  {
    id: 'standard',
    nameKey: 'payment.plan.standard.name' as const,
    basePrice: 299,
    featureKeys: [
      'payment.plan.standard.feature1',
      'payment.plan.standard.feature2',
      'payment.plan.standard.feature3',
      'payment.plan.standard.feature4',
      'payment.plan.standard.feature5',
      'payment.plan.standard.feature6',
    ] as const,
    icon: <CheckCircle />,
    color: '#3B82F6',
    badgeKey: 'payment.plan.standard.badge' as const,
  },
  {
    id: 'enterprise',
    nameKey: 'payment.plan.enterprise.name' as const,
    basePrice: 999,
    featureKeys: [
      'payment.plan.enterprise.feature1',
      'payment.plan.enterprise.feature2',
      'payment.plan.enterprise.feature3',
      'payment.plan.enterprise.feature4',
      'payment.plan.enterprise.feature5',
      'payment.plan.enterprise.feature6',
      'payment.plan.enterprise.feature7',
      'payment.plan.enterprise.feature8',
    ] as const,
    icon: <Rocket />,
    color: '#F59E0B',
    badgeKey: 'payment.plan.enterprise.badge' as const,
  },
];

const PAYMENT_MESSAGE_KEYS = [
  'payment.message1',
  'payment.message2',
  'payment.message3',
  'payment.message4',
  'payment.message5',
] as const;

const SERVICE_NAMES: Record<string, string> = {
  cloud: 'Cloud as a Cloud',
  ai: 'AI Artificialmente Intelligente',
  security: 'Sicurezza Esagerata',
  speed: 'Velocità Supersonica',
  code: 'Codice Automagico',
  deploy: 'Deploy Istantaneo',
};

export default function PaymentDialog({ open, onClose, selectedService }: PaymentDialogProps) {
  const { t } = useLanguage();
  const [selectedPlan, setSelectedPlan] = useState<string>('standard');
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);
  const [paymentStep, setPaymentStep] = useState<'plans' | 'payment' | 'success'>('plans');
  const [messageIndex, setMessageIndex] = useState(0);
  const [priceIncreaseCount, setPriceIncreaseCount] = useState(0);

  // Get plans with translations
  const PLANS = getPlanConfig();

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
        setMessageIndex((prev) => (prev + 1) % PAYMENT_MESSAGE_KEYS.length);
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
      maxWidth="xl"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: '80vh',
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
          backgroundColor: paymentStep === 'success' ? '#ECFDF5' : '#FAFBFC',
          py: 2.5,
          px: 3,
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
            {paymentStep === 'plans' && '💎 ' + t('payment.title.plans')}
            {paymentStep === 'payment' && '💳 ' + t('payment.title.payment')}
            {paymentStep === 'success' && '✨ ' + t('payment.title.success')}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {paymentStep === 'plans' && t('payment.subtitle.plans')}
            {paymentStep === 'payment' && t('payment.subtitle.payment')}
            {paymentStep === 'success' && t('payment.subtitle.success')}
          </Typography>
        </Box>
        {paymentStep !== 'success' && (
          <IconButton
            onClick={handleDialogClose}
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

      <DialogContent sx={{ p: 4, backgroundColor: 'white' }}>
        {paymentStep === 'plans' && (
          <>
            {priceIncreaseCount > 3 && (
              <Alert severity="warning" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  {t('payment.warning', { count: priceIncreaseCount })}
                </Typography>
              </Alert>
            )}

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3, mb: 2 }}>
              {PLANS.map((plan) => (
                <Paper
                  key={plan.id}
                  elevation={0}
                  onMouseEnter={() => handlePlanHover(plan.id)}
                  onMouseLeave={() => handlePlanLeave(plan.id)}
                  sx={{
                    p: 3.5,
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    cursor: 'pointer',
                    border: selectedPlan === plan.id ? `2px solid ${plan.color}` : '2px solid #E5E7EB',
                    borderRadius: 2,
                    backgroundColor: selectedPlan === plan.id ? `${plan.color}05` : 'white',
                    transition: 'all 0.3s ease',
                    transform: hoveredPlan === plan.id ? 'translateY(-4px)' : 'translateY(0)',
                    '&:hover': {
                      borderColor: plan.color,
                      boxShadow: `0 8px 24px ${plan.color}20`,
                    },
                  }}
                  onClick={() => handleSelectPlan(plan.id)}
                >
                  {plan.badgeKey && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 10,
                        backgroundColor: plan.color,
                        color: 'white',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        letterSpacing: 0.5,
                      }}
                    >
                      {t(plan.badgeKey)}
                    </Box>
                  )}

                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 2,
                      backgroundColor: `${plan.color}15`,
                      color: plan.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2.5,
                      fontSize: 28,
                    }}
                  >
                    {plan.icon}
                  </Box>

                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
                    {t(plan.nameKey)}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 3 }}>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: plan.color, fontSize: '2.5rem' }}>
                      €{prices[plan.id] || plan.basePrice}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1, fontWeight: 500 }}>
                      {t('payment.plan.month')}
                    </Typography>
                    {hoveredPlan === plan.id && (
                      <Zoom in>
                        <Chip
                          icon={<TrendingUp sx={{ fontSize: 14 }} />}
                          label="+15%"
                          size="small"
                          sx={{
                            ml: 1,
                            height: 24,
                            backgroundColor: '#FEE2E2',
                            color: '#DC2626',
                            fontWeight: 600,
                            fontSize: '0.7rem',
                            '& .MuiChip-icon': { color: '#DC2626' },
                          }}
                        />
                      </Zoom>
                    )}
                  </Box>

                  <Divider sx={{ mb: 2.5 }} />

                  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1.75, mb: 3 }}>
                    {plan.featureKeys.map((featureKey, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'start', gap: 1.5 }}>
                        <CheckCircle sx={{ fontSize: 18, color: '#10B981', mt: 0.2, flexShrink: 0 }} />
                        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                          {t(featureKey)}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  <Button
                    variant={selectedPlan === plan.id ? 'contained' : 'outlined'}
                    fullWidth
                    size="large"
                    sx={{
                      py: 1.25,
                      backgroundColor: selectedPlan === plan.id ? plan.color : 'transparent',
                      borderColor: selectedPlan === plan.id ? plan.color : '#E5E7EB',
                      color: selectedPlan === plan.id ? 'white' : 'text.primary',
                      fontWeight: 600,
                      borderWidth: 2,
                      '&:hover': {
                        backgroundColor: plan.color,
                        borderColor: plan.color,
                        color: 'white',
                        transform: 'scale(1.02)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {selectedPlan === plan.id ? t('payment.plan.selected.check') : t('payment.plan.select.action')}
                  </Button>
                </Paper>
              ))}
            </Box>

            {/* Info footer */}
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                backgroundColor: '#F9FAFB',
                border: '1px solid #E5E7EB',
                borderRadius: 2,
                textAlign: 'center',
              }}
            >
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: t('payment.plans.footer') }} />
            </Paper>
          </>
        )}

        {paymentStep === 'payment' && selectedPlanData && (
          <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            {/* Riepilogo ordine */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 3,
                backgroundColor: '#F9FAFB',
                border: '2px solid #E5E7EB',
                borderRadius: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    backgroundColor: selectedPlanData.color,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                    flexShrink: 0,
                  }}
                >
                  {selectedPlanData.icon}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {t('payment.checkout.plan', { plan: t(selectedPlanData.nameKey) })}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('payment.checkout.billing.full')}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: selectedPlanData.color }}>
                    €{prices[selectedPlan]}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t('payment.plan.month')}
                  </Typography>
                </Box>
              </Box>
            </Paper>

            {/* Messaggi sicurezza rotanti */}
            <Alert
              severity="info"
              icon={<Lock />}
              sx={{
                mb: 3,
                backgroundColor: '#EFF6FF',
                border: '1px solid #BFDBFE',
                '& .MuiAlert-icon': { color: '#3B82F6' },
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#1E40AF' }}>
                🔒 {t(PAYMENT_MESSAGE_KEYS[messageIndex])}
              </Typography>
            </Alert>

            {/* Form pagamento */}
            <Box sx={{ display: 'grid', gap: 3 }}>
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: 'text.primary' }}>
                  {t('payment.form.section.card')}
                </Typography>
                <TextField
                  fullWidth
                  label={t('payment.form.card')}
                  placeholder={t('payment.form.card.placeholder')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CreditCard sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'white',
                    },
                  }}
                />
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <TextField
                  label={t('payment.form.expiry')}
                  placeholder={t('payment.form.expiry.placeholder')}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'white',
                    },
                  }}
                />
                <TextField
                  label={t('payment.form.cvv')}
                  placeholder={t('payment.form.cvv.placeholder')}
                  helperText={t('payment.form.cvv.help.short')}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'white',
                    },
                  }}
                />
              </Box>

              <TextField
                fullWidth
                label={t('payment.form.name')}
                placeholder={t('payment.form.name.placeholder')}
                helperText={t('payment.form.name.help')}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                  },
                }}
              />

              <Divider sx={{ my: 1 }} />

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: 'text.primary' }}>
                  {t('payment.form.section.billing')}
                </Typography>
                <TextField
                  fullWidth
                  label={t('payment.form.email')}
                  placeholder={t('payment.form.email.placeholder')}
                  helperText={t('payment.form.email.help')}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'white',
                    },
                  }}
                />
              </Box>

              {/* Box garanzia */}
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  backgroundColor: '#F0F9FF',
                  border: '1px solid #BAE6FD',
                  borderRadius: 2,
                }}
              >
                <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.7 }}>
                  <strong>{t('payment.guarantee.title')}</strong>
                  <br />
                  <span style={{ color: '#64748B' }}>
                    {t('payment.guarantee.desc')}
                  </span>
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
              {t('payment.success.title')}
            </Typography>

            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
              {t('payment.success.subtitle')}
            </Typography>

            <Paper elevation={3} sx={{ p: 3, maxWidth: 500, margin: '0 auto', backgroundColor: '#FFF7ED' }}>
              <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }} dangerouslySetInnerHTML={{ __html: t('payment.success.msg', { plan: selectedPlanData ? t(selectedPlanData.nameKey) : '' }) }} />
              <Typography variant="body2" sx={{ fontStyle: 'italic', opacity: 0.8, mt: 2 }}>
                {t('payment.success.ps')}
              </Typography>
            </Paper>
          </Box>
        )}
      </DialogContent>

      {paymentStep !== 'success' && (
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
            onClick={handleDialogClose}
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
            {paymentStep === 'plans' ? t('payment.cancel') : t('payment.checkout.back')}
          </Button>
          {paymentStep === 'plans' && (
            <Button
              variant="contained"
              size="large"
              onClick={() => setPaymentStep('payment')}
              disabled={!selectedPlan}
              sx={{
                px: 4,
                backgroundColor: '#F97316',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: '#EA580C',
                },
                '&:disabled': {
                  backgroundColor: '#E5E7EB',
                  color: '#9CA3AF',
                },
              }}
            >
              {t('payment.checkout.proceed')}
            </Button>
          )}
          {paymentStep === 'payment' && (
            <Button
              variant="contained"
              size="large"
              onClick={handlePaymentSubmit}
              sx={{
                px: 4,
                backgroundColor: '#10B981',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: '#059669',
                },
              }}
            >
              {t('payment.checkout.confirm', { price: prices[selectedPlan] })}
            </Button>
          )}
        </DialogActions>
      )}
    </Dialog>
  );
}
