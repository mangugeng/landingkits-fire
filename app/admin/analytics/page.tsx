'use client';

import { useEffect, useState } from 'react';
import { AnalyticsData } from '../types/analytics';
import StatCard from '../components/analytics/StatCard';
import TopPages from '../components/analytics/TopPages';
import { FiCalendar } from 'react-icons/fi';

// Data dummy untuk contoh
const dummyAnalytics: AnalyticsData = {
  totalViews: 15000,
  totalConversions: 750,
  conversionRate: 5,
  averageTimeOnPage: 2.5,
  bounceRate: 45,
  topPages: [
    {
      id: '1',
      title: 'Landing Page Produk A',
      views: 5000,
      conversions: 250,
      conversionRate: 5,
    },
    {
      id: '2',
      title: 'Landing Page Produk B',
      views: 3000,
      conversions: 150,
      conversionRate: 5,
    },
  ],
  trafficSources: [
    { source: 'Google', count: 8000, percentage: 53 },
    { source: 'Facebook', count: 4000, percentage: 27 },
    { source: 'Direct', count: 3000, percentage: 20 },
  ],
  dailyStats: [
    { date: '2024-03-20', views: 1000, conversions: 50 },
    { date: '2024-03-19', views: 900, conversions: 45 },
    { date: '2024-03-18', views: 800, conversions: 40 },
  ],
  deviceStats: [
    { device: 'Desktop', count: 9000, percentage: 60 },
    { device: 'Mobile', count: 6000, percentage: 40 },
  ],
  locationStats: [
    { location: 'Jakarta', count: 6000, percentage: 40 },
    { location: 'Surabaya', count: 4500, percentage: 30 },
    { location: 'Bandung', count: 4500, percentage: 30 },
  ],
};

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('7d');
  const analytics = dummyAnalytics;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Total Users</h2>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Active Users</h2>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Total Landing Pages</h2>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Total Revenue</h2>
          <p className="text-3xl font-bold">Rp 0</p>
        </div>
      </div>
    </div>
  );
} 