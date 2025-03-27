'use client';

import { usePathname } from 'next/navigation';
import FooterWrapper from './FooterWrapper';
import { Toaster } from 'react-hot-toast';

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const isDashboardPage = pathname === '/dashboard';

  return (
    <div className="min-h-screen bg-white">
      <Toaster position="top-center" />
      <main>{children}</main>
      {!isHomePage && !isDashboardPage && <FooterWrapper />}
    </div>
  );
} 