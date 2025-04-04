'use client';

import { useState, useEffect } from 'react';
import { ThemeConfig } from '../types/editor';
import { themeConfigs } from '../lib/themes';
import { toast } from 'react-hot-toast';

interface CustomThemeEditorProps {
  onThemeChange: (themeConfig: ThemeConfig) => void;
  initialTheme?: ThemeConfig;
}

export default function CustomThemeEditor({ onThemeChange, initialTheme }: CustomThemeEditorProps) {
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>(
    initialTheme || themeConfigs.custom
  );

  useEffect(() => {
    if (initialTheme) {
      setThemeConfig(initialTheme);
    }
  }, [initialTheme]);

  const handleColorChange = (category: string, color: string) => {
    setThemeConfig((prev) => ({
      ...prev,
      colors: {
        ...prev.colors,
        [category]: color,
      },
    }));
  };

  const handleFontChange = (category: string, font: string) => {
    setThemeConfig((prev) => ({
      ...prev,
      typography: {
        ...prev.typography,
        [category]: font,
      },
    }));
  };

  const handleSpacingChange = (category: string, value: string) => {
    setThemeConfig((prev) => ({
      ...prev,
      spacing: {
        ...prev.spacing,
        [category]: value,
      },
    }));
  };

  const handleBorderRadiusChange = (value: string) => {
    setThemeConfig((prev) => ({
      ...prev,
      borderRadius: value,
    }));
  };

  const handleShadowChange = (category: string, value: string) => {
    setThemeConfig((prev) => ({
      ...prev,
      shadows: {
        ...prev.shadows,
        [category]: value,
      },
    }));
  };

  const handleSave = () => {
    onThemeChange(themeConfig);
    toast.success('Tema kustom berhasil disimpan!');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Editor Tema Kustom</h2>
      
      <div className="space-y-6">
        {/* Warna */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Warna</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Warna Utama</label>
              <div className="flex items-center">
                <input
                  type="color"
                  value={themeConfig.colors.primary}
                  onChange={(e) => handleColorChange('primary', e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer mr-2"
                />
                <input
                  type="text"
                  value={themeConfig.colors.primary}
                  onChange={(e) => handleColorChange('primary', e.target.value)}
                  className="flex-1 p-2 border rounded"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Warna Sekunder</label>
              <div className="flex items-center">
                <input
                  type="color"
                  value={themeConfig.colors.secondary}
                  onChange={(e) => handleColorChange('secondary', e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer mr-2"
                />
                <input
                  type="text"
                  value={themeConfig.colors.secondary}
                  onChange={(e) => handleColorChange('secondary', e.target.value)}
                  className="flex-1 p-2 border rounded"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Warna Aksen</label>
              <div className="flex items-center">
                <input
                  type="color"
                  value={themeConfig.colors.accent}
                  onChange={(e) => handleColorChange('accent', e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer mr-2"
                />
                <input
                  type="text"
                  value={themeConfig.colors.accent}
                  onChange={(e) => handleColorChange('accent', e.target.value)}
                  className="flex-1 p-2 border rounded"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Warna Latar</label>
              <div className="flex items-center">
                <input
                  type="color"
                  value={themeConfig.colors.background}
                  onChange={(e) => handleColorChange('background', e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer mr-2"
                />
                <input
                  type="text"
                  value={themeConfig.colors.background}
                  onChange={(e) => handleColorChange('background', e.target.value)}
                  className="flex-1 p-2 border rounded"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Warna Teks</label>
              <div className="flex items-center">
                <input
                  type="color"
                  value={themeConfig.colors.text}
                  onChange={(e) => handleColorChange('text', e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer mr-2"
                />
                <input
                  type="text"
                  value={themeConfig.colors.text}
                  onChange={(e) => handleColorChange('text', e.target.value)}
                  className="flex-1 p-2 border rounded"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tipografi */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Tipografi</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Font Judul</label>
              <select
                value={themeConfig.typography.headingFont}
                onChange={(e) => handleFontChange('headingFont', e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="Inter, sans-serif">Inter</option>
                <option value="Roboto, sans-serif">Roboto</option>
                <option value="Playfair Display, serif">Playfair Display</option>
                <option value="Montserrat, sans-serif">Montserrat</option>
                <option value="Poppins, sans-serif">Poppins</option>
                <option value="Helvetica Neue, sans-serif">Helvetica Neue</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Font Teks</label>
              <select
                value={themeConfig.typography.bodyFont}
                onChange={(e) => handleFontChange('bodyFont', e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="Inter, sans-serif">Inter</option>
                <option value="Open Sans, sans-serif">Open Sans</option>
                <option value="Source Sans Pro, sans-serif">Source Sans Pro</option>
                <option value="Roboto, sans-serif">Roboto</option>
                <option value="Nunito, sans-serif">Nunito</option>
                <option value="Helvetica Neue, sans-serif">Helvetica Neue</option>
              </select>
            </div>
          </div>
        </div>

        {/* Spacing */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Spacing</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Spacing Section</label>
              <input
                type="text"
                value={themeConfig.spacing.section}
                onChange={(e) => handleSpacingChange('section', e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Spacing Component</label>
              <input
                type="text"
                value={themeConfig.spacing.component}
                onChange={(e) => handleSpacingChange('component', e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>

        {/* Border Radius */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Border Radius</h3>
          <input
            type="text"
            value={themeConfig.borderRadius}
            onChange={(e) => handleBorderRadiusChange(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Shadows */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Shadows</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Shadow Small</label>
              <input
                type="text"
                value={themeConfig.shadows.small}
                onChange={(e) => handleShadowChange('small', e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Shadow Medium</label>
              <input
                type="text"
                value={themeConfig.shadows.medium}
                onChange={(e) => handleShadowChange('medium', e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Shadow Large</label>
              <input
                type="text"
                value={themeConfig.shadows.large}
                onChange={(e) => handleShadowChange('large', e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>

        {/* Preview */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Preview</h3>
          <div 
            className="p-6 rounded-lg"
            style={{ 
              backgroundColor: themeConfig.colors.background,
              color: themeConfig.colors.text,
              fontFamily: themeConfig.typography.bodyFont,
              borderRadius: themeConfig.borderRadius,
              boxShadow: themeConfig.shadows.medium
            }}
          >
            <h2 
              className="text-2xl font-bold mb-4"
              style={{ fontFamily: themeConfig.typography.headingFont }}
            >
              Judul Contoh
            </h2>
            <p className="mb-4">
              Ini adalah contoh teks yang menggunakan font dan warna yang telah Anda pilih.
            </p>
            <div className="flex space-x-4">
              <button 
                className="px-4 py-2 rounded"
                style={{ 
                  backgroundColor: themeConfig.colors.primary,
                  color: '#FFFFFF'
                }}
              >
                Tombol Utama
              </button>
              <button 
                className="px-4 py-2 rounded"
                style={{ 
                  backgroundColor: themeConfig.colors.secondary,
                  color: '#FFFFFF'
                }}
              >
                Tombol Sekunder
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Simpan Tema
          </button>
        </div>
      </div>
    </div>
  );
} 