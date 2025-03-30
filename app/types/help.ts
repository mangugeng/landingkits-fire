export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'landing-page' | 'template' | 'domain' | 'billing' | 'technical';
  order: number;
}

export interface Guide {
  id: string;
  title: string;
  description: string;
  content: string;
  category: 'getting-started' | 'landing-page' | 'template' | 'domain' | 'billing' | 'technical';
  order: number;
  steps?: {
    title: string;
    description: string;
    imageUrl?: string;
  }[];
} 