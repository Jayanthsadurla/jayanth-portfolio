import type { ProjectIcon } from '../../data/projects';

/**
 * Hand-drawn SVG illustrations, one per project, tinted by the card's accent
 * (--a). They are decorative (aria-hidden) and add no network requests.
 */

const A = 'rgb(var(--a))';
const A_SOFT = 'rgb(var(--a) / 0.16)';
const A_MID = 'rgb(var(--a) / 0.55)';
const INK = 'rgb(var(--fg) / 0.14)';
const INK_2 = 'rgb(var(--fg) / 0.26)';
const PANEL = 'rgb(var(--elevated) / 0.7)';

const lift = 'transition-transform duration-500 ease-out group-hover:-translate-y-1.5 group-focus-within:-translate-y-1.5';
const drift = 'transition-transform duration-500 ease-out group-hover:translate-x-1.5 group-focus-within:translate-x-1.5';

function Logs() {
  const widths = [118, 84, 132, 70, 104, 126, 76];
  const flagged = new Set([2, 5]);
  return (
    <>
      {widths.map((w, i) => {
        const y = 16 + i * 17;
        const hot = flagged.has(i);
        return (
          <g key={i}>
            <circle cx="16" cy={y + 2.5} r="2.6" fill={hot ? A : INK_2} />
            <rect x="26" y={y} width="26" height="5" rx="2.5" fill={INK} />
            <rect x="60" y={y} width={w} height="5" rx="2.5" fill={hot ? A : INK} opacity={hot ? 0.9 : 1} />
          </g>
        );
      })}
      <g className={lift}>
        <rect x="214" y="14" width="92" height="104" rx="12" fill={PANEL} stroke={INK_2} />
        <path d="M224 100 L238 94 L252 97 L264 88 L277 36 L290 92 L298 86" fill="none" stroke={A} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="277" cy="36" r="8" fill="none" stroke={A} strokeWidth="1.6" strokeDasharray="3 3" />
        <circle cx="277" cy="36" r="3" fill={A} />
        <rect x="224" y="24" width="30" height="4" rx="2" fill={INK_2} />
      </g>
    </>
  );
}

function Rag() {
  return (
    <>
      <g className={drift}>
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect x={18 + i * 6} y={24 + i * 14} width="58" height="46" rx="7" fill={PANEL} stroke={INK_2} />
            <rect x={26 + i * 6} y={34 + i * 14} width="34" height="4" rx="2" fill={INK_2} />
            <rect x={26 + i * 6} y={44 + i * 14} width="42" height="4" rx="2" fill={INK} />
          </g>
        ))}
      </g>
      <path d="M92 68 H124" stroke={A_MID} strokeWidth="2" strokeLinecap="round" />
      <path d="M119 63 L125 68 L119 73" fill="none" stroke={A_MID} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M156 38 L180 52 V80 L156 94 L132 80 V52 Z" fill={A_SOFT} stroke={A} strokeWidth="2" strokeLinejoin="round" />
      <text x="156" y="71" textAnchor="middle" fontFamily="'JetBrains Mono Variable', monospace" fontWeight="700" fontSize="12" fill={A}>
        LLM
      </text>
      <path d="M186 66 H214" stroke={A_MID} strokeWidth="2" strokeLinecap="round" />
      <path d="M209 61 L215 66 L209 71" fill="none" stroke={A_MID} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <g className={lift}>
        <rect x="220" y="42" width="80" height="48" rx="12" fill={PANEL} stroke={A} strokeWidth="1.6" />
        <path d="M232 66 l7 7 l12 -14" fill="none" stroke={A} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        <text x="276" y="71" textAnchor="middle" fontFamily="'JetBrains Mono Variable', monospace" fontWeight="700" fontSize="11" fill={A}>
          PASS
        </text>
      </g>
      <path d="M260 96 C260 128 156 128 156 102" fill="none" stroke={INK_2} strokeWidth="1.8" strokeDasharray="4 4" strokeLinecap="round" />
      <path d="M151 107 L156 100 L161 107" fill="none" stroke={INK_2} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <text x="208" y="127" textAnchor="middle" fontFamily="'JetBrains Mono Variable', monospace" fontSize="9" fill="rgb(var(--fg) / 0.5)">
        retry on FAIL
      </text>
    </>
  );
}

function Fraud() {
  const normal: [number, number][] = [
    [84, 64], [96, 80], [104, 58], [112, 92], [120, 70], [128, 84], [136, 62], [144, 78],
    [100, 100], [152, 92], [90, 92], [132, 100], [116, 52], [160, 70], [72, 76], [108, 76],
  ];
  const outliers: [number, number][] = [[250, 34], [276, 108], [214, 22]];
  return (
    <>
      <path d="M20 124 H304 M20 124 V14" stroke={INK} strokeWidth="1.5" fill="none" />
      <ellipse cx="118" cy="76" rx="86" ry="50" fill="none" stroke={INK_2} strokeWidth="1.6" strokeDasharray="5 5" />
      {normal.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3.6" fill={INK_2} />
      ))}
      <g className={lift}>
        {outliers.map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="11" fill={A_SOFT} stroke={A} strokeWidth="1.6" strokeDasharray="3 3" />
            <circle cx={x} cy={y} r="4" fill={A} />
          </g>
        ))}
      </g>
    </>
  );
}

function Retail() {
  const heights = [34, 52, 44, 72, 62, 92, 104];
  return (
    <>
      <path d="M18 122 H214" stroke={INK_2} strokeWidth="1.5" />
      {heights.map((h, i) => (
        <rect key={i} x={26 + i * 27} y={122 - h} width="16" height={h} rx="4" fill={A} opacity={0.3 + i * 0.1} />
      ))}
      <g className={lift}>
        <polyline
          points={heights.map((h, i) => `${34 + i * 27},${112 - h}`).join(' ')}
          fill="none"
          stroke="rgb(var(--fg) / 0.7)"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {heights.map((h, i) => (
          <circle key={i} cx={34 + i * 27} cy={112 - h} r="3" fill="rgb(var(--bg))" stroke="rgb(var(--fg) / 0.7)" strokeWidth="1.6" />
        ))}
      </g>
      <g className={drift}>
        <path d="M236 16 H300 V122 L292 116 L284 122 L276 116 L268 122 L260 116 L252 122 L244 116 L236 122 Z" fill={PANEL} stroke={INK_2} strokeLinejoin="round" />
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <rect x="244" y={30 + i * 14} width={24 + (i % 2) * 8} height="4" rx="2" fill={INK_2} />
            <rect x="278" y={30 + i * 14} width="14" height="4" rx="2" fill={INK} />
          </g>
        ))}
        <rect x="244" y="92" width="48" height="10" rx="5" fill={A} />
      </g>
    </>
  );
}

function Kanban() {
  const cols = [
    { x: 14, cards: 3 },
    { x: 112, cards: 2 },
    { x: 210, cards: 2 },
  ];
  return (
    <>
      {cols.map((col, c) => (
        <g key={c}>
          <rect x={col.x} y="12" width="92" height="124" rx="10" fill={PANEL} stroke={INK} />
          <rect x={col.x + 10} y="22" width="34" height="5" rx="2.5" fill={INK_2} />
          {Array.from({ length: col.cards }).map((_, i) => (
            <g key={i}>
              <rect x={col.x + 8} y={38 + i * 30} width="76" height="23" rx="6" fill="rgb(var(--elevated) / 0.9)" stroke={INK_2} />
              <rect x={col.x + 15} y={46 + i * 30} width={44 - ((c + i) % 3) * 8} height="4" rx="2" fill={INK_2} />
              <rect x={col.x + 15} y={53 + i * 30} width="22" height="3" rx="1.5" fill={INK} />
            </g>
          ))}
        </g>
      ))}
      <g className="transition-transform duration-500 ease-out group-hover:translate-x-[92px] group-hover:-translate-y-0 group-focus-within:translate-x-[92px]">
        <g transform="rotate(-4 150 100)">
          <rect x="122" y="92" width="76" height="26" rx="7" fill={A_SOFT} stroke={A} strokeWidth="1.8" />
          <rect x="130" y="101" width="40" height="4" rx="2" fill={A} />
          <rect x="130" y="108" width="22" height="3" rx="1.5" fill={A_MID} />
        </g>
      </g>
    </>
  );
}

function Aria() {
  const scores = [128, 104, 80, 52];
  return (
    <>
      {scores.map((w, i) => {
        const y = 22 + i * 28;
        const top = i === 0;
        return (
          <g key={i}>
            {top && <rect x="10" y={y - 10} width="300" height="26" rx="10" fill={A_SOFT} />}
            <circle cx="30" cy={y + 3} r="9" fill={top ? A : INK_2} opacity={top ? 0.9 : 1} />
            <circle cx="30" cy={y} r="3" fill="rgb(var(--bg))" opacity="0.8" />
            <rect x="48" y={y - 2} width="54" height="5" rx="2.5" fill={INK_2} />
            <rect x="48" y={y + 6} width="34" height="3.5" rx="1.75" fill={INK} />
            <rect x="130" y={y - 1} width="150" height="8" rx="4" fill={INK} />
            <rect x="130" y={y - 1} width={w} height="8" rx="4" fill={A} opacity={top ? 1 : 0.5 - i * 0.05} />
          </g>
        );
      })}
      <g className={drift}>
        <circle cx="296" cy="25" r="7" fill="none" stroke={A} strokeWidth="1.6" />
        <path d="M293 25 l2.5 2.5 l4.5 -5" fill="none" stroke={A} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </>
  );
}

function Shield() {
  const nodes: [number, number][] = [[44, 36], [32, 92], [74, 124], [276, 36], [288, 92], [246, 124]];
  return (
    <>
      {nodes.map(([x, y], i) => (
        <g key={i}>
          <line x1={x} y1={y} x2="160" y2="72" stroke={INK} strokeWidth="1.4" />
          <circle cx={x} cy={y} r="5" fill={PANEL} stroke={INK_2} strokeWidth="1.6" />
        </g>
      ))}
      <circle cx="276" cy="36" r="11" fill="none" stroke={A} strokeWidth="1.6" strokeDasharray="3 3" />
      <g className={lift}>
        <path d="M160 18 L208 35 V72 C208 100 188 116 160 128 C132 116 112 100 112 72 V35 Z" fill={A_SOFT} stroke={A} strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M138 72 l15 15 l28 -32" fill="none" stroke={A} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </>
  );
}

const art: Record<ProjectIcon, () => JSX.Element> = {
  logs: Logs,
  rag: Rag,
  fraud: Fraud,
  retail: Retail,
  kanban: Kanban,
  aria: Aria,
  shield: Shield,
};

export function ProjectArt({ icon }: { icon: ProjectIcon }) {
  const Art = art[icon];
  return (
    <svg viewBox="0 0 320 140" className="h-full w-full" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet">
      <Art />
    </svg>
  );
}
