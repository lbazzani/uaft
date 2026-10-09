'use client';
import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  Slide,
  Link,
} from '@mui/material';
import { Close, Cookie } from '@mui/icons-material';
import { useLanguage } from '@/contexts/LanguageContext';
import { TransitionProps } from '@mui/material/transitions';
import { forwardRef } from 'react';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

export default function CookieBanner() {
  const { t } = useLanguage();
  const [showBanner, setShowBanner] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always true, can't be disabled
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      // Show banner after a short delay
      setTimeout(() => setShowBanner(true), 1000);
    } else {
      try {
        // Try to parse as JSON (new format)
        const savedPreferences = JSON.parse(cookieConsent);
        setPreferences(savedPreferences);
        applyPreferences(savedPreferences);
      } catch (e) {
        // Old format (just "accepted" or "rejected" string)
        // Convert to new format
        const isAccepted = cookieConsent === 'accepted';
        const newPreferences = {
          necessary: true,
          analytics: isAccepted,
          marketing: isAccepted,
        };
        setPreferences(newPreferences);
        applyPreferences(newPreferences);
        // Save in new format
        localStorage.setItem('cookieConsent', JSON.stringify(newPreferences));
      }
    }
  }, []);

  const applyPreferences = (prefs: CookiePreferences) => {
    // Apply Google Analytics based on preferences
    if (prefs.analytics) {
      // Analytics already loaded in GoogleAnalytics component
      console.log('Analytics enabled');
    } else {
      // Disable analytics if possible
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          analytics_storage: 'denied',
        });
      }
    }

    // Handle marketing cookies if needed in the future
    if (prefs.marketing) {
      console.log('Marketing enabled');
    }
  };

  const handleAcceptAll = () => {
    const newPreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    savePreferences(newPreferences);
  };

  const handleRejectAll = () => {
    const newPreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    savePreferences(newPreferences);
  };

  const handleSaveCustom = () => {
    savePreferences(preferences);
    setShowCustomize(false);
  };

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('cookieConsent', JSON.stringify(prefs));
    applyPreferences(prefs);
    setShowBanner(false);
  };

  const handleTogglePreference = (key: keyof CookiePreferences) => {
    if (key === 'necessary') return; // Can't toggle necessary cookies
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!showBanner) return null;

  return (
    <>
      <Paper
        elevation={0}
        role="dialog"
        aria-label={t('cookie.title')}
        className="su-scuro"
        sx={{
          // scheda navy staccata dai bordi: nota legale, non un muro
          position: 'fixed',
          bottom: { xs: 0, md: 24 },
          left: { xs: 0, md: 24 },
          right: { xs: 0, md: 'auto' },
          maxWidth: { md: 560 },
          zIndex: 9999,
          p: { xs: 2.5, md: 3.5 },
          borderRadius: { xs: '18px 18px 0 0', md: '18px' },
          backgroundColor: 'var(--navy)',
          border: '1px solid var(--navy-3)',
          boxShadow: '0 24px 60px rgba(11,31,51,0.35)',
          color: 'var(--chiaro)',
        }}
      >
        <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <Cookie sx={{ fontSize: 28, color: 'var(--corallo)', mt: 0.25 }} />

            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontFamily: 'var(--f-titoli)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.01em', mb: 1 }}>
                {t('cookie.title')}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, color: 'var(--chiaro-tenue)' }}>
                {t('cookie.message')}
              </Typography>
              <Typography variant="caption" sx={{ fontFamily: 'var(--f-note)', fontStyle: 'italic', fontSize: '0.95rem', display: 'block', mb: 2 }}>
                <Link href="/privacy" sx={{ color: 'var(--corallo)' }}>
                  Privacy Policy
                </Link>
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  onClick={handleAcceptAll}
                  sx={{
                    bgcolor: 'var(--corallo)',
                    color: 'var(--inchiostro)',
                    '&:hover': { bgcolor: 'var(--chiaro)' }
                  }}
                >
                  {t('cookie.accept')}
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleRejectAll}
                  sx={{
                    borderColor: 'var(--chiaro-filo)',
                    color: 'var(--chiaro)',
                    '&:hover': { borderColor: 'var(--chiaro)', backgroundColor: 'transparent' }
                  }}
                >
                  {t('cookie.reject')}
                </Button>
                <Button
                  variant="text"
                  onClick={() => setShowCustomize(true)}
                  sx={{ color: 'var(--chiaro-tenue)', textDecoration: 'underline', textUnderlineOffset: '4px', '&:hover': { color: 'var(--chiaro)' } }}
                >
                  {t('cookie.customize')}
                </Button>
              </Box>
            </Box>

            <IconButton
              onClick={handleRejectAll}
              size="small"
              aria-label={t('cookie.reject')}
              sx={{ color: 'var(--chiaro-tenue)', '&:hover': { color: 'var(--chiaro)' } }}
            >
              <Close />
            </IconButton>
          </Box>
        </Box>
      </Paper>

      {/* Customize Dialog */}
      <Dialog
        open={showCustomize}
        onClose={() => setShowCustomize(false)}
        TransitionComponent={Transition}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '18px',
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Cookie sx={{ color: 'var(--corallo)' }} />
          {t('cookie.title')}
        </DialogTitle>

        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            {/* Necessary Cookies */}
            <Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.necessary}
                    disabled
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {t('cookie.necessary')}
                  </Typography>
                }
              />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 6, mt: 0.5 }}>
                {t('cookie.necessary.desc')}
              </Typography>
            </Box>

            {/* Analytics Cookies */}
            <Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.analytics}
                    onChange={() => handleTogglePreference('analytics')}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {t('cookie.analytics')}
                  </Typography>
                }
              />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 6, mt: 0.5 }}>
                {t('cookie.analytics.desc')}
              </Typography>
            </Box>

            {/* Marketing Cookies */}
            <Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.marketing}
                    onChange={() => handleTogglePreference('marketing')}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {t('cookie.marketing')}
                  </Typography>
                }
              />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 6, mt: 0.5 }}>
                {t('cookie.marketing.desc')}
              </Typography>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button onClick={() => setShowCustomize(false)} variant="outlined">
            {t('cookie.close')}
          </Button>
          <Button onClick={handleSaveCustom} variant="contained">
            {t('cookie.save')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
