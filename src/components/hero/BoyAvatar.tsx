import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { cn } from '../../lib/cn';

const SKIN = '#c98d63';
const SKIN_SHADE = '#aa6f47';
const HAIR = '#171221';
const HAIR_LIGHT = '#2c2342';

interface BoyAvatarProps {
  className?: string;
  /** Play the one-time wave. Idle breathing/blinking run regardless (unless motion is reduced). */
  wave?: boolean;
}

/**
 * Stylised guide character, drawn as inline SVG so it is crisp at any size,
 * costs almost nothing to render, and never depends on WebGL.
 *
 * Motion is limited to transform animations (see .av-* in index.css):
 *  - breathing (torso/head rise a hair), a slow head sway, a blink every ~5s
 *  - one short wave right after the entrance, then the arm rests
 * Nothing here reacts to the pointer or scroll, and under
 * prefers-reduced-motion no animation classes are applied at all.
 */
export function BoyAvatar({ className, wave = true }: BoyAvatarProps) {
  const reduce = usePrefersReducedMotion();
  const live = !reduce;

  return (
    <svg
      viewBox="0 0 200 250"
      role="img"
      aria-label="Illustration of the portfolio guide: a friendly character with round glasses and a blue hoodie"
      className={cn('block h-full w-full overflow-visible', className)}
    >
      <defs>
        <linearGradient id="av-hoodie" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: 'rgb(var(--blue))' }} />
          <stop offset="1" style={{ stopColor: 'rgb(var(--violet))' }} />
        </linearGradient>
        <linearGradient id="av-pad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" style={{ stopColor: 'rgb(var(--cyan) / 0.0)' }} />
          <stop offset="0.5" style={{ stopColor: 'rgb(var(--cyan) / 0.95)' }} />
          <stop offset="1" style={{ stopColor: 'rgb(var(--cyan) / 0.0)' }} />
        </linearGradient>
        <radialGradient id="av-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0" style={{ stopColor: 'rgb(var(--cyan) / 0.42)' }} />
          <stop offset="1" style={{ stopColor: 'rgb(var(--cyan) / 0)' }} />
        </radialGradient>
        <linearGradient id="av-skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d49a70" />
          <stop offset="1" stopColor={SKIN} />
        </linearGradient>
      </defs>

      {/* holographic pad the guide stands on */}
      <g aria-hidden="true">
        <ellipse cx="100" cy="236" rx="92" ry="16" fill="url(#av-glow)" />
        <ellipse cx="100" cy="236" rx="76" ry="11" fill="none" stroke="url(#av-pad)" strokeWidth="1.6" />
        <ellipse cx="100" cy="236" rx="54" ry="7.5" fill="none" stroke="url(#av-pad)" strokeWidth="1" opacity="0.75" />
      </g>

      <g className={live ? 'av-breathe' : undefined}>
        {/* waving arm: sits behind the torso so at rest it is simply hidden */}
        <g className={live && wave ? 'av-arm' : 'av-arm-rest'} aria-hidden="true">
          <line x1="152" y1="208" x2="169" y2="166" stroke="#3a4fd0" strokeWidth="21" strokeLinecap="round" />
          <line x1="152" y1="208" x2="169" y2="166" stroke="url(#av-hoodie)" strokeWidth="17" strokeLinecap="round" />
          <circle cx="170" cy="156" r="9.5" fill={SKIN} />
          <ellipse cx="161.5" cy="159" rx="3.2" ry="5.4" fill={SKIN} transform="rotate(-24 161.5 159)" />
        </g>

        {/* torso / hoodie */}
        <g aria-hidden="true">
          <path
            d="M24 246 C24 208 50 192 80 187 L120 187 C150 192 176 208 176 246 Z"
            fill="url(#av-hoodie)"
          />
          <path
            d="M24 246 C24 208 50 192 80 187 L120 187 C150 192 176 208 176 246 Z"
            fill="#05081a"
            opacity="0.16"
          />
          {/* hood opening */}
          <path d="M74 187 C84 214 116 214 126 187 C116 194 84 194 74 187 Z" fill="#0b1235" opacity="0.55" />
          <path d="M74 187 C84 214 116 214 126 187" fill="none" stroke="#fff" strokeOpacity="0.28" strokeWidth="1.6" />
          {/* drawstrings */}
          <path d="M91 203 L89 224" stroke="#fff" strokeOpacity="0.8" strokeWidth="2" strokeLinecap="round" />
          <path d="M109 203 L111 224" stroke="#fff" strokeOpacity="0.8" strokeWidth="2" strokeLinecap="round" />
          <circle cx="89" cy="225" r="2" fill="#fff" fillOpacity="0.9" />
          <circle cx="111" cy="225" r="2" fill="#fff" fillOpacity="0.9" />
          {/* chest mark */}
          <text
            x="140"
            y="226"
            textAnchor="middle"
            fontFamily="'JetBrains Mono Variable', ui-monospace, monospace"
            fontWeight="700"
            fontSize="11"
            fill="#fff"
            fillOpacity="0.85"
          >
            {'</>'}
          </text>
        </g>
      </g>

      {/* neck sits above the torso but below the head */}
      <g className={live ? 'av-breathe' : undefined} aria-hidden="true">
        <rect x="87" y="164" width="26" height="30" rx="9" fill={SKIN_SHADE} />
      </g>

      {/* head: rides the same breathing bob as the torso, plus a slow sway */}
      <g className={live ? 'av-breathe' : undefined} aria-hidden="true">
      <g className={live ? 'av-head' : undefined}>
        {/* ears */}
        <circle cx="58.5" cy="124" r="9" fill={SKIN} />
        <circle cx="58.5" cy="124" r="4.6" fill={SKIN_SHADE} opacity="0.55" />
        <circle cx="141.5" cy="124" r="9" fill={SKIN} />
        <circle cx="141.5" cy="124" r="4.6" fill={SKIN_SHADE} opacity="0.55" />

        {/* face */}
        <path
          d="M58 112 C58 83 76 70 100 70 C124 70 142 83 142 112 C142 141 125 168 100 168 C75 168 58 141 58 112 Z"
          fill="url(#av-skin)"
        />
        {/* soft cheek shading */}
        <ellipse cx="73" cy="141" rx="9" ry="5.5" fill="#e0785f" opacity="0.28" />
        <ellipse cx="127" cy="141" rx="9" ry="5.5" fill="#e0785f" opacity="0.28" />

        {/* hair: back mass, then the fringe over the forehead */}
        <path
          d="M54 118 C46 78 70 50 102 50 C136 50 156 78 146 118 C144 102 140 94 132 88 C120 96 96 88 84 80 C72 88 64 98 60 112 C58 114 56 116 54 118 Z"
          fill={HAIR}
        />
        <path
          d="M72 66 C84 48 118 44 136 62 C146 72 148 92 146 108 C142 92 134 84 122 82 C104 78 86 76 76 84 C70 78 68 72 72 66 Z"
          fill={HAIR_LIGHT}
          opacity="0.9"
        />
        <path d="M80 62 C92 54 108 52 120 56" fill="none" stroke="#fff" strokeOpacity="0.12" strokeWidth="2.4" strokeLinecap="round" />

        {/* eyebrows */}
        <path d="M73 109 Q83 103 94 107" fill="none" stroke={HAIR} strokeWidth="3.6" strokeLinecap="round" />
        <path d="M106 107 Q117 103 127 109" fill="none" stroke={HAIR} strokeWidth="3.6" strokeLinecap="round" />

        {/* eyes (blink) */}
        <g className={live ? 'av-blink' : undefined}>
          <ellipse cx="84" cy="124" rx="4.4" ry="5.6" fill="#1a1020" />
          <ellipse cx="116" cy="124" rx="4.4" ry="5.6" fill="#1a1020" />
          <circle cx="85.6" cy="122" r="1.5" fill="#fff" />
          <circle cx="117.6" cy="122" r="1.5" fill="#fff" />
        </g>

        {/* round glasses */}
        <g fill="none" strokeLinecap="round">
          <circle cx="84" cy="124" r="14.5" style={{ stroke: 'rgb(var(--cyan))' }} strokeWidth="2.6" />
          <circle cx="116" cy="124" r="14.5" style={{ stroke: 'rgb(var(--cyan))' }} strokeWidth="2.6" />
          <path d="M98.4 122 Q100 119.6 101.6 122" style={{ stroke: 'rgb(var(--cyan))' }} strokeWidth="2.4" />
          <path d="M69.6 120 L62 118" style={{ stroke: 'rgb(var(--cyan))' }} strokeWidth="2.2" />
          <path d="M130.4 120 L138 118" style={{ stroke: 'rgb(var(--cyan))' }} strokeWidth="2.2" />
          <path d="M75 116 Q79 112 84 112" stroke="#fff" strokeOpacity="0.55" strokeWidth="1.8" />
          <path d="M107 116 Q111 112 116 112" stroke="#fff" strokeOpacity="0.55" strokeWidth="1.8" />
        </g>
        <circle cx="84" cy="124" r="13.4" style={{ fill: 'rgb(var(--cyan) / 0.08)' }} />
        <circle cx="116" cy="124" r="13.4" style={{ fill: 'rgb(var(--cyan) / 0.08)' }} />

        {/* nose + smile */}
        <path d="M100 130 Q96.5 139 101.5 140" fill="none" stroke={SKIN_SHADE} strokeWidth="2.2" strokeLinecap="round" />
        <path d="M88 147 Q100 160 112 147" fill="none" stroke="#6b2f26" strokeWidth="3" strokeLinecap="round" />
        <path d="M91 149 Q100 156.5 109 149 Q100 152 91 149 Z" fill="#fff" opacity="0.92" />
      </g>
      </g>
    </svg>
  );
}
