'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { toast } from 'react-hot-toast';

interface LandingPage {
  id: string;
  title: string;
  description: string;
  content: string;
  status: 'draft' | 'published';
  userId: string;
  createdAt: string;
  updatedAt?: string;
  publishedAt: string | null;
  slug: string;
}

export default function PreviewPage() {
  const params = useParams();
  const [page, setPage] = useState<LandingPage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const pageRef = doc(db, 'landing_pages', params.id as string);
        const pageSnap = await getDoc(pageRef);

        if (!pageSnap.exists()) {
          toast.error('Halaman tidak ditemukan');
          return;
        }

        const pageData = pageSnap.data() as LandingPage;
        setPage({ ...pageData, id: pageSnap.id });
      } catch (error) {
        console.error('Error fetching page:', error);
        toast.error('Gagal memuat halaman');
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [params.id]);

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
          <h1 className="text-2xl font-bold text-gray-800">Halaman tidak ditemukan</h1>
          <p className="text-gray-600 mt-2">Halaman yang Anda cari tidak ada atau telah dihapus.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-4">
            <span className="inline-block px-3 py-1 text-sm font-semibold text-yellow-800 bg-yellow-100 rounded-full">
              Draft
            </span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{page.title}</h1>
          
          <p className="text-gray-600 mb-6">{page.description}</p>
          
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: page.content }} />
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Dibuat pada: {new Date(page.createdAt).toLocaleDateString('id-ID')}
            </p>
            {page.updatedAt && (
              <p className="text-sm text-gray-500">
                Terakhir diperbarui: {new Date(page.updatedAt).toLocaleDateString('id-ID')}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 