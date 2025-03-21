'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { db } from '../../../lib/firebase';
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Landing Pages</h1>
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <p className="text-gray-500">No landing pages found</p>
        </div>
      </div>
    </div>
  );
} 