'use client';

import {
  Box,
  Typography,
  Paper,
  Chip,
} from '@mui/material';
import { Delete } from '@mui/icons-material';

export default function TrashPage() {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          🗑️ Trash
        </Typography>
        <Chip label="0 emails" />
      </Box>

      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Delete sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          Nessun messaggio eliminato
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          I messaggi eliminati appariranno qui per 30 giorni
        </Typography>
      </Paper>
    </Box>
  );
}
