export interface JourneyStep {
  id: string;
  title: string;
  description: string;
  icon: 'graduation' | 'data' | 'chart' | 'bot' | 'shield' | 'compass';
}

// Deliberately undated: this is a learning path, not an employment history.
export const journeySteps: JourneyStep[] = [
  {
    id: 'cse',
    title: 'Computer Science and Engineering',
    description:
      'Built my foundation in programming, software development and problem solving at CMR Technical Campus, Hyderabad.',
    icon: 'graduation',
  },
  {
    id: 'ds',
    title: 'Specialization in Data Science',
    description: 'Focused my degree on data science and learned how to turn data into decisions.',
    icon: 'data',
  },
  {
    id: 'ml',
    title: 'Machine Learning and Data Analytics',
    description:
      'Started applying machine learning and data analysis hands-on with Python, Pandas, NumPy and Scikit-learn.',
    icon: 'chart',
  },
  {
    id: 'genai',
    title: 'AI and LLM-Based Applications',
    description:
      'Moved into generative AI: LLM applications, RAG systems and agentic workflows with LangGraph.',
    icon: 'bot',
  },
  {
    id: 'systems',
    title: 'Fraud Detection and Intelligent Systems',
    description:
      'Built intelligent systems such as fraud detection for e-commerce transactions and explainable candidate ranking.',
    icon: 'shield',
  },
  {
    id: 'learning',
    title: 'Continuous Learning',
    description:
      'Still learning: sharpening problem solving, exploring new tools and building practical projects across AI, software engineering and data science.',
    icon: 'compass',
  },
];
