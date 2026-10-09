'use client';
import { Box } from '@mui/material';

interface LogoProps {
  size?: number;
  color?: string;
  showFullName?: boolean;
}

// Asterisco a sei punte: tre barre ruotate, così resta nitido a qualunque scala e non dipende dal font
export function Asterisco({ size = 16, color = 'var(--corallo, #FF6B35)' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <g fill={color}>
        <rect x="10" y="1" width="4" height="22" rx="1.2" />
        <rect x="10" y="1" width="4" height="22" rx="1.2" transform="rotate(60 12 12)" />
        <rect x="10" y="1" width="4" height="22" rx="1.2" transform="rotate(-60 12 12)" />
      </g>
    </svg>
  );
}

// Wordmark "UAFT*": la promessa e la sua nota a piè di pagina. Stesse props di prima.
export default function Logo({ size = 40, color = 'currentColor', showFullName = false }: LogoProps) {
  const alto = size * 0.62;
  return (
    <Box
      sx={{ display: 'inline-flex', flexDirection: 'column', color, lineHeight: 1 }}
      aria-label="UAFT"
      role="img"
    >
      <Box sx={{ display: 'inline-flex', alignItems: 'flex-start' }}>
        <Box
          component="span"
          aria-hidden="true"
          sx={{
            fontFamily: 'var(--f-titoli)',
            fontWeight: 800,
            fontStretch: '125%',
            fontVariationSettings: '"wdth" 125',
            fontSize: alto,
            letterSpacing: '0.01em',
            textTransform: 'uppercase',
            lineHeight: 1,
          }}
        >
          UAFT
        </Box>
        <Box component="span" sx={{ ml: `${size * 0.04}px`, mt: `-${size * 0.04}px`, display: 'inline-flex' }}>
          <Asterisco size={alto * 0.55} />
        </Box>
      </Box>
      {showFullName && (
        <Box
          component="span"
          sx={{
            fontFamily: 'var(--f-note)',
            fontStyle: 'italic',
            fontSize: Math.max(12, size * 0.32),
            opacity: 0.75,
            lineHeight: 1.2,
            mt: 0.75,
          }}
        >
          Una Azienda che può Fare Tutto*
        </Box>
      )}
    </Box>
  );
}
