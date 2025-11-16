'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  TextField,
  InputAdornment,
  Alert,
  Paper,
  Divider,
} from '@mui/material';
import {
  Close,
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Rocket,
} from '@mui/icons-material';
import { useLanguage } from '@/contexts/LanguageContext';

interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function LoginDialog({ open, onClose }: LoginDialogProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const [email, setEmail] = useState('lorenzo@uaft.it');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(t('login.error'));
      } else {
        onClose();
        router.push('/mail/inbox');
        router.refresh();
      }
    } catch (err) {
      setError(t('login.error'));
    } finally {
      setLoading(false);
    }
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
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
            {t('login.admin.title')}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 3,
            textAlign: 'center',
            lineHeight: 1.6,
            '& strong': {
              fontWeight: 700,
              color: 'primary.main',
            },
          }}
          dangerouslySetInnerHTML={{
            __html: t('login.admin.message').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          }}
        />

        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            mb: 3,
            backgroundColor: '#f8f9fa',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: 'text.primary' }}>
            {t('login.credentials.title')}
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: 'monospace', mb: 1.5, color: 'text.secondary' }}>
            {t('login.credentials.email')}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.6, display: 'block' }}>
            {t('login.credentials.challenge')}
          </Typography>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={loading}
            endIcon={<Rocket />}
            sx={{
              mt: 3,
              py: 1.5,
              fontWeight: 700,
              fontSize: '1rem',
            }}
          >
            {loading ? t('login.loading') : t('login.button')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
