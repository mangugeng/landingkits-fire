'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { db } from '../../lib/firebase';
import { collection, getDocs, query, orderBy, where, limit } from 'firebase/firestore';
import { 
  BellIcon,
  CreditCardIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ArrowTrendingUpIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  EyeIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { auth } from '../../lib/firebase';
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

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  type: 'info' | 'warning' | 'success';
}

export default function Dashboard() {
  const [landingPages, setLandingPages] = useState<LandingPage[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: '1',
      title: 'Fitur Baru: Analytics Dashboard',
      content: 'Kami telah menambahkan fitur analytics dashboard untuk membantu Anda melacak performa landing page dengan lebih baik.',
      date: '2024-03-20',
      type: 'info'
    },
    {
      id: '2',
      title: 'Pemeliharaan Sistem',
      content: 'Akan ada pemeliharaan sistem pada tanggal 25 Maret 2024 pukul 02:00 - 04:00 WIB.',
      date: '2024-03-19',
      type: 'warning'
    }
  ]);
  const [isLoading, setIsLoading] = useState(true);
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
        orderBy('views', 'desc'),
        limit(5)
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

  const getAnnouncementIcon = (type: Announcement['type']) => {
    switch (type) {
      case 'info':
        return <BellIcon className="w-5 h-5 text-blue-500" />;
      case 'warning':
        return <ExclamationCircleIcon className="w-5 h-5 text-yellow-500" />;
      case 'success':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      default:
        return <BellIcon className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Selamat datang kembali! Berikut ringkasan aktivitas Anda.</p>
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

        {/* Desktop Content */}
        <div className="hidden md:block">
          {/* Subscription Status */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CreditCardIcon className="w-6 h-6 text-blue-600 mr-3" />
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Status Langganan</h2>
                  <p className="text-sm text-gray-600">Pro Plan - Berakhir pada 31 Desember 2024</p>
                </div>
              </div>
              <Link
                href="/dashboard/settings/billing"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Kelola Langganan
              </Link>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">75% dari kuota landing page Anda telah digunakan</p>
            </div>
          </div>

          {/* Announcements */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Pengumuman Terbaru</h2>
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  {getAnnouncementIcon(announcement.type)}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{announcement.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{announcement.content}</p>
                    <p className="text-xs text-gray-500 mt-1">{announcement.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Landing Pages */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Landing Page Terpopuler</h2>
              <Link
                href="/dashboard/landingpage"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Lihat Semua
              </Link>
            </div>
            <div className="space-y-4">
              {landingPages.map((page) => (
                <div key={page.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{page.title}</h3>
                    <p className="text-xs text-gray-500">{page.views} views</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      page.status === 'published' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {page.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                    <Link
                      href={`/dashboard/editor/${page.slug}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Content */}
        <div className="md:hidden space-y-4">
          {/* Mobile Announcements */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Pengumuman Terbaru</h2>
            <div className="space-y-3">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  {getAnnouncementIcon(announcement.type)}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{announcement.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{announcement.content}</p>
                    <p className="text-xs text-gray-500 mt-1">{announcement.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Popular Pages */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-900">Landing Page Terpopuler</h2>
              <Link
                href="/dashboard/landingpage"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Lihat Semua
              </Link>
            </div>
            <div className="space-y-3">
              {landingPages.map((page) => (
                <div key={page.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{page.title}</h3>
                    <p className="text-xs text-gray-500">{page.views} views</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      page.status === 'published' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {page.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                    <Link
                      href={`/dashboard/editor/${page.slug}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 