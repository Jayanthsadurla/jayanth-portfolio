import { useMemo, useState, type CSSProperties } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { projects } from '../../data/projects';
import { universeEdges, universeNodes, type UniverseId, type UniverseNode } from '../../data/universe';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { cn } from '../../lib/cn';
import { Reveal } from '../ui/Reveal';
import { Section } from '../ui/Section';
import { SectionHeading } from '../ui/SectionHeading';

const accentVar = (accent: string) => ({ '--a': `var(--${accent})` }) as CSSProperties;

interface Placed extends UniverseNode {
  x: number;
  y: number;
  angle: number;
  count: number;
  /** where the label sits relative to the node */
  side: 'top' | 'bottom' | 'left' | 'right';
}

export function TechnicalUniverse() {
  const wide = useMediaQuery('(min-width: 640px)');
  const radius = wide ? 33 : 27;
  const [selected, setSelected] = useState<UniverseId>('ai');
  const [hovered, setHovered] = useState<UniverseId | null>(null);

  const nodes = useMemo<Placed[]>(
    () =>
      universeNodes.map((node, i) => {
        const angle = (-90 + (360 / universeNodes.length) * i) * (Math.PI / 180);
        const dx = Math.cos(angle);
        const dy = Math.sin(angle);
        const side = Math.abs(dx) < 0.35 ? (dy < 0 ? 'top' : 'bottom') : dx > 0 ? 'right' : 'left';
        return {
          ...node,
          angle,
          x: 50 + radius * dx,
          y: 50 + radius * dy,
          side,
          count: projects.filter((p) => p.themes.includes(node.id)).length,
        };
      }),
    [radius],
  );
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n])) as Record<UniverseId, Placed>;
  const focus = hovered ?? selected;
  const current = byId[selected];
  const related = projects.filter((p) => p.themes.includes(selected));
  const neighbours = universeEdges
    .filter(([a, b]) => a === selected || b === selected)
    .map(([a, b]) => byId[a === selected ? b : a]);

  const edgeActive = ([a, b]: [UniverseId, UniverseId]) => a === focus || b === focus;

  return (
    <Section id="universe" labelledBy="universe-title">
      <SectionHeading
        id="universe-title"
        title="Inside My Technical Universe"
        description="The themes that connect my projects. A larger node means the theme shows up in more of my projects. Select one to see where."
      />

      <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
        <Reveal className="min-w-0">
          <div role="group" aria-label="Technical themes" className="relative mx-auto aspect-square w-full max-w-[600px]">
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
              <circle cx="50" cy="50" r={radius} fill="none" stroke="rgb(var(--line) / 0.09)" strokeWidth="0.3" strokeDasharray="0.8 1.6" />
              <circle cx="50" cy="50" r={radius * 0.55} fill="none" stroke="rgb(var(--line) / 0.07)" strokeWidth="0.3" />
              <circle cx="50" cy="50" r={radius * 0.2} fill="rgb(var(--blue) / 0.08)" stroke="rgb(var(--blue) / 0.3)" strokeWidth="0.3" />
              {universeEdges.map(([a, b]) => {
                const A = byId[a];
                const B = byId[b];
                const on = edgeActive([a, b]);
                const accent = byId[focus].accent;
                return (
                  <path
                    key={`${a}-${b}`}
                    d={`M ${A.x} ${A.y} Q 50 50 ${B.x} ${B.y}`}
                    fill="none"
                    stroke={on ? `rgb(var(--${accent}))` : 'rgb(var(--line) / 0.13)'}
                    strokeWidth={on ? 0.7 : 0.3}
                    style={{ transition: 'stroke 0.3s ease, stroke-width 0.3s ease' }}
                  />
                );
              })}
            </svg>

            <p className="pointer-events-none absolute left-1/2 top-1/2 w-[18%] -translate-x-1/2 -translate-y-1/2 text-center font-display text-[10px] font-semibold leading-tight text-muted sm:text-xs">
              My work
            </p>

            {nodes.map((node) => {
              const active = node.id === selected;
              const size = 7 + node.count * 1.7; // % of the chart width
              return (
                <button
                  key={node.id}
                  type="button"
                  aria-pressed={active}
                  aria-label={`${node.label}, appears in ${node.count} ${node.count === 1 ? 'project' : 'projects'}`}
                  onClick={() => setSelected(node.id)}
                  onMouseEnter={() => setHovered(node.id)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(node.id)}
                  onBlur={() => setHovered(null)}
                  style={{ left: `${node.x}%`, top: `${node.y}%`, width: `${size}%`, ...accentVar(node.accent) }}
                  className="group absolute aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full"
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      'flex h-full w-full items-center justify-center rounded-full border-2 bg-bg font-mono text-[11px] font-semibold transition-[transform,box-shadow,background-color] duration-300 sm:text-sm',
                      active
                        ? 'border-[rgb(var(--a))] bg-[rgb(var(--a)/0.22)] shadow-[0_0_0_5px_rgb(var(--a)/0.18)]'
                        : 'border-[rgb(var(--a)/0.7)] group-hover:scale-110 group-hover:bg-[rgb(var(--a)/0.14)]',
                    )}
                  >
                    {node.count}
                  </span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      'pointer-events-none absolute w-[72px] text-[11px] font-medium leading-tight sm:w-[112px] sm:text-[13px]',
                      active ? 'text-fg' : 'text-muted group-hover:text-fg',
                      node.side === 'top' && 'bottom-full left-1/2 mb-1.5 -translate-x-1/2 text-center',
                      // On phones the two bottom nodes sit ~65px apart, so their labels hang outward
                      // instead of centring and colliding; from 640px up they centre again.
                      node.side === 'bottom' &&
                        cn(
                          'left-1/2 top-full mt-1.5 sm:-translate-x-1/2 sm:text-center',
                          node.x > 50 ? '-translate-x-[18%] text-left' : '-translate-x-[82%] text-right',
                        ),
                      node.side === 'left' && 'right-full top-1/2 mr-1.5 -translate-y-1/2 text-right',
                      node.side === 'right' && 'left-full top-1/2 ml-1.5 -translate-y-1/2 text-left',
                    )}
                  >
                    {node.label}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={0.1} className="min-w-0">
          <div aria-live="polite" style={accentVar(current.accent)} className="glass relative overflow-hidden rounded-3xl p-6 sm:p-8">
            <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-[rgb(var(--a))]" />
            <h3 className="text-2xl font-semibold">{current.label}</h3>
            <p className="mt-2 text-muted">{current.blurb}</p>

            <h4 className="mt-6 font-display text-sm font-semibold">
              {related.length === 0
                ? 'Not yet a focus of a listed project'
                : `Shows up in ${related.length} ${related.length === 1 ? 'project' : 'projects'}`}
            </h4>
            <ul className="mt-3 space-y-1">
              {related.map((p) => (
                <li key={p.id}>
                  <a
                    href={p.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="-mx-2 flex min-h-[40px] items-center justify-between gap-3 rounded-lg px-2 text-[15px] transition-colors hover:bg-line/[0.06]"
                  >
                    <span>{p.name}</span>
                    <ArrowUpRight size={15} aria-hidden="true" className="shrink-0 text-muted" />
                    <span className="sr-only"> (GitHub, opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>

            <h4 className="mt-6 font-display text-sm font-semibold">Connected themes</h4>
            <ul className="mt-3 flex flex-wrap gap-2">
              {neighbours.map((n) => (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => setSelected(n.id)}
                    className="chip min-h-[32px] !text-[12px] !text-fg transition-colors hover:border-cyan/60"
                  >
                    {n.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
