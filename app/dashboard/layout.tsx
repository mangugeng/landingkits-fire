'use client';

import { useState } from 'react';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/auth');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
            <div className="flex h-16 flex-shrink-0 items-center justify-between border-b border-gray-200 px-4">
              <Link href="/dashboard" className="flex items-center space-x-2">
                <Image src="/logo.svg" alt="LandingKits Logo" width={32} height={32} />
                <span className="text-xl font-semibold text-gray-900">LandingKits</span>
              </Link>
              <button
                type="button"
                className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex flex-1 flex-col overflow-y-auto p-4">
              <DashboardSidebar />
            </div>
          </div>
        </div>
      )}

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
          <div className="flex h-16 flex-shrink-0 items-center border-b border-gray-200 px-4">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <Image src="/logo.svg" alt="LandingKits Logo" width={32} height={32} />
              <span className="text-xl font-semibold text-gray-900">LandingKits</span>
            </Link>
          </div>
          <div className="flex flex-1 flex-col overflow-y-auto p-4">
            <DashboardSidebar />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {/* Mobile header */}
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 items-center border-b border-gray-200 bg-white lg:hidden">
          <div className="flex items-center">
            <button
              type="button"
              className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
            <Link href="/dashboard" className="flex items-center space-x-2 ml-4">
              <Image src="/logo.svg" alt="LandingKits Logo" width={32} height={32} />
              <span className="text-xl font-semibold text-gray-900">LandingKits</span>
            </Link>
          </div>
        </div>

        <main className="flex-1">
          <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 