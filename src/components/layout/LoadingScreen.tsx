import { useEffect, useState } from 'react';
import { Monogram } from '../ui/Icons';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface LoadingScreenProps {
  /** Called as the overlay starts to fade, so the hero entrance can begin beneath it. */
  onReady: () => void;
}

/**
 * Short, honest loader: waits for web fonts (capped) plus a brief minimum so
 * the monogram reads, then fades. Roughly 0.8s total; ~0.2s with reduced motion.
 */
export function LoadingScreen({ onReady }: LoadingScreenProps) {
  const reduce = usePrefersReducedMotion();
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const minimum = new Promise<void>((resolve) => window.setTimeout(resolve, reduce ? 150 : 700));
    const fonts = Promise.race([
      document.fonts?.ready ?? Promise.resolve(),
      new Promise((resolve) => window.setTimeout(resolve, 1200)),
    ]);

    Promise.all([minimum, fonts]).then(() => {
      if (cancelled) return;
      setLeaving(true);
      onReady();
      window.setTimeout(() => !cancelled && setGone(true), reduce ? 50 : 500);
    });

    return () => {
      cancelled = true;
    };
  }, [onReady, reduce]);

  if (gone) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading portfolio"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-bg transition-opacity duration-500 ${
        leaving ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <div className={reduce ? '' : 'loader-pop'}>
        <Monogram size={84} />
      </div>
      <div className="h-[3px] w-44 overflow-hidden rounded-full bg-line/10" aria-hidden="true">
        <div className={`h-full rounded-full bg-gradient-to-r from-cyan via-blue to-violet ${reduce ? 'w-full' : 'loader-bar'}`} />
      </div>
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Loading portfolio</p>
    </div>
  );
}
