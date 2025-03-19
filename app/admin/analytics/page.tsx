'use client';

import { useState } from 'react';
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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
        <div className="flex items-center space-x-2">
          <FiCalendar className="text-gray-500" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as '7d' | '30d' | '90d')}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="7d">7 hari terakhir</option>
            <option value="30d">30 hari terakhir</option>
            <option value="90d">90 hari terakhir</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Total Views"
          value={analytics.totalViews}
          icon="views"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Total Conversions"
          value={analytics.totalConversions}
          icon="conversions"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Average Time on Page"
          value={`${analytics.averageTimeOnPage}m`}
          icon="time"
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard
          title="Bounce Rate"
          value={`${analytics.bounceRate}%`}
          icon="bounce"
          trend={{ value: 3, isPositive: false }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopPages pages={analytics.topPages} />
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Traffic Sources</h3>
          <div className="space-y-4">
            {analytics.trafficSources.map((source) => (
              <div key={source.source}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{source.source}</span>
                  <span className="text-gray-900">{source.count} ({source.percentage}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${source.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 