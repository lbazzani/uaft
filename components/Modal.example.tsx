/**
 * ESEMPI DI UTILIZZO DEL COMPONENTE MODAL
 *
 * Questo file contiene esempi pratici di come usare il componente Modal
 * nelle tue applicazioni.
 */

import { useState } from 'react';
import { Button, Typography, TextField, Box } from '@mui/material';
import Modal from './Modal';

// ============================================
// ESEMPIO 1: Modal semplice con solo contenuto
// ============================================
export function SimpleModalExample() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Apri Modal Semplice</Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Titolo della Modal"
      >
        <Typography>
          Questo è il contenuto della modal. Puoi inserire qualsiasi componente React qui dentro.
        </Typography>
      </Modal>
    </>
  );
}

// ============================================
// ESEMPIO 2: Modal con azioni (bottoni footer)
// ============================================
export function ModalWithActionsExample() {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    console.log('Confermato!');
    setOpen(false);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Apri Modal con Azioni</Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Conferma Operazione"
        actions={
          <>
            <Button onClick={() => setOpen(false)} variant="outlined">
              Annulla
            </Button>
            <Button onClick={handleConfirm} variant="contained">
              Conferma
            </Button>
          </>
        }
      >
        <Typography>
          Sei sicuro di voler procedere con questa operazione?
        </Typography>
      </Modal>
    </>
  );
}

// ============================================
// ESEMPIO 3: Modal senza titolo
// ============================================
export function ModalNoTitleExample() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Apri Modal Senza Titolo</Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
      >
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Typography variant="h4" gutterBottom>
            ✅ Successo!
          </Typography>
          <Typography color="text.secondary">
            L'operazione è stata completata con successo.
          </Typography>
        </Box>
      </Modal>
    </>
  );
}

// ============================================
// ESEMPIO 4: Modal con form
// ============================================
export function ModalWithFormExample() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    console.log({ name, email });
    setOpen(false);
    setName('');
    setEmail('');
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Apri Form Modal</Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Inserisci i tuoi dati"
        maxWidth="sm"
        actions={
          <>
            <Button onClick={() => setOpen(false)} variant="outlined">
              Annulla
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={!name || !email}
            >
              Invia
            </Button>
          </>
        }
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
        </Box>
      </Modal>
    </>
  );
}

// ============================================
// ESEMPIO 5: Modal grande
// ============================================
export function LargeModalExample() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Apri Modal Grande</Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Modal Grande"
        maxWidth="lg"
        actions={
          <Button onClick={() => setOpen(false)} variant="contained" fullWidth>
            Chiudi
          </Button>
        }
      >
        <Typography variant="h6" gutterBottom>
          Contenuto esteso
        </Typography>
        <Typography paragraph>
          Questa è una modal più grande che può contenere molto più contenuto.
          Perfetta per form complessi, tabelle, o informazioni dettagliate.
        </Typography>
        {[1, 2, 3, 4, 5].map((i) => (
          <Typography key={i} paragraph>
            Paragrafo di esempio {i}. Lorem ipsum dolor sit amet, consectetur
            adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
            magna aliqua.
          </Typography>
        ))}
      </Modal>
    </>
  );
}

// ============================================
// ESEMPIO 6: Modal fullscreen su mobile
// ============================================
export function FullscreenModalExample() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Apri Modal Fullscreen</Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Modal Fullscreen"
        fullScreen={true}
        actions={
          <Button onClick={() => setOpen(false)} variant="contained" fullWidth>
            Chiudi
          </Button>
        }
      >
        <Typography>
          Questa modal sarà fullscreen sia su mobile che su desktop.
        </Typography>
      </Modal>
    </>
  );
}
