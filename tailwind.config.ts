import type { Config } from 'tailwindcss';

// Every colour is a CSS variable holding an "R G B" triplet (see src/index.css)
// so the same utility class works in both themes and supports alpha: bg-accent/20.
const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: token('bg'),
        elevated: token('elevated'),
        fg: token('fg'),
        muted: token('muted'),
        line: token('line'),
        blue: token('blue'),
        cyan: token('cyan'),
        violet: token('violet'),
        mint: token('mint'),
      },
      fontFamily: {
        display: ['"Sora Variable"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"Inter Variable"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono Variable"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        glass: '0 1px 0 0 rgb(var(--glass-highlight) / 0.5) inset, 0 20px 50px -24px rgb(var(--shadow) / 0.55)',
        glow: '0 0 0 1px rgb(var(--blue) / 0.35), 0 12px 40px -12px rgb(var(--blue) / 0.55)',
      },
      keyframes: {
        'float-y': {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(0, -8px, 0)' },
        },
        'pulse-dot': {
          '0%': { transform: 'scale(1)', opacity: '0.55' },
          '100%': { transform: 'scale(2.6)', opacity: '0' },
        },
      },
      animation: {
        'float-y': 'float-y 7s ease-in-out infinite',
        'pulse-dot': 'pulse-dot 2.4s ease-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
