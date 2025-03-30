import { db } from './firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { FAQ, Guide } from '../types/help';

export const helpService = {
  // FAQ
  async getAllFAQs(): Promise<FAQ[]> {
    try {
      const faqsRef = collection(db, 'faqs');
      const q = query(faqsRef, orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FAQ[];
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      throw error;
    }
  },

  async getFAQsByCategory(category: FAQ['category']): Promise<FAQ[]> {
    try {
      const faqsRef = collection(db, 'faqs');
      const q = query(
        faqsRef,
        where('category', '==', category),
        orderBy('order', 'asc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FAQ[];
    } catch (error) {
      console.error('Error fetching FAQs by category:', error);
      throw error;
    }
  },

  // Guides
  async getAllGuides(): Promise<Guide[]> {
    try {
      const guidesRef = collection(db, 'guides');
      const q = query(guidesRef, orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Guide[];
    } catch (error) {
      console.error('Error fetching guides:', error);
      throw error;
    }
  },

  async getGuidesByCategory(category: Guide['category']): Promise<Guide[]> {
    try {
      const guidesRef = collection(db, 'guides');
      const q = query(
        guidesRef,
        where('category', '==', category),
        orderBy('order', 'asc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Guide[];
    } catch (error) {
      console.error('Error fetching guides by category:', error);
      throw error;
    }
  }
}; 