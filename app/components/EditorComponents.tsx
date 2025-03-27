'use client';

import React from 'react';
import { ComponentData } from '../types/editor';
import { CheckIcon } from '@heroicons/react/24/outline';

export const HeadingComponent = ({ content, props }: { content: string; props?: ComponentData['props'] }) => {
  const level = props?.level || 'h1';
  const text = props?.text || content;
  
  return React.createElement(level, {
    className: 'text-4xl font-bold text-gray-900 mb-4',
  }, text);
};

export const ParagraphComponent = ({ content, props }: { content: string; props?: ComponentData['props'] }) => {
  return (
    <p className="text-gray-600 mb-4">
      {props?.text || content}
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
  const style = (props?.style as 'primary' | 'secondary' | 'outline') || 'primary';
  const text = props?.text || content;
  const link = props?.link || '#';
  
  const baseStyles = 'px-6 py-2 rounded-md font-medium transition-colors';
  const styles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
  };
  
  return (
    <a
      href={link}
      className={`${baseStyles} ${styles[style]} mb-4 inline-block`}
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
} as const; 