import { useMemo } from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface Pt {
  x: number;
  y: number;
}

/** Deterministic pseudo-random so the layout never changes between visits. */
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

function buildGraph() {
  const rand = rng(11);
  const layers = [4, 6, 7, 6, 4];
  const xs = [70, 185, 300, 415, 530];
  const nodes: Pt[][] = layers.map((count, l) =>
    Array.from({ length: count }, (_, i) => ({
      x: xs[l] + (rand() - 0.5) * 16,
      y: 250 + (i - (count - 1) / 2) * 52 + (rand() - 0.5) * 14,
    })),
  );
  const edges: [Pt, Pt][] = [];
  for (let l = 0; l < nodes.length - 1; l++) {
    for (const a of nodes[l]) {
      [...nodes[l + 1]]
        .sort((p, q) => Math.hypot(a.x - p.x, a.y - p.y) - Math.hypot(a.x - q.x, a.y - q.y))
        .slice(0, 2)
        .forEach((b) => edges.push([a, b]));
    }
  }
  return { nodes: nodes.flat(), edges };
}

/**
 * 2D stand-in for the 3D scene: used while the WebGL chunk loads, when WebGL is
 * missing or software-rendered, and if the GPU context is lost. It is a real
 * visual, not a spinner, so the page looks intentional in every case.
 */
export function HeroFallback() {
  const reduce = usePrefersReducedMotion();
  const { nodes, edges } = useMemo(buildGraph, []);
  const pulseEdges = useMemo(() => edges.filter((_, i) => i % 5 === 0).slice(0, 9), [edges]);

  return (
    <svg
      viewBox="0 0 600 520"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id="fb-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style={{ stopColor: 'rgb(var(--blue) / 0.4)' }} />
          <stop offset="100%" style={{ stopColor: 'rgb(var(--blue) / 0)' }} />
        </radialGradient>
        <linearGradient id="fb-edge" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" style={{ stopColor: 'rgb(var(--cyan) / 0.55)' }} />
          <stop offset="100%" style={{ stopColor: 'rgb(var(--violet) / 0.55)' }} />
        </linearGradient>
      </defs>

      <ellipse cx="300" cy="260" rx="270" ry="200" fill="url(#fb-glow)" />

      {/* perspective floor grid */}
      <g style={{ stroke: 'rgb(var(--cyan) / 0.22)' }} strokeWidth="1" fill="none">
        {Array.from({ length: 9 }, (_, i) => {
          const y = 430 + i * i * 1.4;
          return <line key={`h${i}`} x1="40" x2="560" y1={y} y2={y} />;
        })}
        {Array.from({ length: 13 }, (_, i) => {
          const x = 300 + (i - 6) * 44;
          return <line key={`v${i}`} x1={x} x2={300 + (i - 6) * 110} y1="430" y2="505" />;
        })}
      </g>

      <g className={reduce ? undefined : 'fallback-float'}>
        <g stroke="url(#fb-edge)" strokeWidth="1.2" fill="none">
          {edges.map(([a, b], i) => (
            <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
          ))}
        </g>

        {/* core */}
        <polygon
          points="300,200 352,230 352,290 300,320 248,290 248,230"
          fill="none"
          strokeWidth="1.5"
          style={{ stroke: 'rgb(var(--violet) / 0.7)', fill: 'rgb(var(--violet) / 0.1)' }}
        />
        <polygon
          points="300,222 333,241 333,279 300,298 267,279 267,241"
          fill="none"
          strokeWidth="1"
          style={{ stroke: 'rgb(var(--cyan) / 0.6)' }}
        />

        {nodes.map((n, i) => (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r="9" style={{ fill: 'rgb(var(--blue) / 0.14)' }} />
            <circle cx={n.x} cy={n.y} r="3.6" style={{ fill: 'rgb(var(--cyan))' }} />
          </g>
        ))}

        {!reduce &&
          pulseEdges.map(([a, b], i) => (
            <circle key={i} r="3.2" style={{ fill: 'rgb(var(--mint))' }}>
              <animateMotion
                dur={`${2.6 + (i % 4) * 0.5}s`}
                begin={`${(i * 0.37).toFixed(2)}s`}
                repeatCount="indefinite"
                path={`M${a.x},${a.y} L${b.x},${b.y}`}
              />
            </circle>
          ))}
      </g>
    </svg>
  );
}
