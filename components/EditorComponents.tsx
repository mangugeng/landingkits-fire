// import { Draggable } from 'react-beautiful-dnd';

export interface ComponentData {
  id: string;
  type: 'heading' | 'paragraph' | 'image' | 'button' | 'spacer' | 'form' | 'cta' | 'features' | 'testimonial' | 'pricing';
  content: string;
  props?: {
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    alignment?: 'left' | 'center' | 'right';
    backgroundColor?: string;
    textColor?: string;
    imageUrl?: string;
    imageAlt?: string;
    height?: number;
    description?: string;
    ctaText?: string;
    formFields?: Array<{
      type: 'text' | 'email' | 'textarea' | 'select';
      label: string;
      placeholder?: string;
      required?: boolean;
      options?: string[];
    }>;
    features?: Array<{
      title: string;
      description: string;
      icon?: string;
    }>;
    testimonials?: Array<{
      name: string;
      role: string;
      content: string;
      avatar?: string;
    }>;
    pricingPlans?: Array<{
      name: string;
      price: string;
      features: string[];
      ctaText: string;
      ctaLink: string;
      popular?: boolean;
    }>;
  };
}

interface ComponentProps {
  content: string;
  props?: ComponentData['props'];
}

export const HeadingComponent = ({ content, props }: ComponentProps) => {
  return (
    <div className="relative group">
      <h1 className={`text-4xl font-bold text-gray-900 ${props?.alignment ? `text-${props.alignment}` : ''}`}>
        {content}
      </h1>
    </div>
  );
};

export const ParagraphComponent = ({ content, props }: ComponentProps) => {
  return (
    <div className="relative group">
      <p className={`text-gray-600 ${props?.alignment ? `text-${props.alignment}` : ''}`}>
        {content}
      </p>
    </div>
  );
};

export const ImageComponent = ({ content, props }: ComponentProps) => {
  return (
    <div className="relative group">
      <img 
        src={content} 
        alt={props?.imageAlt || "Component"} 
        className="max-w-full h-auto rounded-lg" 
      />
    </div>
  );
};

export const ButtonComponent = ({ content, props }: ComponentProps) => {
  const getVariantClasses = (variant: string = 'primary') => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 text-white hover:bg-blue-700';
      case 'secondary':
        return 'bg-gray-600 text-white hover:bg-gray-700';
      case 'outline':
        return 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50';
      default:
        return 'bg-blue-600 text-white hover:bg-blue-700';
    }
  };

  return (
    <div className="relative group">
      <button className={`px-6 py-2 rounded-md ${getVariantClasses(props?.variant)}`}>
        {content}
      </button>
    </div>
  );
};

export const FormComponent = ({ content, props }: ComponentProps) => {
  return (
    <div className="relative group">
      <div className="w-full">
        <h3 className="text-lg font-medium mb-4">Form</h3>
        <div className="space-y-4">
          {props?.formFields?.map((field, i) => (
            <div key={i} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {field.label}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder={field.placeholder}
                  required={field.required}
                />
              ) : field.type === 'select' ? (
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required={field.required}
                >
                  {field.options?.map((option, j) => (
                    <option key={j} value={option}>{option}</option>
                  ))}
                </select>
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
        </div>
      </div>
    </div>
  );
};

export const CTAComponent = ({ content, props }: ComponentProps) => {
  return (
    <div className="relative group bg-gray-50 p-8 rounded-lg">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{content}</h2>
        {props?.description && (
          <p className="text-lg text-gray-600 mb-6">{props.description}</p>
        )}
        <button className={`px-6 py-3 rounded-md text-lg font-medium ${
          props?.variant === 'secondary' ? 'bg-gray-600 text-white hover:bg-gray-700' :
          props?.variant === 'outline' ? 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50' :
          'bg-blue-600 text-white hover:bg-blue-700'
        }`}>
          {props?.ctaText || 'Get Started'}
        </button>
      </div>
    </div>
  );
};

export const FeaturesComponent = ({ content, props }: ComponentProps) => {
  return (
    <div className="relative group py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">{content}</h2>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {props?.features?.map((feature, index) => (
            <div key={index} className="relative p-6 bg-white rounded-lg shadow-sm">
              {feature.icon && (
                <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                  </svg>
                </div>
              )}
              <h3 className="text-lg font-medium text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const TestimonialComponent = ({ content, props }: ComponentProps) => {
  return (
    <div className="relative group py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">{content}</h2>
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {props?.testimonials?.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                {testimonial.avatar && (
                  <img
                    className="h-12 w-12 rounded-full mr-4"
                    src={testimonial.avatar}
                    alt={testimonial.name}
                  />
                )}
                <div>
                  <h4 className="text-lg font-medium text-gray-900">{testimonial.name}</h4>
                  <p className="text-gray-500">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-600">{testimonial.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const PricingComponent = ({ content, props }: ComponentProps) => {
  return (
    <div className="relative group py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">{content}</h2>
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {props?.pricingPlans?.map((plan, index) => (
            <div
              key={index}
              className={`bg-white p-8 rounded-lg shadow-sm ${
                plan.popular ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              {plan.popular && (
                <span className="inline-block px-3 py-1 text-sm text-blue-600 bg-blue-100 rounded-full mb-4">
                  Most Popular
                </span>
              )}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <p className="text-4xl font-bold text-gray-900 mb-6">{plan.price}</p>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-3 px-4 rounded-md ${
                  plan.popular
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {plan.ctaText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const SpacerComponent = ({ content, props }: ComponentProps) => {
  return (
    <div 
      className="relative group" 
      style={{ height: props?.height ? `${props.height}px` : '40px' }}
    />
  );
} 