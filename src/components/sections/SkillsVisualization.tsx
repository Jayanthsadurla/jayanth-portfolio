import { useState, type CSSProperties } from 'react';
import { BrainCircuit, Database, Layers, Puzzle, Sparkles, type LucideIcon } from 'lucide-react';
import { skillCategories, type SkillCategoryId } from '../../data/skills';
import { useRovingTabs } from '../../hooks/useRovingTabs';
import { cn } from '../../lib/cn';
import { Monogram } from '../ui/Icons';
import { Reveal } from '../ui/Reveal';
import { Section } from '../ui/Section';
import { SectionHeading } from '../ui/SectionHeading';

const icons: Record<SkillCategoryId, LucideIcon> = {
  data: Database,
  ml: BrainCircuit,
  genai: Sparkles,
  web: Layers,
  professional: Puzzle,
};

/** Hub positions as percentages of the (square) constellation, clockwise from the top. */
const hubs: Record<SkillCategoryId, [number, number]> = {
  data: [50, 13],
  ml: [85, 39],
  web: [72, 82],
  professional: [28, 82],
  genai: [15, 39],
};

// Clockwise order so arrow keys travel around the constellation.
const order: SkillCategoryId[] = ['data', 'ml', 'web', 'professional', 'genai'];
const byId = Object.fromEntries(skillCategories.map((c) => [c.id, c])) as Record<SkillCategoryId, (typeof skillCategories)[number]>;

const accentVar = (accent: string) => ({ '--a': `var(--${accent})` }) as CSSProperties;

export function SkillsVisualization() {
  const [selected, setSelected] = useState<SkillCategoryId>('data');
  const roving = useRovingTabs(order, selected, setSelected);
  const current = byId[selected];

  return (
    <Section id="skills" labelledBy="skills-title">
      <SectionHeading
        id="skills-title"
        title="Skills"
        description="The tools and methods I work with, grouped by area. Select an area to see what is in it."
      />

      <div className="grid items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <Reveal className="min-w-0">
          <div
            role="tablist"
            aria-label="Skill areas"
            aria-orientation="horizontal"
            onKeyDown={roving.onKeyDown}
            className="relative mx-auto aspect-square w-full max-w-[460px]"
          >
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
              <circle cx="50" cy="50" r="36" fill="none" stroke="rgb(var(--line) / 0.08)" strokeWidth="0.35" strokeDasharray="1 1.6" />
              <circle cx="50" cy="50" r="19" fill="none" stroke="rgb(var(--line) / 0.08)" strokeWidth="0.35" />
              {order.map((id, i) => {
                const next = order[(i + 1) % order.length];
                const [x1, y1] = hubs[id];
                const [x2, y2] = hubs[next];
                return <line key={id} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgb(var(--line) / 0.1)" strokeWidth="0.35" />;
              })}
              {order.map((id) => {
                const [x, y] = hubs[id];
                return <line key={id} x1="50" y1="50" x2={x} y2={y} stroke="rgb(var(--line) / 0.14)" strokeWidth="0.4" />;
              })}
              {/* the selected spoke redraws itself when selection changes */}
              <line
                key={selected}
                x1="50"
                y1="50"
                x2={hubs[selected][0]}
                y2={hubs[selected][1]}
                pathLength={1}
                className="spoke-draw"
                stroke={`rgb(var(--${current.accent}))`}
                strokeWidth="0.9"
                strokeLinecap="round"
              />
            </svg>

            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <Monogram size={58} />
            </div>

            {order.map((id) => {
              const cat = byId[id];
              const Icon = icons[id];
              const [x, y] = hubs[id];
              const active = id === selected;
              return (
                <button
                  key={id}
                  ref={roving.register(id)}
                  id={`skills-tab-${id}`}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls="skills-panel"
                  tabIndex={roving.tabIndex(id)}
                  onClick={() => setSelected(id)}
                  style={{ left: `${x}%`, top: `${y}%`, ...accentVar(cat.accent) }}
                  className={cn(
                    'glass absolute flex min-h-[44px] w-[112px] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 rounded-2xl px-2 py-2 text-center text-[12px] font-medium leading-tight transition-[transform,border-color,box-shadow,color] duration-300 sm:w-[132px] sm:px-3 sm:text-[13px]',
                    active
                      ? 'scale-105 border-[rgb(var(--a))] text-fg shadow-[0_0_0_1px_rgb(var(--a)),0_14px_36px_-14px_rgb(var(--a)/0.8)]'
                      : 'text-muted hover:border-[rgb(var(--a)/0.6)] hover:text-fg',
                  )}
                >
                  <Icon size={18} aria-hidden="true" className="text-[rgb(var(--a))]" />
                  {cat.title}
                </button>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={0.1} className="min-w-0">
          <div
            role="tabpanel"
            id="skills-panel"
            aria-labelledby={`skills-tab-${selected}`}
            tabIndex={0}
            style={accentVar(current.accent)}
            className="glass relative overflow-hidden rounded-3xl p-6 sm:p-8"
          >
            <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-[rgb(var(--a))]" />
            <h3 className="text-2xl font-semibold">{current.title}</h3>
            <p className="mt-2 text-muted">{current.blurb}</p>

            <ul key={selected} className="mt-6 flex flex-wrap gap-2.5">
              {current.skills.map((skill, i) => (
                <li
                  key={skill}
                  style={{ '--i': i } as CSSProperties}
                  className="skill-chip inline-flex min-h-[36px] items-center gap-2 rounded-xl border border-line/15 bg-line/[0.04] px-3.5 text-[14px] font-medium"
                >
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[rgb(var(--a))]" />
                  {skill}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-muted">{current.skills.length} skills in this area.</p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
