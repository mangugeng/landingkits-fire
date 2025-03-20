'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

interface LandingPage {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'published';
  views: number;
  conversions: number;
  lastUpdated: string;
}

export default function LandingPage() {
  const [landingPages, setLandingPages] = useState<LandingPage[]>([
    {
      id: '1',
      title: 'Landing Page Utama',
      description: 'Halaman utama untuk produk kami',
      status: 'published',
      views: 1234,
      conversions: 45,
      lastUpdated: '2024-03-20'
    },
    {
      id: '2',
      title: 'Promosi Produk Baru',
      description: 'Landing page untuk peluncuran produk baru',
      status: 'draft',
      views: 0,
      conversions: 0,
      lastUpdated: '2024-03-19'
    }
  ]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreatePage = async () => {
    if (!newPageTitle.trim()) {
      toast.error('Judul halaman tidak boleh kosong');
      return;
    }

    setIsLoading(true);
    try {
      // Simulasi API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newPage: LandingPage = {
        id: Date.now().toString(),
        title: newPageTitle,
        description: 'Deskripsi default',
        status: 'draft',
        views: 0,
        conversions: 0,
        lastUpdated: new Date().toISOString().split('T')[0]
      };

      setLandingPages(prev => [...prev, newPage]);
      setNewPageTitle('');
      setIsCreateModalOpen(false);
      toast.success('Landing page berhasil dibuat');
    } catch (error) {
      toast.error('Gagal membuat landing page');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePage = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus landing page ini?')) {
      return;
    }

    setIsLoading(true);
    try {
      // Simulasi API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setLandingPages(prev => prev.filter(page => page.id !== id));
      toast.success('Landing page berhasil dihapus');
    } catch (error) {
      toast.error('Gagal menghapus landing page');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Landing Pages</h1>
              <p className="mt-1 text-sm text-gray-500">
                Kelola semua landing page Anda
              </p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Buat Landing Page Baru
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Desktop Table */}
        <div className="hidden md:block">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Judul
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Views
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Konversi
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Terakhir Diupdate
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Aksi</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {landingPages.map((page) => (
                  <tr key={page.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{page.title}</div>
                      <div className="text-sm text-gray-500">{page.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        page.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {page.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {page.views.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {page.conversions.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(page.lastUpdated).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link href={`/landing/${page.id}/edit`} className="text-blue-600 hover:text-blue-900 mr-4">
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeletePage(page.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {landingPages.map((page) => (
            <div key={page.id} className="bg-white shadow rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{page.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{page.description}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  page.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {page.status === 'published' ? 'Published' : 'Draft'}
                </span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Views:</span>
                  <span className="ml-2 font-medium">{page.views.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-500">Konversi:</span>
                  <span className="ml-2 font-medium">{page.conversions.toLocaleString()}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500">Terakhir Diupdate:</span>
                  <span className="ml-2 font-medium">
                    {new Date(page.lastUpdated).toLocaleDateString('id-ID')}
                  </span>
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-3">
                <Link
                  href={`/landing/${page.id}/edit`}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDeletePage(page.id)}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Buat Landing Page Baru</h2>
            <div className="mb-4">
              <label htmlFor="page-title" className="block text-sm font-medium text-gray-700">
                Judul Landing Page
              </label>
              <input
                type="text"
                id="page-title"
                value={newPageTitle}
                onChange={(e) => setNewPageTitle(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Masukkan judul landing page"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Batal
              </button>
              <button
                onClick={handleCreatePage}
                disabled={isLoading}
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isLoading ? 'Membuat...' : 'Buat'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 