export type ComponentType = 'heading' | 'paragraph' | 'image' | 'button' | 'form' | 'cta' | 'features' | 'testimonial' | 'pricing' | 'spacer';

export interface FormFieldOption {
  label: string;
  value: string;
}

export interface FormField {
  type: 'text' | 'email' | 'textarea';
  label: string;
  placeholder: string;
  required: boolean;
  options?: FormFieldOption[];
}

export interface ComponentData {
  id: string;
  type: ComponentType;
  content: string;
  props?: {
    text?: string;
    title?: string;
    description?: string;
    buttonText?: string;
    ctaText?: string;
    level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    src?: string;
    alt?: string;
    link?: string;
    style?: 'primary' | 'secondary' | 'outline';
    height?: number;
    imageSource?: 'url' | 'upload' | 'camera' | 'device' | 'library';
    variant?: 'primary' | 'secondary' | 'outline' | 'text';
    size?: 'sm' | 'md' | 'lg';
    alignment?: 'left' | 'center' | 'right';
    backgroundColor?: string;
    textColor?: string;
    imageUrl?: string;
    imageAlt?: string;
    ctaType?: 'default' | 'purchase' | 'register' | 'contact' | 'subscribe';
    formType?: 'contact' | 'registration' | 'subscribe';
    formFields?: Array<{
      type: 'text' | 'email' | 'textarea';
      label: string;
      placeholder: string;
      required: boolean;
      options?: FormFieldOption[];
    }>;
    features?: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
    testimonials?: Array<{
      name: string;
      role: string;
      content: string;
      avatar: string;
    }>;
    pricingPlans?: Array<{
      name: string;
      price: string;
      features: string[];
      ctaText: string;
      ctaLink: string;
      popular: boolean;
    }>;
  };
}

export interface LandingPage {
  id: string;
  title: string;
  description: string;
  content: ComponentData[];
  status: 'draft' | 'published';
  userId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  slug: string;
  customDomain?: string;
  analytics?: {
    views: number;
    conversions: number;
    visitors: number;
    lastVisit?: string;
    visitHistory?: Array<{
      timestamp: string;
      type: 'view' | 'conversion';
      eventType?: string;
    }>;
  };
}

export interface ImageLibraryItem {
  id: string;
  name: string;
  description?: string;
  url: string;
  category?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  fileSize: number;
  fileType: string;
  dimensions?: {
    width: number;
    height: number;
  };
  isPublic: boolean;
}

export interface ImageLibraryCategory {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  isActive: boolean;
} 