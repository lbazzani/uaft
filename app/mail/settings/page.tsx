'use client';

import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Switch,
  Divider,
} from '@mui/material';
import { Settings } from '@mui/icons-material';
import { useState } from 'react';

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [autoArchive, setAutoArchive] = useState(false);
  const [readReceipts, setReadReceipts] = useState(false);

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Settings sx={{ fontSize: 36, mr: 2, color: '#F97316' }} />
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Impostazioni
        </Typography>
      </Box>

      <Paper>
        <List>
          <ListItem>
            <ListItemText
              primary="Notifiche Email"
              secondary="Ricevi notifiche per nuove email"
            />
            <Switch
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
            />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary="Archiviazione Automatica"
              secondary="Archivia automaticamente email lette dopo 30 giorni"
            />
            <Switch
              checked={autoArchive}
              onChange={(e) => setAutoArchive(e.target.checked)}
            />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary="Conferme di Lettura"
              secondary="Invia conferme quando leggi un messaggio"
            />
            <Switch
              checked={readReceipts}
              onChange={(e) => setReadReceipts(e.target.checked)}
            />
          </ListItem>
        </List>
      </Paper>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Informazioni Account
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          <strong>Email:</strong> lorenzo@uaft.it
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          <strong>Piano:</strong> Administrator
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Storage utilizzato:</strong> 0 MB / ∞
        </Typography>
      </Paper>
    </Box>
  );
}
