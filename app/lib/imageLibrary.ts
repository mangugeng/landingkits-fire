import { db, storage } from './firebase.singleton';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  limit,
  startAfter,
  DocumentData,
  getDoc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { ImageLibraryItem, ImageLibraryCategory } from '../types/editor';

const IMAGE_LIBRARY_COLLECTION = 'imageLibrary';
const CATEGORIES_COLLECTION = 'imageLibraryCategories';
const ITEMS_PER_PAGE = 20;

export const imageLibraryService = {
  // Kategori
  async createCategory(category: Omit<ImageLibraryCategory, 'id' | 'createdAt' | 'updatedAt'>) {
    const docRef = await addDoc(collection(db, CATEGORIES_COLLECTION), {
      ...category,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    });
    return docRef.id;
  },

  async updateCategory(id: string, category: Partial<ImageLibraryCategory>) {
    const docRef = doc(db, CATEGORIES_COLLECTION, id);
    await updateDoc(docRef, {
      ...category,
      updatedAt: new Date()
    });
  },

  async deleteCategory(id: string) {
    const docRef = doc(db, CATEGORIES_COLLECTION, id);
    await deleteDoc(docRef);
  },

  async getCategories(): Promise<ImageLibraryCategory[]> {
    try {
      const response = await fetch('/images/library/imageLibrary.json');
      const data = await response.json();
      return data.categories;
    } catch (error) {
      console.error('Error loading categories:', error);
      return [];
    }
  },

  // Gambar
  async uploadImage(file: File, metadata: Omit<ImageLibraryItem, 'id' | 'url' | 'createdAt' | 'updatedAt'>) {
    try {
      // Upload file ke Firebase Storage
      const storageRef = ref(storage, `imageLibrary/${Date.now()}-${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Simpan metadata ke Firestore
      const docRef = await addDoc(collection(db, IMAGE_LIBRARY_COLLECTION), {
        ...metadata,
        url: downloadURL,
        fileSize: file.size,
        fileType: file.type,
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublic: true
      });

      return docRef.id;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },

  async updateImage(id: string, updates: Partial<ImageLibraryItem>) {
    const docRef = doc(db, IMAGE_LIBRARY_COLLECTION, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date()
    });
  },

  async deleteImage(id: string, url: string) {
    try {
      // Hapus file dari Storage
      const storageRef = ref(storage, url);
      await deleteObject(storageRef);

      // Hapus dokumen dari Firestore
      const docRef = doc(db, IMAGE_LIBRARY_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  },

  async getImages(options: {
    category?: string;
    search?: string;
  } = {}): Promise<ImageLibraryItem[]> {
    try {
      const { category, search } = options;
      const response = await fetch('/images/library/imageLibrary.json');
      const data = await response.json();
      let images = data.images;

      // Filter by category if specified
      if (category) {
        images = images.filter((image: ImageLibraryItem) => image.category === category);
      }

      // Filter by search if specified
      if (search) {
        const searchLower = search.toLowerCase();
        images = images.filter((image: ImageLibraryItem) =>
          image.name.toLowerCase().includes(searchLower) ||
          image.description?.toLowerCase().includes(searchLower) ||
          image.tags?.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }

      return images;
    } catch (error) {
      console.error('Error loading images:', error);
      return [];
    }
  },

  async getImageById(id: string) {
    const docRef = doc(db, IMAGE_LIBRARY_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as ImageLibraryItem;
    }
    return null;
  }
}; 