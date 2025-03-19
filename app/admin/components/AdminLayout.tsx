'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Cookies from 'js-cookie';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

  const handleLogout = () => {
    Cookies.remove('admin_login');
    window.location.href = '/auth/login';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 px-4 bg-blue-600 text-white">
            <h1 className="text-xl font-bold">LandingKits</h1>
          </div>
          <nav className="flex-1 px-2 py-4 space-y-1">
            <Link
              href="/admin/dashboard"
              className={`flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 ${
                pathname === '/admin/dashboard' ? 'bg-gray-100' : ''
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/admin/users"
              className={`flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 ${
                pathname === '/admin/users' ? 'bg-gray-100' : ''
              }`}
            >
              Pengguna
            </Link>
            <Link
              href="/admin/landing-pages"
              className={`flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 ${
                pathname === '/admin/landing-pages' ? 'bg-gray-100' : ''
              }`}
            >
              Landing Pages
            </Link>
            <Link
              href="/admin/reports"
              className={`flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 ${
                pathname === '/admin/reports' ? 'bg-gray-100' : ''
              }`}
            >
              Laporan
            </Link>
          </nav>
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Keluar
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="ml-64 p-8">
        {children}
      </div>
    </div>
  );
} 