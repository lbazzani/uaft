'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#FF6B35', // Arancione corallo professionale
      dark: '#E8552E',
      light: '#FF8C5A',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#004E89', // Blu navy profondo
      dark: '#003A63',
      light: '#1A6BA5',
      contrastText: '#ffffff',
    },
    background: {
      default: '#FAFBFC', // Grigio caldissimo
      paper: '#ffffff',
    },
    text: {
      primary: '#1A1D29', // Quasi nero con tono blu
      secondary: '#6B7280', // Grigio medio
    },
    error: {
      main: '#DC2626',
    },
    warning: {
      main: '#F59E0B',
    },
    info: {
      main: '#3B82F6',
    },
    success: {
      main: '#10B981',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '3.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1.125rem',
      lineHeight: 1.7,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          padding: '12px 32px',
          fontSize: '1rem',
        },
      },
    },
  },
});

export default theme;
