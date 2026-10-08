'use client';

// Certificate management UI - Force reload v2
import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Tooltip,
  Stack,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Checkbox,
} from '@mui/material';
import {
  Domain,
  Add,
  Delete,
  ContentCopy,
  Check,
  Dns,
  ArrowForward,
  ArrowBack,
  CheckCircle,
  Info,
  Warning,
  Verified,
  Email,
  Lock,
  LockOpen,
  Schedule,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

interface MailDomain {
  id: string;
  domain: string;
  mailSubdomain: string | null;
  serverIp: string | null;
  aRecord: string | null;
  mxRecord: string | null;
  ptrRecord: string | null;
  spfRecord: string | null;
  dkimPublicKey: string | null;
  dkimSelector: string | null;
  dmarcRecord: string | null;
  isActive: boolean;
  createdAt: string;
  tlsCertStatus?: string | null;
  tlsCertExpiry?: string | null;
  tlsCertEmail?: string | null;
  tlsAutoRenew?: boolean;
  addresses: Array<{
    id: string;
    address: string;
    isActive: boolean;
  }>;
}

const wizardSteps = [
  'Inserisci il Dominio',
  'Configura Record DNS',
  'Verifica e Attiva',
];

export default function DomainsPage() {
  const router = useRouter();
  const [domains, setDomains] = useState<MailDomain[]>([]);
  const [loading, setLoading] = useState(true);
  const [openWizard, setOpenWizard] = useState(false);
  const [openDnsDialog, setOpenDnsDialog] = useState(false);
  const [openCertDialog, setOpenCertDialog] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<MailDomain | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copiedField, setCopiedField] = useState('');
  const [certEmail, setCertEmail] = useState('');
  const [certAutoRenew, setCertAutoRenew] = useState(false);
  const [certLoading, setCertLoading] = useState(false);

  // Wizard state
  const [activeStep, setActiveStep] = useState(0);
  const [newDomain, setNewDomain] = useState<MailDomain | null>(null);
  const [formData, setFormData] = useState({
    domain: '',
  });

  useEffect(() => {
    fetchDomains();
  }, []);

  const fetchDomains = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/domains');
      if (!res.ok) throw new Error('Failed to fetch domains');
      const data = await res.json();
      setDomains(data);
    } catch (err) {
      setError('Errore nel caricamento dei domini');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    if (activeStep === 0) {
      // Step 1: Crea il dominio
      try {
        setError('');
        const res = await fetch('/api/admin/domains', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to create domain');
        }

        const domain = await res.json();
        setNewDomain(domain);
        setActiveStep(1);
      } catch (err: any) {
        setError(err.message);
      }
    } else if (activeStep === 1) {
      // Step 2: Vai alla verifica
      setActiveStep(2);
    } else if (activeStep === 2) {
      // Step 3: Completa il wizard
      setSuccess('Dominio configurato con successo!');
      handleCloseWizard();
      fetchDomains();
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleCloseWizard = () => {
    setOpenWizard(false);
    setActiveStep(0);
    setNewDomain(null);
    setFormData({
      domain: '',
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo dominio?')) return;

    try {
      setError('');
      const res = await fetch(`/api/admin/domains/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || 'Failed to delete domain');
      }

      setSuccess('Dominio eliminato con successo!');
      fetchDomains();
    } catch (err: any) {
      setError(err.message || 'Errore nell\'eliminazione del dominio');
    }
  };

  const handleToggleActive = async (domain: MailDomain) => {
    try {
      const res = await fetch(`/api/admin/domains/${domain.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !domain.isActive }),
      });

      if (!res.ok) throw new Error('Failed to update domain');

      setSuccess('Stato dominio aggiornato!');
      fetchDomains();
    } catch (err) {
      setError('Errore nell\'aggiornamento del dominio');
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(''), 2000);
  };

  const showDnsRecords = (domain: MailDomain) => {
    setSelectedDomain(domain);
    setOpenDnsDialog(true);
  };

  const getCertificateChip = (domain: MailDomain) => {
    const status = domain.tlsCertStatus || 'missing';

    const statusConfig: Record<string, { label: string; color: 'success' | 'warning' | 'error' | 'default'; icon: React.ReactElement }> = {
      valid: { label: 'Valido', color: 'success', icon: <Lock fontSize="small" /> },
      expiring: { label: 'In scadenza', color: 'warning', icon: <Schedule fontSize="small" /> },
      expired: { label: 'Scaduto', color: 'error', icon: <LockOpen fontSize="small" /> },
      missing: { label: 'Non configurato', color: 'default', icon: <LockOpen fontSize="small" /> },
      failed: { label: 'Errore', color: 'error', icon: <ErrorIcon fontSize="small" /> },
    };

    const config = statusConfig[status] || statusConfig.missing;

    // Calcola giorni rimanenti se certificato valido o in scadenza
    let daysLeft = null;
    if (domain.tlsCertExpiry && (status === 'valid' || status === 'expiring')) {
      const expiry = new Date(domain.tlsCertExpiry);
      const now = new Date();
      daysLeft = Math.floor((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    }

    return (
      <Tooltip
        title={
          daysLeft !== null
            ? `Scade tra ${daysLeft} giorni (${new Date(domain.tlsCertExpiry!).toLocaleDateString('it-IT')})`
            : config.label
        }
      >
        <Chip
          icon={config.icon}
          label={config.label}
          color={config.color}
          size="small"
          variant="outlined"
        />
      </Tooltip>
    );
  };

  const handleOpenCertDialog = (domain: MailDomain) => {
    setSelectedDomain(domain);
    setCertEmail(domain.tlsCertEmail || '');
    setCertAutoRenew(domain.tlsAutoRenew || false);
    setOpenCertDialog(true);
  };

  const handleGenerateCertificate = async () => {
    if (!selectedDomain) return;

    if (!certEmail) {
      setError('Email richiesta per Let\'s Encrypt');
      return;
    }

    try {
      setCertLoading(true);
      setError('');

      // Step 1: Configura nginx per il mail subdomain
      console.log('🔧 Configurando nginx...');
      const nginxRes = await fetch(`/api/admin/domains/${selectedDomain.id}/setup-nginx`, {
        method: 'POST',
      });

      if (!nginxRes.ok) {
        const nginxData = await nginxRes.json();
        throw new Error(`Errore configurazione nginx: ${nginxData.message || nginxData.error}`);
      }

      console.log('✅ Nginx configurato');

      // Step 2: Genera certificato Let's Encrypt
      console.log('🔐 Generando certificato SSL...');
      const res = await fetch(`/api/admin/domains/${selectedDomain.id}/certificate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: certEmail,
          autoRenew: certAutoRenew,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || 'Errore nella generazione del certificato');
      }

      setSuccess('Certificato SSL generato con successo!');
      setOpenCertDialog(false);
      fetchDomains(); // Ricarica i domini per aggiornare lo stato
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCertLoading(false);
    }
  };

  const handleDeleteCertificate = async () => {
    if (!selectedDomain) return;

    if (!confirm('Sei sicuro di voler eliminare il certificato SSL? Il server mail non potrà più usare TLS per questo dominio.')) {
      return;
    }

    try {
      setCertLoading(true);
      setError('');

      const res = await fetch(`/api/admin/domains/${selectedDomain.id}/certificate`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Errore nella rimozione del certificato');
      }

      setSuccess('Certificato SSL rimosso con successo');
      setOpenCertDialog(false);
      fetchDomains();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCertLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          🌐 Domini Email
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenWizard(true)}
          size="large"
        >
          Configura Nuovo Dominio
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {domains.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Domain sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Nessun dominio configurato
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
            Aggiungi domini per iniziare a ricevere e inviare email
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenWizard(true)}
            size="large"
          >
            Inizia Configurazione Guidata
          </Button>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Dominio</strong></TableCell>
                <TableCell><strong>Indirizzi</strong></TableCell>
                <TableCell><strong>Record MX</strong></TableCell>
                <TableCell><strong>Certificato SSL/TLS</strong></TableCell>
                <TableCell><strong>Stato</strong></TableCell>
                <TableCell><strong>Azioni</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {domains.map((domain) => (
                <TableRow key={domain.id}>
                  <TableCell>
                    <Typography variant="body1" fontWeight={600}>
                      {domain.domain}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Creato: {new Date(domain.createdAt).toLocaleDateString('it-IT')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={`${domain.addresses.length} indirizzi`}
                      size="small"
                      color="primary"
                      variant="outlined"
                      onClick={() => router.push(`/admin/domains/${domain.id}/emails`)}
                      sx={{ cursor: 'pointer' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                      {domain.mxRecord || 'Non configurato'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {getCertificateChip(domain)}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={domain.isActive ? 'Attivo' : 'Disattivo'}
                      color={domain.isActive ? 'success' : 'default'}
                      size="small"
                      onClick={() => handleToggleActive(domain)}
                      sx={{ cursor: 'pointer' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Gestisci Email">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => router.push(`/admin/domains/${domain.id}/emails`)}
                        >
                          <Email />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Visualizza DNS">
                        <IconButton
                          size="small"
                          color="info"
                          onClick={() => showDnsRecords(domain)}
                        >
                          <Dns />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Gestisci Certificato SSL">
                        <IconButton
                          size="small"
                          color="secondary"
                          onClick={() => handleOpenCertDialog(domain)}
                        >
                          <Lock />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Elimina">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(domain.id)}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Wizard Dialog */}
      <Dialog
        open={openWizard}
        onClose={handleCloseWizard}
        maxWidth="md"
        fullWidth
        disableEscapeKeyDown={activeStep > 0}
      >
        <DialogTitle>
          <Box>
            <Typography variant="h5" component="div" fontWeight={700}>
              Configurazione Guidata Dominio Email
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Ti guideremo passo-passo nella configurazione del tuo dominio email
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Stepper activeStep={activeStep} orientation="vertical" sx={{ mt: 2 }}>
            {/* Step 1: Inserisci Dominio */}
            <Step>
              <StepLabel>
                <Typography variant="h6">Inserisci il Dominio</Typography>
              </StepLabel>
              <StepContent>
                <Alert severity="info" icon={<Info />} sx={{ mb: 3 }}>
                  <Typography variant="body2" fontWeight={600} gutterBottom>
                    📧 Il tuo dominio email
                  </Typography>
                  <Typography variant="body2">
                    Inserisci il dominio che vuoi utilizzare per inviare e ricevere email (es: tuaazienda.com).
                    Le email avranno il formato <strong>nome@tuodominio.com</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>⚠️ Importante:</strong> Assicurati di avere accesso al pannello DNS del tuo provider di dominio
                    (es: GoDaddy, Aruba, Register, Cloudflare) per completare la configurazione.
                  </Typography>
                </Alert>

                <TextField
                  autoFocus
                  fullWidth
                  label="Nome Dominio"
                  placeholder="tuaazienda.com"
                  value={formData.domain}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  helperText="✓ Corretto: tuaazienda.com | ✗ Non usare: www.tuaazienda.com o https://tuaazienda.com"
                  sx={{ mb: 3 }}
                />

                <Alert severity="success" icon={<CheckCircle />} sx={{ mb: 2 }}>
                  <Typography variant="body2" fontWeight={600} gutterBottom>
                    🔐 Configurazione Automatica della Sicurezza
                  </Typography>
                  <Typography variant="body2">
                    Il sistema genererà automaticamente tutte le chiavi di sicurezza (DKIM) e configurerà i record DNS
                    ottimizzati per il server. Non dovrai preoccuparti di nulla!
                  </Typography>
                </Alert>

                <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    ✅ Cosa serve per completare la configurazione:
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircle color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Accesso al pannello DNS del tuo provider" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircle color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Permessi per modificare i record DNS" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircle color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Circa 10-15 minuti di tempo" />
                    </ListItem>
                  </List>
                </Box>
              </StepContent>
            </Step>

            {/* Step 2: Configura DNS */}
            <Step>
              <StepLabel>
                <Typography variant="h6">Configura i Record DNS</Typography>
              </StepLabel>
              <StepContent>
                {/* Info about auto-generated DNS */}
                <Alert severity="success" icon={<CheckCircle />} sx={{ mb: 3 }}>
                  <Typography variant="body2" fontWeight={600} gutterBottom>
                    ✅ Record DNS Generati Automaticamente
                  </Typography>
                  <Typography variant="body2">
                    Abbiamo generato automaticamente tutti i record DNS ottimizzati per il tuo server, incluse le chiavi
                    di sicurezza DKIM uniche per il dominio <strong>{newDomain?.domain}</strong>. I record SPF includono
                    l'indirizzo IP del server per garantire la massima deliverability.
                  </Typography>
                </Alert>

                {/* Auto-Configuration Banner for GoDaddy */}
                <Paper
                  sx={{
                    p: 3,
                    mb: 3,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                  }}
                >
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    🚀 Configurazione Automatica Disponibile!
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Se il tuo dominio <strong>{newDomain?.domain}</strong> è registrato su GoDaddy,
                    possiamo configurare automaticamente tutti i record DNS per te con un solo clic!
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: 'white',
                      color: 'primary.main',
                      '&:hover': { bgcolor: 'grey.100' },
                    }}
                    onClick={async () => {
                      if (!newDomain) return;
                      try {
                        setError('');
                        const res = await fetch(`/api/admin/domains/${newDomain.id}/auto-configure`, {
                          method: 'POST',
                        });
                        const data = await res.json();

                        if (!res.ok) {
                          throw new Error(data.message || 'Configurazione fallita');
                        }

                        setSuccess('✓ DNS configurati automaticamente su GoDaddy!');
                        setActiveStep(2); // Vai direttamente alla verifica
                      } catch (err: any) {
                        setError(err.message);
                      }
                    }}
                  >
                    Configura Automaticamente con GoDaddy
                  </Button>
                  <Typography variant="caption" display="block" sx={{ mt: 2, opacity: 0.9 }}>
                    💡 Assicurati di aver configurato le credenziali API di GoDaddy nelle impostazioni
                  </Typography>
                </Paper>

                <Divider sx={{ my: 3 }}>
                  <Chip label="OPPURE configura manualmente" />
                </Divider>

                <Alert severity="warning" icon={<Warning />} sx={{ mb: 3 }}>
                  <Typography variant="body2" fontWeight={600}>
                    Accedi al pannello DNS del tuo provider e aggiungi i seguenti record:
                  </Typography>
                </Alert>

                <Stack spacing={3}>
                  {/* Record A */}
                  {newDomain?.aRecord && newDomain?.mailSubdomain && (
                    <Paper variant="outlined" sx={{ p: 3, bgcolor: 'primary.50', borderColor: 'primary.main', borderWidth: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          🌐 0. Record A (Sottodominio Mail) ⭐ IMPORTANTE
                        </Typography>
                      </Box>

                      <Alert severity="info" sx={{ mb: 2 }}>
                        <Typography variant="body2" fontWeight={600} gutterBottom>
                          Questo record crea il sottodominio <strong>{newDomain.mailSubdomain}</strong>
                        </Typography>
                        <Typography variant="body2">
                          Separando il server mail dal sito web principale ottieni:
                        </Typography>
                        <ul style={{ marginTop: 8, marginBottom: 0 }}>
                          <li>Certificati SSL separati per web e mail</li>
                          <li>Gestione indipendente dei servizi</li>
                          <li>Migliore deliverability delle email</li>
                        </ul>
                      </Alert>

                      <Typography variant="body2" color="text.secondary" paragraph>
                        Questo record fa puntare <strong>mail.{newDomain.domain}</strong> all'indirizzo IP del server mail.
                      </Typography>

                      <Divider sx={{ my: 2 }} />

                      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                        Cosa fare nel tuo pannello DNS:
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemText
                            primary="1. Vai alla sezione 'Record A' o 'DNS Records'"
                            secondary="Solitamente si trova nelle impostazioni DNS del dominio"
                          />
                        </ListItem>
                        <ListItem sx={{ display: 'block' }}>
                          <ListItemText
                            primary="2. Aggiungi un nuovo record A con questi valori:"
                          />
                          <Box sx={{ mt: 1, p: 1.5, bgcolor: 'grey.100', borderRadius: 1, fontFamily: 'monospace' }}>
                            <Typography variant="caption" display="block">Tipo: A</Typography>
                            <Typography variant="caption" display="block">Nome/Host: mail</Typography>
                            <Typography variant="caption" display="block">Valore/IP: {newDomain.aRecord}</Typography>
                            <Typography variant="caption" display="block">TTL: 3600 (1 ora)</Typography>
                          </Box>
                        </ListItem>
                      </List>

                      <Alert severity="success" sx={{ mt: 2 }}>
                        <Typography variant="caption" fontWeight={600} gutterBottom display="block">
                          🔐 Dopo la configurazione DNS
                        </Typography>
                        <Typography variant="caption">
                          Una volta che il record A sarà propagato, potrai generare il certificato SSL cliccando sull'icona lucchetto nella lista domini. Il sistema configurerà automaticamente nginx per <strong>{newDomain.mailSubdomain}</strong> e genererà il certificato Let's Encrypt senza bisogno di altri interventi manuali.
                        </Typography>
                      </Alert>

                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
                        <Button
                          size="small"
                          startIcon={copiedField === 'a-ip' ? <Check /> : <ContentCopy />}
                          onClick={() => copyToClipboard(newDomain.aRecord || '', 'a-ip')}
                        >
                          {copiedField === 'a-ip' ? 'Copiato!' : 'Copia IP'}
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={copiedField === 'a-subdomain' ? <Check /> : <ContentCopy />}
                          onClick={() => copyToClipboard(newDomain.mailSubdomain || '', 'a-subdomain')}
                        >
                          {copiedField === 'a-subdomain' ? 'Copiato!' : 'Copia Sottodominio'}
                        </Button>
                      </Box>
                    </Paper>
                  )}

                  {/* MX Record */}
                  <Paper variant="outlined" sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        📧 1. Record MX (Mail Exchange)
                      </Typography>
                    </Box>

                    <Typography variant="body2" color="text.secondary" paragraph>
                      Il record MX indica dove devono essere consegnate le email per il tuo dominio.
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Cosa fare nel tuo pannello DNS:
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText
                          primary="1. Vai alla sezione 'Record MX' o 'Mail Records'"
                          secondary="Solitamente si trova nelle impostazioni DNS"
                        />
                      </ListItem>
                      <ListItem sx={{ display: 'block' }}>
                        <ListItemText
                          primary="2. Aggiungi un nuovo record MX con questi valori:"
                        />
                        <Box sx={{ mt: 1, p: 1.5, bgcolor: 'grey.100', borderRadius: 1, fontFamily: 'monospace' }}>
                          <Typography variant="caption" display="block">Tipo: MX</Typography>
                          <Typography variant="caption" display="block">Nome/Host: @ (o lascia vuoto)</Typography>
                          <Typography variant="caption" display="block">Valore: {newDomain?.mxRecord}</Typography>
                          <Typography variant="caption" display="block">Priorità: 10</Typography>
                        </Box>
                      </ListItem>
                    </List>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                      <Button
                        size="small"
                        startIcon={copiedField === 'mx' ? <Check /> : <ContentCopy />}
                        onClick={() => copyToClipboard(newDomain?.mxRecord || '', 'mx')}
                      >
                        {copiedField === 'mx' ? 'Copiato!' : 'Copia Valore'}
                      </Button>
                    </Box>
                  </Paper>

                  {/* PTR Record (Reverse DNS) */}
                  {newDomain?.ptrRecord && newDomain?.serverIp && (
                    <Paper variant="outlined" sx={{ p: 3, bgcolor: 'warning.50', borderColor: 'warning.main' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          🔄 2. Record PTR (Reverse DNS) ⚠️ SPECIALE
                        </Typography>
                      </Box>

                      <Alert severity="warning" icon={<Warning />} sx={{ mb: 2 }}>
                        <Typography variant="body2" fontWeight={600} gutterBottom>
                          ⚠️ Il record PTR NON si configura nel pannello DNS del dominio!
                        </Typography>
                        <Typography variant="body2">
                          Il record PTR (Reverse DNS) deve essere configurato dal tuo provider hosting/ISP
                          (chi gestisce l'IP del server), NON nel pannello DNS del dominio.
                        </Typography>
                      </Alert>

                      <Typography variant="body2" color="text.secondary" paragraph>
                        Il record PTR fa il "reverse lookup" dell'IP verso il dominio. È fondamentale per evitare
                        che le tue email finiscano in spam. Quando un server ricevente controlla da dove arriva
                        l'email, verifica che l'IP {newDomain.serverIp} punti a {newDomain.ptrRecord}.
                      </Typography>

                      <Divider sx={{ my: 2 }} />

                      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                        Come configurare il PTR per i provider comuni:
                      </Typography>

                      <List dense>
                        <ListItem>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <Info color="primary" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText
                            primary="☁️ Microsoft Azure"
                            secondary="Impostazioni VM → Networking → Configurazione IP → DNS name label. Configura il PTR tramite Azure Portal."
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <Info color="primary" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText
                            primary="☁️ AWS (Amazon)"
                            secondary="Richiedi PTR record tramite AWS Support. Va su Route 53 per configurare il reverse DNS."
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <Info color="primary" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText
                            primary="🌊 DigitalOcean"
                            secondary="Droplet Settings → Networking → Reverse DNS. Inserisci il nome del dominio."
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <Info color="primary" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText
                            primary="☁️ Google Cloud"
                            secondary="Compute Engine → VM Instance → Edit → Network interfaces → External IP. Configura PTR."
                          />
                        </ListItem>
                      </List>

                      <Alert severity="info" sx={{ mt: 2 }}>
                        <Typography variant="body2" fontWeight={600} gutterBottom>
                          🔍 Per verificare se il PTR è configurato correttamente:
                        </Typography>
                        <Box sx={{ mt: 1, p: 1.5, bgcolor: 'grey.900', color: 'white', borderRadius: 1, fontFamily: 'monospace' }}>
                          <Typography variant="caption" display="block">
                            $ dig -x {newDomain.serverIp}
                          </Typography>
                        </Box>
                        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                          Dovrebbe restituire: {newDomain.ptrRecord}
                        </Typography>
                      </Alert>

                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
                        <Button
                          size="small"
                          startIcon={copiedField === 'ptr-ip' ? <Check /> : <ContentCopy />}
                          onClick={() => copyToClipboard(newDomain.serverIp || '', 'ptr-ip')}
                        >
                          {copiedField === 'ptr-ip' ? 'Copiato!' : 'Copia IP'}
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={copiedField === 'ptr-value' ? <Check /> : <ContentCopy />}
                          onClick={() => copyToClipboard(newDomain.ptrRecord || '', 'ptr-value')}
                        >
                          {copiedField === 'ptr-value' ? 'Copiato!' : 'Copia Valore PTR'}
                        </Button>
                      </Box>
                    </Paper>
                  )}

                  {/* SPF Record */}
                  <Paper variant="outlined" sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        🛡️ 3. Record SPF (Sender Policy Framework)
                      </Typography>
                    </Box>

                    <Typography variant="body2" color="text.secondary" paragraph>
                      SPF previene lo spoofing del dominio, autorizzando quali server possono inviare email per tuo conto.
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Cosa fare nel tuo pannello DNS:
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText
                          primary="1. Vai alla sezione 'Record TXT'"
                          secondary="Aggiungi un nuovo record di tipo TXT"
                        />
                      </ListItem>
                      <ListItem sx={{ display: 'block' }}>
                        <ListItemText
                          primary="2. Inserisci questi valori:"
                        />
                        <Box sx={{ mt: 1, p: 1.5, bgcolor: 'grey.100', borderRadius: 1, fontFamily: 'monospace' }}>
                          <Typography variant="caption" display="block">Tipo: TXT</Typography>
                          <Typography variant="caption" display="block">Nome/Host: @ (o lascia vuoto)</Typography>
                          <Typography variant="caption" display="block">Valore: {newDomain?.spfRecord}</Typography>
                        </Box>
                      </ListItem>
                    </List>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                      <Button
                        size="small"
                        startIcon={copiedField === 'spf' ? <Check /> : <ContentCopy />}
                        onClick={() => copyToClipboard(newDomain?.spfRecord || '', 'spf')}
                      >
                        {copiedField === 'spf' ? 'Copiato!' : 'Copia Valore'}
                      </Button>
                    </Box>
                  </Paper>

                  {/* DKIM Record */}
                  <Paper variant="outlined" sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        🔑 4. Record DKIM (DomainKeys Identified Mail)
                      </Typography>
                    </Box>

                    <Typography variant="body2" color="text.secondary" paragraph>
                      DKIM aggiunge una firma digitale alle tue email per verificarne l'autenticità.
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Cosa fare nel tuo pannello DNS:
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText
                          primary="1. Aggiungi un altro record TXT"
                          secondary="Questo record ha un nome host specifico"
                        />
                      </ListItem>
                      <ListItem sx={{ display: 'block' }}>
                        <ListItemText
                          primary="2. Inserisci questi valori:"
                        />
                        <Box sx={{ mt: 1, p: 1.5, bgcolor: 'grey.100', borderRadius: 1, fontFamily: 'monospace' }}>
                          <Typography variant="caption" display="block">Tipo: TXT</Typography>
                          <Typography variant="caption" display="block">
                            Nome/Host: {newDomain?.dkimSelector}._domainkey
                          </Typography>
                          <Typography variant="caption" display="block" sx={{ wordBreak: 'break-all' }}>
                            Valore: {newDomain?.dkimPublicKey}
                          </Typography>
                        </Box>
                      </ListItem>
                    </List>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                      <Button
                        size="small"
                        startIcon={copiedField === 'dkim' ? <Check /> : <ContentCopy />}
                        onClick={() => copyToClipboard(newDomain?.dkimPublicKey || '', 'dkim')}
                      >
                        {copiedField === 'dkim' ? 'Copiato!' : 'Copia Valore'}
                      </Button>
                    </Box>
                  </Paper>

                  {/* DMARC Record */}
                  <Paper variant="outlined" sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        📊 5. Record DMARC (Domain-based Message Authentication)
                      </Typography>
                    </Box>

                    <Typography variant="body2" color="text.secondary" paragraph>
                      DMARC definisce come gestire le email che falliscono i controlli SPF e DKIM.
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Cosa fare nel tuo pannello DNS:
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText
                          primary="1. Aggiungi l'ultimo record TXT"
                        />
                      </ListItem>
                      <ListItem sx={{ display: 'block' }}>
                        <ListItemText
                          primary="2. Inserisci questi valori:"
                        />
                        <Box sx={{ mt: 1, p: 1.5, bgcolor: 'grey.100', borderRadius: 1, fontFamily: 'monospace' }}>
                          <Typography variant="caption" display="block">Tipo: TXT</Typography>
                          <Typography variant="caption" display="block">Nome/Host: _dmarc</Typography>
                          <Typography variant="caption" display="block">Valore: {newDomain?.dmarcRecord}</Typography>
                        </Box>
                      </ListItem>
                    </List>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                      <Button
                        size="small"
                        startIcon={copiedField === 'dmarc' ? <Check /> : <ContentCopy />}
                        onClick={() => copyToClipboard(newDomain?.dmarcRecord || '', 'dmarc')}
                      >
                        {copiedField === 'dmarc' ? 'Copiato!' : 'Copia Valore'}
                      </Button>
                    </Box>
                  </Paper>
                </Stack>

                <Alert severity="info" sx={{ mt: 3 }}>
                  <Typography variant="body2">
                    <strong>⏱️ Tempo di propagazione:</strong> I record DNS possono richiedere da pochi minuti fino a 48 ore per propagarsi completamente in Internet.
                  </Typography>
                </Alert>
              </StepContent>
            </Step>

            {/* Step 3: Verifica */}
            <Step>
              <StepLabel>
                <Typography variant="h6">Verifica e Attiva</Typography>
              </StepLabel>
              <StepContent>
                <Alert severity="success" icon={<Verified />} sx={{ mb: 3 }}>
                  <Typography variant="body2" fontWeight={600}>
                    Ottimo lavoro! Hai completato la configurazione DNS.
                  </Typography>
                </Alert>

                <Paper sx={{ p: 3, bgcolor: 'grey.50' }}>
                  <Typography variant="h6" gutterBottom>
                    ✅ Checklist Finale
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Record MX configurato"
                        secondary="Le email possono essere ricevute"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Record SPF configurato"
                        secondary="Protezione anti-spoofing attiva"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Record DKIM configurato"
                        secondary="Firma digitale email attiva"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Record DMARC configurato"
                        secondary="Policy di autenticazione attiva"
                      />
                    </ListItem>
                  </List>
                </Paper>

                <Alert severity="info" sx={{ mt: 3 }}>
                  <Typography variant="body2" fontWeight={600} gutterBottom>
                    📋 Prossimi passi:
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <Typography variant="body2" fontWeight={600}>1.</Typography>
                      </ListItemIcon>
                      <ListItemText
                        primary="Attendi la propagazione DNS (15-60 minuti)"
                        secondary="Verifica con: dig mail.uaft.it"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <Typography variant="body2" fontWeight={600}>2.</Typography>
                      </ListItemIcon>
                      <ListItemText
                        primary="Genera il certificato SSL/TLS"
                        secondary="Vai nella lista domini → Clicca sull'icona lucchetto → Genera Certificato"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <Typography variant="body2" fontWeight={600}>3.</Typography>
                      </ListItemIcon>
                      <ListItemText
                        primary="Crea indirizzi email per questo dominio"
                        secondary="Vai in 'Indirizzi Email' e crea i tuoi account"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <Typography variant="body2" fontWeight={600}>4.</Typography>
                      </ListItemIcon>
                      <ListItemText
                        primary="Inizia a inviare e ricevere email!"
                        secondary="Il tuo server mail è pronto 🚀"
                      />
                    </ListItem>
                  </List>
                </Alert>

                {/* Sezione certificato SSL */}
                <Paper sx={{ p: 3, mt: 3, bgcolor: 'success.50', border: '2px solid', borderColor: 'success.main' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Lock color="success" />
                    <Typography variant="h6" fontWeight={600} color="success.dark">
                      Certificato SSL/TLS - Processo Automatico
                    </Typography>
                  </Box>
                  <Typography variant="body2" paragraph>
                    Il sistema configurerà <strong>automaticamente</strong> tutto il necessario quando genererai il certificato:
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircle color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary="✨ Configurazione nginx"
                        secondary={`Server block per ${newDomain?.mailSubdomain || 'mail.domain.com'}`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircle color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary="✨ Generazione certificato Let's Encrypt"
                        secondary="Certificato SSL gratuito valido 90 giorni"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircle color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary="✨ Configurazione server SMTP con TLS"
                        secondary="Connessioni sicure su porte 25, 587, 465"
                      />
                    </ListItem>
                  </List>
                  <Alert severity="success" sx={{ mt: 2 }}>
                    <Typography variant="caption">
                      <strong>💡 Importante:</strong> Il certificato sarà generato per <strong>{newDomain?.mailSubdomain || 'mail.domain.com'}</strong> (separato dal certificato web di {newDomain?.domain}). Questo garantisce la separazione tra web server e mail server.
                    </Typography>
                  </Alert>
                </Paper>

                <Box sx={{ mt: 3, p: 2, border: '2px dashed', borderColor: 'primary.main', borderRadius: 2 }}>
                  <Typography variant="subtitle2" fontWeight={600} color="primary" gutterBottom>
                    💡 Suggerimento Pro
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Puoi verificare la corretta configurazione dei record DNS usando strumenti online come
                    MXToolbox.com o DNSChecker.org. Cerca il tuo dominio per verificare che tutti i record
                    siano stati propagati correttamente.
                  </Typography>
                </Box>
              </StepContent>
            </Step>
          </Stepper>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseWizard} disabled={activeStep === 1}>
            {activeStep === 0 ? 'Annulla' : 'Chiudi'}
          </Button>
          <Box sx={{ flex: 1 }} />
          {activeStep > 0 && activeStep < 2 && (
            <Button onClick={handleBack} startIcon={<ArrowBack />}>
              Indietro
            </Button>
          )}
          <Button
            variant="contained"
            onClick={handleNext}
            endIcon={activeStep < 2 ? <ArrowForward /> : <Check />}
            disabled={activeStep === 0 && !formData.domain}
          >
            {activeStep === 0 && 'Crea Dominio e Continua'}
            {activeStep === 1 && 'Ho Configurato i DNS'}
            {activeStep === 2 && 'Completa Configurazione'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog DNS Records (Quick View) */}
      <Dialog
        open={openDnsDialog}
        onClose={() => setOpenDnsDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Record DNS per {selectedDomain?.domain}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Record DNS configurati per questo dominio:
          </Typography>

          <Stack spacing={3}>
            {/* Record A */}
            {selectedDomain?.aRecord && selectedDomain?.mailSubdomain && (
              <Box>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                  🌐 Record A (Mail Subdomain)
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, bgcolor: 'primary.50' }}>
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                    Nome: mail.{selectedDomain.domain}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', flex: 1 }}>
                      {selectedDomain.aRecord}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => copyToClipboard(selectedDomain.aRecord || '', 'a-view')}
                    >
                      {copiedField === 'a-view' ? <Check color="success" /> : <ContentCopy />}
                    </IconButton>
                  </Box>
                </Paper>
              </Box>
            )}

            {/* MX Record */}
            <Box>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                📧 Record MX
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', flex: 1 }}>
                    {selectedDomain?.mxRecord}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => copyToClipboard(selectedDomain?.mxRecord || '', 'mx-view')}
                  >
                    {copiedField === 'mx-view' ? <Check color="success" /> : <ContentCopy />}
                  </IconButton>
                </Box>
              </Paper>
            </Box>

            {/* PTR Record */}
            {selectedDomain?.ptrRecord && selectedDomain?.serverIp && (
              <Box>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                  🔄 Record PTR (Reverse DNS)
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, bgcolor: 'warning.50' }}>
                  <Alert severity="warning" size="small" sx={{ mb: 1 }}>
                    Da configurare nel pannello del provider hosting
                  </Alert>
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                    IP: {selectedDomain.serverIp}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', flex: 1 }}>
                      {selectedDomain.ptrRecord}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => copyToClipboard(selectedDomain.ptrRecord || '', 'ptr-view')}
                    >
                      {copiedField === 'ptr-view' ? <Check color="success" /> : <ContentCopy />}
                    </IconButton>
                  </Box>
                </Paper>
              </Box>
            )}

            {/* SPF Record */}
            <Box>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                🛡️ Record SPF (TXT)
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', flex: 1 }}>
                    {selectedDomain?.spfRecord}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => copyToClipboard(selectedDomain?.spfRecord || '', 'spf-view')}
                  >
                    {copiedField === 'spf-view' ? <Check color="success" /> : <ContentCopy />}
                  </IconButton>
                </Box>
              </Paper>
            </Box>

            {/* DKIM Record */}
            <Box>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                🔑 Record DKIM (TXT)
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                  Nome: {selectedDomain?.dkimSelector}._domainkey.{selectedDomain?.domain}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography
                    variant="body2"
                    sx={{ fontFamily: 'monospace', flex: 1, wordBreak: 'break-all' }}
                  >
                    {selectedDomain?.dkimPublicKey}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => copyToClipboard(selectedDomain?.dkimPublicKey || '', 'dkim-view')}
                  >
                    {copiedField === 'dkim-view' ? <Check color="success" /> : <ContentCopy />}
                  </IconButton>
                </Box>
              </Paper>
            </Box>

            {/* DMARC Record */}
            <Box>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                📊 Record DMARC (TXT)
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                  Nome: _dmarc.{selectedDomain?.domain}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', flex: 1 }}>
                    {selectedDomain?.dmarcRecord}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => copyToClipboard(selectedDomain?.dmarcRecord || '', 'dmarc-view')}
                  >
                    {copiedField === 'dmarc-view' ? <Check color="success" /> : <ContentCopy />}
                  </IconButton>
                </Box>
              </Paper>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDnsDialog(false)}>Chiudi</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Certificato SSL */}
      <Dialog
        open={openCertDialog}
        onClose={() => setOpenCertDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Lock color="primary" />
            <Typography variant="h6" component="div">
              Gestione Certificato SSL/TLS
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Dominio: <strong>{selectedDomain?.domain}</strong>
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            {/* Stato attuale */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                📊 Stato Attuale
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                {selectedDomain && getCertificateChip(selectedDomain)}
                {selectedDomain?.tlsCertExpiry && (
                  <Typography variant="caption" color="text.secondary">
                    Scadenza: {new Date(selectedDomain.tlsCertExpiry).toLocaleDateString('it-IT', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </Typography>
                )}
              </Box>
            </Box>

            <Divider />

            {/* Informazioni */}
            <Alert severity="info">
              <Typography variant="body2">
                I certificati SSL/TLS permettono la comunicazione cifrata tra il server mail e i client.
                Utilizziamo Let&apos;s Encrypt per certificati gratuiti che si rinnovano automaticamente ogni 90 giorni.
              </Typography>
            </Alert>

            {/* Form per generare nuovo certificato */}
            {(!selectedDomain?.tlsCertStatus || selectedDomain?.tlsCertStatus === 'missing' || selectedDomain?.tlsCertStatus === 'expired') && (
              <>
                <Typography variant="subtitle2">
                  🔐 Genera Nuovo Certificato
                </Typography>

                <TextField
                  fullWidth
                  label="Email per Let's Encrypt"
                  type="email"
                  value={certEmail}
                  onChange={(e) => setCertEmail(e.target.value)}
                  helperText="Email utilizzata per le notifiche di scadenza certificato"
                  required
                />

                <Box>
                  <Typography variant="body2" gutterBottom>
                    <Checkbox
                      checked={certAutoRenew}
                      onChange={(e) => setCertAutoRenew(e.target.checked)}
                    />
                    Abilita rinnovo automatico
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 4 }}>
                    Il certificato verrà rinnovato automaticamente prima della scadenza
                  </Typography>
                </Box>

                <Alert severity="info">
                  <Typography variant="body2" fontWeight={600} gutterBottom>
                    🔄 Processo automatico di configurazione:
                  </Typography>
                  <Typography variant="caption" component="div">
                    1. Configurazione automatica nginx per <strong>{selectedDomain?.mailSubdomain}</strong><br />
                    2. Generazione certificato Let&apos;s Encrypt<br />
                    3. Il processo può richiedere alcuni minuti
                  </Typography>
                  <Typography variant="caption" component="div" sx={{ mt: 1 }}>
                    <strong>Prerequisiti:</strong><br />
                    • Il record DNS A deve essere configurato (<strong>mail.{selectedDomain?.domain}</strong> → IP server)<br />
                    • La porta 80 deve essere accessibile dall&apos;esterno
                  </Typography>
                </Alert>
              </>
            )}

            {/* Azioni per certificato esistente */}
            {selectedDomain?.tlsCertStatus && selectedDomain?.tlsCertStatus !== 'missing' && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  ⚙️ Azioni
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleDeleteCertificate}
                    disabled={certLoading}
                    startIcon={<Delete />}
                  >
                    Rimuovi Certificato
                  </Button>
                  {(selectedDomain?.tlsCertStatus === 'expiring' || selectedDomain?.tlsCertStatus === 'expired') && (
                    <Button
                      variant="contained"
                      onClick={handleGenerateCertificate}
                      disabled={certLoading || !certEmail}
                      startIcon={certLoading ? <CircularProgress size={20} /> : <Lock />}
                    >
                      Rinnova Certificato
                    </Button>
                  )}
                </Stack>
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCertDialog(false)} disabled={certLoading}>
            Annulla
          </Button>
          {(!selectedDomain?.tlsCertStatus || selectedDomain?.tlsCertStatus === 'missing' || selectedDomain?.tlsCertStatus === 'expired') && (
            <Button
              variant="contained"
              onClick={handleGenerateCertificate}
              disabled={certLoading || !certEmail}
              startIcon={certLoading ? <CircularProgress size={20} /> : <Lock />}
            >
              {certLoading ? 'Generazione in corso...' : 'Genera Certificato'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
