import { ArrowRight, Mail } from 'lucide-react';
import { site } from '../../data/site';
import { anchorClick } from '../../lib/scroll';
import { GitHubIcon } from '../ui/Icons';
import { AvatarGuide } from './AvatarGuide';
import { HeroVisual } from './HeroVisual';

interface HeroSectionProps {
  /** True once the loading screen has started to leave; starts the entrance sequence. */
  ready: boolean;
}

/** Stagger helper for the one-time text reveal. */
const delay = (ms: number) => ({ '--d': `${ms}ms` }) as React.CSSProperties;

export function HeroSection({ ready }: HeroSectionProps) {
  return (
    <section
      id="home"
      tabIndex={-1}
      aria-labelledby="hero-title"
      data-hero-ready={ready}
      className="relative overflow-hidden pb-16 pt-28 sm:pt-32 lg:pb-10 lg:pt-28"
    >
      <div className="container-x grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-12">
        <div className="min-w-0 lg:col-start-1 lg:row-start-1 lg:self-center">
          <p
            className="hero-line glass inline-flex max-w-full items-center gap-2.5 rounded-full py-1.5 pl-3 pr-4 text-[13px] font-medium"
            style={delay(0)}
          >
            <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
              <span className="absolute inset-0 rounded-full bg-mint animate-pulse-dot" />
              <span className="relative h-2 w-2 rounded-full bg-mint" />
            </span>
            <span>{site.status}</span>
          </p>

          <h1 id="hero-title" className="mt-7 font-display font-semibold leading-[1.02] tracking-tight">
            <span className="hero-line block text-[clamp(1.25rem,2.4vw,1.75rem)] font-medium text-muted" style={delay(90)}>
              Hi, I’m
            </span>
            <span
              className="hero-line mt-1 block text-[clamp(2.9rem,8.2vw,5.6rem)] [text-wrap:balance]"
              style={delay(170)}
            >
              Jayanth Sadurla
            </span>
          </h1>

          <p
            className="hero-line mt-6 font-display text-[clamp(0.95rem,1.3vw,1.1rem)] font-medium text-fg"
            style={delay(280)}
          >
            {site.roles.map((role, i) => (
              <span key={role} className="mr-3 inline-block whitespace-nowrap last:mr-0">
                {i > 0 && (
                  <span aria-hidden="true" className="mr-3 text-cyan">
                    •
                  </span>
                )}
                {role}
                {i < site.roles.length - 1 && <span className="sr-only">, </span>}
              </span>
            ))}
          </p>

          <p className="hero-line mt-5 max-w-[34rem] text-base leading-relaxed text-muted sm:text-lg" style={delay(380)}>
            {site.intro}
          </p>

          <div className="hero-line mt-8 flex flex-wrap items-center gap-3" style={delay(480)}>
            <a href="#projects" onClick={anchorClick('projects')} className="btn btn-primary">
              Explore My Work
              <ArrowRight size={16} aria-hidden="true" />
            </a>
            <a href="#contact" onClick={anchorClick('contact')} className="btn btn-ghost">
              <Mail size={16} aria-hidden="true" />
              Contact Me
            </a>
            <a href={site.github} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              <GitHubIcon size={16} />
              View GitHub
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>

        {/*
          Guide + stage. On phones and tablets the guide follows the buttons in normal
          flow and the 3D stage comes after it, so nothing can be covered. From 1024px
          the guide shares the stage's grid cell and stands on its lower edge. It is
          laid out by the grid, never `position: fixed`, so it scrolls away with the hero.
        */}
        <div className="relative z-10 min-w-0 lg:col-start-2 lg:row-start-1 lg:self-end">
          <AvatarGuide ready={ready} />
        </div>

        <div className="relative h-[280px] min-w-0 sm:h-[380px] lg:col-start-2 lg:row-start-1 lg:h-[clamp(500px,calc(100svh-11rem),700px)]">
          <HeroVisual ready={ready} />
          <span aria-hidden="true" className="pointer-events-none absolute left-0 top-0 h-6 w-6 rounded-tl-lg border-l-2 border-t-2 border-cyan/50" />
          <span aria-hidden="true" className="pointer-events-none absolute right-0 top-0 h-6 w-6 rounded-tr-lg border-r-2 border-t-2 border-cyan/50" />
        </div>
      </div>
    </section>
  );
}
