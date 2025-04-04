import React from 'react';
import { ThemeType } from '../types/editor';
import Image from 'next/image';

interface ThemeSelectorProps {
  onSelectTheme: (theme: ThemeType) => void;
  onClose: () => void;
}

const themes = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean dan modern dengan warna-warna cerah',
    image: '/themes/modern.png',
  },
  {
    id: 'business',
    name: 'Business',
    description: 'Profesional dan elegan untuk bisnis',
    image: '/themes/business.png',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Berkreasi dengan warna-warna yang hidup',
    image: '/themes/creative.png',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Sederhana dan fokus pada konten',
    image: '/themes/minimal.png',
  },
  {
    id: 'ecommerce',
    name: 'E-Commerce',
    description: 'Optimasi untuk toko online',
    image: '/themes/ecommerce.png',
  },
];

export default function ThemeSelector({ onSelectTheme, onClose }: ThemeSelectorProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Pilih Tema</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {themes.map((theme) => (
            <div
              key={theme.id}
              className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => onSelectTheme(theme.id as ThemeType)}
            >
              <div className="relative h-48">
                <Image
                  src={theme.image}
                  alt={theme.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{theme.name}</h3>
                <p className="text-gray-600 text-sm">{theme.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 