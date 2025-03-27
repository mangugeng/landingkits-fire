'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import LayoutWrapper from './components/LayoutWrapper';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <SessionProvider>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
            <Toaster />
          </SessionProvider>
        </AuthProvider>
      </body>
    </html>
  );
} 