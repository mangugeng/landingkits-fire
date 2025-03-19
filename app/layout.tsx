import type { Metadata, Viewport } from 'next';
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import SchemaMarkup from './components/SchemaMarkup';
import GoogleAnalytics from './components/GoogleAnalytics';

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: 'LandingKits - Platform Pembuatan Landing Page Profesional',
  description: 'Buat landing page profesional dengan mudah menggunakan LandingKits. Platform all-in-one dengan drag & drop builder, template premium, dan analitik lengkap. Gratis untuk mulai.',
  keywords: 'landing page, landing kit, landing page builder, landing page template, landing page creator, landing page design, landing page software, landing page tool, landing page platform, landing page solution',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'LandingKits - Platform Pembuatan Landing Page Profesional',
    description: 'Buat landing page profesional dengan mudah menggunakan LandingKits. Platform all-in-one dengan drag & drop builder, template premium, dan analitik lengkap.',
    url: 'https://landingkits.com',
    siteName: 'LandingKits',
    images: [
      {
        url: 'https://landingkits.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'LandingKits Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LandingKits - Platform Pembuatan Landing Page Profesional',
    description: 'Buat landing page profesional dengan mudah menggunakan LandingKits. Platform all-in-one dengan drag & drop builder, template premium, dan analitik lengkap.',
    images: ['https://landingkits.com/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://landingkits.com',
  },
  verification: {
    google: 'your-google-site-verification', // Tambahkan kode verifikasi Google Search Console
  },
  metadataBase: new URL('https://landingkits.com'),
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' }
    ],
    apple: [
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' }
    ]
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover'
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'LandingKits',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${inter.variable} antialiased`} suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://landingkits.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#2563eb" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="16x16" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body suppressHydrationWarning>
        <GoogleAnalytics />
        <SchemaMarkup />
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
} 