export interface BlogPost {
  id: string;
  title: string;
  content: string;
  description: string;
  slug: string;
  coverImage?: string;
  author: {
    name: string;
    avatar?: string;
  };
  publishedAt: string | null;
  createdAt: string;
  updatedAt?: string;
  status: 'draft' | 'published';
  tags?: string[];
} 