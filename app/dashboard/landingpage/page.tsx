'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
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

export default function DashboardLandingPage() {
  const [landingPages, setLandingPages] = useState<LandingPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

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
      const user = auth.currentUser;
      if (!user) {
        router.push('/auth');
        return;
      }

      const landingPagesRef = collection(db, 'landing_pages');
      const q = query(
        landingPagesRef, 
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      const pages = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        lastUpdated: doc.data().lastUpdated?.toDate?.()?.toLocaleDateString('id-ID') || new Date().toLocaleDateString('id-ID'),
        createdAt: doc.data().createdAt?.toDate?.()?.toLocaleDateString('id-ID') || new Date().toLocaleDateString('id-ID')
      })) as LandingPage[];

      setLandingPages(pages);
    } catch (error) {
      console.error('Error fetching landing pages:', error);
      toast.error('Gagal mengambil data landing page');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePage = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus landing page ini?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'landing_pages', id));
      setLandingPages(landingPages.filter(page => page.id !== id));
      toast.success('Landing page berhasil dihapus');
    } catch (error) {
      console.error('Error deleting landing page:', error);
      toast.error('Gagal menghapus landing page');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async (pageId: string, newStatus: 'draft' | 'published') => {
    try {
      const pageRef = doc(db, 'landing_pages', pageId);
      await updateDoc(pageRef, {
        status: newStatus,
        lastUpdated: new Date().toISOString()
      });
      
      toast.success(`Landing page berhasil diubah ke status ${newStatus === 'published' ? 'Published' : 'Draft'}`);
      fetchLandingPages();
    } catch (error) {
      console.error('Error updating page status:', error);
      toast.error('Gagal mengubah status landing page');
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Landing Pages</h1>
            <p className="text-gray-600 mt-1">Kelola semua landing page Anda</p>
          </div>
          <Link
            href="/dashboard/landingpage/create"
            className="w-full md:w-auto inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mt-4 md:mt-0"
          >
            <DocumentPlusIcon className="w-5 h-5 mr-2" />
            Buat Landing Page Baru
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DocumentTextIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Landing Pages</p>
                <p className="text-2xl font-semibold text-gray-900">{landingPages.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <EyeIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Views</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {landingPages.reduce((sum, page) => sum + page.views, 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <ChartBarIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Conversions</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {landingPages.reduce((sum, page) => sum + page.conversions, 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <ClockIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Pages Published</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {landingPages.filter(page => page.status === 'published').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Grid Menu */}
        <div className="md:hidden grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow">
            <DocumentTextIcon className="w-8 h-8 text-blue-600 mb-2" />
            <span className="text-sm text-gray-700">Total: {landingPages.length}</span>
          </div>
          <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow">
            <EyeIcon className="w-8 h-8 text-green-600 mb-2" />
            <span className="text-sm text-gray-700">Views: {landingPages.reduce((sum, page) => sum + page.views, 0)}</span>
          </div>
          <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow">
            <ChartBarIcon className="w-8 h-8 text-purple-600 mb-2" />
            <span className="text-sm text-gray-700">Conversions: {landingPages.reduce((sum, page) => sum + page.conversions, 0)}</span>
          </div>
          <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow">
            <CheckCircleIcon className="w-8 h-8 text-green-600 mb-2" />
            <span className="text-sm text-gray-700">Published: {landingPages.filter(page => page.status === 'published').length}</span>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Judul
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Views
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Conversions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Terakhir Diupdate
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
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
                        {page.lastUpdated}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          <Link
                            href={`/dashboard/editor/${page.slug}`}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit"
                          >
                            <PencilSquareIcon className="w-5 h-5" />
                          </Link>
                          <Link
                            href={`/preview/${page.slug}`}
                            className="text-purple-600 hover:text-purple-900"
                            title="Preview"
                          >
                            <EyeIcon className="w-5 h-5" />
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
                            className={`${
                              page.status === 'published' 
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
                    <p className="text-sm text-gray-500">Updated: {page.lastUpdated}</p>
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
    </DashboardLayout>
  );
}