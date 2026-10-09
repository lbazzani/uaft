'use client';
import { motion, useReducedMotion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ReactNode } from 'react';

interface ScrollAnimationProps {
  children: ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}

export default function ScrollAnimation({
  children,
  delay = 0,
  style,
}: ScrollAnimationProps) {
  // con movimento ridotto il contenuto compare subito, senza scivolare
  const ridotto = useReducedMotion();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      style={style}
      initial={ridotto ? false : { opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.5,
        delay,
        ease: 'easeOut',
      }}
    >
      {children}
    </motion.div>
  );
}
