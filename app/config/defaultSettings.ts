import { LayoutSettings, ThemeSettings } from '@/app/types/editor';

export const defaultLayout: LayoutSettings = {
  containerWidth: '1200px',
  sectionPadding: '80px',
  contentWidth: '800px',
  gap: '40px',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  gradientDirection: 'to right',
  gradientStartColor: '#4F46E5',
  gradientEndColor: '#7C3AED'
};

export const defaultTheme: ThemeSettings = {
  primaryColor: '#4F46E5',
  secondaryColor: '#7C3AED',
  accentColor: '#10B981',
  backgroundColor: '#FFFFFF',
  textColor: '#1F2937',
  headingColor: '#111827',
  linkColor: '#4F46E5',
  buttonColor: '#4F46E5',
  buttonTextColor: '#FFFFFF',
  borderColor: '#E5E7EB',
  successColor: '#10B981',
  errorColor: '#EF4444',
  warningColor: '#F59E0B',
  infoColor: '#3B82F6',
  fontFamily: 'Inter, sans-serif',
  headingFontFamily: 'Inter, sans-serif',
  fontSize: '16px',
  headingFontSize: '24px',
  lineHeight: '1.5',
  headingLineHeight: '1.2',
  fontWeight: '400',
  headingFontWeight: '600',
  letterSpacing: '0',
  headingLetterSpacing: '-0.025em'
}; 