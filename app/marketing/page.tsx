'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Solusi Digital untuk Bisnis Anda
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Tingkatkan performa bisnis Anda dengan solusi digital terbaik dari kami. 
              Mulai dari website, aplikasi mobile, hingga sistem manajemen terintegrasi.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Hubungi Kami
              </Link>
              <Link
                href="/portfolio"
                className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Lihat Portfolio
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Fitur Unggulan</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="p-6 rounded-xl bg-gray-50 hover:shadow-lg transition-shadow"
              >
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Siap Meningkatkan Bisnis Anda?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Mulai perjalanan digital Anda bersama kami dan rasakan perbedaannya.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Mulai Sekarang
          </Link>
        </div>
      </section>
    </div>
  );
}

const features = [
  {
    icon: "🚀",
    title: "Performa Tinggi",
    description: "Website dan aplikasi dengan performa optimal untuk pengalaman pengguna yang lebih baik."
  },
  {
    icon: "📱",
    title: "Responsif",
    description: "Tampilan yang sempurna di semua perangkat, dari desktop hingga mobile."
  },
  {
    icon: "🔒",
    title: "Keamanan Terjamin",
    description: "Sistem keamanan tingkat tinggi untuk melindungi data bisnis Anda."
  }
]; 