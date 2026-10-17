import type { UniverseId } from './universe';

export type FilterId = 'all' | 'ai-ml' | 'genai' | 'data-science' | 'web' | 'software';

export const filters: { id: FilterId; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'ai-ml', label: 'AI/ML' },
  { id: 'genai', label: 'Generative AI' },
  { id: 'data-science', label: 'Data Science' },
  { id: 'web', label: 'Web Development' },
  { id: 'software', label: 'Software Engineering' },
];

export type ProjectIcon = 'logs' | 'rag' | 'fraud' | 'retail' | 'kanban' | 'aria' | 'shield';
export type Accent = 'blue' | 'cyan' | 'violet' | 'mint';

export interface DemoLink {
  /** Button text, for example "Live demo". */
  label: string;
  url: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  /** Category label exactly as it appears on the card. */
  category: string;
  /** Which filter chips this project belongs to. */
  filters: Exclude<FilterId, 'all'>[];
  tech: string[];
  languages: string[];
  repo: string;
  /** Optional deployed links, shown as buttons above "View on GitHub". */
  demos?: DemoLink[];
  icon: ProjectIcon;
  accent: Accent;
  /** Technical-universe themes this project touches. */
  themes: UniverseId[];
}

// Names, descriptions and repository URLs are used verbatim. Technology chips
// only list things named in the project descriptions. Add specifics (for
// example a framework you used) by editing the `tech` arrays below.
export const projects: Project[] = [
  {
    id: 'ai-log-intelligence-agent',
    name: 'AI Log Intelligence Agent',
    description:
      'An AI-powered log intelligence project that helps analyze and understand application logs using Python-based intelligent processing.',
    category: 'Generative AI / AI Engineering',
    filters: ['genai', 'ai-ml'],
    tech: ['Python', 'Generative AI', 'Log Analysis'],
    languages: ['Python'],
    repo: 'https://github.com/Jayanthsadurla/ai-log-intelligence-agent',
    demos: [
      { label: 'Live API', url: 'https://ai-log-intelligence-agent.onrender.com' },
      { label: 'Swagger UI', url: 'https://ai-log-intelligence-agent.onrender.com/docs' },
    ],
    icon: 'logs',
    accent: 'cyan',
    themes: ['ai', 'genai', 'systems'],
  },
  {
    id: 'self-evaluating-rag-lesson-generator',
    name: 'Self-Evaluating RAG Lesson Generator',
    description:
      'An agentic self-evaluating lesson generator using LangGraph, LLM-based PASS/FAIL evaluation, retry feedback, and persistent memory.',
    category: 'Generative AI / RAG / LLM Applications',
    filters: ['genai', 'ai-ml'],
    tech: ['Python', 'LangGraph', 'RAG', 'LLM Evaluation', 'Persistent Memory'],
    languages: ['Python'],
    repo: 'https://github.com/Jayanthsadurla/self-evaluating-rag-lesson-generator',
    icon: 'rag',
    accent: 'violet',
    themes: ['genai', 'rag', 'ai', 'systems'],
  },
  {
    id: 'fraud-detection-multi-participant-ecommerce',
    name: 'Fraud Detection for Multi-Participant E-commerce Systems',
    description:
      'A machine learning and deep learning-based fraud detection system for multi-participant e-commerce transactions. It includes data preprocessing, feature engineering, model training, prediction interface, visualization dashboards, and evaluation metrics.',
    category: 'Machine Learning / Deep Learning / Data Science',
    filters: ['ai-ml', 'data-science'],
    tech: ['Python', 'HTML', 'Machine Learning', 'Deep Learning', 'Feature Engineering', 'Data Visualization'],
    languages: ['HTML', 'Python'],
    repo: 'https://github.com/Jayanthsadurla/Fraud-Detection-for-Multi-Participant-E-commerce-Systems',
    icon: 'fraud',
    accent: 'mint',
    themes: ['ml', 'analytics', 'ai', 'web'],
  },
  {
    id: 'retail-sales-management-system',
    name: 'Retail Sales Management System',
    description:
      'A Python-based retail sales management system focused on handling retail operations and sales-related workflows.',
    category: 'Python Development / Business Application',
    filters: ['software'],
    tech: ['Python', 'Business Application'],
    languages: ['Python'],
    repo: 'https://github.com/Jayanthsadurla/Retail-Sales-Management-System',
    icon: 'retail',
    accent: 'blue',
    themes: ['backend'],
  },
  {
    id: 'agile-task-manager',
    name: 'Agile Task Manager',
    description: 'A full-stack Agile Sprint Task Management System using Django and React.',
    category: 'Full-Stack Development / Django / React',
    filters: ['web', 'software'],
    tech: ['Python', 'Django', 'React'],
    languages: ['Python'],
    repo: 'https://github.com/Jayanthsadurla/agile-task-manager',
    icon: 'kanban',
    accent: 'blue',
    themes: ['backend', 'web'],
  },
  {
    id: 'aria-adaptive-recruiter-intelligence-agent',
    name: 'ARIA Adaptive Recruiter Intelligence Agent',
    description:
      'An AI-powered candidate discovery and ranking system that mimics recruiter decision-making using semantic matching, behavioral signals, and explainable hybrid scoring.',
    category: 'AI/ML / Semantic Search / Intelligent Systems',
    filters: ['ai-ml'],
    tech: ['Python', 'Semantic Matching', 'Hybrid Scoring', 'Explainable Ranking'],
    languages: ['Python'],
    repo: 'https://github.com/Jayanthsadurla/ARIA-Adaptive-Recruiter-Intelligence-Agent',
    icon: 'aria',
    accent: 'violet',
    themes: ['ai', 'ml', 'systems'],
  },
  {
    id: 'cloud-shield-threat-detection',
    name: 'Cloud Shield Threat Detection',
    description: 'A cloud-based intrusion detection system using machine learning and Flask.',
    category: 'Cybersecurity / Machine Learning / Flask',
    filters: ['ai-ml', 'data-science', 'web'],
    tech: ['Python', 'Flask', 'Machine Learning', 'HTML', 'SCSS', 'Jupyter Notebook'],
    languages: ['HTML', 'Jupyter Notebook', 'Python', 'SCSS'],
    repo: 'https://github.com/Jayanthsadurla/cloud-shield-threat-detection',
    demos: [{ label: 'Live demo', url: 'https://cloud-shield-threat-detection.onrender.com/' }],
    icon: 'shield',
    accent: 'cyan',
    themes: ['security', 'ml', 'backend', 'web'],
  },
];
