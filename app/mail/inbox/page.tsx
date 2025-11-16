'use client';

import { useEffect, useState } from 'react';
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
import { Email, Star, StarBorder } from '@mui/icons-material';

interface EmailItem {
  id: string;
  messageId: string;
  fromAddress: string;
  subject: string;
  bodyText: string;
  isRead: boolean;
  isStarred: boolean;
  receivedAt: string;
}

export default function InboxPage() {
  const [emails, setEmails] = useState<EmailItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/mail/inbox');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch emails');
      }

      setEmails(data.emails);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return d.toLocaleDateString();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          📬 Inbox
        </Typography>
        <Chip label={`${emails.length} emails`} />
      </Box>

      {emails.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Email sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Nessun messaggio in arrivo
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Quando riceverai email, appariranno qui
          </Typography>
        </Paper>
      ) : (
        <Paper>
          <List sx={{ p: 0 }}>
            {emails.map((email) => (
              <ListItemButton
                key={email.id}
                sx={{
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  bgcolor: email.isRead ? 'transparent' : 'rgba(249, 115, 22, 0.05)',
                  '&:hover': {
                    bgcolor: 'rgba(249, 115, 22, 0.1)',
                  },
                }}
              >
                <Box sx={{ mr: 2 }}>
                  {email.isStarred ? (
                    <Star sx={{ color: '#F97316' }} />
                  ) : (
                    <StarBorder sx={{ color: 'text.secondary' }} />
                  )}
                </Box>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: email.isRead ? 400 : 600 }}
                      >
                        {email.fromAddress}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(email.receivedAt)}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: email.isRead ? 400 : 600,
                          mb: 0.5,
                        }}
                      >
                        {email.subject || '(No Subject)'}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {email.bodyText?.substring(0, 100)}...
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
