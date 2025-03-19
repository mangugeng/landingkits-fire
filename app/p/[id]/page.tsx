'use client';

import { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface LandingPage {
  id: string;
  title: string;
  description: string;
  content: any;
  status: 'draft' | 'published';
  userId: string;
  createdAt: string;
  updatedAt?: string;
  publishedAt?: string;
}

export default function PublicPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<LandingPage | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const docRef = doc(db, 'landing_pages', params.id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data() as LandingPage;
          if (data.status !== 'published') {
            setError('Halaman ini belum dipublikasikan');
            setLoading(false);
            return;
          }
          setPage(data);
        } else {
          setError('Halaman tidak ditemukan');
        }
      } catch (error) {
        console.error('Error fetching page:', error);
        setError('Terjadi kesalahan saat memuat halaman');
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Halaman tidak ditemukan</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-gray-900">{page.title}</h1>
          <p className="mt-2 text-gray-600">{page.description}</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="prose prose-lg max-w-none">
          {page.content}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-500 text-sm">
            <p>Dipublikasikan pada {new Date(page.publishedAt || '').toLocaleDateString('id-ID')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 