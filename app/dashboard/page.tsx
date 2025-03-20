'use client';

import { useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { 
  DocumentTextIcon, 
  EyeIcon, 
  ArrowTrendingUpIcon, 
  CheckCircleIcon 
} from '@heroicons/react/24/outline';

interface StatCard {
  title: string;
  value: string | number;
  icon: any;
  bgColor: string;
  textColor: string;
}

export default function DashboardPage() {
  const stats: StatCard[] = [
    {
      title: 'Total Landing Page',
      value: '12',
      icon: DocumentTextIcon,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Halaman Aktif',
      value: '8',
      icon: CheckCircleIcon,
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Total Views',
      value: '15,000',
      icon: EyeIcon,
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Total Konversi',
      value: '450',
      icon: ArrowTrendingUpIcon,
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    }
  ];

  const recentPages = [
    {
      title: 'Landing Page Produk A',
      status: 'Published',
      lastUpdated: '20 Maret 2024',
      views: '1,200',
      conversions: '45'
    },
    {
      title: 'Landing Page Event B',
      status: 'Draft',
      lastUpdated: '19 Maret 2024',
      views: '0',
      conversions: '0'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Ringkasan performa landing page Anda
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`${stat.bgColor} rounded-lg p-6 space-y-2`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
                  <h3 className="text-sm font-medium text-gray-900">{stat.title}</h3>
                </div>
              </div>
              <p className={`text-2xl font-semibold ${stat.textColor}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Recent Landing Pages */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">
                Landing Page Terbaru
              </h2>
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                + Buat Baru
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {recentPages.map((page, index) => (
              <div key={index} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900">
                      {page.title}
                    </h3>
                    <div className="mt-1 flex items-center space-x-2 text-sm text-gray-500">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        page.status === 'Published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {page.status}
                      </span>
                      <span>•</span>
                      <span>Diupdate {page.lastUpdated}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-8 text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <EyeIcon className="h-5 w-5" />
                      <span>{page.views}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ArrowTrendingUpIcon className="h-5 w-5" />
                      <span>{page.conversions}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 