import { Inter } from 'next/font/google';
import './globals.css';
import Script from 'next/script';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/app/contexts/AuthContext';
import { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LandingKits - Create Beautiful Landing Pages',
  description: 'Create beautiful landing pages with ease using LandingKits',
  openGraph: {
    title: 'LandingKits - Create Beautiful Landing Pages',
    description: 'Create beautiful landing pages with ease using LandingKits',
    type: 'website',
    url: 'https://landingkits.com',
    siteName: 'LandingKits'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {/* Google Analytics */}
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
            `}
          </Script>
          <Toaster />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
} 