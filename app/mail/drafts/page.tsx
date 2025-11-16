'use client';

import {
  Box,
  Typography,
  Paper,
  Chip,
} from '@mui/material';
import { Drafts } from '@mui/icons-material';

export default function DraftsPage() {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          📝 Drafts
        </Typography>
        <Chip label="0 emails" />
      </Box>

      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Drafts sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          Nessuna bozza salvata
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Le bozze non inviate appariranno qui
        </Typography>
      </Paper>
    </Box>
  );
}
