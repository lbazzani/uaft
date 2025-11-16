'use client';

import { Box, Typography, Paper, List, ListItem, ListItemText, Chip } from '@mui/material';
import { Settings, CheckCircle } from '@mui/icons-material';

export default function ServerConfigPage() {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
        ⚙️ Configurazione Server
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Stato Server SMTP
        </Typography>
        <List>
          <ListItem>
            <ListItemText
              primary="Porta SMTP"
              secondary="25 (Standard)"
            />
            <Chip
              icon={<CheckCircle />}
              label="Attivo"
              color="success"
              size="small"
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Porta Submission"
              secondary="587 (TLS)"
            />
            <Chip
              icon={<CheckCircle />}
              label="Attivo"
              color="success"
              size="small"
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Hostname"
              secondary="localhost"
            />
          </ListItem>
        </List>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Database
        </Typography>
        <List>
          <ListItem>
            <ListItemText
              primary="PostgreSQL"
              secondary="Connesso a local_pgdb"
            />
            <Chip
              icon={<CheckCircle />}
              label="Connesso"
              color="success"
              size="small"
            />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
}
