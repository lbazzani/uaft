'use client';
import { IconButton, Menu, MenuItem, Box, Typography } from '@mui/material';
import { Language as LanguageIcon } from '@mui/icons-material';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (lang: 'it' | 'en') => {
    setLanguage(lang);
    handleClose();
  };

  return (
    <>
      {/* pillola con il codice lingua: si capisce dove si è senza aprire il menu */}
      <IconButton
        onClick={handleClick}
        sx={{
          color: 'inherit',
          gap: 0.75,
          px: 1.5,
          py: 0.75,
          borderRadius: 999,
          border: '1px solid currentColor',
          borderColor: 'color-mix(in srgb, currentColor 30%, transparent)',
          '&:hover': { backgroundColor: 'color-mix(in srgb, currentColor 10%, transparent)' },
        }}
        aria-label={t('aria.lingua')}
        aria-haspopup="menu"
      >
        <LanguageIcon sx={{ fontSize: 18 }} />
        <Box component="span" sx={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em', lineHeight: 1 }}>
          {language.toUpperCase()}
        </Box>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        slotProps={{ paper: { sx: { mt: 1, border: '1px solid var(--linea)', boxShadow: '0 12px 30px rgba(11,31,51,0.12)' } } }}
      >
        <MenuItem
          onClick={() => handleLanguageChange('it')}
          selected={language === 'it'}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography sx={{ fontSize: '1.2rem' }}>🇮🇹</Typography>
            <Typography>Italiano</Typography>
          </Box>
        </MenuItem>
        <MenuItem
          onClick={() => handleLanguageChange('en')}
          selected={language === 'en'}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography sx={{ fontSize: '1.2rem' }}>🇬🇧</Typography>
            <Typography>English</Typography>
          </Box>
        </MenuItem>
      </Menu>
    </>
  );
}
