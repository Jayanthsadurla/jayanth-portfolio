import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface SectionProps {
  id: string;
  /** id of the heading element that names this section for assistive tech */
  labelledBy: string;
  className?: string;
  children: ReactNode;
}

/** Shared wrapper: landmark, scroll target (tabIndex -1 so nav jumps can move focus), vertical rhythm. */
export function Section({ id, labelledBy, className, children }: SectionProps) {
  return (
    <section id={id} tabIndex={-1} aria-labelledby={labelledBy} className={cn('relative py-20 sm:py-28', className)}>
      <div className="container-x">{children}</div>
    </section>
  );
}
