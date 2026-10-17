import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { navItems, site } from '../../data/site';
import { useScrolled } from '../../hooks/useScrolled';
import { anchorClick } from '../../lib/scroll';
import { cn } from '../../lib/cn';
import { Monogram } from '../ui/Icons';
import { ThemeToggle } from './ThemeToggle';

interface NavbarProps {
  /** id of the section currently crossing the reading line */
  active: string;
}

interface Pill {
  x: number;
  w: number;
  visible: boolean;
}

const FOCUSABLE = 'a[href], button:not([disabled])';

export function Navbar({ active }: NavbarProps) {
  const scrolled = useScrolled(24);
  const [open, setOpen] = useState(false);
  const [pill, setPill] = useState<Pill>({ x: 0, w: 0, visible: false });
  const listRef = useRef<HTMLUListElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Slide the highlight under the active link.
  useLayoutEffect(() => {
    const measure = () => {
      const el = listRef.current?.querySelector<HTMLAnchorElement>(`a[data-id="${active}"]`);
      if (!el) {
        setPill((p) => ({ ...p, visible: false }));
        return;
      }
      setPill({ x: el.offsetLeft, w: el.offsetWidth, visible: true });
    };
    measure();
    window.addEventListener('resize', measure);
    document.fonts?.ready.then(measure);
    return () => window.removeEventListener('resize', measure);
  }, [active]);

  // Mobile menu: lock scroll, move focus in, trap Tab, close on Escape.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    menuRef.current?.querySelector<HTMLElement>('a')?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
        return;
      }
      if (event.key !== 'Tab') return;
      const items = [headerRef.current, menuRef.current]
        .flatMap((root) => Array.from(root?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []))
        .filter((el) => el.offsetParent !== null);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // Close the menu if the viewport grows past the mobile breakpoint.
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 768px)');
    const onChange = () => mql.matches && setOpen(false);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return (
    <>
      <header ref={headerRef} className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5">
        <nav
          aria-label="Primary"
          className={cn(
            'relative isolate mx-auto flex items-center justify-between gap-3 rounded-2xl px-3 transition-[height,max-width] duration-300 ease-out sm:px-4',
            scrolled ? 'h-14 max-w-[960px]' : 'h-[68px] max-w-[1200px]',
          )}
        >
          <div
            aria-hidden="true"
            className={cn(
              'glass absolute inset-0 -z-10 rounded-2xl transition-opacity duration-300',
              scrolled || open ? 'opacity-100' : 'opacity-0',
            )}
          />

          <a
            href="#home"
            onClick={anchorClick('home')}
            aria-label={`${site.name}, back to top`}
            className="flex items-center gap-2.5 rounded-xl"
          >
            <Monogram size={scrolled ? 32 : 38} className="transition-[width,height] duration-300" />
            <span className="hidden font-display text-[15px] font-semibold tracking-tight sm:inline">{site.name}</span>
          </a>

          <ul ref={listRef} className="relative hidden items-center gap-1 md:flex">
            <span
              aria-hidden="true"
              className="absolute bottom-1 top-1 left-0 rounded-lg bg-blue/15 ring-1 ring-blue/40 transition-[transform,width,opacity] duration-300 ease-out"
              style={{ transform: `translateX(${pill.x}px)`, width: pill.w, opacity: pill.visible ? 1 : 0 }}
            />
            {navItems.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    data-id={item.id}
                    aria-current={isActive ? 'location' : undefined}
                    onClick={anchorClick(item.id)}
                    className={cn(
                      'relative block rounded-lg px-3.5 py-2 text-sm transition-colors',
                      isActive ? 'font-semibold text-fg' : 'font-medium text-muted hover:text-fg',
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-1">
            <ThemeToggle />
            <button
              ref={buttonRef}
              type="button"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line/15 text-fg transition-colors hover:border-cyan/60 md:hidden"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <m.div
            id="mobile-menu"
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="fixed inset-0 z-40 flex flex-col bg-bg/90 px-6 pb-10 pt-28 backdrop-blur-xl md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ul className="flex flex-col gap-1">
              {navItems.map((item, i) => (
                <m.li
                  key={item.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, duration: 0.3 }}
                >
                  <a
                    href={`#${item.id}`}
                    onClick={anchorClick(item.id, () => setOpen(false))}
                    aria-current={active === item.id ? 'location' : undefined}
                    className={cn(
                      'flex items-baseline gap-4 rounded-xl border-b border-line/10 px-2 py-4 font-display text-3xl font-semibold',
                      active === item.id ? 'text-fg' : 'text-muted',
                    )}
                  >
                    {item.label}
                    {active === item.id && <span className="sr-only"> (current section)</span>}
                  </a>
                </m.li>
              ))}
            </ul>
            <p className="mt-auto font-mono text-xs text-muted">{site.footerLine}</p>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
