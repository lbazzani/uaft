'use client';
import { createTheme } from '@mui/material/styles';

// Identità UAFT "l'asterisco": corallo come unico accento, navy per le pagine scure, carta per le chiare.
const corallo = '#FF6B35';
const coralloScuro = '#C2410C';
const navy = '#0B1F33';
const inchiostro = '#14161C';
const linea = '#DCD5C9';

const titoli = 'var(--font-titoli), "Archivo", system-ui, sans-serif';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: corallo,
      dark: coralloScuro,
      light: '#FF8C5A',
      // inchiostro su corallo è AA (≈7:1); il bianco non lo sarebbe
      contrastText: inchiostro,
    },
    secondary: {
      main: navy,
      dark: '#06131F',
      light: '#12304D',
      contrastText: '#F3EFE8',
    },
    background: {
      default: '#F7F4EF',
      paper: '#FFFFFF',
    },
    text: {
      primary: inchiostro,
      secondary: '#5B616E',
    },
    divider: linea,
    error: { main: '#DC2626' },
    warning: { main: '#F59E0B' },
    info: { main: '#3B82F6' },
    success: { main: '#10B981' },
  },
  typography: {
    fontFamily: 'var(--font-testi), Inter, system-ui, sans-serif',
    h1: { fontFamily: titoli, fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.02em' },
    h2: { fontFamily: titoli, fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.015em' },
    h3: { fontFamily: titoli, fontSize: '2rem', fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.01em' },
    h4: { fontSize: '1.5rem', fontWeight: 600, lineHeight: 1.35, letterSpacing: '-0.005em' },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    body1: { fontSize: '1.0625rem', lineHeight: 1.65 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 14,
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 999,
          padding: '10px 26px',
          fontSize: '1rem',
          boxShadow: 'none',
          backgroundImage: 'none',
          '&:hover': { boxShadow: 'none' },
        },
        sizeSmall: { padding: '6px 16px', fontSize: '0.875rem' },
        sizeLarge: { padding: '14px 34px', fontSize: '1.0625rem' },
        outlined: { borderWidth: 1 },
        // corallo puro su chiaro non regge come testo: varianti testuali in corallo scuro (AA)
        outlinedPrimary: { color: coralloScuro, borderColor: coralloScuro, '&:hover': { borderColor: coralloScuro, backgroundColor: 'rgba(194,65,12,0.06)' } },
        textPrimary: { color: coralloScuro },
        // hover chiaro: l'inchiostro resta leggibile, il corallo scuro no
        containedPrimary: { '&:hover': { backgroundColor: '#FF8C5A' } },
        containedSecondary: { '&:hover': { backgroundColor: '#12304D' } },
      },
    },
    MuiPaper: {
      // piatte con filo solo le elevazioni basse (carte, pannelli): menu, AppBar e Alert restano come sono
      styleOverrides: {
        root: { backgroundImage: 'none' },
        outlined: { borderColor: linea },
        elevation1: { border: `1px solid ${linea}`, boxShadow: 'none' },
        elevation2: { border: `1px solid ${linea}`, boxShadow: 'none' },
        elevation3: { border: `1px solid ${linea}`, boxShadow: 'none' },
        elevation4: { border: `1px solid ${linea}`, boxShadow: 'none' },
      },
    },
    MuiCard: {
      styleOverrides: { root: { boxShadow: 'none' } },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 18, border: `1px solid ${linea}`, boxShadow: '0 24px 60px rgba(11,31,51,0.18)' },
      },
    },
    MuiDialogTitle: {
      styleOverrides: { root: { fontFamily: titoli, fontWeight: 800, letterSpacing: '-0.01em' } },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 999, fontWeight: 600 },
        outlined: { borderColor: linea },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined' },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          '& .MuiOutlinedInput-notchedOutline': { borderColor: linea },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#B9B0A2' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: coralloScuro, borderWidth: 1.5 },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: { root: { '&.Mui-focused': { color: coralloScuro } } },
    },
    MuiLink: {
      styleOverrides: { root: { color: coralloScuro } },
    },
  },
});

export default theme;
