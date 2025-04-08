import { ComponentData } from '@/app/types/editor';
import { CheckIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import { 
  trackCTAClick, 
  trackRegistration, 
  trackContact, 
  trackSubscribe, 
  trackPurchase 
} from '@/app/components/analytics/Tracking';
import { LandingPage } from '@/app/types/editor';

interface ComponentRendererProps {
  component: ComponentData;
  pageData?: LandingPage;
  isEditor?: boolean;
  onSelect?: (component: ComponentData) => void;
  onDelete?: (component: ComponentData) => void;
}

export default function ComponentRenderer({ 
  component, 
  pageData,
  isEditor = false,
  onSelect,
  onDelete 
}: ComponentRendererProps) {
  const handleClick = () => {
    if (isEditor && onSelect) {
      onSelect(component);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isEditor && onDelete) {
      onDelete(component);
    }
  };

  const renderComponent = () => {
    switch (component.type) {
      case 'heading':
        return (
          <div className="text-4xl font-bold text-gray-900 mb-4">
            {component.content}
          </div>
        );
      case 'paragraph':
        return (
          <div className="text-lg text-gray-600 mb-4">
            {component.content}
          </div>
        );
      case 'image':
        return (
          <div className="mb-4">
            <img
              src={component.content}
              alt=""
              className="w-full h-auto rounded-lg"
            />
          </div>
        );
      case 'button':
        return (
          <div className="mb-4">
            <button
              className={`px-6 py-3 rounded-md text-white font-medium ${
                component.props?.variant === 'primary'
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-600 hover:bg-gray-700'
              }`}
              data-cta={component.props?.ctaType || 'default'}
              onClick={() => pageData?.id && trackCTAClick(pageData.id)}
            >
              {component.content}
            </button>
          </div>
        );
      case 'form':
        return (
          <div className="mb-4 p-6 bg-gray-50 rounded-lg">
            <form 
              className="space-y-4"
              data-form-type={component.props?.formType || 'contact'}
              onSubmit={(e) => {
                e.preventDefault();
                const formType = component.props?.formType || 'contact';
                if (pageData?.id) {
                  switch(formType) {
                    case 'register':
                      trackRegistration(pageData.id);
                      break;
                    case 'contact':
                      trackContact(pageData.id);
                      break;
                    case 'subscribe':
                      trackSubscribe(pageData.id);
                      break;
                  }
                }
              }}
            >
              {component.props?.formFields?.map((field, index) => (
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
          </div>
        );
      case 'cta':
        return (
          <div className="mb-4 p-8 bg-blue-600 text-white rounded-lg text-center">
            <h3 className="text-2xl font-bold mb-2">{component.content}</h3>
            <button 
              className="mt-4 px-6 py-2 bg-white text-blue-600 rounded-md hover:bg-gray-100"
              data-cta={component.props?.ctaType || 'default'}
              onClick={() => pageData?.id && trackCTAClick(pageData.id)}
            >
              Get Started
            </button>
          </div>
        );
      case 'features':
        return (
          <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-6">
            {component.props?.features?.map((feature, index) => (
              <div key={index} className="p-6 bg-white rounded-lg shadow">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-600 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={feature.icon}
                  />
                </svg>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        );
      case 'testimonial':
        return (
          <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-6">
            {component.props?.testimonials?.map((testimonial, index) => (
              <div key={index} className="p-6 bg-white rounded-lg shadow">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full mx-auto mb-4"
                />
                <p className="text-gray-600 mb-2">{testimonial.content}</p>
                <div className="text-center">
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        );
      case 'pricing':
        return (
          <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-6">
            {component.props?.pricingPlans?.map((plan, index) => (
              <div
                key={index}
                className={`p-6 rounded-lg ${
                  plan.popular
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-900'
                }`}
              >
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <p className="text-3xl font-bold mb-4">{plan.price}</p>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <CheckIcon className="w-5 h-5 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button 
                  className="w-full px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-gray-100"
                  data-cta="purchase"
                  onClick={() => pageData?.id && trackPurchase(pageData.id)}
                >
                  {plan.ctaText}
                </button>
              </div>
            ))}
          </div>
        );
      case 'header':
        return (
          <div 
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
                  <Link href="/" className="flex items-center">
                    <Image
                      src={component.props.logo.src}
                      alt={component.props.logo.alt}
                      width={component.props.logo.width || 200}
                      height={component.props.logo.height || 50}
                      className="h-8 w-auto"
                    />
                  </Link>
                )}
                
                <nav className="hidden md:flex space-x-8">
                  {component.props?.navigation?.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      target={item.isExternal ? '_blank' : undefined}
                      rel={item.isExternal ? 'noopener noreferrer' : undefined}
                      className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>

                {component.props?.ctaButton && (
                  <Link
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
                  </Link>
                )}
              </div>
            </header>
          </div>
        );
      case 'footer':
        return (
          <div 
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
                          <Link
                            href={link.href}
                            target={link.isExternal ? '_blank' : undefined}
                            rel={link.isExternal ? 'noopener noreferrer' : undefined}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            {link.label}
                          </Link>
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
                      <Link
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
                      </Link>
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

  return (
    <div 
      className={`relative ${isEditor ? 'hover:ring-2 hover:ring-blue-500 cursor-pointer' : ''}`}
      onClick={handleClick}
    >
      {isEditor && (
        <button
          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
          onClick={handleDelete}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
      {renderComponent()}
    </div>
  );
} 