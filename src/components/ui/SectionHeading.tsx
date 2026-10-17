import { Reveal } from './Reveal';

interface SectionHeadingProps {
  id: string;
  title: string;
  description?: string;
}

export function SectionHeading({ id, title, description }: SectionHeadingProps) {
  return (
    <Reveal className="mb-10 max-w-3xl sm:mb-14">
      <h2 id={id} className="text-[clamp(2rem,4.4vw,3.25rem)] font-semibold leading-[1.08] [text-wrap:balance]">
        {title}
      </h2>
      <span aria-hidden="true" className="mt-5 block h-[3px] w-14 rounded-full bg-gradient-to-r from-cyan via-blue to-violet" />
      {description ? <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">{description}</p> : null}
    </Reveal>
  );
}
