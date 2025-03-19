'use client';

import Link from 'next/link';
import PricingSection from './components/PricingSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-24 sm:pb-20">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Buat Landing Page Menarik dalam Hitungan Menit
        </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Platform all-in-one untuk membuat landing page profesional dengan mudah. 
            Drag & drop, template premium, dan analitik lengkap dalam satu tempat.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/auth"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
            >
              Mulai Gratis
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
            >
              Pelajari Lebih Lanjut
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Fitur Unggulan</h2>
            <p className="mt-4 text-lg text-gray-600">
              Semua yang Anda butuhkan untuk membuat landing page yang sukses
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Drag & Drop Builder</h3>
              <p className="text-gray-600">
                Buat landing page dengan mudah menggunakan editor drag & drop yang intuitif
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Template Premium</h3>
              <p className="text-gray-600">
                Pilih dari berbagai template profesional yang sudah dioptimalkan
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Analitik & Optimasi</h3>
              <p className="text-gray-600">
                Lacak performa dan optimalkan landing page Anda dengan analitik lengkap
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Cara Kerja</h2>
            <p className="mt-4 text-lg text-gray-600">
              Buat landing page profesional dalam 3 langkah sederhana
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Pilih Template</h3>
              <p className="text-gray-600">
                Pilih dari berbagai template profesional yang sudah dioptimalkan
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Kustomisasi</h3>
              <p className="text-gray-600">
                Sesuaikan konten, warna, dan elemen sesuai kebutuhan Anda
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Publikasikan</h3>
              <p className="text-gray-600">
                Publikasikan landing page Anda dan mulai dapatkan hasil
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <PricingSection />

      {/* CTA Section */}
      <div className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Mulai Buat Landing Page Anda Sekarang
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Bergabung dengan ribuan pengusaha yang sudah menggunakan LandingKits untuk meningkatkan bisnis mereka
          </p>
          <Link
            href="/auth"
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 md:py-4 md:text-lg md:px-10"
          >
            Mulai Gratis
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Tentang Kami</h3>
              <p className="text-gray-400">
                LandingKits adalah platform pembuatan landing page profesional yang membantu pengusaha meningkatkan konversi dan pertumbuhan bisnis mereka.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Fitur</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Drag & Drop Builder</li>
                <li>Template Premium</li>
                <li>Analitik Lengkap</li>
                <li>Custom Domain</li>
                <li>API Access</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Bantuan</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Dokumentasi</li>
                <li>Panduan Penggunaan</li>
                <li>FAQ</li>
                <li>Blog</li>
                <li>Status Layanan</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Kontak</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Email: support@landingkits.com</li>
                <li>Telepon: (021) 1234-5678</li>
                <li>Alamat: Jl. Contoh No. 123, Jakarta</li>
                <li>Jam Kerja: Senin - Jumat, 09:00 - 17:00</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2024 LandingKits. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
