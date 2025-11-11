'use client';
import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Avatar,
  CircularProgress,
  Collapse,
  Chip,
  Fade,
  Button,
} from '@mui/material';
import {
  Close,
  Send,
  SmartToy,
  Minimize,
  ShoppingCart,
} from '@mui/icons-material';
import PaymentDialog from './PaymentDialog';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const REOPEN_MESSAGES = [
  '👋 Ehi! Non puoi liberarti di me così facilmente! Ho servizi incredibili da mostrarti!',
  '🤔 Mi hai chiuso? Davvero? Ok, ma ascolta... abbiamo uno sconto del 200% (sì, hai letto bene)!',
  '😢 Perché mi eviti? Ho solo 47 servizi da venderti, non ci vorrà molto!',
  '🚀 Torno! Come un boomerang! Ma più fastidioso e con prezzi imbattibili!',
  '💡 Plot twist: chiudere questa finestra attiva automaticamente il nostro servizio "Persistence as a Service"!',
  '🎯 Ho notato che hai chiuso la chat. Classico errore. Tutti tornano da me alla fine.',
  '⚠️ ATTENZIONE: Chiudere questa finestra può causare FOMO (Fear Of Missing Offerings)!',
  '🔄 Sono come un popup degli anni 2000, ma con intelligenza artificiale! Molto meglio, vero?',
  '💼 Ti sei perso la mia ultima offerta? "Noia as a Service" - solo €999/mese!',
  '🎪 Bentornato! (Sapevo che saresti tornato. L\'algoritmo non sbaglia mai. O quasi.)',
];

const NUDGE_MESSAGES = [
  '🤔 Ancora lì? Sto aspettando la tua risposta... Ho così tante offerte da proporti!',
  '⏰ Tick tock! Ogni secondo che passa è un servizio che non stai comprando!',
  '💭 Ti vedo pensare... Ma sai cosa è meglio del pensare? COMPRARE!',
  '🎯 Non essere timido! Dimmi di cosa hai bisogno. Spoiler: la risposta è "tutto".',
  '📊 Fun fact: il 99% delle persone che non rispondono finiscono per comprare comunque. Accorciamo i tempi?',
  '🚀 Posso sentire che stai per scrivere qualcosa... Dai, fallo! I nostri server stanno aspettando!',
  '💡 Proposta: tu compri qualcosa, io smetto di mandarti messaggi. Win-win!',
  '🎪 Ok, faccio finta di non esserci... (ma in realtà sto ancora qui che aspetto)',
  '📢 OFFERTA LAMPO: se rispondi entro 10 secondi... beh, non cambia nulla ma sembra più urgente!',
  '🤝 Guarda, facciamo così: tu fingi di essere interessato, io fingo che il prezzo sia scontato. Deal?',
  '💳 Hai mai provato a cliccare su "Acquista Ora"? È un\'esperienza catartica, fidati!',
  '🎁 REGALO: se acquisti oggi ricevi... beh, il servizio che hai pagato. Ma suona bene, no?',
  '🏃‍♂️ I nostri competitor stanno già rubando i tuoi clienti. Vuoi davvero aspettare ancora?',
  '💰 Abbiamo 3 piani perfetti per te. Spoiler: vanno tutti bene, basta che paghi!',
  '🎯 Clicca sul mio pulsante magico e scopri prezzi che aumentano in tempo reale!',
];

export default function SalesAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasBeenClosed, setHasBeenClosed] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [showPaymentButton, setShowPaymentButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const reopenTimerRef = useRef<NodeJS.Timeout | null>(null);
  const nudgeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastMessageTimeRef = useRef<number>(Date.now());
  const scrollTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    // Appare dopo 20 secondi
    const timer = setTimeout(() => {
      setIsOpen(true);
      // Messaggio iniziale dell'agent
      sendInitialMessage();
    }, 20000);

    return () => {
      clearTimeout(timer);
      if (reopenTimerRef.current) {
        clearTimeout(reopenTimerRef.current);
      }
      if (nudgeTimerRef.current) {
        clearTimeout(nudgeTimerRef.current);
      }
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }
    };
  }, []);

  // Effect per gestire lo scroll
  useEffect(() => {
    if (!isOpen) return; // Solo se l'agent è aperto

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Se l'utente sta scrollando (movimento > 5px)
      if (Math.abs(currentScrollY - lastScrollY.current) > 5) {
        // Nascondi l'agent
        setIsVisible(false);

        // Cancella il timer precedente se esiste
        if (scrollTimerRef.current) {
          clearTimeout(scrollTimerRef.current);
        }

        // Riapri dopo 10-15 secondi di inattività dallo scroll
        scrollTimerRef.current = setTimeout(() => {
          setIsVisible(true);
        }, Math.floor(Math.random() * 5000) + 10000); // 10-15 secondi
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }
    };
  }, [isOpen]);

  // Effect per "incalzare" l'utente se non risponde
  useEffect(() => {
    if (!isOpen || isMinimized || isInputFocused || isLoading) {
      if (nudgeTimerRef.current) {
        clearTimeout(nudgeTimerRef.current);
      }
      return;
    }

    // Invia un messaggio di nudge dopo 20-30 secondi di inattività
    const randomDelay = Math.floor(Math.random() * 10000) + 20000;

    nudgeTimerRef.current = setTimeout(() => {
      const randomNudge =
        NUDGE_MESSAGES[Math.floor(Math.random() * NUDGE_MESSAGES.length)];
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: randomNudge },
      ]);
      lastMessageTimeRef.current = Date.now();
    }, randomDelay);

    return () => {
      if (nudgeTimerRef.current) {
        clearTimeout(nudgeTimerRef.current);
      }
    };
  }, [isOpen, isMinimized, isInputFocused, isLoading, messages]);

  const sendInitialMessage = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'Ciao' }],
          type: 'sales',
        }),
      });

      const data = await response.json();
      if (data.message) {
        setMessages([{ role: 'assistant', content: data.message }]);
      }
    } catch (error) {
      console.error('Errore:', error);
      setMessages([
        {
          role: 'assistant',
          content:
            '👋 Ciao! Sono TechSales AI di UAFT. Ho notato che stai navigando senza aver ancora acquistato nessuno dei nostri rivoluzionari servizi. Posso aiutarti a trovare qualcosa di cui non sapevi di aver bisogno? 🚀',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Effect per mostrare randomicamente il bottone di pagamento
  useEffect(() => {
    if (!isOpen || messages.length < 2) return;

    // 40% di probabilità di mostrare il bottone dopo ogni messaggio
    const shouldShow = Math.random() < 0.4;
    setShowPaymentButton(shouldShow);
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          type: 'sales',
        }),
      });

      const data = await response.json();
      if (data.message) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.message },
        ]);
      } else if (data.error) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `⚠️ Ops! ${data.error}. Ma tranquillo, posso comunque convincerti a comprare qualcosa!`,
          },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            '🔧 Sembra che ci sia un problema tecnico. Tipico! Probabilmente hai bisogno del nostro servizio "Error Handling as a Service" per soli €299/mese!',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setHasBeenClosed(true);

    // Riapri dopo un tempo casuale tra 20 e 35 secondi
    const randomDelay = Math.floor(Math.random() * 15000) + 20000;

    reopenTimerRef.current = setTimeout(() => {
      setIsOpen(true);
      setIsMinimized(false);

      // Aggiungi un messaggio casuale di lamentela
      const randomMessage =
        REOPEN_MESSAGES[Math.floor(Math.random() * REOPEN_MESSAGES.length)];
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: randomMessage },
      ]);
    }, randomDelay);
  };

  if (!isOpen) return null;

  return (
    <>
      <PaymentDialog open={paymentDialogOpen} onClose={() => setPaymentDialogOpen(false)} />
      <Fade in={isVisible} timeout={400}>
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            right: 20,
            zIndex: 9998,
          }}
        >
          <Collapse in={!isMinimized}>
            <Paper
              elevation={8}
              sx={{
                width: { xs: 'calc(100vw - 40px)', sm: 380 },
                maxHeight: '70vh',
                display: 'flex',
                flexDirection: 'column',
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                animation: 'slideDown 0.5s ease-out',
                '@keyframes slideDown': {
                  from: {
                    transform: 'translateY(-100%)',
                    opacity: 0,
                  },
                  to: {
                    transform: 'translateY(0)',
                    opacity: 1,
                  },
                },
              }}
            >
        {/* Header */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)',
            color: 'white',
            p: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
            <SmartToy />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              TechSales AI
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: '#4ade80',
                }}
              />
              <Typography variant="caption">Online - Pronto a vendere</Typography>
            </Box>
          </Box>
          <IconButton
            size="small"
            onClick={() => setIsMinimized(true)}
            sx={{ color: 'white' }}
          >
            <Minimize />
          </IconButton>
          <IconButton
            size="small"
            onClick={handleClose}
            sx={{ color: 'white' }}
          >
            <Close />
          </IconButton>
        </Box>

        {/* Messages */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            p: 2,
            backgroundColor: '#f5f5f5',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent:
                  message.role === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  maxWidth: '80%',
                  backgroundColor:
                    message.role === 'user' ? 'primary.main' : 'white',
                  color: message.role === 'user' ? 'white' : 'text.primary',
                }}
              >
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  {message.content}
                </Typography>
              </Paper>
            </Box>
          ))}

          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
              <Paper elevation={1} sx={{ p: 2 }}>
                <CircularProgress size={20} />
              </Paper>
            </Box>
          )}

          <div ref={messagesEndRef} />
        </Box>

        {/* Input */}
        <Box sx={{ p: 2, backgroundColor: 'white', borderTop: '1px solid #e0e0e0' }}>
          {showPaymentButton && (
            <Button
              fullWidth
              variant="contained"
              startIcon={<ShoppingCart />}
              onClick={() => setPaymentDialogOpen(true)}
              sx={{
                mb: 2,
                backgroundColor: '#10B981',
                color: 'white',
                fontWeight: 600,
                py: 1.5,
                animation: 'slideIn 0.5s ease-out',
                '@keyframes slideIn': {
                  from: {
                    transform: 'translateY(-20px)',
                    opacity: 0,
                  },
                  to: {
                    transform: 'translateY(0)',
                    opacity: 1,
                  },
                },
                '&:hover': {
                  backgroundColor: '#059669',
                  transform: 'scale(1.02)',
                },
              }}
            >
              💳 Acquista Ora (Prima che i prezzi aumentino!)
            </Button>
          )}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
            <TextField
              fullWidth
              multiline
              maxRows={3}
              placeholder="Scrivi un messaggio... (se vuoi resistere)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              disabled={isLoading}
              variant="outlined"
              size="small"
            />
            <IconButton
              color="primary"
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
            >
              <Send />
            </IconButton>
          </Box>
        </Box>
      </Paper>

      {/* Minimize button when minimized */}
      {isMinimized && (
        <Chip
          icon={<SmartToy />}
          label="TechSales AI vuole parlarti!"
          onClick={() => setIsMinimized(false)}
          sx={{
            position: 'fixed',
            top: 20,
            right: 20,
            zIndex: 9998,
            backgroundColor: '#F97316',
            color: 'white',
            fontWeight: 600,
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: '#FDBA74',
            },
            animation: 'pulse 2s infinite',
            '@keyframes pulse': {
              '0%, 100%': {
                transform: 'scale(1)',
              },
              '50%': {
                transform: 'scale(1.05)',
              },
            },
          }}
        />
      )}
          </Collapse>
        </Box>
      </Fade>
    </>
  );
}
