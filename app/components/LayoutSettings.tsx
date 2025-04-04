'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';

export type LayoutType = 'full' | 'container' | 'boxed';
export type LayoutWidth = 'narrow' | 'medium' | 'wide';
export type LayoutSpacing = 'compact' | 'comfortable' | 'spacious';
export type BackgroundType = 'none' | 'color' | 'image' | 'pattern';
export type PatternType = 'dots' | 'lines' | 'grid' | 'waves' | 'zigzag';

export interface LayoutSettings {
  type: LayoutType;
  width: LayoutWidth;
  spacing: LayoutSpacing;
  sidebarPosition: 'left' | 'right';
  showSidebar: boolean;
  showHeader: boolean;
  showFooter: boolean;
  backgroundType: BackgroundType;
  backgroundColor: string;
  backgroundImage: string;
  patternType: PatternType;
  patternColor: string;
  patternOpacity: number;
}

interface LayoutSettingsProps {
  onSettingsChange: (settings: LayoutSettings) => void;
  initialSettings?: LayoutSettings;
  isSaving?: boolean;
}

export default function LayoutSettings({ onSettingsChange, initialSettings, isSaving = false }: LayoutSettingsProps) {
  const [settings, setSettings] = useState<LayoutSettings>(
    initialSettings || {
      type: 'container',
      width: 'medium',
      spacing: 'comfortable',
      sidebarPosition: 'left',
      showSidebar: true,
      showHeader: true,
      showFooter: true,
      backgroundType: 'none',
      backgroundColor: '#ffffff',
      backgroundImage: '',
      patternType: 'dots',
      patternColor: '#000000',
      patternOpacity: 0.1,
    }
  );

  const handleChange = (key: keyof LayoutSettings, value: any) => {
    setSettings((prev) => {
      const newSettings = { ...prev, [key]: value };
      onSettingsChange(newSettings);
      return newSettings;
    });
  };

  const handleSave = () => {
    onSettingsChange(settings);
    toast.success('Pengaturan layout berhasil disimpan!');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange('backgroundImage', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Pengaturan Layout</h2>
      
      <div className="space-y-6">
        {/* Tipe Layout */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Tipe Layout</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                settings.type === 'full'
                  ? 'border-blue-500 bg-blue-50'
                  : 'hover:border-gray-300'
              }`}
              onClick={() => handleChange('type', 'full')}
            >
              <h4 className="font-medium mb-2">Full Page</h4>
              <p className="text-sm text-gray-500">
                Konten mengisi seluruh lebar halaman tanpa batasan
              </p>
            </div>
            <div
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                settings.type === 'container'
                  ? 'border-blue-500 bg-blue-50'
                  : 'hover:border-gray-300'
              }`}
              onClick={() => handleChange('type', 'container')}
            >
              <h4 className="font-medium mb-2">Container</h4>
              <p className="text-sm text-gray-500">
                Konten dibatasi dalam container dengan lebar maksimum
              </p>
            </div>
            <div
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                settings.type === 'boxed'
                  ? 'border-blue-500 bg-blue-50'
                  : 'hover:border-gray-300'
              }`}
              onClick={() => handleChange('type', 'boxed')}
            >
              <h4 className="font-medium mb-2">Boxed</h4>
              <p className="text-sm text-gray-500">
                Konten dalam box dengan latar belakang berbeda
              </p>
            </div>
          </div>
        </div>

        {/* Lebar Layout */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Lebar Layout</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                settings.width === 'narrow'
                  ? 'border-blue-500 bg-blue-50'
                  : 'hover:border-gray-300'
              }`}
              onClick={() => handleChange('width', 'narrow')}
            >
              <h4 className="font-medium mb-2">Narrow</h4>
              <p className="text-sm text-gray-500">
                Lebar maksimum 640px
              </p>
            </div>
            <div
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                settings.width === 'medium'
                  ? 'border-blue-500 bg-blue-50'
                  : 'hover:border-gray-300'
              }`}
              onClick={() => handleChange('width', 'medium')}
            >
              <h4 className="font-medium mb-2">Medium</h4>
              <p className="text-sm text-gray-500">
                Lebar maksimum 1024px
              </p>
            </div>
            <div
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                settings.width === 'wide'
                  ? 'border-blue-500 bg-blue-50'
                  : 'hover:border-gray-300'
              }`}
              onClick={() => handleChange('width', 'wide')}
            >
              <h4 className="font-medium mb-2">Wide</h4>
              <p className="text-sm text-gray-500">
                Lebar maksimum 1280px
              </p>
            </div>
          </div>
        </div>

        {/* Spacing */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Spacing</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                settings.spacing === 'compact'
                  ? 'border-blue-500 bg-blue-50'
                  : 'hover:border-gray-300'
              }`}
              onClick={() => handleChange('spacing', 'compact')}
            >
              <h4 className="font-medium mb-2">Compact</h4>
              <p className="text-sm text-gray-500">
                Jarak antar elemen lebih kecil
              </p>
            </div>
            <div
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                settings.spacing === 'comfortable'
                  ? 'border-blue-500 bg-blue-50'
                  : 'hover:border-gray-300'
              }`}
              onClick={() => handleChange('spacing', 'comfortable')}
            >
              <h4 className="font-medium mb-2">Comfortable</h4>
              <p className="text-sm text-gray-500">
                Jarak antar elemen standar
              </p>
            </div>
            <div
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                settings.spacing === 'spacious'
                  ? 'border-blue-500 bg-blue-50'
                  : 'hover:border-gray-300'
              }`}
              onClick={() => handleChange('spacing', 'spacious')}
            >
              <h4 className="font-medium mb-2">Spacious</h4>
              <p className="text-sm text-gray-500">
                Jarak antar elemen lebih besar
              </p>
            </div>
          </div>
        </div>

        {/* Background Settings */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Pengaturan Background</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipe Background
              </label>
              <select
                className="w-full border rounded-md p-2"
                value={settings.backgroundType}
                onChange={(e) => handleChange('backgroundType', e.target.value as BackgroundType)}
              >
                <option value="none">Tidak Ada</option>
                <option value="color">Warna</option>
                <option value="image">Gambar</option>
                <option value="pattern">Pattern</option>
              </select>
            </div>

            {settings.backgroundType === 'color' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Warna Background
                </label>
                <input
                  type="color"
                  className="w-full h-10 rounded-md"
                  value={settings.backgroundColor}
                  onChange={(e) => handleChange('backgroundColor', e.target.value)}
                />
              </div>
            )}

            {settings.backgroundType === 'image' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Gambar Background
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full"
                  onChange={handleImageUpload}
                />
                {settings.backgroundImage && (
                  <div className="mt-2">
                    <img
                      src={settings.backgroundImage}
                      alt="Background preview"
                      className="max-h-40 rounded-md"
                    />
                  </div>
                )}
              </div>
            )}

            {settings.backgroundType === 'pattern' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipe Pattern
                  </label>
                  <select
                    className="w-full border rounded-md p-2"
                    value={settings.patternType}
                    onChange={(e) => handleChange('patternType', e.target.value as PatternType)}
                  >
                    <option value="dots">Dots</option>
                    <option value="lines">Lines</option>
                    <option value="grid">Grid</option>
                    <option value="waves">Waves</option>
                    <option value="zigzag">Zigzag</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Warna Pattern
                  </label>
                  <input
                    type="color"
                    className="w-full h-10 rounded-md"
                    value={settings.patternColor}
                    onChange={(e) => handleChange('patternColor', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Opacity Pattern ({Math.round(settings.patternOpacity * 100)}%)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    className="w-full"
                    value={settings.patternOpacity}
                    onChange={(e) => handleChange('patternOpacity', parseFloat(e.target.value))}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Position */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Posisi Sidebar</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                settings.sidebarPosition === 'left'
                  ? 'border-blue-500 bg-blue-50'
                  : 'hover:border-gray-300'
              }`}
              onClick={() => handleChange('sidebarPosition', 'left')}
            >
              <h4 className="font-medium mb-2">Kiri</h4>
              <p className="text-sm text-gray-500">
                Sidebar di sebelah kiri konten
              </p>
            </div>
            <div
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                settings.sidebarPosition === 'right'
                  ? 'border-blue-500 bg-blue-50'
                  : 'hover:border-gray-300'
              }`}
              onClick={() => handleChange('sidebarPosition', 'right')}
            >
              <h4 className="font-medium mb-2">Kanan</h4>
              <p className="text-sm text-gray-500">
                Sidebar di sebelah kanan konten
              </p>
            </div>
          </div>
        </div>

        {/* Visibility Settings */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Pengaturan Visibilitas</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Tampilkan Sidebar</h4>
                <p className="text-sm text-gray-500">
                  Menampilkan atau menyembunyikan sidebar
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.showSidebar}
                  onChange={(e) => handleChange('showSidebar', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Tampilkan Header</h4>
                <p className="text-sm text-gray-500">
                  Menampilkan atau menyembunyikan header
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.showHeader}
                  onChange={(e) => handleChange('showHeader', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Tampilkan Footer</h4>
                <p className="text-sm text-gray-500">
                  Menampilkan atau menyembunyikan footer
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.showFooter}
                  onChange={(e) => handleChange('showFooter', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Preview</h3>
          <div 
            className={`border rounded-lg p-4 ${
              settings.type === 'boxed' ? 'bg-gray-100' : ''
            }`}
            style={{
              backgroundColor: settings.backgroundType === 'color' ? settings.backgroundColor : 'transparent',
              backgroundImage: settings.backgroundType === 'image' ? `url(${settings.backgroundImage})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div 
              className={`mx-auto ${
                settings.type === 'full' 
                  ? 'w-full' 
                  : settings.width === 'narrow' 
                    ? 'max-w-2xl' 
                    : settings.width === 'medium' 
                      ? 'max-w-4xl' 
                      : 'max-w-6xl'
              }`}
            >
              <div className="flex">
                {settings.showSidebar && settings.sidebarPosition === 'left' && (
                  <div className="w-1/4 bg-gray-200 p-4 rounded-l-lg">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded"></div>
                  </div>
                )}
                <div className={`flex-1 p-4 ${
                  settings.spacing === 'compact' 
                    ? 'space-y-2' 
                    : settings.spacing === 'comfortable' 
                      ? 'space-y-4' 
                      : 'space-y-6'
                }`}>
                  {settings.showHeader && (
                    <div className="h-8 bg-blue-200 rounded"></div>
                  )}
                  <div className="h-32 bg-white border rounded-lg"></div>
                  <div className="h-32 bg-white border rounded-lg"></div>
                  {settings.showFooter && (
                    <div className="h-8 bg-gray-200 rounded"></div>
                  )}
                </div>
                {settings.showSidebar && settings.sidebarPosition === 'right' && (
                  <div className="w-1/4 bg-gray-200 p-4 rounded-r-lg">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors ${
              isSaving ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSaving ? 'Menyimpan...' : 'Simpan Pengaturan Layout'}
          </button>
        </div>
      </div>
    </div>
  );
} 