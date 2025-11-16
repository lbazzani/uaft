'use client';

import { Box, Typography, Paper } from '@mui/material';
import { People } from '@mui/icons-material';

export default function UsersPage() {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
        👥 Gestione Utenti
      </Typography>

      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <People sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          Nessun utente configurato
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Crea utenti per il tuo server di posta
        </Typography>
      </Paper>
    </Box>
  );
}
