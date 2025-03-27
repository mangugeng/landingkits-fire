import { db } from '@/app/lib/firebase';
import { doc, updateDoc, increment, arrayUnion, Timestamp } from 'firebase/firestore';

export const trackEvent = async (pageId: string, eventType: string) => {
  console.log(`Tracking event: ${eventType} for page: ${pageId}`);
  
  try {
    const analyticsRef = doc(db, 'landing_pages', pageId);
    console.log('Analytics ref:', analyticsRef.path);
    
    const now = Timestamp.now();
    console.log('Current timestamp:', now.toDate());
    
    const updateData = {
      'analytics.conversions': increment(1),
      'analytics.visitHistory': arrayUnion({
        timestamp: now,
        type: 'conversion',
        eventType
      })
    };
    console.log('Update data:', updateData);
    
    await updateDoc(analyticsRef, updateData);
    console.log('Event tracked successfully');
  } catch (error) {
    console.error('Error tracking event:', error);
  }
};

export const trackCTAClick = async (pageId: string) => {
  console.log('Tracking CTA click');
  await trackEvent(pageId, 'cta_click');
};

export const trackRegistration = async (pageId: string) => {
  console.log('Tracking registration');
  await trackEvent(pageId, 'registration');
};

export const trackPurchase = async (pageId: string) => {
  console.log('Tracking purchase');
  await trackEvent(pageId, 'purchase');
};

export const trackDownload = async (pageId: string) => {
  console.log('Tracking download');
  await trackEvent(pageId, 'download');
};

export const trackContact = async (pageId: string) => {
  console.log('Tracking contact');
  await trackEvent(pageId, 'contact');
};

export const trackSubscribe = async (pageId: string) => {
  console.log('Tracking subscribe');
  await trackEvent(pageId, 'subscribe');
};

export const trackShare = async (pageId: string) => {
  console.log('Tracking share');
  await trackEvent(pageId, 'share');
}; 