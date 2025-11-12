'use client';
import { Paper, Box, Typography, Chip } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';

interface FeatureCardProps {
  icon: React.ComponentType<{ sx?: any }>;
  title: string;
  description: string;
  badge?: string;
  color: string;
  onClick?: () => void;
}

export default function FeatureCard({
  icon: Icon,
  title,
  description,
  badge = '✨ DEMO',
  color,
  onClick,
}: FeatureCardProps) {
  return (
    <Paper
      elevation={24}
      onClick={onClick}
      sx={{
        p: 3,
        backgroundColor: 'rgba(255,255,255,0.98)',
        backdropFilter: 'blur(20px)',
        borderRadius: 3,
        height: '100%',
        cursor: 'pointer',
        position: 'relative',
        transition: 'all 0.3s ease',
        border: '2px solid transparent',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: `0 20px 40px ${color}30`,
          borderColor: color,
          '& .feature-icon': {
            transform: 'scale(1.1) rotate(5deg)',
            color: color,
          },
          '& .demo-badge': {
            transform: 'scale(1.1)',
            boxShadow: `0 4px 12px ${color}40`,
          },
        },
      }}
    >
      {/* Badge Demo in alto a destra */}
      <Chip
        label={badge}
        size="small"
        className="demo-badge"
        sx={{
          position: 'absolute',
          top: 12,
          right: 12,
          bgcolor: color,
          color: 'white',
          fontWeight: 700,
          fontSize: '0.75rem',
          boxShadow: `0 2px 8px ${color}30`,
          transition: 'all 0.3s ease',
        }}
      />

      {/* Icon */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mb: 2,
        }}
      >
        <Box
          className="feature-icon"
          sx={{
            width: 80,
            height: 80,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
            color: color,
            transition: 'all 0.3s ease',
          }}
        >
          <Icon sx={{ fontSize: 40 }} />
        </Box>
      </Box>

      {/* Title */}
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          fontWeight: 700,
          textAlign: 'center',
          mb: 1.5,
          color: 'text.primary',
        }}
      >
        {title}
      </Typography>

      {/* Description */}
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          textAlign: 'center',
          lineHeight: 1.6,
        }}
      >
        {description}
      </Typography>
    </Paper>
  );
}
