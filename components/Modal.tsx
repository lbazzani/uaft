'use client';
import { ReactNode } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Close } from '@mui/icons-material';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  actions?: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullScreen?: boolean;
}

export default function Modal({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = 'md',
  fullScreen = false,
}: ModalProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
      fullScreen={fullScreen || isMobile}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: fullScreen || isMobile ? 0 : 2,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        },
      }}
    >
      {/* Header con titolo e pulsante chiudi */}
      {title && (
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid',
            borderColor: 'divider',
            backgroundColor: '#FAFBFC',
            py: 2.5,
            px: 3,
            fontWeight: 600,
            color: 'text.primary',
            fontSize: '1.1rem',
          }}
        >
          {title}
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              color: 'text.secondary',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.04)',
                color: 'text.primary',
              },
            }}
          >
            <Close fontSize="small" />
          </IconButton>
        </DialogTitle>
      )}

      {/* Pulsante chiudi senza titolo */}
      {!title && (
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 1,
          }}
        >
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              color: 'text.secondary',
              backgroundColor: 'background.paper',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.04)',
                color: 'text.primary',
              },
            }}
          >
            <Close fontSize="small" />
          </IconButton>
        </Box>
      )}

      {/* Contenuto */}
      <DialogContent
        sx={{
          py: 3,
          px: 3,
          backgroundColor: 'white',
        }}
      >
        {children}
      </DialogContent>

      {/* Actions (bottoni footer) */}
      {actions && (
        <DialogActions
          sx={{
            borderTop: '1px solid',
            borderColor: 'divider',
            backgroundColor: '#FAFBFC',
            px: 3,
            py: 2,
            gap: 1.5,
          }}
        >
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
}
