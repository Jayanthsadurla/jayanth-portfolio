import { useId, useRef, useState, type FormEvent } from 'react';
import { Check, Copy, Mail, Phone, Send } from 'lucide-react';
import { mailtoHref, site, telHref } from '../../data/site';
import { GitHubIcon, LinkedInIcon } from '../ui/Icons';
import { buildMailto, buildMessage, MAX_LINK_LENGTH, validate, type Errors, type Field, type FormValues } from '../../lib/contact';
import { Reveal } from '../ui/Reveal';
import { Section } from '../ui/Section';

const details = [
  { label: 'Email', value: site.email, href: mailtoHref, external: false },
  { label: 'Phone', value: site.phone, href: telHref, external: false },
  { label: 'GitHub', value: site.github, href: site.github, external: true },
  { label: 'LinkedIn', value: site.linkedin, href: site.linkedin, external: true },
];

export function ContactSection() {
  const uid = useId();
  const [values, setValues] = useState<FormValues>({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [opened, setOpened] = useState(false);
  const [copied, setCopied] = useState<'yes' | 'failed' | null>(null);
  const refs = {
    name: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    message: useRef<HTMLTextAreaElement>(null),
  };

  const set = (field: Field) => (event: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [field]: event.target.value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
    setOpened(false);
    setCopied(null);
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const found = validate(values);
    if (!found.message && buildMailto(values).length > MAX_LINK_LENGTH) {
      found.message = `This message is too long for an email link. Shorten it, or write to ${site.email} directly.`;
    }
    setErrors(found);
    const firstInvalid = (['name', 'email', 'message'] as Field[]).find((f) => found[f]);
    if (firstInvalid) {
      refs[firstInvalid].current?.focus();
      return;
    }
    // No backend is configured, so hand the message to the visitor's own email app.
    window.location.href = buildMailto(values);
    setOpened(true);
  };

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(`To: ${site.email}\n\n${buildMessage(values)}`);
      setCopied('yes');
    } catch {
      setCopied('failed');
    }
  };

  const inputClass =
    'mt-1.5 block min-h-[48px] w-full rounded-xl border border-line/20 bg-bg/60 px-4 py-3 text-[15px] text-fg placeholder:text-muted/70 transition-colors hover:border-line/40 focus:border-cyan focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan/40 aria-[invalid=true]:border-[rgb(var(--danger))]';

  const fieldProps = (field: Field) => ({
    id: `${uid}-${field}`,
    value: values[field],
    onChange: set(field),
    'aria-invalid': errors[field] ? (true as const) : undefined,
    'aria-describedby': errors[field] ? `${uid}-${field}-error` : undefined,
    className: inputClass,
  });

  const errorLine = (field: Field) =>
    errors[field] ? (
      <p id={`${uid}-${field}-error`} className="mt-1.5 text-[13px] font-medium text-[rgb(var(--danger))]">
        {errors[field]}
      </p>
    ) : null;

  return (
    <Section id="contact" labelledBy="contact-title">
      <div className="grid items-start gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <Reveal className="min-w-0">
          <h2 id="contact-title" className="text-[clamp(2.1rem,5vw,3.6rem)] font-semibold leading-[1.05] [text-wrap:balance]">
            Let’s Build Something Intelligent
          </h2>
          <span aria-hidden="true" className="mt-5 block h-[3px] w-14 rounded-full bg-gradient-to-r from-cyan via-blue to-violet" />
          <p className="mt-5 max-w-[34rem] text-base leading-relaxed text-muted sm:text-lg">
            I’m open to opportunities, collaborations, and conversations around AI, data science, analytics, software
            engineering, and intelligent applications.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href={mailtoHref} className="btn btn-primary">
              <Mail size={16} aria-hidden="true" />
              Send Me an Email
            </a>
            <a href={telHref} className="btn btn-ghost">
              <Phone size={16} aria-hidden="true" />
              Call Me
            </a>
            <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              <LinkedInIcon size={16} />
              Connect on LinkedIn
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <a href={site.github} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              <GitHubIcon size={16} />
              View GitHub
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>

          <dl className="mt-10 max-w-[34rem] divide-y divide-line/10 border-y border-line/10 text-[15px]">
            {details.map((d) => (
              <div key={d.label} className="grid grid-cols-[84px_1fr] gap-4 py-3.5">
                <dt className="text-muted">{d.label}</dt>
                <dd className="min-w-0 break-words">
                  <a
                    href={d.href}
                    {...(d.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="underline decoration-line/30 underline-offset-4 transition-colors hover:decoration-cyan"
                  >
                    {d.value}
                    {d.external && <span className="sr-only"> (opens in a new tab)</span>}
                  </a>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={0.1} className="min-w-0">
          <form onSubmit={onSubmit} noValidate aria-label="Contact form" className="glass relative overflow-hidden rounded-3xl p-6 sm:p-8">
            <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-cyan via-blue to-violet" />
            <h3 className="text-xl font-semibold">Write a message</h3>
            <p className="mt-1.5 text-sm text-muted">This opens your email app with the message ready to send.</p>

            <div className="mt-6 space-y-5">
              <div>
                <label htmlFor={`${uid}-name`} className="text-sm font-medium">
                  Name
                </label>
                <input ref={refs.name} type="text" autoComplete="name" placeholder="Your name" {...fieldProps('name')} />
                {errorLine('name')}
              </div>
              <div>
                <label htmlFor={`${uid}-email`} className="text-sm font-medium">
                  Email
                </label>
                <input
                  ref={refs.email}
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="you@example.com"
                  {...fieldProps('email')}
                />
                {errorLine('email')}
              </div>
              <div>
                <label htmlFor={`${uid}-message`} className="text-sm font-medium">
                  Message
                </label>
                <textarea ref={refs.message} rows={5} placeholder="How can Jayanth help?" {...fieldProps('message')} />
                {errorLine('message')}
              </div>
            </div>

            <button type="submit" className="btn btn-primary mt-6 w-full sm:w-auto">
              <Send size={16} aria-hidden="true" />
              Open in my email app
            </button>

            <div role="status" aria-live="polite" className="mt-5">
              {opened && (
                <div className="rounded-xl border border-line/15 bg-line/[0.04] p-4 text-sm leading-relaxed">
                  <p>
                    Your email app should now be open with this message filled in. <strong>Nothing has been sent yet.</strong>{' '}
                    Press Send in your email app to deliver it.
                  </p>
                  <p className="mt-2 text-muted">
                    If nothing opened, copy the message and email{' '}
                    <a href={mailtoHref} className="underline underline-offset-4">
                      {site.email}
                    </a>{' '}
                    yourself.
                  </p>
                  <button
                    type="button"
                    onClick={copyMessage}
                    className="btn btn-ghost mt-3 !min-h-[40px] !px-4"
                  >
                    {copied === 'yes' ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
                    {copied === 'yes' ? 'Copied' : 'Copy message'}
                  </button>
                  {copied === 'failed' && (
                    <p className="mt-2 text-[13px] text-[rgb(var(--danger))]">
                      Your browser blocked copying. Select the text in the message box and copy it by hand.
                    </p>
                  )}
                </div>
              )}
            </div>
          </form>
        </Reveal>
      </div>
    </Section>
  );
}
