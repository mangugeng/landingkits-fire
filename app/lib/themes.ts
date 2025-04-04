import { ThemeConfig } from '../types/editor';

export const themeConfigs: Record<string, ThemeConfig> = {
  modern: {
    colors: {
      primary: '#3B82F6',
      secondary: '#10B981',
      accent: '#8B5CF6',
      background: '#FFFFFF',
      text: '#1F2937',
    },
    typography: {
      headingFont: 'Inter, sans-serif',
      bodyFont: 'Inter, sans-serif',
    },
    spacing: {
      section: '4rem',
      component: '1.5rem',
    },
    borderRadius: '0.5rem',
    shadows: {
      small: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      medium: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      large: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    },
  },
  business: {
    colors: {
      primary: '#2563EB',
      secondary: '#059669',
      accent: '#7C3AED',
      background: '#F9FAFB',
      text: '#111827',
    },
    typography: {
      headingFont: 'Roboto, sans-serif',
      bodyFont: 'Open Sans, sans-serif',
    },
    spacing: {
      section: '5rem',
      component: '2rem',
    },
    borderRadius: '0.375rem',
    shadows: {
      small: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      medium: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      large: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    },
  },
  creative: {
    colors: {
      primary: '#EC4899',
      secondary: '#F59E0B',
      accent: '#6366F1',
      background: '#FDF4FF',
      text: '#1F2937',
    },
    typography: {
      headingFont: 'Playfair Display, serif',
      bodyFont: 'Source Sans Pro, sans-serif',
    },
    spacing: {
      section: '6rem',
      component: '2.5rem',
    },
    borderRadius: '1rem',
    shadows: {
      small: '0 2px 4px 0 rgba(0, 0, 0, 0.05)',
      medium: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      large: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    },
  },
  minimal: {
    colors: {
      primary: '#000000',
      secondary: '#666666',
      accent: '#999999',
      background: '#FFFFFF',
      text: '#333333',
    },
    typography: {
      headingFont: 'Helvetica Neue, sans-serif',
      bodyFont: 'Helvetica Neue, sans-serif',
    },
    spacing: {
      section: '3rem',
      component: '1rem',
    },
    borderRadius: '0',
    shadows: {
      small: 'none',
      medium: 'none',
      large: 'none',
    },
  },
  ecommerce: {
    colors: {
      primary: '#FF4D4D',
      secondary: '#4CAF50',
      accent: '#FFC107',
      background: '#FFFFFF',
      text: '#212121',
    },
    typography: {
      headingFont: 'Montserrat, sans-serif',
      bodyFont: 'Roboto, sans-serif',
    },
    spacing: {
      section: '4rem',
      component: '1.5rem',
    },
    borderRadius: '0.25rem',
    shadows: {
      small: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      medium: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      large: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    },
  },
  custom: {
    colors: {
      primary: '#FF6B6B',
      secondary: '#4ECDC4',
      accent: '#FFE66D',
      background: '#F7F9FC',
      text: '#2D3748',
    },
    typography: {
      headingFont: 'Poppins, sans-serif',
      bodyFont: 'Nunito, sans-serif',
    },
    spacing: {
      section: '5rem',
      component: '2rem',
    },
    borderRadius: '0.75rem',
    shadows: {
      small: '0 2px 5px 0 rgba(0, 0, 0, 0.05)',
      medium: '0 5px 10px -1px rgba(0, 0, 0, 0.1)',
      large: '0 15px 20px -5px rgba(0, 0, 0, 0.1)',
    },
  },
}; 