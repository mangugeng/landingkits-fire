'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { FiPlus, FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';
import { db } from '../../../lib/firebase';
import { collection, getDocs, deleteDoc, doc, query, orderBy, where, updateDoc } from 'firebase/firestore';
import {
  DocumentPlusIcon,
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ClockIcon,
  ArrowTopRightOnSquareIcon,
  DocumentIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { auth } from '../../../lib/firebase';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';

interface LandingPage {
  id: string;
  title: string;
  description: string;
  status: 'published' | 'draft';
  views: number;
  conversions: number;
  lastUpdated: string;
  createdAt: string;
  slug: string;
}

export default function LandingPages() {
  const router = useRouter();
  const [landingPages, setLandingPages] = useState<LandingPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/auth');
        return;
      }
      fetchLandingPages();
    });

    return () => unsubscribe();
  }, [router]);

  const fetchLandingPages = async () => {
    try {
      const landingPagesRef = collection(db, 'landing_pages');
      const q = query(
        landingPagesRef,
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const pages = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as LandingPage[];
      
      setLandingPages(pages);
    } catch (error) {
      console.error('Error fetching landing pages:', error);
      toast.error('Gagal memuat landing pages');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePage = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus landing page ini?')) return;

    try {
      setIsDeleting(true);
      await deleteDoc(doc(db, 'landing_pages', id));
      setLandingPages(prev => prev.filter(page => page.id !== id));
      toast.success('Landing page berhasil dihapus');
    } catch (error) {
      console.error('Error deleting landing page:', error);
      toast.error('Gagal menghapus landing page');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: 'published' | 'draft') => {
    try {
      const docRef = doc(db, 'landing_pages', id);
      await updateDoc(docRef, {
        status: newStatus,
        updatedAt: new Date()
      });
      
      setLandingPages(prev => prev.map(page => 
        page.id === id ? { ...page, status: newStatus } : page
      ));
      
      toast.success(`Landing page berhasil ${newStatus === 'published' ? 'dipublikasikan' : 'disimpan sebagai draft'}`);
    } catch (error) {
      console.error('Error updating landing page status:', error);
      toast.error('Gagal mengubah status landing page');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {/* Content */}
      {landingPages.length === 0 ? (
        <div className="text-center py-12">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada landing page</h3>
          <p className="mt-1 text-sm text-gray-500">
            Mulai buat landing page pertama Anda
          </p>
          <div className="mt-6">
            <Link
              href="/dashboard/landingpage/create"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <DocumentPlusIcon className="h-5 w-5 mr-2" />
              Buat Landing Page
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Create Button */}
          <div className="mb-6 flex justify-end">
            <Link
              href="/dashboard/landingpage/create"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <DocumentPlusIcon className="h-5 w-5 mr-2" />
              Buat Landing Page Baru
            </Link>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block">
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
                    Conversions
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Terakhir Diupdate
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
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
                        page.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {page.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {page.views}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {page.conversions}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(page.lastUpdated).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href={`/preview/${page.slug}`}
                          target="_blank"
                          className="text-blue-600 hover:text-blue-900"
                          title="Preview"
                        >
                          <EyeIcon className="w-5 h-5" />
                        </Link>
                        <Link
                          href={`/dashboard/editor/${page.slug}`}
                          className="text-gray-600 hover:text-gray-900"
                          title="Edit"
                        >
                          <PencilSquareIcon className="w-5 h-5" />
                        </Link>
                        <Link
                          href={`/${page.slug}`}
                          target="_blank"
                          className="text-green-600 hover:text-green-900"
                          title="Live View"
                        >
                          <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleStatusChange(page.id, page.status === 'published' ? 'draft' : 'published')}
                          className={`${page.status === 'published'
                              ? 'text-yellow-600 hover:text-yellow-900'
                              : 'text-green-600 hover:text-green-900'
                            }`}
                          title={page.status === 'published' ? 'Set as Draft' : 'Publish'}
                        >
                          {page.status === 'published' ? (
                            <DocumentIcon className="w-5 h-5" />
                          ) : (
                            <CheckCircleIcon className="w-5 h-5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDeletePage(page.id)}
                          disabled={isDeleting}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          title="Delete"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {landingPages.map((page) => (
              <div key={page.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{page.title}</h3>
                    <p className="text-sm text-gray-500">{page.description}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    page.status === 'published'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {page.status === 'published' ? 'Published' : 'Draft'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Views</p>
                    <p className="text-lg font-medium">{page.views}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Conversions</p>
                    <p className="text-lg font-medium">{page.conversions}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">Updated: {new Date(page.lastUpdated).toLocaleDateString()}</p>
                  <div className="flex gap-2">
                    <Link
                      href={`/preview/${page.slug}`}
                      target="_blank"
                      className="p-2 text-gray-600 hover:text-gray-900"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </Link>
                    <Link
                      href={`/dashboard/editor/${page.slug}`}
                      className="p-2 text-gray-600 hover:text-gray-900"
                    >
                      <PencilSquareIcon className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => handleDeletePage(page.id)}
                      className="p-2 text-red-600 hover:text-red-700"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}