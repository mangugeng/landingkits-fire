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
              ...(data.layout?.showHeader && !hasHeader ? [{
                id: `header-${Date.now()}`,
                type: 'header',
                content: '',
                props: {
                  logo: {
                    src: 'https://placehold.co/200x50',
                    alt: 'Logo',
                    width: 200,
                    height: 50
                  },
                  navigation: [
                    { label: 'Beranda', href: '/' },
                    { label: 'Tentang', href: '/about' },
                    { label: 'Layanan', href: '/services' },
                    { label: 'Kontak', href: '/contact' }
                  ],
                  ctaButton: {
                    text: 'Hubungi Kami',
                    href: '/contact',
                    variant: 'primary'
                  },
                  isSticky: data.layout?.headerSticky ?? true,
                  backgroundType: data.layout?.backgroundType || 'color',
                  backgroundColor: data.layout?.backgroundColor || '#ffffff'
                }
              }] : []),
              ...content,
              ...(data.layout?.showFooter && !hasFooter ? [{
                id: `footer-${Date.now()}`,
                type: 'footer',
                content: '',
                props: {
                  footerLinks: [
                    {
                      title: 'Perusahaan',
                      links: [
                        { label: 'Tentang Kami', href: '/about' },
                        { label: 'Karir', href: '/careers' },
                        { label: 'Blog', href: '/blog' }
                      ]
                    },
                    {
                      title: 'Layanan',
                      links: [
                        { label: 'Produk', href: '/products' },
                        { label: 'Solusi', href: '/solutions' },
                        { label: 'Pricing', href: '/pricing' }
                      ]
                    },
                    {
                      title: 'Dukungan',
                      links: [
                        { label: 'FAQ', href: '/faq' },
                        { label: 'Kontak', href: '/contact' },
                        { label: 'Bantuan', href: '/help' }
                      ]
                    }
                  ],
                  socialLinks: [
                    { platform: 'facebook', url: 'https://facebook.com' },
                    { platform: 'twitter', url: 'https://twitter.com' },
                    { platform: 'instagram', url: 'https://instagram.com' },
                    { platform: 'linkedin', url: 'https://linkedin.com' }
                  ],
                  copyright: '© 2024 Nama Perusahaan. All rights reserved.'
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

  const renderComponent = (component: ComponentData) => {
    switch (component.type) {
      case 'heading':
        return (
          <h2 className="text-3xl font-bold mb-4">
            {component.content}
          </h2>
        );
      case 'paragraph':
        return (
          <p className="mb-4">
            {component.content}
          </p>
        );
      case 'image':
        return (
          <div className="mb-4">
            <img 
              src={component.props?.src} 
              alt={component.props?.alt || ''} 
              className="max-w-full h-auto rounded-lg"
            />
          </div>
        );
      case 'button':
        return (
          <button 
            className={`px-6 py-2 rounded-lg ${component.props?.style || 'bg-blue-600 text-white'}`}
          >
            {component.content}
          </button>
        );
      case 'form':
        return (
          <div className="mb-4 p-6 bg-gray-50 rounded-lg">
            <form className="space-y-4">
              {(component.props?.formFields as FormField[])?.map((field, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      className="w-full p-2 border rounded-lg"
                      placeholder={field.placeholder}
                      required={field.required}
                    />
                  ) : (
                    <input
                      type={field.type}
                      className="w-full p-2 border rounded-lg"
                      placeholder={field.placeholder}
                      required={field.required}
                    />
                  )}
                </div>
              ))}
            </form>
          </div>
        );
      case 'testimonial':
        return (
          <div className="mb-4 bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <img 
                src={component.props?.testimonials?.[0]?.avatar} 
                alt={component.props?.testimonials?.[0]?.name} 
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <h4 className="font-semibold">{component.props?.testimonials?.[0]?.name}</h4>
                {component.props?.testimonials?.[0]?.role && (
                  <p className="text-sm text-gray-600">{component.props?.testimonials?.[0]?.role}</p>
                )}
              </div>
            </div>
            <p className="text-gray-700">{component.props?.testimonials?.[0]?.content}</p>
          </div>
        );
      case 'cta':
        return (
          <div className="mb-4 p-8 bg-blue-600 text-white rounded-lg text-center">
            <h3 className="text-2xl font-bold mb-2">{component.content}</h3>
            <button className="mt-4 px-6 py-2 bg-white text-blue-600 rounded-md hover:bg-gray-100">
              Get Started
            </button>
          </div>
        );
      case 'features':
        return (
          <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-6">
            {component.props?.features?.map((feature: { title: string; description: string; icon?: string }, index: number) => (
              <div key={index} className="p-6 bg-white rounded-lg shadow">
                {feature.icon && (
                  <div className="text-4xl mb-4">{feature.icon}</div>
                )}
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        );
      case 'pricing':
        return (
          <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-6">
            {component.props?.pricingPlans?.map((plan, index) => (
              <div key={index} className={`p-6 rounded-lg ${plan.popular ? 'bg-blue-50 border-2 border-blue-500' : 'bg-white border'}`}>
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <p className="text-3xl font-bold mb-4">{plan.price}</p>
                <ul className="mb-6 space-y-2">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckIcon className="w-5 h-5 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  {plan.ctaText}
                </button>
              </div>
            ))}
          </div>
        );
      case 'spacer':
        return (
          <div
            className="w-full"
            style={{ height: `${component.props?.height || 40}px` }}
          />
        );
      case 'hero':
        return (
          <div key={component.id} className="relative py-16 mb-4">
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
      case 'header':
        return (
          <div 
            key={component.id}
            className={`w-full ${component.props?.isSticky ? 'sticky top-0 z-50' : ''}`}
            style={{
              ...(component.props?.backgroundType === 'color' && {
                backgroundColor: component.props?.backgroundColor || '#ffffff'
              }),
              ...(component.props?.backgroundType === 'image' && {
                backgroundImage: `url(${component.props?.backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }),
              ...(component.props?.backgroundType === 'gradient' && {
                background: `linear-gradient(${component.props?.gradientDirection || 'to right'}, ${component.props?.gradientStartColor || '#3c87d3'}, ${component.props?.gradientEndColor || '#23853c'})`
              }),
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease'
            }}
          >
            <header className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                {component.props?.logo && (
                  <a href="/" className="flex items-center">
                    <img
                      src={component.props.logo.src}
                      alt={component.props.logo.alt}
                      width={component.props.logo.width || 200}
                      height={component.props.logo.height || 50}
                      className="h-8 w-auto"
                    />
                  </a>
                )}
                
                <nav className="hidden md:flex space-x-8">
                  {component.props?.navigation?.map((item, index) => (
                    <a
                      key={index}
                      href={item.href}
                      target={item.isExternal ? '_blank' : undefined}
                      rel={item.isExternal ? 'noopener noreferrer' : undefined}
                      className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>

                {component.props?.ctaButton && (
                  <a
                    href={component.props.ctaButton.href}
                    className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
                      component.props.ctaButton.variant === 'primary'
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : component.props.ctaButton.variant === 'secondary'
                        ? 'bg-gray-600 text-white hover:bg-gray-700'
                        : 'border-2 border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {component.props.ctaButton.text}
                  </a>
                )}
              </div>
            </header>
          </div>
        );
      case 'footer':
        return (
          <div 
            key={component.id}
            className="w-full"
            style={{
              backgroundColor: component.props?.backgroundType === 'color' ? component.props?.backgroundColor : '#ffffff',
              backgroundImage: component.props?.backgroundType === 'image' ? `url(${component.props?.backgroundImage})` : 'none',
              backgroundSize: component.props?.backgroundType === 'image' ? 'cover' : 'auto',
              backgroundPosition: component.props?.backgroundType === 'image' ? 'center' : 'initial',
              backgroundRepeat: component.props?.backgroundType === 'image' ? 'no-repeat' : 'repeat',
              background: component.props?.backgroundType === 'gradient' 
                ? `linear-gradient(${component.props?.gradientDirection || 'to right'}, ${component.props?.gradientStartColor || '#ffffff'}, ${component.props?.gradientEndColor || '#f3f4f6'})`
                : 'none'
            }}
          >
            <footer className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                {component.props?.footerLinks?.map((section, index) => (
                  <div key={index} className="space-y-2">
                    <h3 className="text-lg font-semibold">{section.title}</h3>
                    <ul className="space-y-1">
                      {section.links.map((link, linkIndex) => (
                        <li key={linkIndex}>
                          <a
                            href={link.href}
                            target={link.isExternal ? '_blank' : undefined}
                            rel={link.isExternal ? 'noopener noreferrer' : undefined}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {component.props?.socialLinks && component.props.socialLinks.length > 0 && (
                <div className="mt-8 pt-8 border-t">
                  <div className="flex justify-center space-x-6">
                    {component.props.socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-900"
                      >
                        {social.platform === 'facebook' && (
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                          </svg>
                        )}
                        {social.platform === 'twitter' && (
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                          </svg>
                        )}
                        {social.platform === 'instagram' && (
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 011.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 01-1.153 1.772 4.915 4.915 0 01-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 01-1.772-1.153 4.904 4.904 0 01-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 011.153-1.772A4.897 4.897 0 015.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 100 10 5 5 0 000-10zm6.5-.25a1.25 1.25 0 10-2.5 0 1.25 1.25 0 002.5 0zM12 9a3 3 0 110 6 3 3 0 010-6z" />
                          </svg>
                        )}
                        {social.platform === 'linkedin' && (
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                        )}
                        {social.platform === 'youtube' && (
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                          </svg>
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {component.props?.copyright && (
                <div className="mt-8 pt-8 border-t text-center text-gray-600">
                  {component.props.copyright}
                </div>
              )}
            </footer>
          </div>
        );
      default:
        return null;
    }
  };

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
        paddingTop: 0
      }}
    >
      {/* Main Content */}
      <main className="flex-grow">
        <div className={`mx-auto ${getWidthClass()}`}>
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
                      onSelect={() => {}}
                      onDelete={() => {}}
                      isEditor={false}
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
      </main>
    </div>
  );
} 