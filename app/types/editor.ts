export type ComponentType = 
  | 'header'
  | 'hero'
  | 'heading'
  | 'paragraph'
  | 'image'
  | 'button'
  | 'form'
  | 'pricing'
  | 'testimonial'
  | 'features'
  | 'cta'
  | 'spacer'
  | 'footer'
  | 'anchor';

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
  content?: string;
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
    style?: 'primary' | 'outline' | 'secondary';
    variant?: 'primary' | 'secondary' | 'outline';
    ctaType?: 'register' | 'purchase' | 'download' | 'contact' | 'subscribe' | 'share';
    formType?: 'contact' | 'register' | 'subscribe';
    height?: number;
    imageSource?: 'url' | 'upload' | 'camera' | 'device' | 'library';
    size?: 'sm' | 'md' | 'lg';
    alignment?: 'left' | 'center' | 'right';
    backgroundColor?: string;
    textColor?: string;
    imageUrl?: string;
    imageAlt?: string;
    // Background properties
    backgroundType?: 'none' | 'color' | 'image' | 'gradient';
    backgroundImage?: string;
    gradientStartColor?: string;
    gradientEndColor?: string;
    gradientDirection?: 'to right' | 'to bottom' | 'to bottom right';
    // Header properties
    logo?: {
      src: string;
      alt: string;
      width?: number;
      height?: number;
    };
    navigation?: Array<{
      label: string;
      href: string;
      isExternal?: boolean;
      textColor?: string;
    }>;
    ctaButton?: {
      text: string;
      href: string;
      variant: 'primary' | 'secondary' | 'outline';
    };
    isSticky?: boolean;
    // Footer properties
    footerLinks?: Array<{
      title: string;
      links: Array<{
        label: string;
        href: string;
        isExternal?: boolean;
      }>;
    }>;
    socialLinks?: Array<{
      platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'youtube';
      url: string;
    }>;
    copyright?: string;
    formFields?: Array<{
      type: 'email' | 'text' | 'textarea';
      label: string;
      placeholder: string;
      required: boolean;
      options?: FormFieldOption[];
    }>;
    testimonials?: Array<{
      name: string;
      role: string;
      content: string;
      avatar: string;
    }>;
    features?: Array<{
      title: string;
      description: string;
      icon?: string;
    }>;
    pricingPlans?: Array<{
      name: string;
      price: string;
      description: string;
      features: string[];
      ctaText: string;
      ctaLink?: string;
      popular?: boolean;
    }>;
    // Anchor props
    anchorId?: string;
  };
}

export type ThemeType = 'modern' | 'business' | 'creative' | 'minimal' | 'ecommerce' | 'custom';

export interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
  };
  spacing: {
    section: string;
    component: string;
  };
  borderRadius: string;
  shadows: {
    small: string;
    medium: string;
    large: string;
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
  theme: ThemeType;
  themeConfig: ThemeConfig;
  layout?: LayoutSettings;
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

export interface LayoutSettings {
  type: 'full' | 'boxed' | 'narrow';
  width: string;
  maxWidth: string;
  padding: string;
  spacing: 'compact' | 'comfortable' | 'spacious';
  sidebarPosition: 'left' | 'right';
  showSidebar: boolean;
  showHeader: boolean;
  showFooter: boolean;
  backgroundType: 'none' | 'color' | 'image' | 'gradient';
  backgroundColor: string;
  backgroundImage: string;
  patternType: 'none' | 'dots' | 'lines' | 'grid';
  patternColor: string;
  patternOpacity: number;
  gradientDirection: string;
  gradientStartColor: string;
  gradientEndColor: string;
} 