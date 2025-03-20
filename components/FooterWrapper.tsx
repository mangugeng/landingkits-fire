'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function FooterWrapper() {
  const pathname = usePathname();
  
  // Jangan tampilkan Footer di halaman home karena sudah ada Footer di sana
  if (pathname === '/') {
    return null;
  }

  return <Footer />;
} 