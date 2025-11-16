'use client';
import { useState } from 'react';
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
  Alert,
} from '@mui/material';
import {
  Close,
  Lock,
  ShoppingCart,
  Warning,
} from '@mui/icons-material';
import { useLanguage } from '@/contexts/LanguageContext';

interface ContactDialogProps {
  open: boolean;
  onClose: () => void;
  onOpenPayment: () => void;
}

export default function ContactDialog({ open, onClose, onOpenPayment }: ContactDialogProps) {
  const { t } = useLanguage();
  const [showWarning, setShowWarning] = useState(false);

  const handleContactAttempt = () => {
    setShowWarning(true);
    setTimeout(() => {
      onClose();
      onOpenPayment();
    }, 2000);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
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
            {t('contact.title')}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.95 }}>
            {t('contact.subtitle')}
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 4, backgroundColor: '#FAFBFC' }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            textAlign: 'center',
            backgroundColor: 'white',
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: '#FEE2E2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
            }}
          >
            <Lock sx={{ fontSize: 40, color: '#DC2626' }} />
          </Box>

          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            {t('contact.access.title')}
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>
            {t('contact.access.desc')}
          </Typography>

          <Alert severity="info" icon={<ShoppingCart />} sx={{ mb: 3, textAlign: 'left' }}>
            <Typography variant="body2">
              <strong>{t('contact.policy.title')}</strong>
              <br />
              {t('contact.policy.desc')}
            </Typography>
          </Alert>

          {showWarning && (
            <Alert severity="warning" icon={<Warning />} sx={{ mb: 2, textAlign: 'left' }}>
              <Typography variant="body2">
                {t('contact.warning')}
              </Typography>
            </Alert>
          )}

          <Paper
            sx={{
              p: 2,
              backgroundColor: '#FFF7ED',
              border: '2px dashed #FF6B35',
            }}
          >
            <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
              {t('contact.funfact')}
            </Typography>
          </Paper>
        </Paper>
      </DialogContent>

      <DialogActions sx={{ p: 3, backgroundColor: 'white', borderTop: '1px solid #E5E7EB' }}>
        <Button
          onClick={onClose}
          sx={{
            color: 'text.secondary',
            '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' },
          }}
        >
          {t('contact.cancel')}
        </Button>
        <Button
          variant="contained"
          size="large"
          onClick={handleContactAttempt}
          startIcon={<ShoppingCart />}
          sx={{
            backgroundColor: '#FF6B35',
            px: 4,
            fontWeight: 600,
            '&:hover': {
              backgroundColor: '#E8552E',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 24px rgba(255,107,53,0.4)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          {t('contact.buy')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
