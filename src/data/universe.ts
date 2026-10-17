export type UniverseId =
  | 'ai'
  | 'genai'
  | 'rag'
  | 'systems'
  | 'backend'
  | 'web'
  | 'security'
  | 'ml'
  | 'analytics';

export interface UniverseNode {
  id: UniverseId;
  label: string;
  /** One neutral sentence about how the theme shows up in my work. */
  blurb: string;
  accent: 'blue' | 'cyan' | 'violet' | 'mint';
}

// Listed in clockwise order, starting at the top of the chart.
export const universeNodes: UniverseNode[] = [
  { id: 'ai', label: 'AI', blurb: 'The thread that connects most of what I build.', accent: 'blue' },
  { id: 'genai', label: 'Generative AI', blurb: 'LLM applications, agents and evaluation loops.', accent: 'violet' },
  { id: 'rag', label: 'RAG', blurb: 'Grounding language models in retrieved context.', accent: 'violet' },
  { id: 'systems', label: 'Intelligent Systems', blurb: 'Software that reasons, ranks and decides.', accent: 'cyan' },
  { id: 'backend', label: 'Backend Engineering', blurb: 'Python services and APIs behind the interfaces.', accent: 'mint' },
  { id: 'web', label: 'Web Development', blurb: 'Interfaces that make models and data usable.', accent: 'mint' },
  { id: 'security', label: 'Cybersecurity', blurb: 'Machine learning applied to threat detection.', accent: 'cyan' },
  { id: 'ml', label: 'Machine Learning', blurb: 'Training, evaluating and deploying models.', accent: 'blue' },
  { id: 'analytics', label: 'Data Analytics', blurb: 'Cleaning, exploring and visualizing data.', accent: 'mint' },
];

/** Pairs of themes that are connected in the chart. */
export const universeEdges: [UniverseId, UniverseId][] = [
  ['ai', 'genai'],
  ['genai', 'rag'],
  ['rag', 'systems'],
  ['systems', 'backend'],
  ['backend', 'web'],
  ['backend', 'security'],
  ['security', 'ml'],
  ['ml', 'analytics'],
  ['analytics', 'ai'],
  ['ai', 'ml'],
  ['ai', 'systems'],
  ['ml', 'systems'],
  ['genai', 'systems'],
];
