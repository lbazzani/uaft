'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItemButton,
  ListItemText,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Send } from '@mui/icons-material';

interface SentMessage {
  id: string;
  messageId: string;
  fromAddress: string;
  toAddresses: string[];
  subject: string;
  bodyText: string;
  sentAt: string;
}

export default function SentPage() {
  const [messages, setMessages] = useState<SentMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSentMessages();
  }, []);

  const fetchSentMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/mail/sent');

      if (!response.ok) {
        throw new Error('Failed to fetch sent messages');
      }

      const data = await response.json();
      setMessages(data.messages || []);
    } catch (err: any) {
      console.error('Error fetching sent messages:', err);
      setError(err.message || 'Errore nel caricamento dei messaggi');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('it-IT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          📤 Inviati
        </Typography>
        <Chip label={`${messages.length} email`} color="primary" />
      </Box>

      {messages.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Send sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Nessun messaggio inviato
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Le email inviate appariranno qui
          </Typography>
        </Paper>
      ) : (
        <Paper>
          <List>
            {messages.map((message, index) => (
              <ListItemButton
                key={message.id}
                divider={index < messages.length - 1}
                sx={{
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {message.subject || '(Nessun oggetto)'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(message.sentAt)}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Box sx={{ mt: 0.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        A: {message.toAddresses.join(', ')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {message.bodyText.substring(0, 100)}
                        {message.bodyText.length > 100 ? '...' : ''}
                      </Typography>
                    </Box>
                  }
                />
              </ListItemButton>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
}
