import React from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface ComponentData {
  id: string;
  type: 'heading' | 'paragraph' | 'image' | 'button' | 'form' | 'cta' | 'features' | 'testimonial' | 'pricing' | 'spacer';
  content: string;
  props?: {
    text?: string;
    level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    src?: string;
    alt?: string;
    link?: string;
    style?: 'primary' | 'secondary' | 'outline';
    height?: number;
    formFields?: Array<{
      type: 'text' | 'email' | 'textarea';
      label: string;
      placeholder: string;
      required: boolean;
    }>;
    features?: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
    testimonials?: Array<{
      name: string;
      role: string;
      content: string;
      avatar: string;
    }>;
    pricingPlans?: Array<{
      name: string;
      price: string;
      features: string[];
      ctaText: string;
      ctaLink: string;
      popular: boolean;
    }>;
  };
}

interface ComponentRendererProps {
  component: ComponentData;
  onSelect: (component: ComponentData) => void;
  onDelete: (id: string) => void;
  onMoveUp?: (id: string) => void;
  onMoveDown?: (id: string) => void;
}

const getComponentIcon = (type: ComponentData['type']) => {
  switch (type) {
    case 'heading':
      return <h1 className="w-6 h-6 text-gray-600" />;
    case 'paragraph':
      return <p className="w-6 h-6 text-gray-600" />;
    case 'image':
      return <img className="w-6 h-6 text-gray-600" alt="" />;
    case 'button':
      return <button className="w-6 h-6 text-gray-600" />;
    case 'spacer':
      return <div className="w-6 h-6 text-gray-600" />;
    default:
      return <div className="w-6 h-6 text-gray-600" />;
  }
};

export default function ComponentRenderer({ component, onSelect, onDelete, onMoveUp, onMoveDown }: ComponentRendererProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect(component);
  };

  const handleMoveUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMoveUp?.(component.id);
  };

  const handleMoveDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMoveDown?.(component.id);
  };

  const renderContent = () => {
    switch (component.type) {
      case 'heading':
        return (
          <div className={`${component.props?.level === 'h1' ? 'text-4xl' : 
            component.props?.level === 'h2' ? 'text-3xl' : 
            component.props?.level === 'h3' ? 'text-2xl' : 
            component.props?.level === 'h4' ? 'text-xl' : 
            component.props?.level === 'h5' ? 'text-lg' : 
            'text-base'} font-bold text-gray-900`}>
            {component.content}
          </div>
        );

      case 'paragraph':
        return (
          <p className="text-base text-gray-600 leading-relaxed">
            {component.content}
          </p>
        );

      case 'image':
        return (
          <img 
            src={component.props?.src || component.content} 
            alt={component.props?.alt || ''} 
            className="w-full h-auto rounded-lg shadow-sm" 
          />
        );

      case 'button':
        return (
          <button 
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              component.props?.style === 'primary' ? 'bg-blue-600 text-white hover:bg-blue-700' :
              component.props?.style === 'secondary' ? 'bg-gray-600 text-white hover:bg-gray-700' :
              'border-2 border-gray-300 text-gray-700 hover:border-gray-400'
            }`}
          >
            {component.content}
          </button>
        );

      case 'form':
        return (
          <div className="space-y-4 bg-white p-6 rounded-lg border border-gray-200">
            {component.props?.formFields?.map((field, index) => (
              <div key={index} className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    rows={4}
                  />
                ) : (
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                )}
              </div>
            ))}
            <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Submit
            </button>
          </div>
        );

      case 'features':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {component.props?.features?.map((feature, index) => (
              <div key={index} className="p-6 bg-white rounded-lg border border-gray-200">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        );

      case 'testimonial':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {component.props?.testimonials?.map((testimonial, index) => (
              <div key={index} className="p-6 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center mb-4">
                  <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full" />
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        );

      case 'pricing':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {component.props?.pricingPlans?.map((plan, index) => (
              <div key={index} className={`p-6 bg-white rounded-lg border-2 ${plan.popular ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-50' : 'border-gray-200'}`}>
                {plan.popular && (
                  <span className="inline-block px-3 py-1 text-sm text-blue-600 bg-blue-50 rounded-full mb-4">
                    Popular
                  </span>
                )}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-3xl font-bold text-gray-900 mb-4">{plan.price}</p>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <a
                  href={plan.ctaLink}
                  className={`block w-full px-6 py-3 text-center rounded-lg font-medium transition-colors ${
                    plan.popular ? 'bg-blue-600 text-white hover:bg-blue-700' : 'border-2 border-gray-300 text-gray-700 hover:border-gray-400'
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
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">{component.content}</h2>
            <button className="px-8 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              Get Started
            </button>
          </div>
        );

      case 'spacer':
        return (
          <div style={{ height: component.props?.height || 20 }} />
        );

      default:
        return null;
    }
  };
  
  return (
    <div className="flex items-center">
      <div className="flex flex-col space-y-1 mr-2">
        <button
          onClick={handleMoveUp}
          className="p-1 text-gray-400 hover:text-blue-500 rounded-lg hover:bg-blue-50 transition-colors"
          title="Pindahkan ke atas"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
        <button
          onClick={handleMoveDown}
          className="p-1 text-gray-400 hover:text-blue-500 rounded-lg hover:bg-blue-50 transition-colors"
          title="Pindahkan ke bawah"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      <div 
        onClick={handleClick}
        className="flex-1 relative group cursor-pointer p-4 border border-gray-200 rounded-lg hover:border-blue-500 transition-colors"
      >
        <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-5 transition-opacity rounded-lg" />
        <div className="relative">
          <div className="flex items-center justify-between">
            <div>
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 