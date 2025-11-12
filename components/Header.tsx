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
  useMediaQuery,
  useTheme,
  Chip,
  alpha,
  Typography,
} from '@mui/material';
import { Menu as MenuIcon, Close, Rocket, ArrowForward } from '@mui/icons-material';
import Link from 'next/link';
import Logo from './Logo';
import ContactDialog from './ContactDialog';
import PaymentDialog from './PaymentDialog';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Header() {
  const { t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: isScrolled
            ? 'rgba(255, 255, 255, 0.98)'
            : 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(24px)',
          borderBottom: isScrolled
            ? '1px solid rgba(0,0,0,0.12)'
            : '1px solid rgba(0,0,0,0.06)',
          color: 'primary.main',
          boxShadow: isScrolled
            ? '0 4px 20px rgba(0,0,0,0.08)'
            : '0 2px 8px rgba(0,0,0,0.04)',
          transition: 'all 0.3s ease',
        }}
      >
        <Toolbar sx={{ py: isScrolled ? 0.5 : 1, transition: 'padding 0.3s ease' }}>
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Logo size={isScrolled ? 32 : 36} />
            {!isMobile && isScrolled && (
              <Chip
                icon={<Rocket sx={{ fontSize: 18 }} />}
                label={t('header.tagline')}
                size="small"
                sx={{
                  backgroundColor: alpha('#F97316', 0.1),
                  color: '#F97316',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                }}
              />
            )}
          </Box>

          {/* Desktop Menu */}
          {!isMobile && (
            <>
              {menuItems.map((item) => (
                <Button
                  key={item.label}
                  color="inherit"
                  component={Link}
                  href={item.href}
                  sx={{
                    mx: 0.5,
                    px: 2,
                    fontWeight: 600,
                    fontSize: '0.95rem',
                  }}
                >
                  {item.label}
                </Button>
              ))}
              <Box sx={{ ml: 1 }}>
                <LanguageSwitcher />
              </Box>
              <Button
                variant="contained"
                endIcon={<ArrowForward />}
                onClick={() => setContactDialogOpen(true)}
                sx={{
                  ml: 1,
                  px: 3,
                  py: 1.2,
                  background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  borderRadius: 2,
                  boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)',
                  textTransform: 'none',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #EA580C 0%, #DC2626 100%)',
                  },
                }}
              >
                {t('header.cta')}
              </Button>
            </>
          )}

          {/* Mobile Menu Icon */}
          {isMobile && (
            <IconButton
              color="inherit"
              edge="end"
              onClick={handleDrawerToggle}
              sx={{ ml: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          '& .MuiDrawer-paper': {
            width: 300,
            background: 'linear-gradient(180deg, #F97316 0%, #EA580C 100%)',
            color: 'white',
            boxShadow: '-8px 0 24px rgba(0,0,0,0.15)',
          },
        }}
      >
        <Box
          sx={{
            p: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid rgba(255,255,255,0.15)',
          }}
        >
          <Logo size={36} color="white" />
          <IconButton
            onClick={handleDrawerToggle}
            sx={{
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            <Close />
          </IconButton>
        </Box>
        <List sx={{ px: 2, pt: 3 }}>
          {menuItems.map((item) => (
            <ListItem key={item.label} disablePadding sx={{ mb: 2 }}>
              <ListItemButton
                component={Link}
                href={item.href}
                onClick={handleDrawerToggle}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.2)',
                  },
                }}
              >
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: 700,
                    fontSize: '1.1rem',
                  }}
                />
                <ArrowForward sx={{ opacity: 0.7 }} />
              </ListItemButton>
            </ListItem>
          ))}
          <ListItem disablePadding sx={{ mt: 4 }}>
            <Button
              fullWidth
              variant="contained"
              endIcon={<Rocket />}
              onClick={() => {
                handleDrawerToggle();
                setContactDialogOpen(true);
              }}
              sx={{
                backgroundColor: 'white',
                color: '#F97316',
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 700,
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.95)',
                },
              }}
            >
              {t('header.cta')}
            </Button>
          </ListItem>
        </List>
        <Box
          sx={{
            mt: 'auto',
            p: 3,
            borderTop: '1px solid rgba(255,255,255,0.15)',
          }}
        >
          <Typography
            variant="caption"
            sx={{
              opacity: 0.8,
              display: 'block',
              textAlign: 'center',
            }}
          >
            {t('misc.company')}
          </Typography>
        </Box>
      </Drawer>
    </>
  );
}
