'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import DashboardLayout from '../../../../components/dashboard/DashboardLayout';
import { db } from '../../../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { auth } from '../../../../lib/firebase';

export default function CreateLandingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [slug, setSlug] = useState('');

  // Fungsi untuk mengubah judul menjadi slug
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  // Update slug otomatis ketika judul berubah
  useEffect(() => {
    if (title && !slug) {
      setSlug(generateSlug(title));
    }
  }, [title, slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        router.push('/auth');
        return;
      }

      const landingPageData = {
        title,
        description,
        status: 'draft' as const,
        views: 0,
        conversions: 0,
        userId: user.uid,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        content: [],
        slug: slug || generateSlug(title)
      };

      const docRef = await addDoc(collection(db, 'landing_pages'), landingPageData);
      toast.success('Landing page berhasil dibuat');
      router.push(`/dashboard/editor/${docRef.id}`);
    } catch (error) {
      console.error('Error creating landing page:', error);
      toast.error('Gagal membuat landing page');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all">
          <div className="p-4 md:p-6">
            <div className="flex justify-between items-start md:items-center mb-4 md:mb-6">
              <div>
                <h2 className="text-lg md:text-xl font-semibold text-gray-900">Buat Landing Page Baru</h2>
                <p className="text-sm text-gray-500 mt-1">Buat landing page baru untuk memulai</p>
              </div>
              <button
                onClick={() => router.push('/dashboard/landingpage')}
                className="text-gray-400 hover:text-gray-500 transition-colors p-1"
              >
                <span className="sr-only">Tutup</span>
                <svg className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Judul Landing Page
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm transition-colors"
                  required
                  placeholder="Masukkan judul landing page"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm transition-colors"
                  placeholder="Masukkan deskripsi landing page"
                />
              </div>

              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                  URL Slug
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm transition-colors pr-24"
                    placeholder="custom-url-slug"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <button
                      type="button"
                      onClick={() => setSlug(generateSlug(title))}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Reset
                    </button>
                  </div>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  URL yang akan digunakan untuk mengakses landing page
                </p>
              </div>

              <div className="mt-4 md:mt-6 flex flex-col-reverse md:flex-row md:justify-end md:space-x-3 space-y-3 md:space-y-0">
                <button
                  type="button"
                  onClick={() => router.push('/dashboard/landingpage')}
                  className="w-full md:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full md:w-auto px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                >
                  {isLoading ? 'Membuat...' : 'Buat Landing Page'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 