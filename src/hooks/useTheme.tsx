import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

export type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const THEME_COLORS: Record<Theme, string> = { dark: '#060a18', light: '#f5f7fc' };

function readInitialTheme(): Theme {
  // index.html sets data-theme before first paint (saved choice, else system).
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
}

function readSavedTheme(): Theme | null {
  try {
    const saved = localStorage.getItem('theme');
    return saved === 'light' || saved === 'dark' ? saved : null;
  } catch {
    return null;
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(readInitialTheme);
  const reduceMotion = usePrefersReducedMotion();
  const timer = useRef<number>();

  const apply = useCallback(
    (next: Theme, animate: boolean) => {
      const root = document.documentElement;
      if (animate && !reduceMotion) {
        root.classList.add('theme-transition');
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => root.classList.remove('theme-transition'), 550);
      }
      root.setAttribute('data-theme', next);
      document
        .querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
        .forEach((meta) => meta.setAttribute('content', THEME_COLORS[next]));
      setThemeState(next);
    },
    [reduceMotion],
  );

  const toggleTheme = useCallback(() => {
    const next: Theme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    apply(next, true);
    try {
      localStorage.setItem('theme', next);
    } catch {
      /* storage blocked: the choice still applies for this visit */
    }
  }, [apply]);

  // Follow the OS setting live, but only until the visitor makes their own choice.
  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: light)');
    const onChange = (event: MediaQueryListEvent) => {
      if (readSavedTheme() === null) apply(event.matches ? 'light' : 'dark', true);
    };
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [apply]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
