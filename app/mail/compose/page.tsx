'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Send, ArrowBack } from '@mui/icons-material';

export default function ComposePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSend = async () => {
    setError(null);
    setSuccess(false);

    if (!to || !subject) {
      setError('Destinatario e oggetto sono obbligatori');
      return;
    }

    if (!session?.user?.email) {
      setError('Sessione non valida');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/mail/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: session.user.email,
          to,
          subject,
          text: body,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Errore invio email');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/mail/sent');
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => router.back()}
          sx={{ mr: 2 }}
        >
          Indietro
        </Button>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          ✉️ Componi Email
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Email inviata con successo! Reindirizzamento...
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <TextField
          fullWidth
          label="Destinatario"
          type="email"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="recipient@example.com"
          required
          margin="normal"
        />

        <TextField
          fullWidth
          label="Oggetto"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Oggetto dell'email"
          required
          margin="normal"
        />

        <TextField
          fullWidth
          label="Messaggio"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Scrivi il tuo messaggio..."
          multiline
          rows={12}
          margin="normal"
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
          <Button
            variant="outlined"
            onClick={() => router.back()}
            disabled={loading}
          >
            Annulla
          </Button>
          <Button
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} /> : <Send />}
            onClick={handleSend}
            disabled={loading}
            sx={{
              bgcolor: '#F97316',
              '&:hover': { bgcolor: '#EA580C' },
            }}
          >
            {loading ? 'Invio...' : 'Invia'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
