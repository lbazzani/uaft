'use client';
import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
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

export default function Header() {
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 100], [0.95, 1]);
  const headerShadow = useTransform(scrollY, [0, 100], [0, 0.15]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setIsScrolled(currentScrollY > 50);

      if (currentScrollY < 100) {
        setShowHeader(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const menuItems = [
    { label: 'Servizi', href: '#services' },
    { label: 'Chi Siamo', href: '#about' },
    { label: 'Privacy', href: '/privacy' },
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
        component={motion.div}
        animate={{ y: showHeader ? 0 : -100 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
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
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Logo size={isScrolled ? 32 : 36} />
            </motion.div>
            {!isMobile && isScrolled && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Chip
                  icon={<Rocket sx={{ fontSize: 18 }} />}
                  label="La tua azienda che può fare tutto"
                  size="small"
                  sx={{
                    backgroundColor: alpha('#F97316', 0.1),
                    color: '#F97316',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                  }}
                />
              </motion.div>
            )}
          </Box>

          {/* Desktop Menu */}
          {!isMobile && (
            <>
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <Button
                    color="inherit"
                    component={Link}
                    href={item.href}
                    sx={{
                      mx: 0.5,
                      px: 2,
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 8,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 0,
                        height: 2,
                        backgroundColor: '#F97316',
                        transition: 'width 0.3s ease',
                      },
                      '&:hover::after': {
                        width: '70%',
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                </motion.div>
              ))}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="contained"
                  endIcon={<ArrowForward />}
                  onClick={() => setContactDialogOpen(true)}
                  sx={{
                    ml: 2,
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
                      boxShadow: '0 6px 16px rgba(249, 115, 22, 0.4)',
                    },
                  }}
                >
                  Inizia Ora
                </Button>
              </motion.div>
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
          {menuItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <ListItem disablePadding sx={{ mb: 2 }}>
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
                      transform: 'translateX(8px)',
                      transition: 'all 0.3s ease',
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
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
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
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Inizia Ora
              </Button>
            </ListItem>
          </motion.div>
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
            UAFT - Una Azienda che può Fare Tutto
          </Typography>
        </Box>
      </Drawer>
    </>
  );
}
