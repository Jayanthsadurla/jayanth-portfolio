import { useState } from 'react';
import { Compass, GraduationCap, Lightbulb, type LucideIcon } from 'lucide-react';
import { projects } from '../../data/projects';
import { skillCategories } from '../../data/skills';
import { useRovingTabs } from '../../hooks/useRovingTabs';
import { cn } from '../../lib/cn';
import { CountUp } from '../ui/CountUp';
import { Monogram } from '../ui/Icons';
import { Reveal } from '../ui/Reveal';
import { Section } from '../ui/Section';
import { SectionHeading } from '../ui/SectionHeading';

type TabId = 'education' | 'interests' | 'approach';

const tabs: { id: TabId; label: string; icon: LucideIcon }[] = [
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'interests', label: 'Interests', icon: Compass },
  { id: 'approach', label: 'Approach', icon: Lightbulb },
];
const tabIds = tabs.map((t) => t.id);

const careerInterests = [
  'Data Analytics',
  'Data Science',
  'Artificial Intelligence',
  'Machine Learning',
  'Generative AI',
  'Software Engineering',
];

const keywords = [
  'Python',
  'SQL',
  'Pandas',
  'NumPy',
  'Scikit-learn',
  'FastAPI',
  'Django',
  'LangGraph',
  'Machine Learning',
  'Deep Learning',
  'Generative AI',
  'LLM Applications',
  'RAG Systems',
  'Data Analytics',
  'Data Visualization',
  'Backend Development',
  'Software Engineering',
];

// Derived from the real data files so the numbers can never drift from the page.
const stats = [
  { value: projects.length, label: 'Projects on GitHub' },
  { value: skillCategories.length, label: 'Skill areas' },
  { value: new Set(projects.flatMap((p) => p.languages)).size, label: 'Languages in the repos' },
];

export function AboutSection() {
  const [tab, setTab] = useState<TabId>('education');
  const roving = useRovingTabs(tabIds, tab, setTab);

  return (
    <Section id="about" labelledBy="about-title">
      <SectionHeading id="about-title" title="About" />

      <div className="grid items-start gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <Reveal className="min-w-0">
          <p className="max-w-[36rem] font-display text-[clamp(1.35rem,2.6vw,1.85rem)] font-medium leading-snug [text-wrap:pretty]">
            I’m a Computer Science and Engineering graduate specializing in Data Science from CMR Technical Campus,
            Hyderabad.
          </p>
          <div className="mt-6 max-w-[38rem] space-y-4 text-base leading-relaxed text-muted sm:text-[17px]">
            <p>
              I’m passionate about artificial intelligence, generative AI, software development, data science, and data
              analytics. I enjoy working with data to uncover insights, building intelligent applications, and
              developing software that addresses real-world problems.
            </p>
            <p>
              Through hands-on projects I have explored machine learning, data analysis, backend development, web
              applications, LLM-based applications, RAG systems, and fraud detection.
            </p>
            <p>
              I’m continuously strengthening my problem-solving, analytical, and development skills while exploring new
              technologies and building practical projects.
            </p>
          </div>

          <h3 className="mt-10 font-display text-sm font-semibold text-fg">What I work with</h3>
          <ul className="mt-3 flex max-w-[38rem] flex-wrap gap-2">
            {keywords.map((word) => (
              <li
                key={word}
                className="chip cursor-default transition-[transform,border-color,color] duration-200 hover:-translate-y-0.5 hover:border-cyan/60 hover:text-fg"
              >
                {word}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1} className="min-w-0">
          <div className="glass relative overflow-hidden rounded-3xl p-6 sm:p-7">
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-cyan via-blue to-violet"
            />
            <span aria-hidden="true" className="mx-auto mb-5 block h-1.5 w-14 rounded-full bg-line/15" />

            <div className="flex items-center gap-4">
              <Monogram size={60} />
              <div className="min-w-0">
                <p className="font-display text-xl font-semibold leading-tight">Jayanth Sadurla</p>
                <p className="mt-1 text-sm text-muted">Computer Science and Engineering graduate</p>
              </div>
            </div>

            <div
              role="tablist"
              aria-label="Profile details"
              onKeyDown={roving.onKeyDown}
              className="mt-6 flex gap-1 rounded-xl bg-line/[0.06] p-1"
            >
              {tabs.map(({ id, label, icon: Icon }) => {
                const selected = tab === id;
                return (
                  <button
                    key={id}
                    ref={roving.register(id)}
                    id={`about-tab-${id}`}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-controls={`about-panel-${id}`}
                    tabIndex={roving.tabIndex(id)}
                    onClick={() => setTab(id)}
                    className={cn(
                      'flex min-h-[40px] flex-1 items-center justify-center gap-1.5 rounded-lg px-2 text-[13px] font-medium transition-colors',
                      selected ? 'bg-elevated text-fg shadow-sm ring-1 ring-line/15' : 'text-muted hover:text-fg',
                    )}
                  >
                    <Icon size={14} aria-hidden="true" className={selected ? 'text-cyan' : undefined} />
                    {label}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 min-h-[168px]">
              <div
                role="tabpanel"
                id="about-panel-education"
                aria-labelledby="about-tab-education"
                hidden={tab !== 'education'}
                className="text-sm leading-relaxed"
              >
                <ol className="relative ml-2 space-y-5 border-l border-line/20 pl-6">
                  <li className="relative">
                    <span aria-hidden="true" className="absolute -left-[31px] top-1.5 h-2.5 w-2.5 rounded-full bg-cyan ring-4 ring-cyan/20" />
                    <p className="font-semibold text-fg">Computer Science and Engineering</p>
                    <p className="text-muted">CMR Technical Campus, Hyderabad</p>
                  </li>
                  <li className="relative">
                    <span aria-hidden="true" className="absolute -left-[31px] top-1.5 h-2.5 w-2.5 rounded-full bg-violet ring-4 ring-violet/20" />
                    <p className="font-semibold text-fg">Specialization in Data Science</p>
                    <p className="text-muted">Turning data into insight and working intelligent systems.</p>
                  </li>
                </ol>
              </div>

              <div
                role="tabpanel"
                id="about-panel-interests"
                aria-labelledby="about-tab-interests"
                hidden={tab !== 'interests'}
              >
                <p className="text-sm text-muted">Where I’d like my career to go:</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {careerInterests.map((item) => (
                    <li key={item} className="chip !text-[12px] !text-fg">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div
                role="tabpanel"
                id="about-panel-approach"
                aria-labelledby="about-tab-approach"
                hidden={tab !== 'approach'}
                className="text-sm leading-relaxed"
              >
                <ul className="space-y-3 text-muted">
                  <li className="flex gap-3">
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan" />
                    Learn by building practical projects.
                  </li>
                  <li className="flex gap-3">
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue" />
                    Aim at real-world problems, not just exercises.
                  </li>
                  <li className="flex gap-3">
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet" />
                    Keep experimenting with new technologies.
                  </li>
                </ul>
              </div>
            </div>

            <dl className="mt-6 grid grid-cols-3 divide-x divide-line/10 border-t border-line/10 pt-5">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col gap-1.5 px-3 first:pl-0 last:pr-0">
                  <dt className="order-2 text-xs leading-snug text-muted">{stat.label}</dt>
                  <dd className="font-display text-3xl font-semibold leading-none">
                    <CountUp value={stat.value} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
