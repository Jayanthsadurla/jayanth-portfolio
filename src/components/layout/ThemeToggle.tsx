import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

/** Accessible switch: announces "Dark mode, on/off". Sized for touch (44px target). */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Dark mode"
      onClick={toggleTheme}
      className="group relative inline-flex h-11 w-[68px] shrink-0 items-center justify-center rounded-full"
    >
      <span
        aria-hidden="true"
        className="relative block h-8 w-[60px] rounded-full border border-line/20 bg-line/[0.06] transition-colors group-hover:border-cyan/60"
      >
        <Sun
          size={14}
          strokeWidth={2.2}
          className={`absolute left-[9px] top-[8px] transition-opacity duration-300 ${isDark ? 'opacity-60' : 'opacity-0'} text-muted`}
        />
        <Moon
          size={14}
          strokeWidth={2.2}
          className={`absolute right-[9px] top-[8px] transition-opacity duration-300 ${isDark ? 'opacity-0' : 'opacity-60'} text-muted`}
        />
        <span
          className="absolute left-[3px] top-[3px] flex h-[24px] w-[24px] items-center justify-center rounded-full bg-gradient-to-br from-cyan to-blue text-[rgb(var(--on-accent))] shadow-md transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
          style={{ transform: isDark ? 'translateX(28px)' : 'translateX(0)' }}
        >
          {isDark ? <Moon size={14} strokeWidth={2.4} /> : <Sun size={14} strokeWidth={2.4} />}
        </span>
      </span>
    </button>
  );
}
