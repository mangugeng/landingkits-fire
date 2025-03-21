'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import DashboardNav from './DashboardNav';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
            <div className="flex h-14 items-center justify-between px-4 border-b border-gray-200">
              <Link href="/home" className="text-lg font-semibold text-gray-900 hover:text-gray-600">
                landingkits.com
              </Link>
              <button
                type="button"
                className="-mr-2 p-2 rounded-md text-gray-500 hover:bg-gray-100"
                onClick={() => setSidebarOpen(false)}
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <DashboardNav />
            </div>
          </div>
        </div>
      )}

      {/* Desktop layout */}
      <div className="flex min-h-screen">
        {/* Desktop sidebar */}
        <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 lg:bg-white">
          <div className="flex h-14 items-center px-4 border-b border-gray-200">
            <Link href="/home" className="text-lg font-semibold text-gray-900 hover:text-gray-600">
              landingkits.com
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <DashboardNav />
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 lg:pl-64">
          {/* Mobile header */}
          <div className="sticky top-0 z-10 flex h-14 items-center border-b border-gray-200 bg-white lg:hidden">
            <button
              type="button"
              className="px-4 text-gray-500 hover:text-gray-900"
              onClick={() => setSidebarOpen(true)}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <Link href="/home" className="text-lg font-semibold text-gray-900 hover:text-gray-600">
              landingkits.com
            </Link>
          </div>

          {/* Main content area */}
          <main className="flex-1 p-4 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
} 