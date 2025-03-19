import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LandingKits - Buat Landing Page dengan Mudah',
  description: 'Buat landing page profesional dengan mudah menggunakan LandingKits',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={inter.className} suppressHydrationWarning={true}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  )
} 