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
  Button,
} from '@mui/material';
import {
  Close,
  Send,
  SmartToy,
  Minimize,
  ShoppingCart,
} from '@mui/icons-material';
import PaymentDialog from '../dialogs/PaymentDialog';
import { useLanguage } from '@/contexts/LanguageContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function SalesAgent() {
  const { t, language } = useLanguage();

  const REOPEN_MESSAGES = [
    t('chat.reopen1'),
    t('chat.reopen2'),
    t('chat.reopen3'),
    t('chat.reopen4'),
    t('chat.reopen5'),
    t('chat.reopen6'),
    t('chat.reopen7'),
    t('chat.reopen8'),
    t('chat.reopen9'),
    t('chat.reopen10'),
  ];

  const NUDGE_MESSAGES = [
    t('chat.nudge1'),
    t('chat.nudge2'),
    t('chat.nudge3'),
    t('chat.nudge4'),
    t('chat.nudge5'),
    t('chat.nudge6'),
    t('chat.nudge7'),
    t('chat.nudge8'),
    t('chat.nudge9'),
    t('chat.nudge10'),
    t('chat.nudge11'),
    t('chat.nudge12'),
    t('chat.nudge13'),
    t('chat.nudge14'),
    t('chat.nudge15'),
  ];
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasBeenClosed, setHasBeenClosed] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [showPaymentButton, setShowPaymentButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const reopenTimerRef = useRef<NodeJS.Timeout | null>(null);
  const nudgeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastMessageTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    // Appare dopo 20 secondi
    const timer = setTimeout(async () => {
      // Controlla se ci sono altre modali aperte
      const openDialogs = document.querySelectorAll('[role="dialog"]');
      const hasOpenDialog = openDialogs.length > 0;

      if (!hasOpenDialog) {
        // Prima carica il messaggio iniziale
        await sendInitialMessage();
        // Poi apri la chat con il messaggio già pronto
        setIsOpen(true);
      }
    }, 20000);

    return () => {
      clearTimeout(timer);
      if (reopenTimerRef.current) {
        clearTimeout(reopenTimerRef.current);
      }
      if (nudgeTimerRef.current) {
        clearTimeout(nudgeTimerRef.current);
      }
    };
  }, []);

  // Rimosso il meccanismo di scroll hiding per stabilità

  // Effect per chiudere automaticamente se si apre una modale
  useEffect(() => {
    if (!isOpen) return;

    const checkForModals = setInterval(() => {
      const openDialogs = document.querySelectorAll('[role="dialog"]');
      const hasOpenDialog = openDialogs.length > 0;

      // Se c'è una modale aperta e il chat è visibile, minimizza il chat
      if (hasOpenDialog && !isMinimized) {
        setIsMinimized(true);
      }
    }, 1000); // Controlla ogni secondo

    return () => clearInterval(checkForModals);
  }, [isOpen, isMinimized]);

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
          language: language,
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
          content: t('chat.initial.fallback'),
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
          language: language,
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
            content: t('chat.error.api').replace('{error}', data.error),
          },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: t('chat.error.technical'),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
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
      // Controlla se ci sono altre modali aperte prima di riaprire
      const openDialogs = document.querySelectorAll('[role="dialog"]');
      const hasOpenDialog = openDialogs.length > 0;

      if (!hasOpenDialog) {
        setIsOpen(true);
        setIsMinimized(false);

        // Aggiungi un messaggio casuale di lamentela
        const randomMessage =
          REOPEN_MESSAGES[Math.floor(Math.random() * REOPEN_MESSAGES.length)];
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: randomMessage },
        ]);
      } else {
        // Se c'è una modale aperta, riprova dopo 10 secondi
        setTimeout(() => {
          handleClose(); // Riprova ricorsivamente
        }, 10000);
      }
    }, randomDelay);
  };

  if (!isOpen) return null;

  return (
    <>
      <PaymentDialog open={paymentDialogOpen} onClose={() => setPaymentDialogOpen(false)} />
        <Box
          sx={{
            position: 'fixed',
            // sotto la testata (64px su mobile, 72px da 900px): non copre più lingua e menu
            top: { xs: 72, md: 84 },
            right: 20,
            zIndex: 9998,
          }}
        >
          <Collapse in={!isMinimized}>
            <Paper
              elevation={0}
              sx={{
                width: { xs: 'calc(100vw - 40px)', sm: 380 },
                maxHeight: { xs: '80vh', sm: '70vh' },
                display: 'flex',
                flexDirection: 'column',
                // staccata dalla testata: angoli tutti tondi
                borderRadius: '18px',
                overflow: 'hidden',
                // scheda navy con filo sottile: niente alone arancione
                boxShadow: '0 24px 60px rgba(11,31,51,0.35)',
                border: '1px solid #1E3A5A',
                backgroundColor: '#0B1F33',
              }}
            >
        {/* Header - Stile più tecnico e compatto */}
        <Box
          sx={{
            background: '#0B1F33',
            borderBottom: '1px solid rgba(243,239,232,0.16)',
            color: '#F3EFE8',
            px: 2,
            py: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <Avatar
            sx={{
              bgcolor: '#FF6B35',
              color: '#14161C',
              width: 32,
              height: 32,
            }}
          >
            <SmartToy sx={{ fontSize: 18 }} />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 800,
                fontSize: '0.85rem',
                fontFamily: 'var(--f-titoli)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              {t('chat.title')}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  bgcolor: '#4ade80',
                  animation: 'pulse 2s ease-in-out infinite',
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  fontSize: '0.85rem',
                  fontFamily: 'var(--f-note)',
                  fontStyle: 'italic',
                  color: 'rgba(243,239,232,0.7)',
                }}
              >
                {t('chat.status')}
              </Typography>
            </Box>
          </Box>
          <IconButton
            size="small"
            onClick={() => setIsMinimized(true)}
            sx={{
              color: 'rgba(255,255,255,0.8)',
              padding: 0.5,
              '&:hover': {
                color: 'white',
                bgcolor: 'rgba(243,239,232,0.16)',
              },
            }}
          >
            <Minimize sx={{ fontSize: 18 }} />
          </IconButton>
          <IconButton
            size="small"
            onClick={handleClose}
            sx={{
              color: 'rgba(255,255,255,0.8)',
              padding: 0.5,
              '&:hover': {
                color: 'white',
                bgcolor: 'rgba(239, 68, 68, 0.3)',
              },
            }}
          >
            <Close sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>

        {/* Messages */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            p: 2,
            backgroundColor: '#0B1F33',
            backgroundImage: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch',
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'rgba(249, 115, 22, 0.1)',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#FF6B35',
              borderRadius: '3px',
              '&:hover': {
                backgroundColor: '#C2410C',
              },
            },
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
                elevation={0}
                sx={{
                  p: 1.5,
                  maxWidth: '80%',
                  backgroundColor:
                    message.role === 'user' ? '#FF6B35' : '#12304D',
                  // corallo con inchiostro: il bianco non sarebbe leggibile
                  color: message.role === 'user' ? '#14161C' : '#F3EFE8',
                  border: message.role === 'user'
                    ? '1px solid #FF6B35'
                    : '1px solid #1E3A5A',
                  borderRadius: message.role === 'user'
                    ? '16px 16px 4px 16px'
                    : '16px 16px 16px 4px',
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  boxShadow: 'none',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    lineHeight: 1.6,
                    fontSize: '0.9rem',
                  }}
                >
                  {message.content}
                </Typography>
              </Paper>
            </Box>
          ))}

          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  backgroundColor: '#12304D',
                  border: '1px solid #1E3A5A',
                  borderRadius: '16px 16px 16px 4px',
                }}
              >
                <CircularProgress size={20} sx={{ color: '#FF6B35' }} />
              </Paper>
            </Box>
          )}

          <div ref={messagesEndRef} />
        </Box>

        {/* Input */}
        <Box
          sx={{
            p: 2,
            backgroundColor: '#0B1F33',
            borderTop: '1px solid rgba(243,239,232,0.16)',
          }}
        >
          {showPaymentButton && (
            <Button
              fullWidth
              variant="contained"
              startIcon={<ShoppingCart />}
              onClick={() => setPaymentDialogOpen(true)}
              sx={{
                mb: 2,
                backgroundColor: '#FF6B35',
                color: '#14161C',
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
                  backgroundColor: '#F3EFE8',
                },
              }}
            >
              {t('chat.buy.button')}
            </Button>
          )}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
            <TextField
              fullWidth
              multiline
              maxRows={3}
              placeholder={t('chat.placeholder')}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              disabled={isLoading}
              variant="outlined"
              size="small"
              inputRef={inputRef}
              slotProps={{
                htmlInput: {
                  enterKeyHint: 'send',
                  autoComplete: 'off',
                  autoCorrect: 'off',
                  autoCapitalize: 'sentences',
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#12304D',
                  color: '#F3EFE8',
                  borderRadius: '14px',
                  '& fieldset': {
                    borderColor: '#1E3A5A',
                    borderWidth: '1px',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(243,239,232,0.4)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#FF6B35',
                    borderWidth: '1px',
                  },
                  '&.Mui-disabled': {
                    backgroundColor: '#0B1F33',
                  },
                },
                '& .MuiInputBase-input': {
                  color: '#F3EFE8',
                  WebkitTapHighlightColor: 'transparent',
                  '&::placeholder': {
                    color: 'rgba(243,239,232,0.6)',
                    opacity: 1,
                  },
                },
              }}
            />
            <IconButton
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              sx={{
                backgroundColor: '#FF6B35',
                color: '#14161C',
                '&:hover': {
                  backgroundColor: '#F3EFE8',
                },
                '&.Mui-disabled': {
                  backgroundColor: '#1E3A5A',
                  color: 'rgba(243,239,232,0.4)',
                },
                transition: 'all 0.2s ease',
              }}
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
          label={t('chat.minimized')}
          onClick={() => setIsMinimized(false)}
          sx={{
            position: 'fixed',
            top: { xs: 76, md: 88 },
            right: 20,
            zIndex: 9998,
            backgroundColor: '#FF6B35',
            color: '#14161C',
            fontWeight: 600,
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: '#FF8C5A',
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

      {/* Pulse animation for status indicator */}
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </>
  );
}
