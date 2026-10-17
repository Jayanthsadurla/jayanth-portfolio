import { Mail } from 'lucide-react';
import { mailtoHref, site } from '../../data/site';
import { GitHubIcon, LinkedInIcon } from '../ui/Icons';

const linkClass =
  'inline-flex min-h-[44px] items-center gap-2 rounded-lg px-2 text-sm font-medium text-muted transition-colors hover:text-fg';

export function Footer() {
  return (
    <footer className="border-t border-line/10">
      <div className="container-x flex flex-col items-start justify-between gap-6 py-10 sm:flex-row sm:items-center">
        <div>
          <p className="font-display text-sm font-semibold">Designed and built by {site.name}.</p>
          <p className="mt-1 font-mono text-xs text-muted">{site.footerLine}</p>
        </div>
        <nav aria-label="Footer" className="-mx-2 flex flex-wrap items-center gap-1">
          <a href={site.github} target="_blank" rel="noopener noreferrer" className={linkClass}>
            <GitHubIcon size={18} />
            GitHub
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className={linkClass}>
            <LinkedInIcon size={18} />
            LinkedIn
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <a href={mailtoHref} className={linkClass}>
            <Mail size={18} aria-hidden="true" />
            Email
          </a>
        </nav>
      </div>
    </footer>
  );
}
