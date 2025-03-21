'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { toast } from 'react-hot-toast';

interface LandingPage {
  id: string;
  title: string;
  description: string;
  content: any;  // konten JSON dari database
  category: string;
  slug: string;
  conversionRate?: number;
  createdAt: string;
}

export default function PreviewPage() {
  const [landingPages, setLandingPages] = useState<LandingPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLandingPages = async () => {
      try {
        const pagesRef = collection(db, 'landing_pages');
        const q = query(
          pagesRef,
          where('status', '==', 'published')
        );

        const querySnapshot = await getDocs(q);
        const pages = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as LandingPage[];

        // Urutkan berdasarkan tanggal pembuatan terbaru
        pages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        setLandingPages(pages);
      } catch (error) {
        console.error('Error fetching landing pages:', error);
        toast.error('Gagal memuat data landing page');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLandingPages();
  }, []);

  // Fungsi untuk mengkonversi konten JSON menjadi HTML
  const renderContent = (content: any) => {
    if (!content) return '';

    // Fungsi rekursif untuk merender elemen
    const renderElement = (element: any): string => {
      if (!element) return '';

      // Jika elemen adalah string, kembalikan langsung
      if (typeof element === 'string') return element;

      // Jika elemen adalah array, render setiap item
      if (Array.isArray(element)) {
        return element.map(item => renderElement(item)).join('');
      }

      // Jika elemen adalah objek dengan properti type
      if (element.type) {
        const { type, props, content: elementContent } = element;
        
        // Filter props yang tidak valid untuk HTML
        const validProps = props ? Object.entries(props)
          .filter(([key]) => !['features', 'testimonials', 'formfields', 'pricingplans'].includes(key))
          .map(([key, value]) => `${key}="${value}"`)
          .join(' ') : '';

        const renderedContent = elementContent ? renderElement(elementContent) : '';

        // Tambahkan class default untuk styling berdasarkan tipe
        let defaultClass = '';
        let wrapperClass = '';
        switch (type) {
          case 'heading':
            defaultClass = 'text-4xl font-bold text-gray-900';
            wrapperClass = 'max-w-4xl mx-auto px-4 py-12';
            break;
          case 'paragraph':
            defaultClass = 'text-lg text-gray-600';
            wrapperClass = 'max-w-4xl mx-auto px-4 py-12';
            break;
          case 'image':
            defaultClass = 'w-full h-auto rounded-lg';
            wrapperClass = 'max-w-4xl mx-auto px-4 py-12';
            break;
          case 'button':
            defaultClass = `px-6 py-3 rounded-md text-white font-medium ${
              props?.variant === 'primary'
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-600 hover:bg-gray-700'
            }`;
            wrapperClass = 'max-w-4xl mx-auto px-4 py-12';
            break;
          case 'cta':
            defaultClass = 'p-8 bg-blue-600 text-white rounded-lg text-center';
            wrapperClass = 'max-w-4xl mx-auto px-4 py-12';
            break;
          case 'form':
            defaultClass = 'p-6 bg-gray-50 rounded-lg';
            wrapperClass = 'max-w-4xl mx-auto px-4 py-12';
            break;
          case 'features':
            defaultClass = 'grid grid-cols-1 md:grid-cols-3 gap-6';
            wrapperClass = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12';
            break;
          case 'testimonial':
            defaultClass = 'grid grid-cols-1 md:grid-cols-3 gap-6';
            wrapperClass = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12';
            break;
          case 'pricing':
            defaultClass = 'grid grid-cols-1 md:grid-cols-3 gap-6';
            wrapperClass = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12';
            break;
          default:
            defaultClass = 'w-full h-full';
            wrapperClass = 'max-w-4xl mx-auto px-4 py-12';
        }

        const className = props?.className ? `${props.className} ${defaultClass}` : defaultClass;

        return `
          <div class="${wrapperClass}">
            <${type} ${validProps} class="${className}">${renderedContent}</${type}>
          </div>
        `;
      }

      return '';
    };

    // Render konten utama
    const renderedContent = renderElement(content);
    return `
      <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        ${renderedContent}
      </div>
    `;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Kembali ke Beranda
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Inspirasi Landing Page
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Kumpulan landing page berkualitas tinggi untuk inspirasi desain Anda
            </p>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : landingPages.length > 0 ? (
          <div className="relative">
            {/* Scroll Indicator - Mobile Only */}
            <div className="md:hidden absolute right-0 top-0 z-10 bg-gradient-to-l from-gray-50 via-gray-50/80 to-transparent w-24 h-full">
            </div>
            
            <div className="flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 pb-4 md:pb-0 snap-x snap-mandatory">
              {landingPages.map((page) => (
                <div key={page.id} className="flex-none w-[85vw] md:w-auto bg-white rounded-lg shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 snap-center">
                  <div className="relative h-64 overflow-hidden bg-gray-50">
                    <div 
                      className="absolute inset-0 w-[250%] h-[250%] transform scale-[0.4] origin-top-left overflow-auto"
                      dangerouslySetInnerHTML={{ __html: renderContent(page.content) }}
                    />
                    {page.conversionRate && (
                      <div className="absolute top-4 left-4 z-10">
                        <span className="px-3 py-1 bg-green-600 text-white text-sm rounded-full">
                          {page.conversionRate}% Konversi
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {page.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {page.description}
                    </p>
                    <a
                      href={`https://${page.slug}.landingkits.com`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white hover:bg-gray-50 transition-colors duration-200 shadow-md"
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              Belum ada landing page yang tersedia. Silakan cek kembali nanti.
            </p>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Siap Membuat Landing Page Anda?
            </h2>
            <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
              Mulai buat landing page profesional Anda sendiri dengan LandingKits
            </p>
            <Link
              href="/auth"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 md:py-4 md:text-lg md:px-10"
            >
              Mulai Sekarang
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 