'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';
import { ComponentData } from '../types/editor';

interface FooterWrapperProps {
  component?: ComponentData;
}

export default function FooterWrapper({ component }: FooterWrapperProps) {
  const pathname = usePathname();
  
  // Jangan tampilkan Footer di halaman home karena sudah ada Footer di sana
  if (pathname === '/') {
    return null;
  }

  return <Footer component={component} />;
} 