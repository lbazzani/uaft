'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Avatar,
  Button,
  Badge,
} from '@mui/material';
import {
  Inbox,
  Send,
  Drafts,
  Star,
  Delete,
  Archive,
  Edit,
  Logout,
  Settings,
  AdminPanelSettings,
} from '@mui/icons-material';

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
}

const mainItems: MenuItem[] = [
  { label: 'Inbox', icon: <Inbox />, path: '/mail/inbox', badge: 3 },
  { label: 'Sent', icon: <Send />, path: '/mail/sent' },
  { label: 'Drafts', icon: <Drafts />, path: '/mail/drafts' },
  { label: 'Starred', icon: <Star />, path: '/mail/starred' },
  { label: 'Archive', icon: <Archive />, path: '/mail/archive' },
  { label: 'Trash', icon: <Delete />, path: '/mail/trash' },
];

export default function MailSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  return (
    <Box
      sx={{
        width: 280,
        height: '100vh',
        borderRight: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.paper',
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#F97316' }}>
          📬 UAFT Mail
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Il mail server che probabilmente funziona
        </Typography>
      </Box>

      {/* Compose Button */}
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<Edit />}
          onClick={() => router.push('/mail/compose')}
          sx={{
            bgcolor: '#F97316',
            '&:hover': { bgcolor: '#EA580C' },
          }}
        >
          Componi
        </Button>
      </Box>

      {/* Navigation */}
      <List sx={{ flex: 1, overflow: 'auto', pt: 0 }}>
        {mainItems.map((item) => (
          <ListItemButton
            key={item.path}
            selected={pathname === item.path}
            onClick={() => router.push(item.path)}
            sx={{
              borderRadius: 1,
              mx: 1,
              mb: 0.5,
              '&.Mui-selected': {
                bgcolor: 'rgba(249, 115, 22, 0.1)',
                '&:hover': {
                  bgcolor: 'rgba(249, 115, 22, 0.15)',
                },
              },
            }}
          >
            <ListItemIcon>
              {item.badge ? (
                <Badge badgeContent={item.badge} color="error">
                  {item.icon}
                </Badge>
              ) : (
                item.icon
              )}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>

      <Divider />

      {/* User Section */}
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ width: 40, height: 40, mr: 1.5, bgcolor: '#F97316' }}>
            {session?.user?.name?.[0] || 'U'}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
              {session?.user?.name || 'User'}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {session?.user?.email}
            </Typography>
          </Box>
        </Box>

        <List dense>
          <ListItemButton onClick={() => router.push('/mail/settings')}>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>

          {(session?.user as any)?.isAdmin && (
            <ListItemButton onClick={() => router.push('/admin/domains')}>
              <ListItemIcon>
                <AdminPanelSettings fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Admin Panel" />
            </ListItemButton>
          )}

          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </List>
      </Box>
    </Box>
  );
}
