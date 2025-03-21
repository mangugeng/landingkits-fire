'use client';

import { Toaster } from 'react-hot-toast';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="py-10">
        {children}
      </main>
      <Toaster position="top-right" />
    </div>
  );
} 