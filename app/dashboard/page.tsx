'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

interface LandingPage {
  id: string;
  title: string;
  description: string;
  content: string;
  status: 'draft' | 'published';
  userId: string;
  createdAt: string;
  updatedAt?: string;
  publishedAt: string | null;
  slug: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [landingPages, setLandingPages] = useState<LandingPage[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState('');
  const [newPageDescription, setNewPageDescription] = useState('');
  const [newPageSlug, setNewPageSlug] = useState('');
  const [slugError, setSlugError] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/auth');
      } else {
        setLoading(false);
        // Fetch landing pages
        const q = query(collection(db, 'landing_pages'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const pages = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as LandingPage[];
        setLandingPages(pages);
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleCreatePage = async () => {
    if (!auth.currentUser) return;

    try {
      if (!newPageTitle || !newPageDescription || !newPageSlug) {
        toast.error('Semua field harus diisi');
        return;
      }

      // Check if slug is unique
      const slugQuery = query(collection(db, 'landing_pages'), where('slug', '==', newPageSlug));
      const slugSnapshot = await getDocs(slugQuery);
      
      if (!slugSnapshot.empty) {
        setSlugError('Slug sudah digunakan, silakan gunakan yang lain');
        return;
      }

      const newPage: Omit<LandingPage, 'id'> = {
        title: newPageTitle,
        description: newPageDescription,
        content: '', // Initialize with empty content
        status: 'draft',
        userId: auth.currentUser.uid,
        createdAt: new Date().toISOString(),
        publishedAt: null,
        slug: newPageSlug
      };

      const docRef = await addDoc(collection(db, 'landing_pages'), newPage);
      const pageWithId = { ...newPage, id: docRef.id };

      setLandingPages(prev => [...prev, pageWithId]);
      setNewPageTitle('');
      setNewPageDescription('');
      setNewPageSlug('');
      setSlugError('');
      toast.success('Landing page berhasil dibuat!');
    } catch (error) {
      console.error('Error creating page:', error);
      toast.error('Gagal membuat landing page');
    }
  };

  const handleDeletePage = async (pageId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus landing page ini?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'landing_pages', pageId));
      setLandingPages(landingPages.filter(page => page.id !== pageId));
      toast.success('Landing page berhasil dihapus!');
    } catch (error) {
      console.error('Error deleting page:', error);
      toast.error('Gagal menghapus landing page');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/auth');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const createTestCollection = async () => {
    if (!auth.currentUser) return;

    try {
      const testData = {
        title: 'Test Page',
        description: 'This is a test page',
        slug: 'test-page',
        userId: auth.currentUser.uid,
        createdAt: new Date().toISOString(),
        status: 'draft' as const
      };

      console.log('Creating test collection with data:', testData);
      const docRef = await addDoc(collection(db, 'landing_pages'), testData);
      console.log('Test document created with ID:', docRef.id);
      toast.success('Test collection created successfully!');
    } catch (error: any) {
      console.error('Error creating test collection:', error);
      console.error('Error details:', {
        name: error.name,
        code: error.code,
        message: error.message
      });
      toast.error('Failed to create test collection: ' + error.message);
    }
  };

  const handlePublish = async (pageId: string) => {
    if (!auth.currentUser) return;

    try {
      const pageRef = doc(db, 'landing_pages', pageId);
      await updateDoc(pageRef, {
        status: 'published',
        publishedAt: new Date().toISOString()
      });

      // Update local state
      setLandingPages(prev => prev.map(page => 
        page.id === pageId 
          ? { ...page, status: 'published', publishedAt: new Date().toISOString() }
          : page
      ));

      toast.success('Landing page berhasil dipublikasikan!');
    } catch (error) {
      console.error('Error publishing page:', error);
      toast.error('Gagal mempublikasikan landing page');
    }
  };

  const handleUnpublish = async (pageId: string) => {
    if (!auth.currentUser) return;

    try {
      const pageRef = doc(db, 'landing_pages', pageId);
      await updateDoc(pageRef, {
        status: 'draft',
        publishedAt: null
      });

      // Update local state
      setLandingPages(prev => prev.map(page => 
        page.id === pageId 
          ? { ...page, status: 'draft', publishedAt: null }
          : page
      ));

      toast.success('Landing page berhasil diunpublish!');
    } catch (error) {
      console.error('Error unpublishing page:', error);
      toast.error('Gagal mengunpublish landing page');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-900"
              title="Logout"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden lg:inline ml-2">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Create New Page Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span className="hidden lg:inline ml-2">Buat Landing Page Baru</span>
          </button>
        </div>

        {/* Landing Pages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {landingPages.map((page) => (
            <div key={page.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{page.title}</h3>
                  <p className="text-gray-600 mt-1">{page.description}</p>
                </div>
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                  page.status === 'published' 
                    ? 'text-green-800 bg-green-100' 
                    : 'text-yellow-800 bg-yellow-100'
                }`}>
                  {page.status === 'published' ? 'Published' : 'Draft'}
                </span>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Link
                  href={`/editor/${page.id}`}
                  className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  title="Edit"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  <span className="hidden lg:inline ml-2">Edit</span>
                </Link>
                
                <Link
                  href={page.status === 'published' ? `/${page.slug}` : `/preview/${page.id}`}
                  target="_blank"
                  className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  title="Preview"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                  <span className="hidden lg:inline ml-2">Preview</span>
                </Link>
                
                {page.status === 'draft' ? (
                  <button
                    onClick={() => handlePublish(page.id)}
                    className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                    title="Publish"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="hidden lg:inline ml-2">Publish</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleUnpublish(page.id)}
                    className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-md hover:bg-yellow-700"
                    title="Unpublish"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                    </svg>
                    <span className="hidden lg:inline ml-2">Unpublish</span>
                  </button>
                )}
                
                <button
                  onClick={() => handleDeletePage(page.id)}
                  className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                  title="Delete"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="hidden lg:inline ml-2">Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Buat Landing Page Baru</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Judul
                </label>
                <input
                  type="text"
                  value={newPageTitle}
                  onChange={(e) => setNewPageTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Masukkan judul landing page"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi
                </label>
                <textarea
                  value={newPageDescription}
                  onChange={(e) => setNewPageDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                  placeholder="Masukkan deskripsi landing page"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug URL
                </label>
                <input
                  type="text"
                  value={newPageSlug}
                  onChange={(e) => setNewPageSlug(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="masukkan-slug-url"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Batal
              </button>
              <button
                onClick={handleCreatePage}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Buat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 