import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

/** GitHub mark (lucide v1 no longer ships brand icons, so these are inline). */
export function GitHubIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" focusable="false" {...props}>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

export function LinkedInIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false" {...props}>
      <rect x="2.75" y="2.75" width="18.5" height="18.5" rx="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="8" cy="8" r="1.3" fill="currentColor" />
      <rect x="6.9" y="10.2" width="2.2" height="6.8" fill="currentColor" />
      <path
        d="M11.4 10.2h2.1v1c.5-.8 1.4-1.2 2.4-1.2 2 0 2.8 1.2 2.8 3.4V17h-2.2v-3.4c0-1.1-.4-1.6-1.2-1.6-.9 0-1.7.6-1.7 1.8V17h-2.2z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Hexagon monogram used by the navbar, loader and favicon. */
export function Monogram({ size = 36, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false" {...props}>
      <defs>
        <linearGradient id="mono-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="rgb(var(--cyan))" />
          <stop offset="0.55" stopColor="rgb(var(--blue))" />
          <stop offset="1" stopColor="rgb(var(--violet))" />
        </linearGradient>
      </defs>
      <path
        d="M32 5l21.6 12.5v29L32 59 10.4 46.5v-29z"
        fill="rgb(var(--elevated) / 0.7)"
        stroke="url(#mono-grad)"
        strokeWidth="3.4"
        strokeLinejoin="round"
      />
      <text
        x="32"
        y="40.5"
        textAnchor="middle"
        fontFamily="'Sora Variable', system-ui, sans-serif"
        fontWeight="700"
        fontSize="22"
        fill="rgb(var(--fg))"
      >
        JS
      </text>
    </svg>
  );
}
