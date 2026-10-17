import { useRef } from 'react';
import { m, useInView, useScroll, useSpring } from 'framer-motion';
import { BarChart3, Bot, Compass, Database, GraduationCap, ShieldCheck, type LucideIcon } from 'lucide-react';
import { journeySteps, type JourneyStep } from '../../data/journey';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { cn } from '../../lib/cn';
import { Section } from '../ui/Section';
import { SectionHeading } from '../ui/SectionHeading';

const icons: Record<JourneyStep['icon'], LucideIcon> = {
  graduation: GraduationCap,
  data: Database,
  chart: BarChart3,
  bot: Bot,
  shield: ShieldCheck,
  compass: Compass,
};

function Step({ step, index, last, reduce }: { step: JourneyStep; index: number; last: boolean; reduce: boolean }) {
  const ref = useRef<HTMLLIElement>(null);
  const seen = useInView(ref, { once: true, margin: '0px 0px -35% 0px' });
  const reached = reduce || seen;
  const Icon = icons[step.icon];
  const left = index % 2 === 0; // desktop: alternate sides

  return (
    <li ref={ref} className="relative grid grid-cols-[44px_1fr] gap-x-4 pb-10 last:pb-0 md:grid-cols-[1fr_56px_1fr] md:gap-x-6 md:pb-14">
      <div
        className={cn(
          'col-start-2 row-start-1 min-w-0 transition-[opacity,transform] duration-700 ease-out',
          left ? 'md:col-start-1 md:text-right' : 'md:col-start-3',
          reached ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
        )}
      >
        <div className="glass rounded-2xl p-5 sm:p-6">
          <h3 className="flex flex-wrap items-center gap-2 text-lg font-semibold leading-snug">
            <span className={cn('flex-1', left && 'md:text-right')}>{step.title}</span>
            {last && <span className="chip !text-fg">Ongoing</span>}
          </h3>
          <p className="mt-2 text-[15px] leading-relaxed text-muted">{step.description}</p>
        </div>
      </div>

      <div className="relative z-10 col-start-1 row-start-1 flex justify-center md:col-start-2">
        <span
          aria-hidden="true"
          className={cn(
            'mt-4 flex h-11 w-11 items-center justify-center rounded-full border-2 bg-bg transition-[border-color,box-shadow,color] duration-500 md:h-12 md:w-12',
            reached ? 'border-cyan text-cyan shadow-[0_0_0_5px_rgb(var(--cyan)/0.14)]' : 'border-line/20 text-muted',
          )}
        >
          <Icon size={20} />
        </span>
      </div>
    </li>
  );
}

export function JourneyTimeline() {
  const reduce = usePrefersReducedMotion();
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 65%', 'end 65%'] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <Section id="journey" labelledBy="journey-title">
      <SectionHeading
        id="journey-title"
        title="My Learning and Building Journey"
        description="The path that led to my projects: what I studied, what I explored, and what I am still learning."
      />

      <div className="relative">
        {/* track + progress fill, aligned to the centre of the node column */}
        <div aria-hidden="true" className="absolute bottom-6 left-[22px] top-6 w-[2px] rounded-full bg-line/15 md:left-1/2 md:-translate-x-1/2">
          <m.div
            className="h-full w-full origin-top rounded-full bg-gradient-to-b from-cyan via-blue to-violet"
            style={{ scaleY: reduce ? 1 : fill }}
          />
        </div>
        <ol ref={listRef} className="relative">
          {journeySteps.map((step, i) => (
            <Step key={step.id} step={step} index={i} last={i === journeySteps.length - 1} reduce={reduce} />
          ))}
        </ol>
      </div>
    </Section>
  );
}
