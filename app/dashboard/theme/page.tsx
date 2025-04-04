'use client';

import { useState, useEffect } from 'react';
import { ThemeConfig } from '@/app/types/editor';
import CustomThemeEditor from '@/app/components/CustomThemeEditor';
import LayoutSettings, { LayoutSettings as LayoutSettingsType } from '@/app/components/LayoutSettings';
import { themeConfigs } from '@/app/lib/themes';
import { db } from '@/app/lib/firebase';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '@/app/contexts/AuthContext';
import { toast } from 'react-hot-toast';

export default function ThemePage() {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'theme' | 'layout'>('theme');
  const [landingPages, setLandingPages] = useState<Array<{ id: string; title: string }>>([]);
  const [selectedPageId, setSelectedPageId] = useState<string>('');
  const [layoutSettings, setLayoutSettings] = useState<LayoutSettingsType>({
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
  });

  useEffect(() => {
    if (user) {
      loadLandingPages();
    }
  }, [user]);

  const loadLandingPages = async () => {
    try {
      const q = query(
        collection(db, 'landing_pages'),
        where('userId', '==', user!.uid)
      );
      const querySnapshot = await getDocs(q);
      const pages = querySnapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title
      }));
      setLandingPages(pages);
      
      if (pages.length > 0) {
        setSelectedPageId(pages[0].id);
        loadLayoutSettings(pages[0].id);
      }
    } catch (error) {
      console.error('Error loading landing pages:', error);
      toast.error('Gagal memuat daftar landing page');
    }
  };

  const loadLayoutSettings = async (pageId: string) => {
    try {
      const docRef = doc(db, 'landing_pages', pageId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.layout) {
          setLayoutSettings(data.layout);
        }
      }
    } catch (error) {
      console.error('Error loading layout settings:', error);
      toast.error('Gagal memuat pengaturan layout');
    }
  };

  const handleThemeChange = async (themeConfig: ThemeConfig) => {
    if (!user) {
      toast.error('Anda harus login untuk menyimpan tema');
      return;
    }

    try {
      setIsSaving(true);
      
      // Simpan tema ke Firestore
      await setDoc(doc(db, 'users', user.uid, 'themes', 'custom'), {
        ...themeConfig,
        updatedAt: new Date().toISOString(),
      });

      // Update tema di memory
      themeConfigs.custom = themeConfig;
      
      toast.success('Tema berhasil disimpan!');
    } catch (error) {
      console.error('Error saving theme:', error);
      toast.error('Gagal menyimpan tema');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLayoutChange = async (newSettings: LayoutSettingsType) => {
    if (!user || !selectedPageId) {
      toast.error('Anda harus login dan memilih landing page untuk menyimpan pengaturan');
      return;
    }

    try {
      setIsSaving(true);
      const docRef = doc(db, 'landing_pages', selectedPageId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        await setDoc(docRef, {
          ...docSnap.data(),
          layout: {
            ...newSettings,
            updatedAt: new Date().toISOString(),
          },
          updatedAt: new Date().toISOString(),
        }, { merge: true });
        
        setLayoutSettings(newSettings);
        toast.success('Pengaturan layout berhasil disimpan!');
      } else {
        toast.error('Landing page tidak ditemukan');
      }
    } catch (error) {
      console.error('Error saving layout settings:', error);
      toast.error('Gagal menyimpan pengaturan layout');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Pengaturan Tema & Layout</h1>
        
        {/* Landing Page Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pilih Landing Page
          </label>
          <select
            className="w-full border rounded-md p-2"
            value={selectedPageId}
            onChange={(e) => {
              setSelectedPageId(e.target.value);
              loadLayoutSettings(e.target.value);
            }}
          >
            <option value="">Pilih Landing Page</option>
            {landingPages.map((page) => (
              <option key={page.id} value={page.id}>
                {page.title}
              </option>
            ))}
          </select>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b mb-8">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'theme'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('theme')}
          >
            Tema
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'layout'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('layout')}
          >
            Layout
          </button>
        </div>
        
        {activeTab === 'theme' ? (
          <>
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Tema yang Tersedia</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(themeConfigs).map(([name, config]) => (
                  <div
                    key={name}
                    className="border rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-colors"
                    onClick={() => handleThemeChange(config)}
                  >
                    <div
                      className="h-32 rounded-lg mb-3"
                      style={{ backgroundColor: config.colors.background }}
                    >
                      <div className="p-4">
                        <h3
                          className="text-lg font-bold mb-2"
                          style={{
                            color: config.colors.text,
                            fontFamily: config.typography.headingFont,
                          }}
                        >
                          {name.charAt(0).toUpperCase() + name.slice(1)}
                        </h3>
                        <div className="flex space-x-2">
                          <div
                            className="w-6 h-6 rounded-full"
                            style={{ backgroundColor: config.colors.primary }}
                          />
                          <div
                            className="w-6 h-6 rounded-full"
                            style={{ backgroundColor: config.colors.secondary }}
                          />
                          <div
                            className="w-6 h-6 rounded-full"
                            style={{ backgroundColor: config.colors.accent }}
                          />
                        </div>
                      </div>
                    </div>
                    <p
                      className="text-sm"
                      style={{
                        color: config.colors.text,
                        fontFamily: config.typography.bodyFont,
                      }}
                    >
                      Klik untuk menggunakan tema ini
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <CustomThemeEditor
              onThemeChange={handleThemeChange}
              initialTheme={themeConfigs.custom}
            />
          </>
        ) : (
          <LayoutSettings
            onSettingsChange={handleLayoutChange}
            initialSettings={layoutSettings}
            isSaving={isSaving}
          />
        )}
      </div>
    </div>
  );
} 