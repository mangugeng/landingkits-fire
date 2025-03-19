'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { toast } from 'react-hot-toast';
import { ComponentData } from '../components/EditorComponents';

interface LandingPage {
  id: string;
  title: string;
  description: string;
  content: ComponentData[];
  status: 'draft' | 'published';
  userId: string;
  createdAt: string;
  updatedAt?: string;
  publishedAt: string | null;
  slug: string;
}

export default function PublicPage() {
  const params = useParams();
  const [page, setPage] = useState<LandingPage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
        const pagesRef = collection(db, 'landing_pages');
        const q = query(pagesRef, where('slug', '==', slug), where('status', '==', 'published'));
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
            >
              {component.content}
            </button>
          </div>
        );
      case 'form':
        return (
          <div className="mb-4 p-6 bg-gray-50 rounded-lg">
            <form className="space-y-4">
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
            <button className="mt-4 px-6 py-2 bg-white text-blue-600 rounded-md hover:bg-gray-100">
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full px-4 py-2 rounded-md ${
                    plan.popular
                      ? 'bg-white text-blue-600 hover:bg-gray-100'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Halaman Tidak Ditemukan</h1>
          <p className="text-gray-600">Halaman yang Anda cari tidak ada atau belum dipublikasikan.</p>
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
          Dipublikasikan pada {new Date(page.publishedAt || '').toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      </div>
    </div>
  );
} 