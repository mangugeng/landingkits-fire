'use client';

import { ComponentData, LandingPage } from '@/app/types/editor';
import { useState } from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

interface ComponentRendererProps {
  component: ComponentData;
  pageData?: LandingPage;
  onSelect?: () => void;
  onDelete?: () => void;
  isEditor?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

export default function ComponentRenderer({
  component,
  pageData,
  onSelect,
  onDelete,
  isEditor = false,
  onMoveUp,
  onMoveDown
}: ComponentRendererProps) {
  const [isHovered, setIsHovered] = useState(false);

  const renderComponent = () => {
    switch (component.type) {
      case 'heading':
        return (
          <div className="w-full">
            <h1 className="text-4xl font-bold mb-4">{component.content}</h1>
          </div>
        );
      case 'paragraph':
        return (
          <div className="w-full">
            <p className="text-lg mb-4">{component.content}</p>
          </div>
        );
      case 'image':
        return (
          <div className="w-full">
          <img 
              src={component.content}
              alt=""
              className="w-full h-auto rounded-lg"
              style={{
                maxHeight: '500px',
                objectFit: 'cover'
              }}
          />
          </div>
        );
      case 'button':
        return (
          <div className="w-full">
          <button 
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                component.props?.variant === 'primary'
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {component.content}
          </button>
          </div>
        );
      case 'form':
        return (
          <div className="w-full">
            <form className="space-y-4">
            {component.props?.formFields?.map((field, index) => (
              <div key={index} className="space-y-1">
                  <label className="block text-sm font-medium">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    placeholder={field.placeholder}
                      className="w-full p-2 border rounded-lg"
                    rows={4}
                  />
                ) : (
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                      className="w-full p-2 border rounded-lg"
                  />
                )}
              </div>
            ))}
            <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Submit
            </button>
            </form>
          </div>
        );
      case 'features':
        return (
          <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {component.props?.features?.map((feature, index) => (
                <div key={index} className="p-6 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                  </svg>
                </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
            </div>
          </div>
        );
      case 'testimonial':
        return (
          <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {component.props?.testimonials?.map((testimonial, index) => (
                <div key={index} className="p-6 bg-gray-50 rounded-lg">
                <div className="flex items-center mb-4">
                  <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full" />
                  <div className="ml-4">
                      <h4 className="text-lg font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.content}"</p>
              </div>
            ))}
            </div>
          </div>
        );
      case 'pricing':
        return (
          <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {component.props?.pricingPlans?.map((plan, index) => (
                <div key={index} className={`p-6 rounded-lg ${
                  plan.popular ? 'bg-blue-50 border-2 border-blue-500' : 'bg-gray-50'
                }`}>
                {plan.popular && (
                    <span className="inline-block px-3 py-1 text-sm text-blue-600 bg-blue-100 rounded-full mb-4">
                    Popular
                  </span>
                )}
                  <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                  <p className="text-3xl font-bold mb-4">{plan.price}</p>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                  <button className={`w-full px-6 py-3 rounded-lg font-medium transition-colors ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}>
                  {plan.ctaText}
                  </button>
              </div>
            ))}
            </div>
          </div>
        );
      case 'cta':
        return (
          <div className="w-full">
            <div className="bg-blue-600 text-white p-8 rounded-lg text-center">
              <h2 className="text-2xl font-bold mb-4">{component.content}</h2>
              <button className="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Get Started
            </button>
            </div>
          </div>
        );
      case 'spacer':
        return (
          <div className="w-full" style={{ height: component.props?.height || 20 }} />
        );
      case 'hero':
        return (
          <div 
            className="w-full"
            style={{
              marginTop: component.props?.isSticky ? '80px' : '0',
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
              })
            }}
          >
            <div className="container mx-auto px-4 py-16">
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">{component.props?.title}</h1>
                <p className="text-xl mb-8">{component.props?.description}</p>
                {component.props?.ctaButton && (
                  <a
                    href={component.props.ctaButton.href}
                    className={`px-6 py-3 rounded-md font-medium transition-colors duration-200 ${
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
            </div>
          </div>
        );
      case 'header':
        return (
          <>
            <div 
              className={`w-full ${component.props?.isSticky ? 'fixed top-0 left-0 right-0 z-50' : ''}`}
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
                boxShadow: component.props?.isSticky ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
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
                        onClick={(e) => {
                          if (item.href.startsWith('#')) {
                            e.preventDefault();
                            const targetElement = document.querySelector(item.href);
                            if (targetElement) {
                              targetElement.scrollIntoView({ behavior: 'smooth' });
                            }
                          }
                        }}
                        style={{
                          color: item.textColor || component.props?.textColor || '#4B5563',
                          transition: 'color 0.2s ease'
                        }}
                        className="font-medium hover:opacity-80"
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
            {component.props?.isSticky && (
              <div style={{ height: '80px' }} />
            )}
          </>
        );
      case 'footer':
        return (
          <div className="w-full">
            <div className="bg-gray-50 py-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  {component.props?.footerLinks?.map((section, index) => (
                    <div key={index}>
                      <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
                      <ul className="space-y-2">
                        {section.links.map((link, linkIndex) => (
                          <li key={linkIndex}>
                            <a
                              href={link.href}
                              className="text-gray-600 hover:text-gray-900"
                              target={link.isExternal ? '_blank' : undefined}
                              rel={link.isExternal ? 'noopener noreferrer' : undefined}
                            >
                              {link.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <p className="text-gray-500">{component.props?.copyright}</p>
                    <div className="flex space-x-4">
                      {component.props?.socialLinks?.map((social, index) => (
                        <a
                          key={index}
                          href={social.url}
                          className="text-gray-400 hover:text-gray-500"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span className="sr-only">{social.platform}</span>
                          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                            {social.platform === 'facebook' && (
                              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.764 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                            )}
                            {social.platform === 'twitter' && (
                              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                            )}
                            {social.platform === 'instagram' && (
                              <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                            )}
                            {social.platform === 'linkedin' && (
                              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                            )}
                          </svg>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'anchor':
        if (isEditor) {
          return (
            <div 
              id={component.props?.anchorId} 
              className="scroll-mt-20 border-2 border-dashed border-gray-300 p-6 rounded-lg bg-gray-50"
            >
              <div className="flex items-center justify-center space-x-3 text-gray-500">
                <span className="text-2xl">🔗</span>
                <div className="text-center">
                  <p className="font-medium">Anchor Point</p>
                  <p className="text-sm">#{component.props?.anchorId}</p>
                </div>
              </div>
              <div className="mt-2 text-center text-xs text-gray-400">
                Titik ini akan menjadi tujuan scroll saat link dengan ID yang sama diklik
              </div>
          </div>
        );
        }
        return (
          <div 
            id={component.props?.anchorId} 
            className="scroll-mt-20"
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {renderComponent()}
      {isEditor && isHovered && (
        <div className="absolute top-2 right-2 flex items-center space-x-1">
          {onMoveUp && (
        <button
          className="p-1 text-gray-400 hover:text-blue-500 rounded-lg hover:bg-blue-50 transition-colors"
              onClick={onMoveUp}
              title="Move Up"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
          )}
          {onMoveDown && (
        <button
          className="p-1 text-gray-400 hover:text-blue-500 rounded-lg hover:bg-blue-50 transition-colors"
              onClick={onMoveDown}
              title="Move Down"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
          )}
          <button
            className="p-1 text-gray-400 hover:text-blue-500 rounded-lg hover:bg-blue-50 transition-colors"
            onClick={onSelect}
            title="Edit"
      >
            <FiEdit2 className="w-4 h-4" />
          </button>
          <button
            className="p-1 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
            onClick={onDelete}
            title="Delete"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
} 