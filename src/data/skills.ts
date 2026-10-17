export type SkillCategoryId = 'data' | 'ml' | 'genai' | 'web' | 'professional';

export interface SkillCategory {
  id: SkillCategoryId;
  title: string;
  blurb: string;
  accent: 'blue' | 'cyan' | 'violet' | 'mint';
  skills: string[];
}

// Skills are grouped, never scored: no percentages or levels.
export const skillCategories: SkillCategory[] = [
  {
    id: 'data',
    title: 'Programming and Data',
    blurb: 'Working with data from raw tables to insight.',
    accent: 'cyan',
    skills: ['Python', 'SQL', 'Pandas', 'NumPy', 'Data Cleaning', 'Data Analysis', 'Data Visualization'],
  },
  {
    id: 'ml',
    title: 'AI and Machine Learning',
    blurb: 'Building, training and evaluating models.',
    accent: 'blue',
    skills: [
      'Machine Learning',
      'Deep Learning',
      'Scikit-learn',
      'Feature Engineering',
      'Model Training',
      'Model Evaluation',
      'Fraud Detection',
      'Semantic Matching',
    ],
  },
  {
    id: 'genai',
    title: 'Generative AI',
    blurb: 'LLM applications and agentic workflows.',
    accent: 'violet',
    skills: [
      'Large Language Models',
      'RAG Systems',
      'LangGraph',
      'Prompt Engineering',
      'Agentic Workflows',
      'LLM Evaluation',
      'Persistent Memory',
      'Retry-Based Feedback Systems',
    ],
  },
  {
    id: 'web',
    title: 'Backend and Web Development',
    blurb: 'Services, APIs and interfaces.',
    accent: 'mint',
    skills: ['FastAPI', 'Django', 'Flask', 'REST APIs', 'React', 'HTML', 'SCSS'],
  },
  {
    id: 'professional',
    title: 'Professional Skills',
    blurb: 'How I approach the work.',
    accent: 'blue',
    skills: [
      'Problem Solving',
      'Analytical Thinking',
      'Software Development',
      'Research',
      'Technical Communication',
      'Continuous Learning',
    ],
  },
];
