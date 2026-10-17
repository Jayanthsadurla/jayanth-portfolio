import { filters, type FilterId } from '../../data/projects';
import { cn } from '../../lib/cn';

interface ProjectFilterProps {
  value: FilterId;
  counts: Record<FilterId, number>;
  onChange: (id: FilterId) => void;
  /** id of the element that lists the filtered cards */
  controls: string;
}

/** Toggle-button group (not tabs): every button reports pressed/not pressed and how many projects it holds. */
export function ProjectFilter({ value, counts, onChange, controls }: ProjectFilterProps) {
  return (
    <div role="group" aria-label="Filter projects by category" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
      {filters.map((f) => {
        const pressed = value === f.id;
        return (
          <button
            key={f.id}
            type="button"
            aria-pressed={pressed}
            aria-controls={controls}
            onClick={() => onChange(f.id)}
            className={cn(
              'inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-[background-color,border-color,color,transform] duration-200 active:scale-[0.97]',
              pressed
                ? 'border-transparent bg-gradient-to-r from-blue to-violet text-[rgb(var(--on-accent))] shadow-md'
                : 'border-line/20 bg-elevated/40 text-muted hover:border-cyan/60 hover:text-fg',
            )}
          >
            {f.label}
            <span
              className={cn(
                'rounded-full px-1.5 py-0.5 font-mono text-[11px] leading-none',
                pressed ? 'bg-black/20 text-[rgb(var(--on-accent))]' : 'bg-line/10',
              )}
            >
              {counts[f.id]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
