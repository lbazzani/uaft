'use client';
import { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  CircularProgress,
  IconButton,
  Fade,
} from '@mui/material';
import { Close, SmartToy, Person, Send } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

interface Message {
  id: number;
  text: string;
  sender: 'ai' | 'user';
  timestamp: Date;
}

interface InterviewChatbotProps {
  open: boolean;
  onClose: () => void;
}

export default function InterviewChatbot({ open, onClose }: InterviewChatbotProps) {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const questions = [
    t('interview.welcome'),
    t('interview.q1'),
    t('interview.q2'),
    t('interview.q3'),
    t('interview.q4'),
    t('interview.q5'),
  ];

  // Initialize with welcome message
  useEffect(() => {
    if (open && messages.length === 0) {
      setTimeout(() => {
        addAIMessage(questions[0]);
      }, 500);
    }
  }, [open]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const addAIMessage = (text: string) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          text,
          sender: 'ai',
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      text: currentMessage,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');

    // Move to next question or complete
    const nextIndex = questionIndex + 1;
    if (nextIndex < questions.length) {
      setQuestionIndex(nextIndex);
      addAIMessage(questions[nextIndex]);
    } else {
      // Interview completed
      setIsCompleted(true);
      addAIMessage(t('interview.completed'));
    }
  };

  const handleRestart = () => {
    setMessages([]);
    setQuestionIndex(0);
    setIsCompleted(false);
    setTimeout(() => {
      addAIMessage(questions[0]);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '80vh',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '2px solid #F3F4F6',
          pb: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: '#F97316' }}>
            <SmartToy />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {t('interview.title')}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {t('interview.subtitle')}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          p: 3,
          backgroundColor: '#F9FAFB',
          minHeight: 400,
          maxHeight: 500,
          overflowY: 'auto',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                    gap: 1,
                  }}
                >
                  {message.sender === 'ai' && (
                    <Avatar sx={{ bgcolor: '#F97316', width: 32, height: 32 }}>
                      <SmartToy sx={{ fontSize: 18 }} />
                    </Avatar>
                  )}
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      maxWidth: '75%',
                      backgroundColor: message.sender === 'user' ? '#F97316' : 'white',
                      color: message.sender === 'user' ? 'white' : 'text.primary',
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                      {message.text}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'block',
                        mt: 0.5,
                        opacity: 0.7,
                        fontSize: '0.7rem',
                      }}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Typography>
                  </Paper>
                  {message.sender === 'user' && (
                    <Avatar sx={{ bgcolor: '#3B82F6', width: 32, height: 32 }}>
                      <Person sx={{ fontSize: 18 }} />
                    </Avatar>
                  )}
                </Box>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {isTyping && (
            <Fade in={isTyping}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ bgcolor: '#F97316', width: 32, height: 32 }}>
                  <SmartToy sx={{ fontSize: 18 }} />
                </Avatar>
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    backgroundColor: 'white',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <CircularProgress size={16} sx={{ color: '#F97316' }} />
                  <Typography variant="body2" color="text.secondary">
                    {t('interview.thinking')}
                  </Typography>
                </Paper>
              </Box>
            </Fade>
          )}

          <div ref={messagesEndRef} />
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          borderTop: '2px solid #F3F4F6',
          flexDirection: 'column',
          gap: 2,
          alignItems: 'stretch',
        }}
      >
        {!isCompleted ? (
          <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
            <TextField
              fullWidth
              multiline
              maxRows={3}
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t('interview.placeholder')}
              disabled={isTyping}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleSendMessage}
              disabled={!currentMessage.trim() || isTyping}
              sx={{
                minWidth: 56,
                height: 56,
                backgroundColor: '#F97316',
                '&:hover': {
                  backgroundColor: '#EA580C',
                },
              }}
            >
              <Send />
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
            <Button
              variant="outlined"
              onClick={handleRestart}
              fullWidth
              sx={{
                borderColor: '#F97316',
                color: '#F97316',
                '&:hover': {
                  borderColor: '#EA580C',
                  backgroundColor: '#FFF7ED',
                },
              }}
            >
              {t('interview.restart')}
            </Button>
            <Button
              variant="contained"
              onClick={onClose}
              fullWidth
              sx={{
                backgroundColor: '#F97316',
                '&:hover': {
                  backgroundColor: '#EA580C',
                },
              }}
            >
              {t('interview.apply')}
            </Button>
          </Box>
        )}
      </DialogActions>
    </Dialog>
  );
}
