import { useRef, type CSSProperties, type PointerEvent } from 'react';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import type { Project } from '../../data/projects';
import { GitHubIcon } from '../ui/Icons';
import { ProjectArt } from './ProjectArt';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const ref = useRef<HTMLElement>(null);
  const headingId = `project-${project.id}`;

  // The spotlight follows the pointer by updating two CSS variables: no React state, no re-render.
  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el || event.pointerType === 'touch') return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${event.clientX - rect.left}px`);
    el.style.setProperty('--my', `${event.clientY - rect.top}px`);
  };

  return (
    <article
      ref={ref}
      aria-labelledby={headingId}
      onPointerMove={onPointerMove}
      style={{ '--a': `var(--${project.accent})` } as CSSProperties}
      className="group glass relative flex h-full flex-col overflow-hidden rounded-3xl transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1.5 hover:border-[rgb(var(--a)/0.55)] hover:shadow-[0_24px_60px_-28px_rgb(var(--a)/0.6)] focus-within:-translate-y-1.5 focus-within:border-[rgb(var(--a)/0.55)]"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: 'radial-gradient(320px circle at var(--mx, 50%) var(--my, 0%), rgb(var(--a) / 0.13), transparent 70%)' }}
      />

      <div className="relative h-[150px] border-b border-line/10 bg-line/[0.035] px-4 py-3">
        <ProjectArt icon={project.icon} />
      </div>

      <div className="relative flex flex-1 flex-col p-5 sm:p-6">
        <p className="inline-flex w-fit items-center gap-2 text-[13px] font-medium text-[rgb(var(--a))]">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[rgb(var(--a))]" />
          {project.category}
        </p>

        <h3 id={headingId} className="mt-2.5 text-xl font-semibold leading-snug">
          {project.name}
        </h3>
        <p className="mt-2.5 text-[15px] leading-relaxed text-muted">{project.description}</p>

        <ul aria-label="Main technologies" className="mt-4 flex flex-wrap gap-1.5">
          {project.tech.map((t) => (
            <li key={t} className="chip">
              {t}
            </li>
          ))}
        </ul>

        <p className="mt-4 text-[13px] text-muted">
          <span className="font-medium text-fg">{project.languages.length > 1 ? 'Languages' : 'Language'}:</span>{' '}
          {project.languages.join(', ')}
        </p>

        <div className="mt-auto flex flex-col gap-2 pt-6">
        {project.demos && (
          <ul aria-label="Live demos" className="flex flex-wrap gap-2">
            {project.demos.map((demo) => (
              <li key={demo.url} className="min-w-0 flex-1">
                <a
                  href={demo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary w-full justify-center !px-4"
                >
                  <ExternalLink size={15} aria-hidden="true" />
                  {demo.label}
                  <span className="sr-only">: {project.name} (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        )}
        <a
          href={project.repo}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost w-full justify-between !px-4 group-hover:border-[rgb(var(--a)/0.6)]"
        >
          <span className="inline-flex items-center gap-2">
            <GitHubIcon size={16} />
            View on GitHub
          </span>
          <ArrowUpRight size={16} aria-hidden="true" />
          <span className="sr-only">: {project.name} (opens in a new tab)</span>
        </a>
        </div>
      </div>
    </article>
  );
}
