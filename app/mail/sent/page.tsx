'use client';

import {
  Box,
  Typography,
  Paper,
  List,
  ListItemButton,
  ListItemText,
  Chip,
} from '@mui/material';
import { Email, Send } from '@mui/icons-material';

export default function SentPage() {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          📤 Sent
        </Typography>
        <Chip label="0 emails" />
      </Box>

      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Send sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          Nessun messaggio inviato
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Le email inviate appariranno qui
        </Typography>
      </Paper>
    </Box>
  );
}
