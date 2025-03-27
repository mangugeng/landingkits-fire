import { db } from './firebase';
import { collection, addDoc, getDocs, query, where, orderBy, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ComponentData } from '@/app/types/editor';

export interface LandingPage {
  id?: string;
  title: string;
  description: string;
  slug: string;
  userId: string;
  content: ComponentData[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  status: 'draft' | 'published';
  views: number;
  conversions: number;
}

export const landingPageService = {
  async createLandingPage(data: Omit<LandingPage, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'landing_pages'), {
      ...data,
      content: data.content || [],
      views: data.views || 0,
      conversions: data.conversions || 0,
      status: data.status || 'draft'
    });
    return docRef.id;
  },

  async getLandingPageById(id: string): Promise<LandingPage | null> {
    const docRef = doc(db, 'landing_pages', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }

    return {
      id: docSnap.id,
      ...docSnap.data()
    } as LandingPage;
  },

  async getLandingPagesByUserId(userId: string): Promise<LandingPage[]> {
    const q = query(
      collection(db, 'landing_pages'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as LandingPage[];
  },

  async updateLandingPage(id: string, data: Partial<LandingPage>): Promise<void> {
    const docRef = doc(db, 'landing_pages', id);
    await updateDoc(docRef, data);
  },

  async deleteLandingPage(id: string): Promise<void> {
    const docRef = doc(db, 'landing_pages', id);
    await deleteDoc(docRef);
  }
}; 