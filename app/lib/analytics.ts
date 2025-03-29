import { db } from './firebase';
import { collection, doc, getDoc, setDoc, updateDoc, query, where, getDocs, Timestamp, increment, arrayUnion } from 'firebase/firestore';
import { AnalyticsData, VisitHistory, VisitMetadata, Demographics } from '@/app/types/analytics';

const ANALYTICS_COLLECTION = 'analytics';

type FirestoreData = {
  views: number;
  uniqueVisitors: number;
  conversions: number;
  lastVisit: Timestamp;
  userId: string;
  slug: string;
  analytics: {
    visitHistory: VisitHistory[];
    demographics: {
      ageGroups: Record<string, number>;
      gender: Record<string, number>;
      interests: Record<string, number>;
    };
    devices: Record<string, number>;
    operatingSystems: Record<string, number>;
    locations: {
      cities: Record<string, number>;
      countries: Record<string, number>;
    };
  };
};

export const analyticsService = {
  // Mendapatkan data analytics berdasarkan userId dan slug
  async getAnalytics(userId: string, slug: string): Promise<AnalyticsData | null> {
    try {
      const landingPagesRef = collection(db, 'landing_pages');
      const q = query(
        landingPagesRef,
        where('userId', '==', userId),
        where('slug', '==', slug)
      );
      
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        return null;
      }

      const doc = querySnapshot.docs[0];
      const data = doc.data();
      
      return {
        views: data.analytics?.views || 0,
        uniqueVisitors: data.analytics?.visitors || 0,
        conversions: data.analytics?.conversions || 0,
        lastVisit: data.analytics?.lastVisit || null,
        analytics: data.analytics || {
          visitHistory: [],
          demographics: {
            ageGroups: {},
            gender: {},
            interests: {}
          },
          devices: {},
          operatingSystems: {},
          locations: {
            cities: {},
            countries: {}
          }
        }
      };
    } catch (error) {
      console.error('Error getting analytics:', error);
      return null;
    }
  },

  // Membuat atau memperbarui data analytics
  async updateAnalytics(userId: string, slug: string, visit: VisitHistory): Promise<void> {
    try {
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
      
      const updates: any = {
        'analytics.views': increment(1),
        'analytics.uniqueVisitors': increment(1),
        'analytics.lastVisit': Timestamp.now(),
        'analytics.visitHistory': arrayUnion(visit),
        [`analytics.devices.${visit.metadata.device}`]: increment(1),
        [`analytics.operatingSystems.${visit.metadata.os}`]: increment(1),
        [`analytics.locations.countries.${visit.metadata.location.country}`]: increment(1),
        [`analytics.locations.cities.${visit.metadata.location.city}`]: increment(1)
      };

      // Update demographics if available
      if ('demographics' in visit.metadata) {
        const demographics = visit.metadata.demographics as Demographics;
        
        // Update age groups
        Object.entries(demographics.ageGroups).forEach(([ageGroup, count]) => {
          updates[`analytics.demographics.ageGroups.${ageGroup}`] = increment(count || 1);
        });

        // Update gender
        Object.entries(demographics.gender).forEach(([gender, count]) => {
          updates[`analytics.demographics.gender.${gender}`] = increment(count || 1);
        });

        // Update interests
        Object.entries(demographics.interests).forEach(([interest, count]) => {
          updates[`analytics.demographics.interests.${interest}`] = increment(count || 1);
        });

        // Update education
        Object.entries(demographics.education).forEach(([education, count]) => {
          updates[`analytics.demographics.education.${education}`] = increment(count || 1);
        });

        // Update occupation
        Object.entries(demographics.occupation).forEach(([occupation, count]) => {
          updates[`analytics.demographics.occupation.${occupation}`] = increment(count || 1);
        });

        // Update income
        Object.entries(demographics.income).forEach(([income, count]) => {
          updates[`analytics.demographics.income.${income}`] = increment(count || 1);
        });

        // Update marital status
        Object.entries(demographics.maritalStatus).forEach(([status, count]) => {
          updates[`analytics.demographics.maritalStatus.${status}`] = increment(count || 1);
        });
      }

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
  },

  // Mendapatkan semua data analytics untuk user tertentu
  async getAllAnalytics(userId: string): Promise<AnalyticsData[]> {
    try {
      const landingPagesRef = collection(db, 'landing_pages');
      const q = query(landingPagesRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          views: data.analytics?.views || 0,
          uniqueVisitors: data.analytics?.visitors || 0,
          conversions: data.analytics?.conversions || 0,
          lastVisit: data.analytics?.lastVisit || null,
          analytics: data.analytics || {
            visitHistory: [],
            demographics: {
              ageGroups: {},
              gender: {},
              interests: {}
            },
            devices: {},
            operatingSystems: {},
            locations: {
              cities: {},
              countries: {}
            }
          }
        };
      });
    } catch (error) {
      console.error('Error getting all analytics:', error);
      return [];
    }
  }
};

function getDefaultMetadata(): VisitMetadata {
  return {
    device: 'unknown',
    os: 'unknown',
    browser: 'unknown',
    screenSize: 'unknown',
    location: {
      country: 'unknown',
      city: 'unknown',
      region: 'unknown'
    }
  };
}

export async function recordVisit(slug: string, userId: string, metadata?: VisitMetadata) {
  try {
    const visit: VisitHistory = {
      timestamp: Timestamp.now(),
      type: 'view',
      metadata: metadata || getDefaultMetadata()
    };

    await analyticsService.updateAnalytics(userId, slug, visit);
    return { success: true };
  } catch (error) {
    console.error('Error recording visit:', error);
    return { success: false, error };
  }
}

export async function recordConversion(slug: string, userId: string, metadata?: VisitMetadata) {
  try {
    const visit: VisitHistory = {
      timestamp: Timestamp.now(),
      type: 'conversion',
      metadata: metadata || getDefaultMetadata()
    };

    await analyticsService.updateAnalytics(userId, slug, visit);
    return { success: true };
  } catch (error) {
    console.error('Error recording conversion:', error);
    return { success: false, error };
  }
}

export async function getAnalytics(slug: string, userId: string) {
  try {
    const analytics = await analyticsService.getAnalytics(userId, slug);
    if (!analytics) {
      return null;
    }

    return {
      analytics: analytics.analytics
    };
  } catch (error) {
    console.error('Error getting analytics:', error);
    return null;
  }
} 