'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  TextField,
  Button,
  Link as MuiLink,
  Alert,
  InputAdornment,
  IconButton,
  Paper,
  Divider,
  alpha,
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock, Rocket } from '@mui/icons-material';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function LoginPage() {
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
    <Box>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{
          fontWeight: 700,
          textAlign: 'center',
          color: 'primary.main',
        }}
      >
        {t('login.admin.title')}
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{
          mb: 4,
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

      {/* Info box professionale */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          backgroundColor: '#f8f9fa',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
          {t('login.credentials.title')}
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: 'monospace', mb: 2, color: 'text.secondary' }}>
          {t('login.credentials.email')}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
          {t('login.credentials.challenge')}
        </Typography>
      </Paper>

      <Divider sx={{ mb: 3 }} />

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
            mb: 2,
            py: 1.5,
            fontWeight: 700,
            fontSize: '1rem',
          }}
        >
          {loading ? t('login.loading') : t('login.button')}
        </Button>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            <MuiLink component={Link} href="/" sx={{ fontWeight: 600 }}>
              {t('header.home')}
            </MuiLink>
          </Typography>
        </Box>
      </form>
    </Box>
  );
}
