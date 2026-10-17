import { LazyMotion, domAnimation } from 'framer-motion';
import type { ReactNode } from 'react';

/**
 * Loads only the animation features we use (no drag/layout engines).
 * Components use the lightweight `m` primitive instead of `motion`.
 * Features are bundled synchronously so scroll-reveals can never stay hidden.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
