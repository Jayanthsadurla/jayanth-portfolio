import { useState } from 'react';
import { BookOpen, FolderGit2, Mail, Route, Sparkles, User, type LucideIcon } from 'lucide-react';
import { guide } from '../../data/site';
import { useGuideSequence } from '../../hooks/useGuideSequence';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { anchorClick } from '../../lib/scroll';
import { cn } from '../../lib/cn';
import { BoyAvatar } from './BoyAvatar';

interface GuideSection {
  id: string;
  label: string;
  hint: string;
  icon: LucideIcon;
}

/** The sections the guide introduces, in the same order as the navigation bar. */
const guideSections: GuideSection[] = [
  { id: 'about', label: 'About', hint: 'Who Jayanth is and what he studies.', icon: User },
  { id: 'projects', label: 'Projects', hint: 'Seven projects, each linked to its GitHub repository.', icon: FolderGit2 },
  { id: 'skills', label: 'Skills', hint: 'Tools and methods, grouped by area.', icon: Sparkles },
  { id: 'journey', label: 'Journey', hint: 'How his learning and building has progressed.', icon: Route },
  { id: 'contact', label: 'Contact', hint: 'Email, phone, GitHub and LinkedIn.', icon: Mail },
];

const DEFAULT_HINT = 'Pick a section to jump straight to it.';

/** React 18's types predate `inert`; the attribute itself works in all current browsers. */
const INERT = { inert: '' } as Record<string, string>;

interface AvatarGuideProps {
  /** True once the loading screen has started to leave. */
  ready: boolean;
  className?: string;
}

/**
 * The hero guide: avatar + speech bubble.
 *
 * Position contract: this component is rendered once, inside the hero, as a
 * normal absolutely/statically positioned element. It is never `position: fixed`,
 * never follows the pointer or the scroll, and scrolls away with the hero.
 * After a single entrance it only breathes, blinks and sways very slightly.
 */
export function AvatarGuide({ ready, className }: AvatarGuideProps) {
  const reduce = usePrefersReducedMotion();
  const seq = useGuideSequence(ready, reduce, guide.greeting.length, guide.message.length);
  const [hint, setHint] = useState(DEFAULT_HINT);

  const typingGreeting = seq.bubbleVisible && seq.greetingChars < guide.greeting.length;
  const typingMessage = !typingGreeting && seq.messageChars < guide.message.length && seq.bubbleVisible;

  return (
    <div
      role="group"
      aria-label="Portfolio guide"
      data-guide
      className={cn('flex items-start gap-3 sm:items-end sm:gap-4', className)}
    >
      <div
        data-avatar
        data-ready={ready}
        className="av-stage relative w-[88px] shrink-0 sm:w-[150px] lg:w-[196px] lg:[@media(max-height:820px)]:w-[150px]"
        style={{ aspectRatio: '200 / 250' }}
      >
        <BoyAvatar wave={ready} />
      </div>

      <div
        data-bubble
        data-visible={seq.bubbleVisible}
        className="bubble glass relative min-w-0 flex-1 rounded-2xl p-4 sm:mb-6 sm:p-5"
      >
        {/* speech-bubble tail: points left at the avatar */}
        <span
          aria-hidden="true"
          className="absolute -left-[7px] top-9 h-3.5 w-3.5 rotate-45 border-b border-l border-line/10 bg-elevated/80 sm:bottom-10 sm:top-auto"
        />

        {/* Screen readers get the whole message at once; the typed copy below is decorative. */}
        <p className="sr-only">
          {guide.greeting} {guide.message}
        </p>

        {/* Each line holds its full text invisibly so the bubble never changes size while typing. */}
        <div aria-hidden="true">
          <p className="relative font-display text-[15px] font-semibold leading-snug sm:text-base">
            <span className="invisible">{guide.greeting}</span>
            <span className="absolute inset-0">
              {guide.greeting.slice(0, seq.greetingChars)}
              {typingGreeting && <span className="caret" />}
            </span>
          </p>
          <p className="relative mt-2 text-[13px] leading-relaxed text-muted sm:text-sm">
            <span className="invisible">{guide.message}</span>
            <span className="absolute inset-0">
              {guide.message.slice(0, seq.messageChars)}
              {typingMessage && <span className="caret" />}
            </span>
          </p>
        </div>

        <nav
          aria-label="Jump to a section"
          className={cn('mt-3 transition-opacity duration-500', seq.chipsVisible ? 'opacity-100' : 'pointer-events-none opacity-0')}
          {...(seq.chipsVisible ? {} : INERT)}
        >
          <ul className="flex flex-wrap gap-1.5">
            {guideSections.map(({ id, label, hint: text, icon: Icon }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={anchorClick(id)}
                  onMouseEnter={() => setHint(text)}
                  onFocus={() => setHint(text)}
                  onMouseLeave={() => setHint(DEFAULT_HINT)}
                  onBlur={() => setHint(DEFAULT_HINT)}
                  className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full border border-cyan/35 bg-cyan/[0.07] px-3 text-[13px] font-medium text-fg transition-colors hover:border-cyan hover:bg-cyan/15"
                >
                  <Icon size={14} aria-hidden="true" className="text-cyan" />
                  {label}
                  <span className="sr-only">: {text}</span>
                </a>
              </li>
            ))}
          </ul>
          <p aria-hidden="true" className="mt-2.5 hidden min-h-[1.25rem] text-xs text-muted sm:block">
            {hint}
          </p>
        </nav>

        {!seq.finished && !reduce && (
          <button
            type="button"
            onClick={seq.skip}
            className="absolute -top-3 right-3 inline-flex min-h-[28px] items-center gap-1 rounded-full border border-line/15 bg-elevated/90 px-2.5 text-xs font-medium text-muted transition-colors hover:text-fg"
          >
            <BookOpen size={12} aria-hidden="true" />
            Skip
          </button>
        )}
      </div>
    </div>
  );
}
