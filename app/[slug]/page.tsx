'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { collection, query, where, getDocs, doc, updateDoc, increment, setDoc, arrayUnion, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { toast } from 'react-hot-toast';
import { ComponentData, LayoutSettings } from '@/app/types/editor';
import { headers } from 'next/headers';
import { CheckIcon } from '@heroicons/react/24/outline';
import LayoutWrapper from '@/app/components/LayoutWrapper';
import ComponentRenderer from '@/app/components/editor/ComponentRenderer';
import { defaultLayout, defaultTheme } from '@/app/config/defaultSettings';

interface LandingPage {
  id: string;
  title: string;
  description: string;
  content: ComponentData[];
  status: 'draft' | 'published';
  userId: string;
  createdAt: string;
  lastUpdated: string;
  slug: string;
  customDomain?: string;
  layout: {
    type: 'boxed' | 'full-width';
    width: string;
    spacing: string;
    backgroundType: 'none' | 'color' | 'image' | 'gradient';
    backgroundColor: string;
    backgroundImage: string;
    gradientDirection: string;
    gradientStartColor: string;
    gradientEndColor: string;
    showHeader: boolean;
    showFooter: boolean;
    headerSticky: boolean;
  };
  theme: {
    typography: {
      headingFont: string;
      bodyFont: string;
    };
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      text: string;
      background: string;
    };
    spacing: {
      component: string;
      section: string;
    };
    borderRadius: string;
    shadows: {
      small: string;
      medium: string;
      large: string;
    };
  };
}

interface FormField {
  label: string;
  type: 'text' | 'textarea' | 'email' | 'tel';
  placeholder?: string;
  required?: boolean;
}

export default function DynamicPage() {
  const params = useParams();
  const [page, setPage] = useState<LandingPage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        console.log('Fetching page with slug:', params.slug);
        const q = query(
          collection(db, 'landing_pages'),
          where('slug', '==', params.slug)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          const data = doc.data();
          console.log('Fetched page data:', data);
          
          // Pastikan content ada dan merupakan array
          const content = Array.isArray(data.content) ? data.content : [];
          const hasHeader = content.some(item => item.type === 'header');
          const hasFooter = content.some(item => item.type === 'footer');
          console.log('Content data:', content);
          
          const pageData = {
            id: doc.id,
            ...data,
            content: [
              ...content
            ],
            layout: {
              type: data.layout?.type || 'full-width',
              width: data.layout?.width || 'wide',
              spacing: data.layout?.spacing || 'spacious',
              backgroundType: data.layout?.backgroundType || 'none',
              backgroundColor: data.layout?.backgroundColor || '#ffffff',
              backgroundImage: data.layout?.backgroundImage || '',
              gradientDirection: data.layout?.gradientDirection || 'to right',
              gradientStartColor: data.layout?.gradientStartColor || '#3c87d3',
              gradientEndColor: data.layout?.gradientEndColor || '#23853c',
              showHeader: data.layout?.showHeader || true,
              showFooter: data.layout?.showFooter || true,
              headerSticky: data.layout?.headerSticky ?? true,
            },
            theme: {
              typography: {
                headingFont: data.themeConfig?.typography?.headingFont || 'Montserrat, sans-serif',
                bodyFont: data.themeConfig?.typography?.bodyFont || 'Roboto, sans-serif'
              },
              colors: {
                primary: data.themeConfig?.colors?.primary || '#FF4D4D',
                secondary: data.themeConfig?.colors?.secondary || '#4CAF50',
                accent: data.themeConfig?.colors?.accent || '#FFC107',
                text: data.themeConfig?.colors?.text || '#212121',
                background: data.themeConfig?.colors?.background || '#FFFFFF'
              },
              spacing: {
                component: data.themeConfig?.spacing?.component || '1.5rem',
                section: data.themeConfig?.spacing?.section || '4rem'
              },
              borderRadius: data.themeConfig?.borderRadius || '0.25rem',
              shadows: {
                small: data.themeConfig?.shadows?.small || '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                medium: data.themeConfig?.shadows?.medium || '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                large: data.themeConfig?.shadows?.large || '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }
            }
          } as LandingPage;
          
          console.log('Processed page data:', pageData);
          setPage(pageData);
        } else {
          console.error('No page found with slug:', params.slug);
        }
      } catch (error) {
        console.error('Error fetching page:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchPage();
    }
  }, [params.slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
          <p className="text-gray-600">The page you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const getBackgroundStyle = () => {
    switch (page.layout.backgroundType) {
      case 'color':
        return {
          backgroundColor: page.layout.backgroundColor
        };
      case 'image':
        return {
          backgroundImage: `url(${page.layout.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        };
      case 'gradient':
        return {
          background: `linear-gradient(${page.layout.gradientDirection}, ${
            page.layout.gradientStartColor
          }, ${page.layout.gradientEndColor})`
        };
      default:
        return {};
    }
  };

  const getWidthClass = () => {
    switch (page.layout.width) {
      case 'narrow':
        return 'max-w-3xl';
      case 'wide':
        return 'max-w-6xl';
      case 'full':
        return 'w-full';
      default:
        return 'max-w-4xl';
    }
  };

  console.log('Rendering page with content:', page.content);

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{
        ...getBackgroundStyle(),
        fontFamily: page.theme.typography.bodyFont,
        color: page.theme.colors.text,
        backgroundColor: page.layout.backgroundType === 'color' ? page.layout.backgroundColor : page.theme.colors.background,
        marginTop: 0,
        paddingTop: 0
      }}
    >
      {/* Main Content */}
      <main className="flex-grow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-0 pb-7">
          {page.content && page.content.length > 0 ? (
            page.content.map((component, index) => {
              // Skip header and footer if they are not enabled in layout settings
              if (component.type === 'header' && !page.layout.showHeader) return null;
              if (component.type === 'footer' && !page.layout.showFooter) return null;

              console.log('Rendering component:', component);
              return (
                <div 
                  key={index} 
                  className="w-full"
                  style={{
                    marginBottom: page.theme.spacing.section
                  }}
                >
                  <div className="w-full">
                    <ComponentRenderer 
                      component={component} 
                      pageData={page}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No content available</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 