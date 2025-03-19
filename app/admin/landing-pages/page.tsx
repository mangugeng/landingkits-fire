'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, doc, getDoc, DocumentData } from 'firebase/firestore';
import { LandingPage } from '../types/landing-page';

interface UserData extends DocumentData {
  email: string;
}

export default function LandingPagesPage() {
  const router = useRouter();
  const [landingPages, setLandingPages] = useState<LandingPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const isLoggedIn = Cookies.get('admin_login');
    if (!isLoggedIn) {
      router.push('/auth/login');
      return;
    }

    const fetchLandingPages = async () => {
      try {
        const landingPagesRef = collection(db, 'landing_pages');
        const q = query(landingPagesRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const pages: LandingPage[] = [];
        for (const docSnapshot of querySnapshot.docs) {
          const data = docSnapshot.data();
          // Ambil data user dari koleksi users
          const userDoc = await getDoc(doc(db, 'users', data.userId));
          const userData = userDoc.data() as UserData;
          
          pages.push({
            id: docSnapshot.id,
            ...data,
            userEmail: userData?.email || 'N/A'
          } as LandingPage);
        }

        setLandingPages(pages);
      } catch (error) {
        console.error('Error fetching landing pages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLandingPages();
  }, [router]);

  const handleCreatePage = () => {
    router.push('/admin/landing-pages/create');
  };

  const handleEditPage = (id: string) => {
    router.push(`/admin/landing-pages/${id}/edit`);
  };

  const handleDeletePage = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus halaman ini?')) {
      return;
    }

    try {
      // TODO: Implement delete functionality
      console.log('Deleting page:', id);
    } catch (error) {
      console.error('Error deleting page:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Landing Pages</h1>
        <button
          onClick={handleCreatePage}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Buat Halaman Baru
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Judul
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pemilik
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pengunjung
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Konversi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dibuat
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
                  <div className="text-sm text-gray-500">{page.url}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{page.userName}</div>
                  <div className="text-xs text-gray-500">{page.userEmail}</div>
                  <div className="text-xs text-gray-400">{page.userId}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    page.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {page.status === 'published' ? 'Dipublikasi' : 'Draft'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {page.analytics?.visitors || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {page.analytics?.conversionRate || 0}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(page.createdAt).toLocaleDateString('id-ID')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEditPage(page.id)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edit
                  </button>
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
  );
} 