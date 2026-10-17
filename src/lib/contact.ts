import { mailtoHref } from '../data/site';

export type Field = 'name' | 'email' | 'message';
export type Errors = Partial<Record<Field, string>>;
export type FormValues = Record<Field, string>;

// Mail clients and browsers cap mailto links at roughly 2,000 characters.
export const MAX_LINK_LENGTH = 1900;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validate(values: FormValues): Errors {
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = 'Enter your name so Jayanth knows who is writing.';
  if (!values.email.trim()) errors.email = 'Enter your email address so Jayanth can reply.';
  else if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = 'Enter a valid email address, like name@example.com.';
  if (!values.message.trim()) errors.message = 'Write a message before sending.';
  return errors;
}

export function buildMessage(values: FormValues): string {
  return `${values.message.trim()}\n\n${values.name.trim()}\n${values.email.trim()}`;
}

export function buildMailto(values: FormValues): string {
  const subject = `Portfolio message from ${values.name.trim()}`;
  return `${mailtoHref}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(buildMessage(values))}`;
}
