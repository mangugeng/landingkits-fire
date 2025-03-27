'use client';

import { useEffect, useState } from 'react';
import { db } from '@/app/lib/firebase.singleton';
import { collection, getDocs, query, where } from 'firebase/firestore';

interface Component {
  id: string;
  name: string;
  description: string;
  category: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  content: any;
}

export default function CheckPage() {
  const [components, setComponents] = useState<Component[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchComponents() {
      try {
        const componentsRef = collection(db, 'component_editor');
        const q = query(componentsRef, where('isActive', '==', true));
        const querySnapshot = await getDocs(q);
        
        const fetchedComponents = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate()
        })) as Component[];
        
        setComponents(fetchedComponents);
      } catch (error) {
        console.error('Error fetching components:', error);
        setError('Gagal memuat komponen');
      } finally {
        setLoading(false);
      }
    }

    fetchComponents();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Daftar Komponen</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {components.map((component) => (
          <div key={component.id} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-2">{component.name}</h2>
            <p className="text-gray-600 mb-4">{component.description}</p>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">
                <span className="font-medium">Kategori:</span> {component.category}
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-medium">Dibuat:</span>{' '}
                {component.createdAt.toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-medium">Diperbarui:</span>{' '}
                {component.updatedAt.toLocaleDateString()}
              </p>
              <details className="mt-4">
                <summary className="text-sm text-blue-600 cursor-pointer">
                  Lihat Konten
                </summary>
                <pre className="mt-2 p-4 bg-gray-50 rounded-lg overflow-auto text-sm">
                  {JSON.stringify(component.content, null, 2)}
                </pre>
              </details>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 