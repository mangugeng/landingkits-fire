'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <h1 className="text-9xl font-bold text-gray-900 mb-4">404</h1>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ delay: 0.5, duration: 1 }}
            className="absolute bottom-0 left-0 h-1 bg-blue-600"
          />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">
            Oops! Halaman Tidak Ditemukan
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Maaf, halaman yang Anda cari tidak dapat ditemukan. 
            Halaman mungkin telah dipindahkan atau dihapus.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Kembali ke Beranda
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-12"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-md mx-auto">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="h-24 rounded-lg"
                animate={{
                  backgroundColor: [
                    '#E5E7EB', // gray-200
                    '#60A5FA', // blue-400
                    '#34D399', // green-400
                    '#F472B6', // pink-400
                    '#E5E7EB', // kembali ke gray-200
                  ],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: i * 0.5, // delay bertahap untuk setiap kotak
                  ease: "linear"
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
} 