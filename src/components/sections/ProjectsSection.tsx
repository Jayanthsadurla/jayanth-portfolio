import { useMemo, useState } from 'react';
import { m } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { filters, projects, type FilterId, type Project } from '../../data/projects';
import { site } from '../../data/site';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { ProjectCard } from '../projects/ProjectCard';
import { ProjectFilter } from '../projects/ProjectFilter';
import { GitHubIcon } from '../ui/Icons';
import { Reveal } from '../ui/Reveal';
import { Section } from '../ui/Section';
import { SectionHeading } from '../ui/SectionHeading';

const inFilter = (project: Project, id: FilterId) => id === 'all' || project.filters.includes(id);

export function ProjectsSection() {
  const [filter, setFilter] = useState<FilterId>('all');
  const reduce = usePrefersReducedMotion();

  const counts = useMemo(() => {
    const result = {} as Record<FilterId, number>;
    for (const f of filters) {
      result[f.id] = projects.filter((p) => inFilter(p, f.id)).length;
    }
    return result;
  }, []);

  const visible = projects.filter((p) => inFilter(p, filter));
  const activeLabel = filters.find((f) => f.id === filter)?.label ?? 'All';

  return (
    <Section id="projects" labelledBy="projects-title">
      <SectionHeading
        id="projects-title"
        title="Projects"
        description="Seven projects across generative AI, machine learning, data science and web development. Each one links to its GitHub repository."
      />

      <Reveal className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-center sm:justify-between">
        <ProjectFilter value={filter} counts={counts} onChange={setFilter} controls="project-grid" />
        <p role="status" aria-live="polite" className="shrink-0 text-sm text-muted">
          Showing {visible.length} of {projects.length}
          {filter !== 'all' && <span className="sr-only"> projects in {activeLabel}</span>}
        </p>
      </Reveal>

      {/* flex-wrap + justify-center keeps a lone last card centred instead of orphaned at the left */}
      <ul id="project-grid" className="flex flex-wrap justify-center gap-5 xl:gap-6">
        {visible.map((project, i) => (
          <m.li
            key={`${filter}-${project.id}`}
            className="w-full min-w-0 sm:w-[calc(50%-0.625rem)] xl:w-[calc(33.333%-1rem)]"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: reduce ? 0 : Math.min(i * 0.05, 0.3), ease: [0.2, 0.8, 0.2, 1] }}
          >
            <ProjectCard project={project} />
          </m.li>
        ))}
      </ul>

      <Reveal className="mt-10 flex justify-center">
        <a href={site.github} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
          <GitHubIcon size={16} />
          Browse all repositories on GitHub
          <ArrowUpRight size={16} aria-hidden="true" />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </Reveal>
    </Section>
  );
}
