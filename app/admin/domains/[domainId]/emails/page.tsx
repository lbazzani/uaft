'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  Card,
  CardContent,
  Grid,
  Switch,
  FormControlLabel,
  InputAdornment,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  Autocomplete,
  Divider,
} from '@mui/material';
import {
  Email,
  Add,
  Delete,
  ArrowBack,
  ContentCopy,
  Check,
  Person,
  Lock,
  Visibility,
  VisibilityOff,
  Search,
} from '@mui/icons-material';

interface MailAddress {
  id: string;
  address: string;
  isActive: boolean;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
}

interface MailDomain {
  id: string;
  domain: string;
  isActive: boolean;
  addresses: MailAddress[];
}

export default function DomainEmailsPage() {
  const params = useParams();
  const router = useRouter();
  const domainId = params.domainId as string;

  const [domain, setDomain] = useState<MailDomain | null>(null);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userMode, setUserMode] = useState<'new' | 'existing'>('new');
  const [users, setUsers] = useState<Array<{ id: string; name: string | null; email: string }>>([]);
  const [selectedUser, setSelectedUser] = useState<{ id: string; name: string | null; email: string } | null>(null);

  const [formData, setFormData] = useState({
    localPart: '',
    userName: '',
    userEmail: '',
    password: '',
  });

  useEffect(() => {
    fetchDomain();
    fetchUsers();
  }, [domainId]);

  const fetchDomain = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/domains/${domainId}`);
      if (!res.ok) throw new Error('Failed to fetch domain');
      const data = await res.json();
      setDomain(data);
    } catch (err) {
      setError('Errore nel caricamento del dominio');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      console.log('Users API response status:', res.status);
      if (res.ok) {
        const data = await res.json();
        console.log('Users fetched:', data.length);
        setUsers(data);
      } else {
        const errorData = await res.json();
        console.error('Error fetching users:', errorData);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const handleCreateAddress = async () => {
    try {
      setError('');

      let payload;
      if (userMode === 'existing') {
        if (!selectedUser) {
          setError('Seleziona un utente esistente');
          return;
        }
        payload = {
          localPart: formData.localPart,
          userId: selectedUser.id,
        };
      } else {
        payload = formData;
      }

      const res = await fetch(`/api/admin/domains/${domainId}/addresses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create email address');
      }

      setSuccess('Indirizzo email creato con successo!');
      setOpenDialog(false);
      setFormData({
        localPart: '',
        userName: '',
        userEmail: '',
        password: '',
      });
      setSelectedUser(null);
      setUserMode('new');
      fetchDomain();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (addressId: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo indirizzo email?')) return;

    try {
      setError('');
      const res = await fetch(`/api/admin/domains/${domainId}/addresses/${addressId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete address');
      }

      setSuccess('Indirizzo eliminato con successo!');
      fetchDomain();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleToggleActive = async (address: MailAddress) => {
    try {
      const res = await fetch(`/api/admin/domains/${domainId}/addresses/${address.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !address.isActive }),
      });

      if (!res.ok) throw new Error('Failed to update address');

      setSuccess('Stato indirizzo aggiornato!');
      fetchDomain();
    } catch (err) {
      setError('Errore nell\'aggiornamento dell\'indirizzo');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSuccess('Copiato negli appunti!');
  };

  const filteredAddresses = domain?.addresses.filter((addr) =>
    addr.address.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!domain) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Dominio non trovato</Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => router.push('/admin/domains')}
          sx={{ mb: 2 }}
        >
          Torna ai Domini
        </Button>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
              📧 Caselle Email
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Dominio: <strong>{domain.domain}</strong>
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenDialog(true)}
            size="large"
          >
            Nuova Casella Email
          </Button>
        </Box>
      </Box>

      {/* Alerts */}
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

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Totale Caselle
              </Typography>
              <Typography variant="h3" component="div" sx={{ fontWeight: 700 }}>
                {domain.addresses.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Caselle Attive
              </Typography>
              <Typography variant="h3" component="div" sx={{ fontWeight: 700, color: 'success.main' }}>
                {domain.addresses.filter(a => a.isActive).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Stato Dominio
              </Typography>
              <Chip
                label={domain.isActive ? 'Attivo' : 'Disattivo'}
                color={domain.isActive ? 'success' : 'default'}
                size="large"
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search Bar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Cerca indirizzo email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {/* Email Addresses Table */}
      {filteredAddresses.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Email sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            {searchQuery ? 'Nessun risultato trovato' : 'Nessuna casella email configurata'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
            {searchQuery ? 'Prova con una ricerca diversa' : 'Crea la prima casella email per questo dominio'}
          </Typography>
          {!searchQuery && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenDialog(true)}
              size="large"
            >
              Crea Prima Casella
            </Button>
          )}
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Indirizzo Email</strong></TableCell>
                <TableCell><strong>Utente</strong></TableCell>
                <TableCell><strong>Stato</strong></TableCell>
                <TableCell><strong>Data Creazione</strong></TableCell>
                <TableCell align="right"><strong>Azioni</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAddresses.map((address) => (
                <TableRow key={address.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Email color="primary" />
                      <Box>
                        <Typography variant="body1" fontWeight={600}>
                          {address.address}
                        </Typography>
                        <Tooltip title="Copia indirizzo">
                          <IconButton
                            size="small"
                            onClick={() => copyToClipboard(address.address)}
                          >
                            <ContentCopy fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        {address.user.name || 'N/A'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {address.user.email}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={address.isActive}
                          onChange={() => handleToggleActive(address)}
                          color="success"
                        />
                      }
                      label={address.isActive ? 'Attiva' : 'Disattiva'}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(address.createdAt).toLocaleDateString('it-IT', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Elimina">
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(address.id)}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Create Email Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h5" component="div" fontWeight={700}>
            📧 Crea Nuova Casella Email
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Configura una nuova casella email per {domain.domain}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {/* Step 1: User Mode Selection */}
            <FormControl component="fieldset" fullWidth sx={{ mb: 3 }}>
              <FormLabel component="legend">
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                  👤 Modalità di Creazione
                </Typography>
              </FormLabel>
              <RadioGroup
                value={userMode}
                onChange={(e) => setUserMode(e.target.value as 'new' | 'existing')}
                sx={{ mt: 1 }}
              >
                <FormControlLabel
                  value="new"
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography variant="body1" fontWeight={600}>
                        Crea nuovo utente
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Crea un nuovo account utente con email e password
                      </Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  value="existing"
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography variant="body1" fontWeight={600}>
                        Usa utente esistente
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Associa l'indirizzo a un utente già registrato
                      </Typography>
                    </Box>
                  }
                />
              </RadioGroup>
            </FormControl>

            <Divider sx={{ mb: 3 }} />

            {/* Step 2: Email Address */}
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
              📧 Indirizzo Email
            </Typography>

            <TextField
              fullWidth
              required
              label="Parte Locale dell'Email"
              placeholder="es: info, contatto, mario.rossi"
              value={formData.localPart}
              onChange={(e) => setFormData({ ...formData, localPart: e.target.value })}
              helperText={`L'indirizzo completo sarà: ${formData.localPart || 'nome'}@${domain.domain}`}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                ),
              }}
            />

            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                Stai creando: <strong>{formData.localPart || 'nome'}@{domain.domain}</strong>
              </Typography>
            </Alert>

            <Divider sx={{ mb: 3 }} />

            {/* Step 3: User Details (conditional) */}
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
              {userMode === 'new' ? '👤 Dati Nuovo Utente' : '👤 Seleziona Utente'}
            </Typography>

            {userMode === 'new' ? (
              <>
                <TextField
                  fullWidth
                  label="Nome Utente"
                  placeholder="es: Mario Rossi"
                  value={formData.userName}
                  onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                  sx={{ mb: 2 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  required
                  label="Email di Login"
                  type="email"
                  placeholder="es: mario.rossi@esempio.com"
                  value={formData.userEmail}
                  onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                  helperText="Email utilizzata per accedere al sistema"
                  sx={{ mb: 2 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  required
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Minimo 8 caratteri"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  helperText="Password per accedere al sistema"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    Verrà creato un nuovo utente con queste credenziali che potrà accedere al sistema.
                  </Typography>
                </Alert>
              </>
            ) : (
              <>
                <Autocomplete
                  options={users}
                  getOptionLabel={(option) => `${option.email}${option.name ? ` (${option.name})` : ''}`}
                  value={selectedUser}
                  onChange={(event, newValue) => setSelectedUser(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      label="Seleziona Utente"
                      placeholder="Cerca utente..."
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <>
                            <InputAdornment position="start">
                              <Person />
                            </InputAdornment>
                            {params.InputProps.startAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />

                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    L'indirizzo email sarà associato all'utente selezionato. L'utente potrà accedere con le sue credenziali esistenti.
                  </Typography>
                </Alert>
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setOpenDialog(false)}>
            Annulla
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateAddress}
            disabled={
              !formData.localPart ||
              (userMode === 'new' && (!formData.userEmail || !formData.password)) ||
              (userMode === 'existing' && !selectedUser)
            }
          >
            Crea Casella Email
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
