"use client";

import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FiUsers, FiEye, FiTrendingUp, FiActivity, FiBarChart2, FiPieChart, FiGlobe } from 'react-icons/fi';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface LandingPage {
  id: string;
  title: string;
  description: string;
  slug: string;
  userId: string;
  content: any[];
  createdAt: string | { seconds: number; nanoseconds: number };
  updatedAt: { seconds: number; nanoseconds: number };
  status: 'draft' | 'published';
  hasUnpublishedChanges?: boolean;
  isFeatured?: boolean;
  analytics?: {
    views: number;
    conversions: number;
    visitors: number;
  };
  publishedAt?: string | { seconds: number; nanoseconds: number };
}

interface AnalyticsData {
  totalViews: number;
  totalConversions: number;
  conversionRate: number;
  viewsTrend: Array<{ date: string; views: number }>;
  conversionsByPage: Array<{ name: string; conversions: number }>;
  recentPages: Array<{
    title: string;
    views: number;
    conversions: number;
    conversionRate: number;
  }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function AnalyticsPage() {
  const router = useRouter();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalViews: 0,
    totalConversions: 0,
    conversionRate: 0,
    viewsTrend: [],
    conversionsByPage: [],
    recentPages: []
  });
  const [isLoading, setIsLoading] = useState(true);

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
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const pages = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as LandingPage[];

      // Hitung total views dan conversions
      const totalViews = pages.reduce((sum, page) => sum + (page.analytics?.views || 0), 0);
      const totalConversions = pages.reduce((sum, page) => sum + (page.analytics?.conversions || 0), 0);
      const conversionRate = totalViews > 0 ? (totalConversions / totalViews) * 100 : 0;

      // Generate views trend (7 hari terakhir)
      const today = new Date();
      const viewsTrend = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        return {
          date: date.toLocaleDateString('id-ID', { weekday: 'short' }),
          views: Math.floor(Math.random() * 100) // Untuk demo, nanti bisa diganti dengan data real
        };
      }).reverse();

      // Generate conversions by page
      const conversionsByPage = pages.map(page => ({
        name: page.title,
        conversions: page.analytics?.conversions || 0
      }));

      // Generate recent pages data
      const recentPages = pages.map(page => ({
        title: page.title,
        views: page.analytics?.views || 0,
        conversions: page.analytics?.conversions || 0,
        conversionRate: page.analytics?.views ? (page.analytics.conversions / page.analytics.views) * 100 : 0
      }));

      setAnalyticsData({
        totalViews,
        totalConversions,
        conversionRate,
        viewsTrend,
        conversionsByPage,
        recentPages
      });
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setIsLoading(false);
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
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="mt-1 text-sm text-gray-500">
              Pantau performa landing page Anda
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Views</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">{analyticsData.totalViews}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Conversions</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">{analyticsData.totalConversions}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Conversion Rate</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">{analyticsData.conversionRate.toFixed(2)}%</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Active Pages</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">{analyticsData.recentPages.length}</p>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Penjualan</TabsTrigger>
          <TabsTrigger value="users">Pengguna</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Views Trend</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData.viewsTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="views" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Conversions by Page</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.conversionsByPage}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="conversions" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Conversion Distribution</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analyticsData.conversionsByPage}
                      dataKey="conversions"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {analyticsData.conversionsByPage.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sales">
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Pages</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Judul
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Views
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Conversions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Conversion Rate
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {analyticsData.recentPages.map((page, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {page.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {page.views}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {page.conversions}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {page.conversionRate.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">User Growth</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData.viewsTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="views" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 