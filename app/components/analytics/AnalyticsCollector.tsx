'use client';

import { useEffect } from 'react';
import { collection, doc, updateDoc, increment, arrayUnion, Timestamp, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';
import { AnalyticsData, VisitHistory, VisitMetadata, Demographics } from '@/app/types/analytics';

interface AnalyticsCollectorProps {
  slug: string;
  userId: string;
}

// Fungsi untuk menghitung ukuran data dalam bytes
function calculateDataSize(data: any): number {
  try {
    return new Blob([JSON.stringify(data)]).size;
  } catch (error) {
    console.error('Error calculating data size:', error);
    return 0;
  }
}

// Fungsi untuk menghitung traffic berdasarkan ukuran halaman
function calculatePageTraffic(): number {
  const pageSize = calculateDataSize(document.documentElement.outerHTML);
  const resourcesSize = Array.from(document.getElementsByTagName('*'))
    .reduce((total, element) => {
      if (element instanceof HTMLImageElement) {
        return total + (element.naturalWidth * element.naturalHeight * 4); // Estimasi ukuran gambar
      }
      return total;
    }, 0);
  return pageSize + resourcesSize;
}

// Fungsi untuk mendapatkan kelompok umur
function getAgeGroup(age: number): string {
  if (age < 18) return 'under-18';
  if (age < 25) return '18-24';
  if (age < 35) return '25-34';
  if (age < 45) return '35-44';
  if (age < 55) return '45-54';
  if (age < 65) return '55-64';
  return '65-plus';
}

// Fungsi untuk mendapatkan lokasi
async function getLocation() {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return {
      country: data.country_code || 'unknown',
      city: data.city || 'unknown',
      region: data.region || 'unknown'
    };
  } catch (error) {
    console.error('Error getting location:', error);
    return {
      country: 'unknown',
      city: 'unknown',
      region: 'unknown'
    };
  }
}

// Fungsi untuk mendapatkan data demografi dari Google Analytics
async function getDemographicsFromGA() {
  try {
    // Untuk sementara kita gunakan data dummy
    return {
      age: Math.floor(Math.random() * 50) + 18,
      gender: Math.random() > 0.5 ? 'male' : 'female',
      interests: ['technology', 'business'],
      education: 'bachelor',
      occupation: 'professional',
      income: 'middle',
      maritalStatus: 'single'
    };
  } catch (error) {
    console.error('Error getting demographics from GA:', error);
    return null;
  }
}

export default function AnalyticsCollector({ slug, userId }: AnalyticsCollectorProps) {
  useEffect(() => {
    const collectAnalytics = async () => {
      try {
        // Deteksi device
        const device = detectDevice();
        const os = detectOS();
        const browser = detectBrowser();
        const screenSize = `${window.innerWidth}x${window.innerHeight}`;

        // Deteksi lokasi menggunakan IP-API
        const location = await getLocation();

        // Deteksi demografi
        const demographics = await getDemographicsFromGA();
        const ageGroup = getAgeGroup(demographics?.age || 0);

        // Hitung ukuran halaman dan traffic
        const pageSize = calculateDataSize(document.documentElement.outerHTML);
        const trafficSize = calculatePageTraffic();

        // Buat visit history entry
        const visitEntry: VisitHistory = {
          timestamp: Timestamp.now(),
          type: 'view',
          metadata: {
            device,
            os,
            browser,
            screenSize,
            location: {
              country: location?.country || 'unknown',
              city: location?.city || 'unknown',
              region: location?.region || 'unknown'
            }
          }
        };

        // Buat metadata terpisah untuk update
        const metadata: VisitMetadata = {
          device,
          os,
          browser,
          screenSize,
          location: {
            country: location?.country || 'unknown',
            city: location?.city || 'unknown',
            region: location?.region || 'unknown'
          },
          demographics: {
            ageGroups: { [ageGroup]: 1 },
            gender: { [demographics?.gender?.toLowerCase() || 'unknown']: 1 },
            interests: { [demographics?.interests?.join(',') || 'unknown']: 1 },
            education: { [demographics?.education || 'unknown']: 1 },
            occupation: { [demographics?.occupation || 'unknown']: 1 },
            income: { [demographics?.income || 'unknown']: 1 },
            maritalStatus: { [demographics?.maritalStatus || 'unknown']: 1 }
          }
        };

        console.log('Visit Entry:', visitEntry);
        console.log('Metadata:', metadata);

        // Cari dokumen berdasarkan slug dan userId
        const landingPagesRef = collection(db, 'landing_pages');
        const q = query(
          landingPagesRef,
          where('slug', '==', slug),
          where('userId', '==', userId)
        );
        
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          console.error('No landing page found with this slug and userId');
          return;
        }

        const docRef = querySnapshot.docs[0].ref;
        const docData = querySnapshot.docs[0].data();
        
        try {
          // Update data analytics
          const updates: any = {
            'analytics.views': increment(1),
            'analytics.uniqueVisitors': increment(1),
            'analytics.lastVisit': Timestamp.now(),
            'analytics.visitHistory': arrayUnion(visitEntry),
            [`analytics.devices.${device}`]: increment(1),
            [`analytics.operatingSystems.${os}`]: increment(1),
            [`analytics.locations.countries.${location?.country || 'unknown'}`]: increment(1),
            [`analytics.locations.cities.${location?.city || 'unknown'}`]: increment(1),
            'analytics.storage.used': increment(pageSize),
            'analytics.traffic.used': increment(trafficSize),
            [`analytics.demographics.ageGroups.${ageGroup}`]: increment(1),
            [`analytics.demographics.gender.${demographics?.gender?.toLowerCase() || 'unknown'}`]: increment(1),
            [`analytics.demographics.education.${demographics?.education || 'unknown'}`]: increment(1),
            [`analytics.demographics.occupation.${demographics?.occupation || 'unknown'}`]: increment(1),
            [`analytics.demographics.income.${demographics?.income || 'unknown'}`]: increment(1),
            [`analytics.demographics.maritalStatus.${demographics?.maritalStatus || 'unknown'}`]: increment(1),
            [`analytics.demographics.interests.${demographics?.interests?.join(',') || 'unknown'}`]: increment(1)
          };

          // Inisialisasi storage dan traffic total jika belum ada
          if (!docData.analytics?.storage?.total) {
            updates['analytics.storage.total'] = 100 * 1024 * 1024; // 100 MB default
          }
          if (!docData.analytics?.traffic?.total) {
            updates['analytics.traffic.total'] = 1000 * 1024 * 1024; // 1 GB default
          }

          await updateDoc(docRef, updates);
          console.log('Analytics updated successfully');
        } catch (error) {
          console.error('Error updating analytics:', error);
        }

      } catch (error) {
        console.error('Error collecting analytics:', error);
      }
    };

    collectAnalytics();
  }, [slug, userId]);

  return null;
}

function detectDevice() {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
}

function detectOS() {
  const ua = navigator.userAgent;
  
  // Deteksi Android
  if (/Android/i.test(ua)) {
    return 'Android';
  }
  
  // Deteksi iOS
  if (/iPhone|iPad|iPod/i.test(ua)) {
    return 'iOS';
  }
  
  // Deteksi Windows
  if (/Windows/i.test(ua)) {
    return 'Windows';
  }
  
  // Deteksi MacOS
  if (/Macintosh|MacIntel|MacPPC|Mac68K/i.test(ua)) {
    return 'MacOS';
  }
  
  // Deteksi Linux
  if (/Linux/i.test(ua)) {
    return 'Linux';
  }
  
  return 'Unknown';
}

function detectBrowser() {
  const ua = navigator.userAgent;
  if (/Edge/i.test(ua)) return 'Edge';
  if (/Firefox/i.test(ua)) return 'Firefox';
  if (/Chrome/i.test(ua)) return 'Chrome';
  if (/Safari/i.test(ua)) return 'Safari';
  if (/Opera|OPR/i.test(ua)) return 'Opera';
  return 'Unknown';
}

function updateTrends(updates: any) {
  const now = new Date();
  const dayKey = now.toISOString().split('T')[0];
  const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
  const weekKey = weekStart.toISOString().split('T')[0];
  const monthKey = now.toISOString().slice(0, 7); // Format: YYYY-MM

  // Update daily trends
  updates[`analytics.trends.views.${dayKey}`] = increment(1);
  
  // Update weekly trends
  updates[`analytics.trends.views.${weekKey}`] = increment(1);
  
  // Update monthly trends
  updates[`analytics.trends.views.${monthKey}`] = increment(1);

  return updates;
} 