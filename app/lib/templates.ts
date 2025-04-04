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
  setDoc
} from 'firebase/firestore';

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  content: any; // JSON content dari template
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

const TEMPLATES_COLLECTION = 'templates';

const defaultTemplates: Omit<Template, 'id'>[] = [
  {
    name: 'Landing Page Bisnis Modern',
    description: 'Template landing page modern untuk bisnis dengan fokus pada konversi',
    category: 'business',
    thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1500&q=80',
    content: {
      sections: [
        {
          type: 'hero',
          content: {
            title: 'Tingkatkan Bisnis Anda',
            subtitle: 'Solusi modern untuk pertumbuhan bisnis Anda',
            cta: 'Mulai Sekarang'
          }
        }
      ]
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true
  },
  {
    name: 'Portfolio Kreatif',
    description: 'Template portfolio yang menarik untuk menampilkan karya Anda',
    category: 'portfolio',
    thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1500&q=80',
    content: {
      sections: [
        {
          type: 'hero',
          content: {
            title: 'Portfolio Kreatif',
            subtitle: 'Tampilkan karya terbaik Anda',
            cta: 'Lihat Karya'
          }
        }
      ]
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true
  },
  {
    name: 'E-commerce Landing',
    description: 'Template landing page untuk e-commerce dengan fokus pada penjualan',
    category: 'ecommerce',
    thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1500&q=80',
    content: {
      sections: [
        {
          type: 'hero',
          content: {
            title: 'Tingkatkan Penjualan Online',
            subtitle: 'Solusi e-commerce yang efektif',
            cta: 'Mulai Jual'
          }
        }
      ]
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true
  }
];

export const templateService = {
  // Mengambil semua template
  async getAllTemplates() {
    try {
      const q = query(
        collection(db, TEMPLATES_COLLECTION),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const templates = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Template[];

      // Jika tidak ada template, buat template default
      if (templates.length === 0) {
        for (const template of defaultTemplates) {
          await addDoc(collection(db, TEMPLATES_COLLECTION), template);
        }
        return defaultTemplates.map((template, index) => ({
          id: `template-${index + 1}`,
          ...template
        })) as Template[];
      }

      return templates;
    } catch (error) {
      console.error('Error fetching templates:', error);
      return [];
    }
  },

  // Mengambil template berdasarkan ID
  async getTemplateById(id: string) {
    try {
      const docRef = doc(db, TEMPLATES_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as Template;
      }
      return null;
    } catch (error) {
      console.error('Error fetching template:', error);
      return null;
    }
  },

  // Mengambil template berdasarkan kategori
  async getTemplatesByCategory(category: string) {
    try {
      const q = query(
        collection(db, TEMPLATES_COLLECTION),
        where('category', '==', category),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Template[];
    } catch (error) {
      console.error('Error fetching templates by category:', error);
      return [];
    }
  },

  // Membuat landing page dari template
  async createLandingPageFromTemplate(templateId: string, userId: string, title: string, slug?: string) {
    try {
      const template = await this.getTemplateById(templateId);
      if (!template) {
        throw new Error('Template not found');
      }

      const landingPageRef = await addDoc(collection(db, 'landing_pages'), {
        title,
        description: template.description,
        content: template.content,
        status: 'draft',
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
        views: 0,
        conversions: 0,
        layout: {
          type: 'full',
          width: 'medium',
          spacing: 'comfortable',
          sidebarPosition: 'left',
          showSidebar: false,
          showHeader: false,
          showFooter: true,
          backgroundType: 'none',
          backgroundColor: '#ffffff',
          backgroundImage: '',
          patternType: 'dots',
          patternColor: '#000000',
          patternOpacity: 0.1
        }
      });

      return landingPageRef.id;
    } catch (error) {
      console.error('Error creating landing page from template:', error);
      throw error;
    }
  },

  // Menyimpan landing page sebagai template
  async saveAsTemplate(landingPage: any, userId: string) {
    try {
      const templateRef = await addDoc(collection(db, 'templates'), {
        name: landingPage.title,
        description: landingPage.description,
        content: landingPage.content,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        category: 'custom',
        thumbnail: landingPage.thumbnail || '',
        isPublic: false,
        isActive: true
      });

      return templateRef.id;
    } catch (error) {
      console.error('Error saving as template:', error);
      throw error;
    }
  }
}; 