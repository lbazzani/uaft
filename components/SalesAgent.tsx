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
              {t('chat.title')}
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
              <Typography variant="caption">{t('chat.status')}</Typography>
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
          label={t('chat.minimized')}
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
