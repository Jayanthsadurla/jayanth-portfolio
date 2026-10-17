export const site = {
  name: 'Jayanth Sadurla',
  monogram: 'JS',
  heading: 'Hi, I’m Jayanth Sadurla',
  roles: ['AI/ML Developer', 'Data Scientist', 'Software Developer'],
  title:
    'Computer Science and Engineering Graduate | AI/ML Developer | Data Scientist | Software Developer',
  intro:
    'A Computer Science and Engineering graduate (Data Science) who builds intelligent applications, from LLM agents and RAG pipelines to fraud-detection models and full-stack tools.',
  status: 'Building intelligent systems with data, AI, and code.',
  footerLine: 'Building intelligent solutions with data, AI, and code.',
  email: 'sadurlajayanth@gmail.com',
  phone: '9985597371',
  github: 'https://github.com/Jayanthsadurla',
  linkedin: 'https://www.linkedin.com/in/sadurla-jayanth-50080a257/',
} as const;

export const mailtoHref = `mailto:${site.email}`;
export const telHref = `tel:${site.phone}`;

export interface NavItem {
  id: string;
  label: string;
}

/** Sections shown in the navbar and introduced by the avatar guide. */
export const navItems: NavItem[] = [
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'journey', label: 'Journey' },
  { id: 'contact', label: 'Contact' },
];

/** Every observable section, in page order (used by the scroll spy). */
export const sectionIds = ['home', 'about', 'projects', 'skills', 'journey', 'universe', 'contact'] as const;

export const guide = {
  greeting: 'Hi, welcome to Jayanth’s portfolio.',
  message:
    'I’m your guide. Explore the sections to learn more about Jayanth, his projects, technical skills, and work in AI, data science, and software development.',
} as const;
