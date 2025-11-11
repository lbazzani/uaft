'use client';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ReactNode } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';

interface ScrollAnimationProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export default function ScrollAnimation({
  children,
  delay = 0,
  direction = 'up',
}: ScrollAnimationProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [ref, inView] = useInView({
    triggerOnce: isMobile, // Su mobile l'animazione avviene una sola volta
    threshold: isMobile ? 0.05 : 0.3, // Threshold aumentato per mantenere il contenuto visibile più a lungo
  });

  const directions = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 },
  };

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        ...directions[direction],
      }}
      animate={
        inView
          ? {
              opacity: 1,
              x: 0,
              y: 0,
            }
          : isMobile
            ? {} // Su mobile non anima l'uscita
            : {
                opacity: 0,
                ...directions[direction],
              }
      }
      transition={{
        duration: 0.6,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
