export interface LandingPage {
  id: string;
  title: string;
  description: string;
  url: string;
  status: 'draft' | 'published';
  userId: string;
  userName: string;
  userEmail: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  analytics?: {
    visitors: number;
    conversionRate: number;
  };
  content: {
    sections: {
      id: string;
      type: string;
      content: any;
    }[];
  };
  settings: {
    theme: string;
    customCss?: string;
    customJs?: string;
    metaTags?: {
      title?: string;
      description?: string;
      keywords?: string;
      ogImage?: string;
    };
  };
}

export interface LandingPageFormData {
  title: string;
  description: string;
  status: 'draft' | 'published' | 'archived';
} 