'use client';

import { ReactNode } from 'react';
import { Box } from '@mui/material';
import MailSidebar from '@/components/mail/MailSidebar';

export default function MailLayout({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      <MailSidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          overflow: 'auto',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
