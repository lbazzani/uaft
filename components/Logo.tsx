'use client';
import { Box } from '@mui/material';

interface LogoProps {
  size?: number;
  color?: string;
  showFullName?: boolean;
}

export default function Logo({ size = 40, color = '#2c2c2c', showFullName = false }: LogoProps) {
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Esagono di base */}
        <path
          d="M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z"
          fill={color}
          opacity="0.1"
        />

        {/* Linee diagonali che formano una "U" stilizzata */}
        <path
          d="M35 30 L35 55 Q35 65 45 65 L55 65 Q65 65 65 55 L65 30"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Triangolo in alto (rappresenta "tutto" / completezza) */}
        <path
          d="M50 20 L60 35 L40 35 Z"
          fill={color}
        />

        {/* Tre punti sotto (rappresenta connessione/rete) */}
        <circle cx="40" cy="75" r="3" fill={color} />
        <circle cx="50" cy="78" r="3" fill={color} />
        <circle cx="60" cy="75" r="3" fill={color} />

        {/* Bordo esagono */}
        <path
          d="M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z"
          stroke={color}
          strokeWidth="2"
          fill="none"
        />
      </svg>

      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box
          component="span"
          sx={{
            fontFamily: '"Inter", "Roboto", sans-serif',
            fontWeight: 800,
            fontSize: size * 0.6,
            color: color,
            letterSpacing: '-0.02em',
            lineHeight: 1,
          }}
        >
          UAFT
        </Box>
        {showFullName && (
          <Box
            component="span"
            sx={{
              fontSize: size * 0.25,
              color: color,
              opacity: 0.7,
              fontWeight: 500,
              lineHeight: 1.2,
              mt: 0.5,
            }}
          >
            Una Azienda che può Fare Tutto
          </Box>
        )}
      </Box>
    </Box>
  );
}
