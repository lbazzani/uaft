'use client';
import { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import { Menu as MenuIcon, Close, ArrowForward } from '@mui/icons-material';
import Link from 'next/link';
import Logo from './Logo';
import ContactDialog from '../dialogs/ContactDialog';
import PaymentDialog from '../dialogs/PaymentDialog';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Header() {
  const { t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: t('header.services'), href: '#services' },
    { label: t('header.about'), href: '#about' },
    { label: t('header.privacy'), href: '/privacy' },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      <ContactDialog
        open={contactDialogOpen}
        onClose={() => setContactDialogOpen(false)}
        onOpenPayment={() => {
          setContactDialogOpen(false);
          setPaymentDialogOpen(true);
        }}
      />
      <PaymentDialog
        open={paymentDialogOpen}
        onClose={() => setPaymentDialogOpen(false)}
      />
      {/* barra navy alla Blumea: logo a sinistra, nav corta e lingua a destra (niente «Accedi»: l'area
          riservata non c'è più). Desktop e telefono si scambiano col CSS (da md in su), non con
          useMediaQuery: l'HTML arriva dal server, che lo schermo non lo conosce, e il telefono vedrebbe
          la barra desktop fino all'idratazione */}
      <AppBar
        position="fixed"
        elevation={0}
        className="su-scuro"
        sx={{
          backgroundColor: 'var(--navy)',
          color: 'var(--chiaro)',
          borderBottom: '1px solid',
          borderColor: isScrolled ? 'var(--chiaro-filo)' : 'transparent',
          boxShadow: 'none',
          transition: 'border-color 0.3s ease',
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 64, md: 72 }, px: { xs: 2, md: 4 } }}>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 2.5, minWidth: 0 }}>
            <Box component={Link} href="/" aria-label={t('aria.home')} sx={{ color: 'inherit', textDecoration: 'none', display: 'inline-flex', borderRadius: '8px' }}>
              <Logo size={36} color="var(--chiaro)" />
            </Box>
            <Typography
              component="span"
              sx={{
                display: { xs: 'none', md: 'block' },
                fontFamily: 'var(--f-note)',
                fontStyle: 'italic',
                fontSize: '0.95rem',
                color: 'var(--chiaro-tenue)',
                pl: 2.5,
                borderLeft: '1px solid var(--chiaro-filo)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {t('header.tagline')}*
            </Typography>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            <Box component="nav" sx={{ display: 'flex', alignItems: 'center' }}>
              {menuItems.map((item) => (
                <Button
                  key={item.label}
                  color="inherit"
                  component={Link}
                  href={item.href}
                  sx={{
                    mx: 0.25,
                    px: 1.75,
                    fontWeight: 500,
                    fontSize: '0.95rem',
                    color: 'var(--chiaro-tenue)',
                    '&:hover': { color: 'var(--chiaro)', backgroundColor: 'var(--chiaro-filo)' },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
            <Box sx={{ ml: 1 }}>
              <LanguageSwitcher />
            </Box>
          </Box>

          <IconButton
            color="inherit"
            edge="end"
            onClick={handleDrawerToggle}
            aria-label={t('aria.menu')}
            sx={{ display: { xs: 'inline-flex', md: 'none' }, ml: 1, border: '1px solid var(--chiaro-filo)' }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer mobile: stessa logica, foglio navy */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          '& .MuiDrawer-paper': {
            width: 'min(320px, 100vw)',
            backgroundColor: 'var(--navy)',
            color: 'var(--chiaro)',
            borderLeft: '1px solid var(--chiaro-filo)',
            boxShadow: 'none',
          },
        }}
        PaperProps={{ className: 'su-scuro' }}
      >
        <Box
          sx={{
            p: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--chiaro-filo)',
          }}
        >
          <Logo size={36} color="var(--chiaro)" />
          <IconButton
            onClick={handleDrawerToggle}
            aria-label={t('aria.chiudi')}
            sx={{ color: 'var(--chiaro)', '&:hover': { backgroundColor: 'var(--chiaro-filo)' } }}
          >
            <Close />
          </IconButton>
        </Box>
        <List sx={{ px: 2, pt: 2 }}>
          {menuItems.map((item) => (
            <ListItem key={item.label} disablePadding sx={{ borderBottom: '1px solid var(--chiaro-filo)' }}>
              <ListItemButton
                component={Link}
                href={item.href}
                onClick={handleDrawerToggle}
                sx={{ py: 2, px: 1, borderRadius: 0, '&:hover': { backgroundColor: 'var(--chiaro-filo)' } }}
              >
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontFamily: 'var(--f-titoli)',
                    fontWeight: 700,
                    fontSize: '1.15rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.01em',
                  }}
                />
                <ArrowForward sx={{ color: 'var(--corallo)' }} />
              </ListItemButton>
            </ListItem>
          ))}
          <ListItem disablePadding sx={{ mt: 3, mb: 2, justifyContent: 'center' }}>
            <LanguageSwitcher />
          </ListItem>
        </List>
        <Box sx={{ mt: 'auto', p: 3, borderTop: '1px solid var(--chiaro-filo)' }}>
          <Typography
            variant="caption"
            sx={{
              fontFamily: 'var(--f-note)',
              fontStyle: 'italic',
              fontSize: '0.95rem',
              color: 'var(--chiaro-tenue)',
              display: 'block',
              textAlign: 'center',
            }}
          >
            {t('misc.company')}*
          </Typography>
        </Box>
      </Drawer>
    </>
  );
}
