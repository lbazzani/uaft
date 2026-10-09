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
          borderRadius: fullScreen || isMobile ? 0 : '18px',
          border: fullScreen || isMobile ? 'none' : '1px solid var(--linea)',
          boxShadow: '0 24px 60px rgba(11,31,51,0.18)',
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
            backgroundColor: 'var(--carta)',
            py: 2.5,
            px: 3,
            fontFamily: 'var(--f-titoli)',
            fontWeight: 800,
            color: 'text.primary',
            fontSize: '1.15rem',
            letterSpacing: '-0.01em',
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
          backgroundColor: 'background.paper',
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
            backgroundColor: 'var(--carta)',
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
