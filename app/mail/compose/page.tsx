'use client';

import { useState, useEffect } from 'react';
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
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Collapse,
  Chip,
  Stack,
} from '@mui/material';
import {
  Send,
  ArrowBack,
  ExpandMore,
  ExpandLess,
  AttachFile,
  Delete,
} from '@mui/icons-material';

interface MailAddress {
  id: string;
  address: string;
  isActive: boolean;
}

export default function ComposePage() {
  const router = useRouter();
  const { data: session } = useSession();

  // Mail addresses
  const [mailAddresses, setMailAddresses] = useState<MailAddress[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);

  // Form fields
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [cc, setCc] = useState('');
  const [bcc, setBcc] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  // UI state
  const [showCcBcc, setShowCcBcc] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Load user's mail addresses
  useEffect(() => {
    const fetchMailAddresses = async () => {
      try {
        const response = await fetch('/api/mail/addresses');
        if (!response.ok) throw new Error('Failed to load mail addresses');

        const data = await response.json();
        setMailAddresses(data.filter((addr: MailAddress) => addr.isActive));

        // Set default sender
        if (data.length > 0) {
          setFrom(data[0].address);
        }
      } catch (err: any) {
        console.error('Error loading mail addresses:', err);
        setError('Impossibile caricare gli indirizzi email');
      } finally {
        setLoadingAddresses(false);
      }
    };

    fetchMailAddresses();
  }, []);

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSend = async () => {
    setError(null);
    setSuccess(false);

    // Validation
    if (!from) {
      setError('Seleziona un mittente');
      return;
    }

    if (!to) {
      setError('Il campo destinatario è obbligatorio');
      return;
    }

    // Validate email format
    const toEmails = to.split(',').map(e => e.trim());
    for (const email of toEmails) {
      if (!validateEmail(email)) {
        setError(`Indirizzo email non valido: ${email}`);
        return;
      }
    }

    if (cc) {
      const ccEmails = cc.split(',').map(e => e.trim());
      for (const email of ccEmails) {
        if (!validateEmail(email)) {
          setError(`Indirizzo CC non valido: ${email}`);
          return;
        }
      }
    }

    if (bcc) {
      const bccEmails = bcc.split(',').map(e => e.trim());
      for (const email of bccEmails) {
        if (!validateEmail(email)) {
          setError(`Indirizzo BCC non valido: ${email}`);
          return;
        }
      }
    }

    if (!subject) {
      setError('L\'oggetto è obbligatorio');
      return;
    }

    if (!body) {
      setError('Il messaggio non può essere vuoto');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/mail/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from,
          to: toEmails,
          cc: cc ? cc.split(',').map(e => e.trim()) : undefined,
          bcc: bcc ? bcc.split(',').map(e => e.trim()) : undefined,
          subject,
          text: body,
          html: `<p>${body.replace(/\n/g, '<br>')}</p>`,
          userId: (session?.user as any)?.id, // Aggiungi userId dalla sessione
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        throw new Error('Risposta non valida dal server');
      }

      if (!response.ok) {
        // Mostra errore dettagliato dal server
        const errorMessage = data.error || `Errore ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      setSuccess(true);
      setError(null);

      // Clear form
      setTo('');
      setCc('');
      setBcc('');
      setSubject('');
      setBody('');

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/mail/sent');
      }, 2000);
    } catch (err: any) {
      console.error('❌ Send error:', err);

      // Messaggi di errore user-friendly
      let errorMessage = err.message || 'Errore durante l\'invio dell\'email';

      if (err.message?.includes('ECONNREFUSED')) {
        errorMessage = 'Server SMTP non disponibile. Contatta l\'amministratore.';
      } else if (err.message?.includes('Invalid credentials')) {
        errorMessage = 'Credenziali non valide. Verifica le tue impostazioni.';
      } else if (err.message?.includes('timeout')) {
        errorMessage = 'Timeout durante l\'invio. Riprova tra qualche minuto.';
      } else if (err.message?.includes('Risposta non valida')) {
        errorMessage = 'Errore del server. Riprova più tardi.';
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setTo('');
    setCc('');
    setBcc('');
    setSubject('');
    setBody('');
    setError(null);
    setSuccess(false);
  };

  if (loadingAddresses) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (mailAddresses.length === 0) {
    return (
      <Box>
        <Alert severity="warning">
          Non hai indirizzi email abilitati. Contatta l'amministratore per configurare un indirizzo email.
        </Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => router.back()}
          sx={{ mt: 2 }}
        >
          Indietro
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => router.back()} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 600, flexGrow: 1 }}>
          Nuova Email
        </Typography>
        <Chip
          label={`Da: ${from}`}
          color="primary"
          variant="outlined"
          sx={{ fontWeight: 500 }}
        />
      </Box>

      {/* Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          ✅ Email inviata con successo! Reindirizzamento alla posta inviata...
        </Alert>
      )}

      {/* Form */}
      <Paper elevation={2} sx={{ overflow: 'hidden' }}>
        <Box sx={{ p: 3 }}>
          {/* From Field */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Da</InputLabel>
            <Select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              label="Da"
              required
            >
              {mailAddresses.map((addr) => (
                <MenuItem key={addr.id} value={addr.address}>
                  {addr.address}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* To Field */}
          <TextField
            fullWidth
            label="A"
            type="email"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="destinatario@example.com (separare con virgola per più destinatari)"
            required
            margin="normal"
            helperText="Puoi inserire più indirizzi separati da virgola"
          />

          {/* CC/BCC Toggle */}
          <Box sx={{ mt: 1, mb: 1 }}>
            <Button
              size="small"
              startIcon={showCcBcc ? <ExpandLess /> : <ExpandMore />}
              onClick={() => setShowCcBcc(!showCcBcc)}
              sx={{ textTransform: 'none' }}
            >
              {showCcBcc ? 'Nascondi' : 'Aggiungi'} CC/BCC
            </Button>
          </Box>

          {/* CC/BCC Fields */}
          <Collapse in={showCcBcc}>
            <TextField
              fullWidth
              label="CC"
              type="email"
              value={cc}
              onChange={(e) => setCc(e.target.value)}
              placeholder="cc@example.com"
              margin="normal"
              helperText="Copia conoscenza (visibile ai destinatari)"
            />

            <TextField
              fullWidth
              label="BCC"
              type="email"
              value={bcc}
              onChange={(e) => setBcc(e.target.value)}
              placeholder="bcc@example.com"
              margin="normal"
              helperText="Copia conoscenza nascosta (non visibile agli altri destinatari)"
            />
          </Collapse>

          <Divider sx={{ my: 2 }} />

          {/* Subject Field */}
          <TextField
            fullWidth
            label="Oggetto"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Inserisci l'oggetto dell'email"
            required
            margin="normal"
            sx={{
              '& .MuiOutlinedInput-root': {
                fontWeight: 500,
              },
            }}
          />

          {/* Body Field */}
          <TextField
            fullWidth
            label="Messaggio"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Scrivi il tuo messaggio qui..."
            multiline
            rows={14}
            margin="normal"
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                fontFamily: 'monospace',
              },
            }}
          />

          {/* Character count */}
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Caratteri: {body.length}
          </Typography>
        </Box>

        {/* Actions */}
        <Divider />
        <Box sx={{ p: 2, bgcolor: 'grey.50', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<Delete />}
              onClick={handleClear}
              disabled={loading}
              color="error"
            >
              Cancella
            </Button>
          </Stack>

          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              onClick={() => router.back()}
              disabled={loading}
            >
              Annulla
            </Button>
            <Button
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send />}
              onClick={handleSend}
              disabled={loading || !from || !to || !subject || !body}
              size="large"
              sx={{
                bgcolor: '#F97316',
                '&:hover': { bgcolor: '#EA580C' },
                '&:disabled': { bgcolor: 'grey.300' },
                minWidth: 120,
              }}
            >
              {loading ? 'Invio...' : 'Invia'}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}
