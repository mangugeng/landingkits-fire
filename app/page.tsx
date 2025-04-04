'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { collection, query, where, getDocs, doc, getDoc, updateDoc, increment, Timestamp, arrayUnion } from 'firebase/firestore';
import { db } from './lib/firebase';
import { BlogPost } from './types/blog';
import { FiArrowRight } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { ComponentData, ThemeType, ThemeConfig, LayoutSettings } from './types/editor';
import PricingSection from './components/PricingSection';
import BlogCard from './components/BlogCard';
import { getLatestPosts } from './lib/blog';
import ViewTracker from '@/app/components/analytics/ViewTracker';
import { 
  trackRegistration, 
  trackPurchase, 
  trackDownload, 
  trackContact, 
  trackSubscribe, 
  trackShare, 
  trackCTAClick 
} from '@/app/components/analytics/Tracking';
import ThemeProvider from '@/app/components/ThemeProvider';
import LayoutWrapper from '@/app/components/LayoutWrapper';
import { detectBrowser, detectDevice, detectOS, getUserLocation } from '@/app/utils/analytics';
import ComponentRenderer from '@/app/components/editor/ComponentRenderer';

interface LandingPage {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: ComponentData[];
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
    headerBackgroundType: 'none' | 'color' | 'image' | 'gradient';
    headerBackgroundColor: string;
    footerBackgroundType: 'none' | 'color' | 'image' | 'gradient';
    footerBackgroundColor: string;
    logo: string;
    navigation: Array<{ label: string; href: string }>;
    ctaButton: {
      text: string;
      href: string;
      variant: string;
    };
    links: Array<{
      title: string;
      links: Array<{ label: string; href: string }>;
    }>;
    socialLinks: Array<{ platform: string; url: string }>;
    copyright: string;
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
  status: 'draft' | 'published';
  userId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  customDomain?: string;
  analytics?: {
    views: number;
    uniqueVisitors: number;
    lastVisit: string;
    visitHistory: Array<{
      timestamp: string;
      type: string;
      browser?: string;
      device?: string;
      os?: string;
      screenSize?: string;
      location?: {
        city: string;
        country: string;
      };
    }>;
    devices?: {
      [key: string]: number;
    };
    operatingSystems?: {
      [key: string]: number;
    };
    locations?: {
      cities?: {
        [key: string]: number;
      };
      countries?: {
        [key: string]: number;
      };
    };
  };
}

const renderComponent = (component: ComponentData, pageData: LandingPage) => {
  switch (component.type) {
    case 'heading':
      return (
        <div className="heading text-4xl font-bold mb-4">
          {component.content}
        </div>
      );
    case 'paragraph':
      return (
        <div className="paragraph text-lg mb-4">
          {component.content}
        </div>
      );
    case 'image':
      return (
        <div className="mb-4">
          <img
            src={component.content}
            alt=""
            className="image w-full h-auto rounded-lg"
          />
        </div>
      );
    case 'button':
      return (
        <div className="mb-4">
          <button
            className={`button ${
              component.props?.variant === 'primary'
                ? 'button-primary'
                : 'button-secondary'
            }`}
            data-cta={component.props?.ctaType || 'default'}
            onClick={() => trackCTAClick(pageData.id)}
          >
            {component.content}
          </button>
        </div>
      );
    case 'form':
      return (
        <div className="form mb-4">
          {component.props?.formFields?.map((field, index) => (
            <div key={index} className="space-y-1">
              <label className="block text-sm font-medium">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  placeholder={field.placeholder}
                  className="w-full"
                  rows={4}
                  defaultValue=""
                />
              ) : (
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  className="w-full"
                  defaultValue=""
                />
              )}
            </div>
          ))}
          <button className="button button-primary w-full">
            Submit
          </button>
        </div>
      );
    case 'features':
      return (
        <div className="features grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
          {component.props?.features?.map((feature, index) => (
            <div key={index} className="p-6">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      );
    case 'testimonial':
      return (
        <div className="testimonial grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
          {component.props?.testimonials?.map((testimonial, index) => (
            <div key={index} className="p-6">
              <div className="flex items-center mb-4">
                <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full" />
                <div className="ml-4">
                  <h4 className="text-lg font-semibold">{testimonial.name}</h4>
                  <p className="text-sm">{testimonial.role}</p>
                </div>
              </div>
              <p className="italic">"{testimonial.content}"</p>
            </div>
          ))}
        </div>
      );
    case 'pricing':
      return (
        <div className="pricing grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
          {component.props?.pricingPlans?.map((plan, index) => (
            <div key={index} className={`p-6 ${plan.popular ? 'pricing-popular' : ''}`}>
              {plan.popular && (
                <span className="inline-block px-3 py-1 text-sm rounded-full mb-4">
                  Popular
                </span>
              )}
              <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
              <p className="text-3xl font-bold mb-4">{plan.price}</p>
              <p className="mb-4">{plan.description}</p>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                href={plan.ctaLink}
                className={`block w-full text-center pricing-button ${
                  plan.popular ? 'button-primary' : 'button-secondary'
                }`}
              >
                {plan.ctaText}
              </a>
            </div>
          ))}
        </div>
      );
    case 'cta':
      return (
        <div className="cta p-8 text-center mb-4">
          <h2 className="text-2xl font-bold mb-4">{component.content}</h2>
          <button className="button button-primary">
            Get Started
          </button>
        </div>
      );
    case 'spacer':
      return (
        <div style={{ height: component.props?.height || 20 }} />
      );
    case 'hero':
      return (
        <div className="relative py-16 mb-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl">
                {component.props?.title || component.content}
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                {component.props?.description || 'A powerful solution for your needs'}
              </p>
              <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                <div className="rounded-md shadow">
                  <a
                    href="#"
                    className="button button-primary"
                  >
                    {component.props?.buttonText || 'Get started'}
                  </a>
                </div>
              </div>
            </div>
          </div>
          {component.props?.imageUrl && (
            <div className="absolute inset-0 z-0 opacity-20">
              <img
                src={component.props.imageUrl}
                alt="Hero background"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      );
    default:
      return null;
  }
};

export default function Home() {
  const [page, setPage] = useState<LandingPage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        // Get the current hostname
        const hostname = window.location.hostname;
        const isSubdomain = hostname.split('.').length > 2;
        
        let q;
        if (isSubdomain) {
          // If it's a subdomain, use the subdomain as the slug
          const subdomain = hostname.split('.')[0];
          q = query(
            collection(db, 'landing_pages'),
            where('slug', '==', subdomain)
          );
        } else {
          // If it's not a subdomain, first check if it's a custom domain
          const customDomainQuery = query(
            collection(db, 'landing_pages'),
            where('customDomain', '==', hostname)
          );
          const customDomainSnapshot = await getDocs(customDomainQuery);
          
          if (!customDomainSnapshot.empty) {
            // If it's a custom domain, use that query
            q = customDomainQuery;
          } else {
            // If it's not a custom domain, use the path as the slug
            const path = window.location.pathname.split('/')[1];
            q = query(
              collection(db, 'landing_pages'),
              where('slug', '==', path)
            );
          }
        }

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
              ...(data.layout?.showHeader && !hasHeader ? [{
                type: 'header',
                props: {
                  logo: {
                    src: data.layout?.logo || '/logo.png',
                    alt: 'Logo',
                    width: 200,
                    height: 50
                  },
                  navigation: data.layout?.navigation || [
                    { label: 'Home', href: '/' },
                    { label: 'About', href: '/about' },
                    { label: 'Contact', href: '/contact' }
                  ],
                  ctaButton: data.layout?.ctaButton || {
                    text: 'Get Started',
                    href: '/signup',
                    variant: 'primary'
                  },
                  isSticky: data.layout?.headerSticky ?? true,
                  backgroundType: data.layout?.headerBackgroundType || 'color',
                  backgroundColor: data.layout?.headerBackgroundColor || '#ffffff'
                }
              }] : []),
              ...(Array.isArray(data.content) ? data.content : []),
              ...(data.layout?.showFooter && !hasFooter ? [{
                type: 'footer',
                props: {
                  links: data.layout?.footerLinks || [
                    {
                      title: 'Company',
                      links: [
                        { label: 'About', href: '/about' },
                        { label: 'Contact', href: '/contact' }
                      ]
                    }
                  ],
                  socialLinks: data.layout?.socialLinks || [
                    { platform: 'facebook', url: '#' },
                    { platform: 'twitter', url: '#' },
                    { platform: 'instagram', url: '#' }
                  ],
                  copyright: data.layout?.copyright || '© 2024 Your Company. All rights reserved.',
                  backgroundType: data.layout?.footerBackgroundType || 'color',
                  backgroundColor: data.layout?.footerBackgroundColor || '#f3f4f6'
                }
              }] : [])
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
              headerBackgroundType: data.layout?.headerBackgroundType || 'color',
              headerBackgroundColor: data.layout?.headerBackgroundColor || '#ffffff',
              footerBackgroundType: data.layout?.footerBackgroundType || 'color',
              footerBackgroundColor: data.layout?.footerBackgroundColor || '#f3f4f6'
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
          console.error('No page found with slug:', isSubdomain ? hostname.split('.')[0] : window.location.pathname.split('/')[1]);
        }
      } catch (error) {
        console.error('Error fetching page:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, []);

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
      className="min-h-screen"
      style={{
        ...getBackgroundStyle(),
        fontFamily: page.theme.typography.bodyFont,
        color: page.theme.colors.text,
        backgroundColor: page.theme.colors.background,
        paddingTop: 0
      }}
    >
      <div className={`mx-auto ${getWidthClass()}`}>
        {page.content && page.content.length > 0 ? (
          page.content.map((component, index) => {
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
                    onSelect={() => {}}
                    onDelete={() => {}}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No components found in this page</p>
            <pre className="mt-4 text-left bg-gray-100 p-4 rounded">
              {JSON.stringify(page, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
