'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { db, auth } from '../../../lib/firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import {
  ChartBarIcon,
  EyeIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ArrowUpIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

interface LandingPage {
  id: string;
  title: string;
  views: number;
  conversions: number;
  conversionRate: number;
  status: 'published' | 'draft';
}

interface AnalyticsData {
  totalViews: number;
  totalConversions: number;
  averageConversionRate: number;
  publishedPages: number;
  topPages: LandingPage[];
  viewsTrend: number;
  conversionsTrend: number;
}

export default function Analytics() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalViews: 0,
    totalConversions: 0,
    averageConversionRate: 0,
    publishedPages: 0,
    topPages: [],
    viewsTrend: 0,
    conversionsTrend: 0,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/auth');
        return;
      }
      fetchAnalyticsData(user.uid);
    });

    return () => unsubscribe();
  }, [router]);

  const fetchAnalyticsData = async (userId: string) => {
    try {
      const landingPagesRef = collection(db, 'landing_pages');
      const q = query(
        landingPagesRef,
        where('userId', '==', userId),
        orderBy('views', 'desc')
      );
      const querySnapshot = await getDocs(q);

      const pages = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        conversionRate: doc.data().views > 0 
          ? (doc.data().conversions / doc.data().views) * 100 
          : 0
      })) as LandingPage[];

      const totalViews = pages.reduce((sum, page) => sum + page.views, 0);
      const totalConversions = pages.reduce((sum, page) => sum + page.conversions, 0);
      const publishedPages = pages.filter(page => page.status === 'published').length;
      const averageConversionRate = totalViews > 0 
        ? (totalConversions / totalViews) * 100 
        : 0;

      setAnalyticsData({
        totalViews,
        totalConversions,
        averageConversionRate,
        publishedPages,
        topPages: pages.slice(0, 5),
        viewsTrend: 15.7,
        conversionsTrend: 8.2,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Gagal mengambil data analytics');
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  const formatPercentage = (num: number): string => {
    return num.toFixed(1) + '%';
  };

  return (
    <DashboardLayout>
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="mt-1 text-sm text-gray-500">Pantau performa landing page Anda</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {/* Total Views */}
            <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <EyeIcon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-sm font-medium text-gray-500">Total Views</h3>
                  <div className="mt-1 flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">
                      {formatNumber(analyticsData.totalViews)}
                    </p>
                    <p className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      <ArrowUpIcon className="self-center flex-shrink-0 h-4 w-4 text-green-500" />
                      <span className="sr-only">Increased by</span>
                      {analyticsData.viewsTrend}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Conversions */}
            <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <UserGroupIcon className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-sm font-medium text-gray-500">Total Conversions</h3>
                  <div className="mt-1 flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">
                      {formatNumber(analyticsData.totalConversions)}
                    </p>
                    <p className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      <ArrowUpIcon className="self-center flex-shrink-0 h-4 w-4 text-green-500" />
                      <span className="sr-only">Increased by</span>
                      {analyticsData.conversionsTrend}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Conversion Rate */}
            <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <ArrowTrendingUpIcon className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-sm font-medium text-gray-500">Conversion Rate</h3>
                  <div className="mt-1 flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">
                      {formatPercentage(analyticsData.averageConversionRate)}
                    </p>
                    <p className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      <ArrowUpIcon className="self-center flex-shrink-0 h-4 w-4 text-green-500" />
                      <span className="sr-only">Increased by</span>
                      2.1%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Published Pages */}
            <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="p-2 bg-yellow-50 rounded-lg">
                    <ChartBarIcon className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-sm font-medium text-gray-500">Published Pages</h3>
                  <div className="mt-1 flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">
                      {analyticsData.publishedPages}
                    </p>
                    <p className="ml-2 text-sm text-gray-500">aktif</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Pages Table */}
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-4 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Landing Page Terpopuler</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Judul
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Views
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Conversions
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Conversion Rate
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {analyticsData.topPages.map((page) => (
                    <tr key={page.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {page.title}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatNumber(page.views)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatNumber(page.conversions)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatPercentage(page.conversionRate)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </DashboardLayout>
  );
} 