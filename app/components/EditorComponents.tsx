'use client';

import React from 'react';
import { ComponentData } from '../types/editor';
import { CheckIcon } from '@heroicons/react/24/outline';

export const HeadingComponent = ({ content, props }: { content: string; props?: ComponentData['props'] }) => {
  const level = props?.level || 'h1';
  const text = props?.text || content;
  
  switch (level) {
    case 'h1':
      return <h1 className="text-4xl font-bold mb-4">{text}</h1>;
    case 'h2':
      return <h2 className="text-3xl font-bold mb-3">{text}</h2>;
    case 'h3':
      return <h3 className="text-2xl font-bold mb-2">{text}</h3>;
    case 'h4':
      return <h4 className="text-xl font-bold mb-2">{text}</h4>;
    case 'h5':
      return <h5 className="text-lg font-bold mb-2">{text}</h5>;
    case 'h6':
      return <h6 className="text-base font-bold mb-2">{text}</h6>;
    default:
      return <h1 className="text-4xl font-bold mb-4">{text}</h1>;
  }
};

export const ParagraphComponent = ({ content, props }: { content: string; props?: ComponentData['props'] }) => {
  const text = props?.text || content;
  return (
    <p className="text-gray-600 mb-4">
      {text}
    </p>
  );
};

export const ImageComponent = ({ content, props }: { content: string; props?: ComponentData['props'] }) => {
  return (
    <img
      src={props?.src || content}
      alt={props?.alt || ''}
      className="w-full h-auto rounded-lg mb-4"
    />
  );
};

export const ButtonComponent = ({ content, props }: { content: string; props?: ComponentData['props'] }) => {
  const text = props?.text || content;
  const link = props?.link || '#';
  const style = props?.style || 'primary';
  
  const getStyleClasses = () => {
    switch (style) {
      case 'primary':
        return 'bg-blue-600 text-white hover:bg-blue-700';
      case 'secondary':
        return 'bg-gray-600 text-white hover:bg-gray-700';
      case 'outline':
        return 'border-2 border-gray-300 text-gray-700 hover:border-gray-400';
      default:
        return 'bg-blue-600 text-white hover:bg-blue-700';
    }
  };

  return (
    <a
      href={link}
      className={`inline-block px-6 py-3 rounded-lg font-medium transition-colors ${getStyleClasses()}`}
    >
      {text}
    </a>
  );
};

export const FormComponent = ({ content, props }: { content: string; props?: ComponentData['props'] }) => {
  const formFields = props?.formFields || [];
  
  return (
    <form className="space-y-4 mb-4">
      {formFields.map((field: { label: string; type: string; placeholder?: string; required?: boolean }, index: number) => (
        <div key={index}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {field.label}
          </label>
          {field.type === 'textarea' ? (
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder={field.placeholder}
              required={field.required}
            />
          ) : (
            <input
              type={field.type}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder={field.placeholder}
              required={field.required}
            />
          )}
        </div>
      ))}
      <button
        type="submit"
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Submit
      </button>
    </form>
  );
};

export const CTAComponent = ({ content, props }: { content: string; props?: ComponentData['props'] }) => {
  return (
    <div className="bg-blue-50 p-8 rounded-lg mb-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        {props?.title || 'Ready to get started?'}
      </h2>
      <p className="text-gray-600 mb-6">
        {props?.description || 'Create your landing page in minutes.'}
      </p>
      <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
        {props?.buttonText || 'Get Started'}
      </button>
    </div>
  );
};

export const FeaturesComponent = ({ content, props }: { content: string; props?: ComponentData['props'] }) => {
  const features = props?.features || [];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
      {features.map((feature: { title: string; description: string; icon?: string }, index: number) => (
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
};

export const TestimonialComponent = ({ content, props }: { content: string; props?: ComponentData['props'] }) => {
  const testimonials = props?.testimonials || [];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
      {testimonials.map((testimonial, index) => (
        <div key={index} className="p-6 bg-white rounded-lg shadow">
          <p className="text-gray-600 mb-4">{testimonial.content}</p>
          <div className="flex items-center">
            {testimonial.avatar && (
              <img
                src={testimonial.avatar}
                alt={testimonial.name}
                className="w-10 h-10 rounded-full mr-3"
              />
            )}
            <div>
              <h4 className="font-semibold">{testimonial.name}</h4>
              {testimonial.role && (
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const PricingComponent = ({ content, props }: { content: string; props?: ComponentData['props'] }) => {
  const plans = props?.pricingPlans || [];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
      {plans.map((plan, index) => (
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
};

export const SpacerComponent = ({ content, props }: { content: string; props?: ComponentData['props'] }) => {
  const height = props?.height || 40;
  
  return (
    <div style={{ height: `${height}px` }} className="mb-4" />
  );
};

export const HeroComponent = ({ content, props }: { content: string; props?: ComponentData['props'] }) => {
  return (
    <div className="relative bg-gray-900 text-white py-16 mb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl">
            {props?.title || content}
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            {props?.description || 'A powerful solution for your needs'}
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <a
                href="#"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
              >
                {props?.buttonText || 'Get started'}
              </a>
            </div>
          </div>
        </div>
      </div>
      {props?.imageUrl && (
        <div className="absolute inset-0 z-0 opacity-20">
          <img
            src={props.imageUrl}
            alt="Hero background"
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
};

export const HeaderComponent = ({ content, props }: { content: string; props?: ComponentData['props'] }) => {
  const getBackgroundStyle = (): React.CSSProperties => {
    if (!props?.backgroundType || props.backgroundType === 'none') {
      return { 
        backgroundColor: '#ffffff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      };
    }

    const styles: React.CSSProperties = {
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    };

    switch (props.backgroundType) {
      case 'color':
        styles.backgroundColor = props.backgroundColor || '#ffffff';
        break;
      case 'image':
        if (props.backgroundImage) {
          styles.backgroundImage = `url(${props.backgroundImage})`;
          styles.backgroundSize = 'cover';
          styles.backgroundPosition = 'center';
          styles.backgroundRepeat = 'no-repeat';
          styles.backgroundColor = 'rgba(255,255,255,0.9)'; // Overlay putih untuk meningkatkan keterbacaan
        }
        break;
      case 'gradient':
        styles.background = `linear-gradient(${props.gradientDirection || 'to right'}, ${props.gradientStartColor || '#3c87d3'}, ${props.gradientEndColor || '#23853c'})`;
        break;
    }

    return styles;
  };

  const getCtaButtonStyle = () => {
    if (!props?.ctaButton?.variant) {
      return 'bg-blue-600 text-white hover:bg-blue-700';
    }

    switch (props.ctaButton.variant) {
      case 'primary':
        return 'bg-blue-600 text-white hover:bg-blue-700';
      case 'secondary':
        return 'bg-gray-600 text-white hover:bg-gray-700';
      case 'outline':
        return 'border-2 border-gray-300 text-gray-700 hover:border-gray-400';
      default:
        return 'bg-blue-600 text-white hover:bg-blue-700';
    }
  };

  return (
    <div 
      className={`w-full ${props?.isSticky ? 'sticky top-0 z-50' : ''}`} 
      style={{
        ...getBackgroundStyle(),
        transition: 'all 0.3s ease'
      }}
    >
      <header className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {props?.logo && (
            <a href="/" className="flex items-center">
              <img
                src={props.logo.src}
                alt={props.logo.alt}
                width={props.logo.width || 200}
                height={props.logo.height || 50}
                className="h-8 w-auto"
              />
            </a>
          )}
          
          <nav className="hidden md:flex space-x-8">
            {props?.navigation?.map((item, index) => (
              <a
                key={index}
                href={item.href}
                target={item.isExternal ? '_blank' : undefined}
                rel={item.isExternal ? 'noopener noreferrer' : undefined}
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {props?.ctaButton && (
            <a
              href={props.ctaButton.href}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${getCtaButtonStyle()}`}
            >
              {props.ctaButton.text}
            </a>
          )}
        </div>
      </header>
    </div>
  );
};

export const FooterComponent = ({ content, props }: { content: string; props?: ComponentData['props'] }) => {
  const getBackgroundStyle = (): React.CSSProperties => {
    if (!props?.backgroundType || props.backgroundType === 'none') {
      return {};
    }

    const styles: React.CSSProperties = {};

    switch (props.backgroundType) {
      case 'color':
        styles.backgroundColor = props.backgroundColor || '#f9fafb';
        break;
      case 'image':
        if (props.backgroundImage) {
          styles.backgroundImage = `url(${props.backgroundImage})`;
          styles.backgroundSize = 'cover';
          styles.backgroundPosition = 'center';
          styles.backgroundRepeat = 'no-repeat';
        }
        break;
      case 'gradient':
        styles.background = `linear-gradient(${props.gradientDirection || 'to right'}, ${props.gradientStartColor || '#f9fafb'}, ${props.gradientEndColor || '#f3f4f6'})`;
        break;
    }

    return styles;
  };

  return (
    <div className="w-full" style={getBackgroundStyle()}>
      <footer className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {props?.footerLinks?.map((section, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
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

        {props?.socialLinks && props.socialLinks.length > 0 && (
          <div className="mt-8 pt-8 border-t">
            <div className="flex justify-center space-x-6">
              {props.socialLinks.map((social, index) => (
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

        {props?.copyright && (
          <div className="mt-8 pt-8 border-t text-center text-gray-600">
            {props.copyright}
          </div>
        )}
      </footer>
    </div>
  );
};

export const componentMap = {
  heading: HeadingComponent,
  paragraph: ParagraphComponent,
  image: ImageComponent,
  button: ButtonComponent,
  form: FormComponent,
  cta: CTAComponent,
  features: FeaturesComponent,
  testimonial: TestimonialComponent,
  pricing: PricingComponent,
  spacer: SpacerComponent,
  hero: HeroComponent,
  header: HeaderComponent,
  footer: FooterComponent,
} as const; 