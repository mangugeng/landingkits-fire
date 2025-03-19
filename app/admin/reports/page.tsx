'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface AnalyticsData {
  date: string;
  visitors: number;
  pageViews: number;
  bounceRate: number;
  avgSessionDuration: number;
  conversionRate: number;
}

export default function ReportsPage() {
  const router = useRouter();
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'custom'>('30d');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const isLoggedIn = Cookies.get('admin_login');
    if (!isLoggedIn) {
      router.push('/auth/login');
      return;
    }
  }, [router]);

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/analytics?startDate=${startDate}&endDate=${endDate}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }

      const data = await response.json();
      setAnalyticsData(data);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      setError('Gagal mengambil data analytics. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateRangeChange = (range: '7d' | '30d' | '90d' | 'custom') => {
    setDateRange(range);
    if (range !== 'custom') {
      const end = new Date();
      const start = new Date();
      switch (range) {
        case '7d':
          start.setDate(start.getDate() - 7);
          break;
        case '30d':
          start.setDate(start.getDate() - 30);
          break;
        case '90d':
          start.setDate(start.getDate() - 90);
          break;
      }
      setStartDate(start.toISOString().split('T')[0]);
      setEndDate(end.toISOString().split('T')[0]);
    }
  };

  return (
    <div className="space-y-6 p-4">
      <div className="bg-white p-4 md:p-6 rounded-lg shadow">
        <div className="space-y-6">
          {/* Date Range Selector */}
          <div className="flex flex-col space-y-4">
            <label className="text-lg font-medium">Rentang Waktu:</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['7d', '30d', '90d', 'custom'].map((range) => (
                <button
                  key={range}
                  onClick={() => setDateRange(range as '7d' | '30d' | '90d' | 'custom')}
                  className={`py-3 px-4 text-center rounded-lg border-2 text-base ${
                    dateRange === range
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-gray-200 text-gray-600'
                  } touch-manipulation`}
                >
                  {range === '7d' && '7 Hari'}
                  {range === '30d' && '30 Hari'}
                  {range === '90d' && '90 Hari'}
                  {range === 'custom' && 'Kustom'}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Date Range */}
          {dateRange === 'custom' && (
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Mulai
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent touch-manipulation"
                  style={{
                    minHeight: '48px',
                    fontSize: '16px'
                  }}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Akhir
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent touch-manipulation"
                  style={{
                    minHeight: '48px',
                    fontSize: '16px'
                  }}
                />
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={fetchAnalyticsData}
            disabled={isLoading || !startDate || !endDate}
            className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center min-h-[48px] touch-manipulation"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Memuat...
              </>
            ) : (
              'Tampilkan Data'
            )}
          </button>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 text-base rounded-lg">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Analytics Data Display */}
      {analyticsData.length > 0 && (
        <div className="bg-white p-4 md:p-6 rounded-lg shadow overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="py-3 px-4 text-left">Tanggal</th>
                <th className="py-3 px-4 text-right">Pengunjung</th>
                <th className="py-3 px-4 text-right">Tampilan</th>
                <th className="py-3 px-4 text-right">Bounce Rate</th>
                <th className="py-3 px-4 text-right">Durasi</th>
                <th className="py-3 px-4 text-right">Konversi</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.map((data, index) => (
                <tr key={index} className="border-b">
                  <td className="py-3 px-4">{data.date}</td>
                  <td className="py-3 px-4 text-right">{data.visitors}</td>
                  <td className="py-3 px-4 text-right">{data.pageViews}</td>
                  <td className="py-3 px-4 text-right">{data.bounceRate}%</td>
                  <td className="py-3 px-4 text-right">{Math.round(data.avgSessionDuration / 60)}m</td>
                  <td className="py-3 px-4 text-right">{data.conversionRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 