'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { toast } from 'react-hot-toast';
import { ComponentData } from '@/app/types/editor';
import { headers } from 'next/headers';
import { CheckIcon } from '@heroicons/react/24/outline';

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
        const pagesRef = collection(db, 'landing_pages');
        const q = query(
          pagesRef,
          where('slug', '==', params.slug),
          where('status', '==', 'published')
        );

        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          setPage({
            id: doc.id,
            ...doc.data()
          } as LandingPage);
        }
      } catch (error) {
        console.error('Error fetching page:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
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
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-gray-600">Halaman tidak ditemukan</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{page.title}</h1>
          <p className="text-xl text-gray-600">{page.description}</p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {page.content.map((component, index) => (
            <div key={component.id || index}>
              {renderComponent(component)}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          Dipublikasikan pada {new Date(page.lastUpdated).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      </div>
    </div>
  );
} 