"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AnalyticsDashboard from '@/app/components/analytics/AnalyticsDashboard';
import { collection, query, where, getDocs, doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';
import { toast } from 'react-hot-toast';

export default function AnalyticsPage() {
  const params = useParams();
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [pages, setPages] = useState<Array<{ id: string; title: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const landingPagesRef = collection(db, 'landing_pages');
        const q = query(landingPagesRef, where('status', '==', 'published'));
        const querySnapshot = await getDocs(q);
        
        const pagesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          title: doc.data().title
        }));
        
        setPages(pagesData);
        if (pagesData.length > 0) {
          setSelectedPage(pagesData[0].id);
        }
      } catch (error) {
        console.error('Error fetching pages:', error);
        toast.error('Gagal memuat data landing page');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPages();
  }, []);

  useEffect(() => {
    if (!selectedPage) return;

    const landingPagesRef = collection(db, 'landing_pages');
    const docRef = doc(landingPagesRef, selectedPage);

    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        console.log('Raw Firestore Data:', data);
        
        // Pastikan data analytics ada
        if (!data.analytics) {
          console.error('No analytics data found in document');
          return;
        }

        setAnalyticsData({
          analytics: {
            views: data.analytics.views || 0,
            visitors: data.analytics.visitors || 0,
            conversions: data.analytics.conversions || 0,
            lastVisit: data.analytics.lastVisit || null,
            visitHistory: data.analytics.visitHistory || [],
            demographics: data.analytics.demographics || {},
            devices: data.analytics.devices || {},
            operatingSystems: data.analytics.operatingSystems || {},
            locations: data.analytics.locations || {}
          }
        });
      }
    });

    return () => unsubscribe();
  }, [selectedPage]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="w-full sm:w-64">
        <select
          value={selectedPage || ''}
          onChange={(e) => setSelectedPage(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          {pages.map((page) => (
            <option key={page.id} value={page.id}>
              {page.title}
            </option>
          ))}
        </select>
      </div>

      {selectedPage && analyticsData ? (
        <AnalyticsDashboard analyticsData={analyticsData} />
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">Pilih landing page untuk melihat analytics</p>
        </div>
      )}
    </div>
  );
} 