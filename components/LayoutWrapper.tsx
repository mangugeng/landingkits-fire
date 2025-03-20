'use client';

import { usePathname } from 'next/navigation';
import FooterWrapper from './FooterWrapper';

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const isDashboardPage = pathname === '/dashboard';

  return (
    <div className="min-h-screen bg-gray-50">
      {children}
      {!isHomePage && !isDashboardPage && <FooterWrapper />}
    </div>
  );
} 