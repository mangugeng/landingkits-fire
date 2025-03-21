'use client';

import { usePathname } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isEditorPage = pathname?.includes('/editor');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="py-10">
        {children}
      </main>
    </div>
  );
} 