import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Box, Container, Paper } from '@mui/material';

// Login e registrazione: con la posta spenta proxy.ts risponde 404, con la posta accesa esistono ma
// non hanno niente da cercare. Fuori dall'indice, ma i link si seguono; robots.txt non le blocca,
// se no Google non vedrebbe mai il noindex.
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={8}
          sx={{
            p: 4,
            borderRadius: 2,
          }}
        >
          {children}
        </Paper>
      </Container>
    </Box>
  );
}
