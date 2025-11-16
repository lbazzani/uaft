'use client';

import {
  Box,
  Typography,
  Paper,
  Chip,
} from '@mui/material';
import { Archive } from '@mui/icons-material';

export default function ArchivePage() {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          📦 Archive
        </Typography>
        <Chip label="0 emails" />
      </Box>

      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Archive sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          Nessun messaggio archiviato
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          I messaggi archiviati appariranno qui
        </Typography>
      </Paper>
    </Box>
  );
}
