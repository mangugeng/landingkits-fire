'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface NotificationSettings {
  email: boolean;
  push: boolean;
  marketing: boolean;
  updates: boolean;
}

interface PrivacySettings {
  showAnalytics: boolean;
  showProfile: boolean;
  allowTracking: boolean;
}

export default function SettingsPage() {
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    email: true,
    push: true,
    marketing: false,
    updates: true,
  });

  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    showAnalytics: true,
    showProfile: true,
    allowTracking: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      // Simulasi API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Pengaturan berhasil disimpan');
    } catch (error) {
      toast.error('Gagal menyimpan pengaturan');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Notification Settings */}
      <div className="bg-white shadow rounded-lg mb-6 lg:mb-8">
        <div className="px-4 lg:px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Pengaturan Notifikasi</h2>
          <button
            onClick={handleSaveSettings}
            disabled={isLoading}
            className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? 'Menyimpan...' : 'Simpan Pengaturan'}
          </button>
        </div>
        <div className="p-4 lg:p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Notifikasi Email</h3>
                <p className="text-sm text-gray-500">Terima notifikasi melalui email</p>
              </div>
              <button
                type="button"
                onClick={() => setNotificationSettings({ ...notificationSettings, email: !notificationSettings.email })}
                className={`${notificationSettings.email ? 'bg-blue-600' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              >
                <span
                  className={`${notificationSettings.email ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Notifikasi Push</h3>
                <p className="text-sm text-gray-500">Terima notifikasi push di browser</p>
              </div>
              <button
                type="button"
                onClick={() => setNotificationSettings({ ...notificationSettings, push: !notificationSettings.push })}
                className={`${notificationSettings.push ? 'bg-blue-600' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              >
                <span
                  className={`${notificationSettings.push ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Email Marketing</h3>
                <p className="text-sm text-gray-500">Terima email marketing dan promosi</p>
              </div>
              <button
                type="button"
                onClick={() => setNotificationSettings({ ...notificationSettings, marketing: !notificationSettings.marketing })}
                className={`${notificationSettings.marketing ? 'bg-blue-600' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              >
                <span
                  className={`${notificationSettings.marketing ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Pembaruan Produk</h3>
                <p className="text-sm text-gray-500">Terima informasi tentang pembaruan produk</p>
              </div>
              <button
                type="button"
                onClick={() => setNotificationSettings({ ...notificationSettings, updates: !notificationSettings.updates })}
                className={`${notificationSettings.updates ? 'bg-blue-600' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              >
                <span
                  className={`${notificationSettings.updates ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 lg:px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Pengaturan Privasi</h2>
        </div>
        <div className="p-4 lg:p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Tampilkan Analytics</h3>
                <p className="text-sm text-gray-500">Tampilkan statistik dan analytics di dashboard</p>
              </div>
              <button
                type="button"
                onClick={() => setPrivacySettings({ ...privacySettings, showAnalytics: !privacySettings.showAnalytics })}
                className={`${privacySettings.showAnalytics ? 'bg-blue-600' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              >
                <span
                  className={`${privacySettings.showAnalytics ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Tampilkan Profil</h3>
                <p className="text-sm text-gray-500">Tampilkan profil Anda di halaman publik</p>
              </div>
              <button
                type="button"
                onClick={() => setPrivacySettings({ ...privacySettings, showProfile: !privacySettings.showProfile })}
                className={`${privacySettings.showProfile ? 'bg-blue-600' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              >
                <span
                  className={`${privacySettings.showProfile ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Izinkan Tracking</h3>
                <p className="text-sm text-gray-500">Izinkan pengumpulan data untuk analisis</p>
              </div>
              <button
                type="button"
                onClick={() => setPrivacySettings({ ...privacySettings, allowTracking: !privacySettings.allowTracking })}
                className={`${privacySettings.allowTracking ? 'bg-blue-600' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              >
                <span
                  className={`${privacySettings.allowTracking ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 