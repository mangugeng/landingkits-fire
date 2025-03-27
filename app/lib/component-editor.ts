import { db } from './firebase.singleton';
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc,
  addDoc,
  query,
  where,
  orderBy,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';

export interface ComponentEditor {
  id?: string;
  name: string;
  description: string;
  category: string;
  content: any; // JSON content dari komponen
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  thumbnail?: string;
}

const COMPONENT_COLLECTION = 'component_editor';

export const componentEditorService = {
  // Mengambil semua komponen
  async getAllComponents(userId: string) {
    try {
      const q = query(
        collection(db, COMPONENT_COLLECTION),
        where('userId', '==', userId),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ComponentEditor[];
    } catch (error) {
      console.error('Error fetching components:', error);
      return [];
    }
  },

  // Mengambil komponen berdasarkan ID
  async getComponentById(id: string) {
    try {
      const docRef = doc(db, COMPONENT_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as ComponentEditor;
      }
      return null;
    } catch (error) {
      console.error('Error fetching component:', error);
      return null;
    }
  },

  // Mengambil komponen berdasarkan kategori
  async getComponentsByCategory(category: string, userId: string) {
    try {
      const q = query(
        collection(db, COMPONENT_COLLECTION),
        where('category', '==', category),
        where('userId', '==', userId),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ComponentEditor[];
    } catch (error) {
      console.error('Error fetching components by category:', error);
      return [];
    }
  },

  // Menyimpan komponen baru
  async saveComponent(component: Omit<ComponentEditor, 'id'>) {
    try {
      const docRef = await addDoc(collection(db, COMPONENT_COLLECTION), {
        ...component,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
      });

      return docRef.id;
    } catch (error) {
      console.error('Error saving component:', error);
      throw error;
    }
  },

  // Mengupdate komponen
  async updateComponent(id: string, component: Partial<ComponentEditor>) {
    try {
      const docRef = doc(db, COMPONENT_COLLECTION, id);
      await updateDoc(docRef, {
        ...component,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating component:', error);
      throw error;
    }
  },

  // Menghapus komponen (soft delete)
  async deleteComponent(id: string) {
    try {
      const docRef = doc(db, COMPONENT_COLLECTION, id);
      await updateDoc(docRef, {
        isActive: false,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error deleting component:', error);
      throw error;
    }
  }
}; 