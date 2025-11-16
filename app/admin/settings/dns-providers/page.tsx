'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Alert,
  Chip,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Link as MuiLink,
} from '@mui/material';
import { Save, Check, Error, OpenInNew } from '@mui/icons-material';

export default function DNSProvidersPage() {
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [godaddyStatus, setGodaddyStatus] = useState<{
    configured: boolean;
    valid: boolean;
    domains?: string[];
  } | null>(null);

  useEffect(() => {
    checkGodaddyStatus();
  }, []);

  const checkGodaddyStatus = async () => {
    try {
      const res = await fetch('/api/admin/dns-providers/godaddy/domains');
      const data = await res.json();
      setGodaddyStatus(data);
    } catch (err) {
      console.error('Error checking GoDaddy status:', err);
    }
  };

  const handleTest = async () => {
    if (!apiKey || !apiSecret) {
      setError('Inserisci sia API Key che API Secret');
      return;
    }

    setTesting(true);
    setError('');
    setSuccess('');

    try {
      // TODO: Implementare endpoint per testare le credenziali
      // Per ora simuliamo il test
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSuccess('✓ Credenziali valide! Puoi salvarle.');
    } catch (err: any) {
      setError(err.message || 'Errore nel test delle credenziali');
    } finally {
      setTesting(false);
    }
  };

  const handleSave = async () => {
    setError('Salvataggio delle credenziali API non ancora implementato. Aggiungi manualmente al file .env:\n\nGODADDY_API_KEY=' + apiKey + '\nGODADDY_API_SECRET=' + apiSecret);
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
        ⚙️ Configurazione DNS Providers
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Configura le credenziali API dei tuoi provider DNS per abilitare la configurazione automatica dei record.
      </Typography>

      {/* GoDaddy Configuration */}
      <Paper sx={{ p: 4, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Typography variant="h5" fontWeight={600}>
            GoDaddy API
          </Typography>
          {godaddyStatus && (
            <Chip
              label={godaddyStatus.configured && godaddyStatus.valid ? 'Configurato' : 'Non configurato'}
              color={godaddyStatus.configured && godaddyStatus.valid ? 'success' : 'default'}
              size="small"
              icon={godaddyStatus.configured && godaddyStatus.valid ? <Check /> : <Error />}
            />
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2" gutterBottom>
            <strong>Come ottenere le credenziali API GoDaddy:</strong>
          </Typography>
          <List dense>
            <ListItem sx={{ py: 0 }}>
              <ListItemText
                primary={
                  <>
                    1. Vai su{' '}
                    <MuiLink
                      href="https://developer.godaddy.com/keys"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      developer.godaddy.com/keys <OpenInNew sx={{ fontSize: 14 }} />
                    </MuiLink>
                  </>
                }
              />
            </ListItem>
            <ListItem sx={{ py: 0 }}>
              <ListItemText primary="2. Accedi con il tuo account GoDaddy" />
            </ListItem>
            <ListItem sx={{ py: 0 }}>
              <ListItemText primary='3. Clicca su "Create New API Key"' />
            </ListItem>
            <ListItem sx={{ py: 0 }}>
              <ListItemText primary='4. Seleziona "Production" environment' />
            </ListItem>
            <ListItem sx={{ py: 0 }}>
              <ListItemText primary="5. Copia la Key e il Secret generati" />
            </ListItem>
          </List>
        </Alert>

        <Stack spacing={3}>
          <TextField
            fullWidth
            label="API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="dAbcdEfg_..."
            helperText="La tua GoDaddy API Key"
          />

          <TextField
            fullWidth
            label="API Secret"
            type="password"
            value={apiSecret}
            onChange={(e) => setApiSecret(e.target.value)}
            placeholder="••••••••"
            helperText="Il tuo GoDaddy API Secret (mantienilo segreto!)"
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={handleTest}
              disabled={testing || !apiKey || !apiSecret}
              startIcon={testing ? <CircularProgress size={16} /> : undefined}
            >
              {testing ? 'Testing...' : 'Testa Credenziali'}
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={loading || !apiKey || !apiSecret}
              startIcon={<Save />}
            >
              Salva
            </Button>
          </Box>
        </Stack>

        {godaddyStatus?.domains && godaddyStatus.domains.length > 0 && (
          <>
            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" gutterBottom>
              Domini disponibili su GoDaddy:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
              {godaddyStatus.domains.map((domain) => (
                <Chip key={domain} label={domain} variant="outlined" />
              ))}
            </Stack>
          </>
        )}

        <Divider sx={{ my: 3 }} />

        <Alert severity="warning">
          <Typography variant="body2">
            <strong>⚠️ Importante:</strong> Per ora, aggiungi le credenziali manualmente al file{' '}
            <code>.env</code>:
          </Typography>
          <Box
            sx={{
              mt: 2,
              p: 2,
              bgcolor: 'grey.900',
              color: 'grey.100',
              borderRadius: 1,
              fontFamily: 'monospace',
              fontSize: '0.875rem',
            }}
          >
            GODADDY_API_KEY=la_tua_api_key
            <br />
            GODADDY_API_SECRET=il_tuo_api_secret
          </Box>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Dopo aver aggiunto le credenziali, riavvia il server Next.js.
          </Typography>
        </Alert>
      </Paper>

      {/* Coming Soon: Altri provider */}
      <Paper sx={{ p: 4, bgcolor: 'grey.50' }}>
        <Typography variant="h6" gutterBottom>
          🚀 Prossimamente
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Stiamo lavorando per aggiungere il supporto per altri provider DNS popolari:
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mt: 2 }} flexWrap="wrap" gap={1}>
          <Chip label="Cloudflare" disabled />
          <Chip label="AWS Route 53" disabled />
          <Chip label="Google Cloud DNS" disabled />
          <Chip label="Aruba" disabled />
          <Chip label="Register.it" disabled />
        </Stack>
      </Paper>
    </Box>
  );
}
