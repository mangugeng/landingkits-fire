'use client';

import { useEffect, useState } from 'react';
import { collection, doc, onSnapshot, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';
import { AnalyticsData } from '@/app/types/analytics';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Timestamp } from 'firebase/firestore';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

interface VisitMetadata {
  device: string;
  os: string;
  browser: string;
  screenSize: string;
  location: {
    country: string;
    city: string;
    region: string;
  };
}

interface Visit {
  timestamp: {
    seconds: number;
    nanoseconds: number;
  } | string;
  type: string;
  metadata: VisitMetadata;
}

interface Demographics {
  ageGroups: Record<string, number>;
  gender: Record<string, number>;
  interests: Record<string, number>;
}

interface Locations {
  cities: Record<string, number>;
  countries: Record<string, number>;
}

interface Analytics {
  views: number;
  visitors: number;
  conversions: number;
  lastVisit: {
    seconds: number;
    nanoseconds: number;
  } | string;
  visitHistory: Visit[];
  demographics?: Demographics;
  devices?: Record<string, number>;
  operatingSystems?: Record<string, number>;
  locations?: Locations;
  storage?: {
    used: number;
    total: number;
  };
  traffic?: {
    used: number;
    total: number;
  };
}

interface AnalyticsDashboardProps {
  analyticsData: {
    analytics: Analytics;
  };
}

function formatDate(timestamp: Timestamp | Date | string) {
  if (!timestamp) return 'Unknown';
  
  const date = timestamp instanceof Timestamp 
    ? timestamp.toDate() 
    : new Date(timestamp);
    
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Jakarta'
  }).format(date);
}

export default function AnalyticsDashboard({ analyticsData }: AnalyticsDashboardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    console.log('Analytics Data:', analyticsData);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [analyticsData]);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    if (typeof timestamp === 'object' && 'seconds' in timestamp) {
      return new Date(timestamp.seconds * 1000).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    return new Date(timestamp).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeRangeData = () => {
    const now = new Date();
    const visits = analyticsData?.analytics?.visitHistory || [];
    
    return visits.filter(visit => {
      const visitDate = visit.timestamp && typeof visit.timestamp === 'object' && 'seconds' in visit.timestamp
        ? new Date(visit.timestamp.seconds * 1000)
        : new Date(visit.timestamp);
      const diffHours = (now.getTime() - visitDate.getTime()) / (1000 * 60 * 60);
      
      switch (timeRange) {
        case '24h':
          return diffHours <= 24;
        case '7d':
          return diffHours <= 168;
        case '30d':
          return diffHours <= 720;
        default:
          return true;
      }
    });
  };

  const timeRangeData = getTimeRangeData();
  const views = timeRangeData.filter(visit => visit.type === 'view').length;
  const conversions = timeRangeData.filter(visit => visit.type === 'conversion').length;
  const conversionRate = views > 0 ? (conversions / views) * 100 : 0;

  // Fungsi untuk mendapatkan data yang sudah diurutkan dan dipaginasi
  const getPaginatedVisitHistory = () => {
    const sortedVisits = [...(analyticsData.analytics.visitHistory || [])].sort((a, b) => {
      const dateA = a.timestamp && typeof a.timestamp === 'object' && 'seconds' in a.timestamp
        ? new Date(a.timestamp.seconds * 1000)
        : new Date(a.timestamp);
      const dateB = b.timestamp && typeof b.timestamp === 'object' && 'seconds' in b.timestamp
        ? new Date(b.timestamp.seconds * 1000)
        : new Date(b.timestamp);
      return dateB.getTime() - dateA.getTime(); // Urutkan dari yang terbaru
    });

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedVisits.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil((analyticsData.analytics.visitHistory?.length || 0) / itemsPerPage);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!analyticsData || !analyticsData.analytics || !analyticsData.analytics.visitHistory) {
    return (
      <div className="text-center text-gray-500 py-8">
        Belum ada data analytics
      </div>
    );
  }

  console.log('Analytics Data:', analyticsData);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Views</h3>
          <p className="text-2xl font-bold">{analyticsData.analytics.views || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Unique Visitors</h3>
          <p className="text-2xl font-bold">{analyticsData.analytics.visitors || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Conversion Rate</h3>
          <p className="text-2xl font-bold">{conversionRate.toFixed(1)}%</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Last Visit</h3>
          <p className="text-2xl font-bold">
            {analyticsData.analytics.lastVisit ? formatDate(analyticsData.analytics.lastVisit) : 'N/A'}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Storage Usage</h3>
          <p className="text-2xl font-bold">
            {analyticsData.analytics.storage ? 
              `${(analyticsData.analytics.storage.used / 1024 / 1024).toFixed(2)} MB / ${(analyticsData.analytics.storage.total / 1024 / 1024).toFixed(2)} MB` : 
              'N/A'}
          </p>
          {analyticsData.analytics.storage && (
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{
                  width: `${(analyticsData.analytics.storage.used / analyticsData.analytics.storage.total) * 100}%`
                }}
              />
            </div>
          )}
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Traffic Usage</h3>
          <p className="text-2xl font-bold">
            {analyticsData.analytics.traffic ? 
              `${(analyticsData.analytics.traffic.used / 1024 / 1024).toFixed(2)} MB / ${(analyticsData.analytics.traffic.total / 1024 / 1024).toFixed(2)} MB` : 
              'N/A'}
          </p>
          {analyticsData.analytics.traffic && (
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{
                  width: `${(analyticsData.analytics.traffic.used / analyticsData.analytics.traffic.total) * 100}%`
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Views Trend */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Views Trend</h2>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as '24h' | '7d' | '30d')}
            className="border rounded px-2 py-1"
          >
            <option value="24h">24 Hours</option>
            <option value="7d">7 Days</option>
            <option value="30d">30 Days</option>
          </select>
        </div>
        <div className="h-[300px]">
          <Line
            data={{
              labels: Array.from({ length: timeRange === '24h' ? 24 : timeRange === '7d' ? 7 : 30 }, (_, i) => 
                timeRange === '24h' ? `${i}:00` : 
                timeRange === '7d' ? `${i + 1} days ago` : 
                `${i + 1} days ago`
              ),
              datasets: [
                {
                  label: 'Views',
                  data: Array.from({ length: timeRange === '24h' ? 24 : timeRange === '7d' ? 7 : 30 }, (_, i) => {
                    const date = new Date();
                    date.setHours(date.getHours() - (timeRange === '24h' ? i : timeRange === '7d' ? i * 24 : i * 24));
                    return timeRangeData.filter(visit => {
                      const visitDate = visit.timestamp && typeof visit.timestamp === 'object' && 'seconds' in visit.timestamp
                        ? new Date(visit.timestamp.seconds * 1000)
                        : new Date(visit.timestamp);
                      return visitDate.getHours() === date.getHours() && 
                             visitDate.getDate() === date.getDate() &&
                             visitDate.getMonth() === date.getMonth() &&
                             visitDate.getFullYear() === date.getFullYear();
                    }).length;
                  }),
                  borderColor: 'rgb(59, 130, 246)',
                  tension: 0.1
                }
              ]
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1
                  }
                }
              }
            }}
          />
        </div>
      </div>

      {/* Demographics */}
      {analyticsData.analytics.demographics && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Demographics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Age Distribution */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Age Distribution</h3>
              <div className="space-y-2">
                {Object.entries(analyticsData.analytics.demographics?.ageGroups || {}).map(([age, count]) => (
                  <div key={age} className="flex items-center">
                    <div className="w-20 text-sm">{age}</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{
                          width: `${(Number(count) / Object.values(analyticsData.analytics.demographics?.ageGroups || {}).reduce((a, b) => a + b, 0)) * 100}%`
                        }}
                      />
                    </div>
                    <div className="w-12 text-sm text-right">{count}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gender Distribution */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Gender Distribution</h3>
              <div className="space-y-2">
                {Object.entries(analyticsData.analytics.demographics?.gender || {}).map(([gender, count]) => (
                  <div key={gender} className="flex items-center">
                    <div className="w-20 text-sm capitalize">{gender}</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{
                          width: `${(Number(count) / Object.values(analyticsData.analytics.demographics?.gender || {}).reduce((a, b) => a + b, 0)) * 100}%`
                        }}
                      />
                    </div>
                    <div className="w-12 text-sm text-right">{count}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interests Distribution */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Interests Distribution</h3>
              <div className="space-y-2">
                {Object.entries(analyticsData.analytics.demographics?.interests || {}).map(([interest, count]) => (
                  <div key={interest} className="flex items-center">
                    <div className="w-20 text-sm capitalize">{interest}</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{
                          width: `${(Number(count) / Object.values(analyticsData.analytics.demographics?.interests || {}).reduce((a, b) => a + b, 0)) * 100}%`
                        }}
                      />
                    </div>
                    <div className="w-12 text-sm text-right">{count}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Devices & OS */}
      {(analyticsData.analytics.devices || analyticsData.analytics.operatingSystems) && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Devices & Operating Systems</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Devices */}
            {analyticsData.analytics.devices && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Devices</h3>
                <div className="space-y-2">
                  {Object.entries(analyticsData.analytics.devices).map(([device, count]) => (
                    <div key={device} className="flex items-center">
                      <div className="w-20 text-sm capitalize">{device}</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{
                            width: `${(Number(count) / Object.values(analyticsData.analytics.devices || {}).reduce((a, b) => a + b, 0)) * 100}%`
                          }}
                        />
                      </div>
                      <div className="w-12 text-sm text-right">{count}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Operating Systems */}
            {analyticsData.analytics.operatingSystems && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Operating Systems</h3>
                <div className="space-y-2">
                  {Object.entries(analyticsData.analytics.operatingSystems).map(([os, count]) => (
                    <div key={os} className="flex items-center">
                      <div className="w-20 text-sm capitalize">{os}</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{
                            width: `${(Number(count) / Object.values(analyticsData.analytics.operatingSystems || {}).reduce((a, b) => a + b, 0)) * 100}%`
                          }}
                        />
                      </div>
                      <div className="w-12 text-sm text-right">{count}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Location */}
      {analyticsData.analytics.locations && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Location</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cities */}
            {analyticsData.analytics.locations?.cities && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Cities</h3>
                <div className="space-y-2">
                  {Object.entries(analyticsData.analytics.locations.cities).map(([city, count]) => (
                    <div key={city} className="flex items-center">
                      <div className="w-40 text-sm">{city}</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{
                            width: `${(Number(count) / Object.values(analyticsData.analytics.locations?.cities || {}).reduce((a, b) => a + b, 0)) * 100}%`
                          }}
                        />
                      </div>
                      <div className="w-12 text-sm text-right">{count}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Countries */}
            {analyticsData.analytics.locations?.countries && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Countries</h3>
                <div className="space-y-2">
                  {Object.entries(analyticsData.analytics.locations.countries).map(([country, count]) => (
                    <div key={country} className="flex items-center">
                      <div className="w-20 text-sm">{country}</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{
                            width: `${(Number(count) / Object.values(analyticsData.analytics.locations?.countries || {}).reduce((a, b) => a + b, 0)) * 100}%`
                          }}
                        />
                      </div>
                      <div className="w-12 text-sm text-right">{count}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Visit History */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Visit History</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OS</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {getPaginatedVisitHistory().map((visit, index) => {
                console.log('Visit data:', visit);
                return (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(visit.timestamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {visit.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {visit.metadata?.location?.city && visit.metadata?.location?.country 
                        ? `${visit.metadata.location.city}, ${visit.metadata.location.country}`
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {visit.metadata?.device || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {visit.metadata?.os || 'N/A'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-500">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, analyticsData.analytics.visitHistory?.length || 0)} of {analyticsData.analytics.visitHistory?.length || 0} entries
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 