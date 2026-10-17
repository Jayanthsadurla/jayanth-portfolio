import type { MouseEvent } from 'react';

/** Smoothly scrolls to a section, updates the URL hash and moves focus there for keyboard/screen-reader users. */
export function scrollToId(id: string): void {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  try {
    history.replaceState(null, '', `#${id}`);
  } catch {
    /* some sandboxed contexts block history changes */
  }
  el.focus({ preventScroll: true });
}

/**
 * onClick helper for in-page anchors. Plain left-clicks scroll smoothly;
 * modified clicks (new tab, etc.) fall through to the normal href.
 */
export function anchorClick(id: string, after?: () => void) {
  return (event: MouseEvent<HTMLElement>) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    after?.();
    // Wait a frame so any overlay/scroll-lock is released before scrolling.
    requestAnimationFrame(() => scrollToId(id));
  };
}
