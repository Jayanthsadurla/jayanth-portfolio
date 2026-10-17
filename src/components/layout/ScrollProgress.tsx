import { m, useScroll, useSpring } from 'framer-motion';

/** Thin reading-progress bar pinned to the top edge. Uses transform only. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 });

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]">
      <m.div
        className="h-full origin-left bg-gradient-to-r from-cyan via-blue to-violet"
        style={{ scaleX }}
      />
    </div>
  );
}
