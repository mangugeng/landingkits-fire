'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, doc, getDocs, query, where, updateDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ComponentList } from '@/app/components/ComponentList';
import ComponentRenderer from '@/app/components/editor/ComponentRenderer';
import ComponentProperties from '@/app/components/ComponentProperties';
import { DroppableContainer } from '@/app/components/DroppableContainer';
import { componentMap } from '@/app/components/EditorComponents';
import ThemeSelector from '@/app/components/ThemeSelector';
import ThemeProvider from '@/app/components/ThemeProvider';
import { themeConfigs } from '@/app/lib/themes';
import { ComponentData, ComponentType, ThemeType } from '@/app/types/editor';
import type { User } from 'firebase/auth';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { themeConfigs as oldThemeConfigs } from '@/app/lib/themes';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface LandingPage {
  id: string;
  title: string;
  description: string;
  content: ComponentData[];
  status: 'draft' | 'published';
  userId: string;
  createdAt: string;
  updatedAt?: string;
  publishedAt: string | null;
  slug: string;
  hasUnpublishedChanges?: boolean;
  theme: ThemeType;
}

interface SortableComponentProps {
  component: ComponentData;
  onSelect: (component: ComponentData) => void;
  onDelete: (id: string) => void;
  onMoveUp?: (id: string) => void;
  onMoveDown?: (id: string) => void;
}

const getComponentIcon = (type: ComponentType) => {
  switch (type) {
    case 'heading':
      return <h1 className="w-6 h-6 text-gray-600" />;
    case 'paragraph':
      return <p className="w-6 h-6 text-gray-600" />;
    case 'image':
      return <img className="w-6 h-6 text-gray-600" />;
    case 'button':
      return <button className="w-6 h-6 text-gray-600" />;
    case 'spacer':
      return <div className="w-6 h-6 text-gray-600" />;
    default:
      return <div className="w-6 h-6 text-gray-600" />;
  }
};

const SortableComponent = ({ component, onSelect, onDelete, onMoveUp, onMoveDown }: SortableComponentProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Component clicked:', component);
    onSelect(component);
  };

  const handleMoveUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMoveUp?.(component.id);
  };

  const handleMoveDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMoveDown?.(component.id);
  };
  
  return (
    <div 
      onClick={handleClick}
      className="relative group cursor-pointer p-4 border border-gray-200 rounded-lg hover:border-blue-500 transition-colors"
    >
      <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-5 transition-opacity rounded-lg" />
      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              {getComponentIcon(component.type)}
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                {component.type.charAt(0).toUpperCase() + component.type.slice(1)}
              </h3>
              <p className="text-sm text-gray-500">
                {component.content || 'No content'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex flex-col space-y-1">
              <button
                onClick={handleMoveUp}
                className="p-1 text-gray-400 hover:text-blue-500 rounded-lg hover:bg-blue-50 transition-colors"
                title="Pindahkan ke atas"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <button
                onClick={handleMoveDown}
                className="p-1 text-gray-400 hover:text-blue-500 rounded-lg hover:bg-blue-50 transition-colors"
                title="Pindahkan ke bawah"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
    </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect(component);
              }}
              className="p-2 text-gray-400 hover:text-blue-500 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <PencilIcon className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(component.id);
              }}
              className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Editor() {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [landingPage, setLandingPage] = useState<LandingPage | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<ComponentData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeDraggedComponent, setActiveDraggedComponent] = useState<ComponentData | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('modern');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/auth');
        return;
      }
      setUser(user);
      fetchLandingPage(user.uid);
    });

    return () => unsubscribe();
  }, [router, params]);

  useEffect(() => {
    if (landingPage?.theme) {
      setCurrentTheme(landingPage.theme);
    }
  }, [landingPage]);

  const fetchLandingPage = async (userId: string) => {
    try {
      const landingPagesRef = collection(db, 'landing_pages');
      const q = query(
        landingPagesRef,
        where('userId', '==', userId),
        where('slug', '==', params.slug)
      );
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        toast.error('Landing page tidak ditemukan');
        router.push('/dashboard');
        return;
      }

      const doc = querySnapshot.docs[0];
      const data = doc.data() as LandingPage;
      data.id = doc.id;
      
      setLandingPage(data);
    } catch (error) {
      console.error('Error fetching landing page:', error);
      toast.error('Gagal memuat landing page');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!landingPage) return;

    try {
      setIsSaving(true);
      const docRef = doc(db, 'landing_pages', landingPage.id);

      // Bersihkan data dari nilai undefined
      const cleanContent = landingPage.content.map(component => ({
        ...component,
        props: Object.fromEntries(
          Object.entries(component.props || {}).filter(([_, value]) => value !== undefined)
        )
      }));

      const updateData = {
        title: landingPage.title || '',
        description: landingPage.description || '',
        content: cleanContent,
        updatedAt: serverTimestamp(),
        hasUnpublishedChanges: true
      };

      await updateDoc(docRef, updateData);
      toast.success('Perubahan berhasil disimpan');
    } catch (error) {
      console.error('Error saving landing page:', error);
      toast.error('Gagal menyimpan perubahan');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!landingPage) return;

    try {
      setIsPublishing(true);
      const docRef = doc(db, 'landing_pages', landingPage.id);

      const updateData = {
        status: 'published',
        publishedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        hasUnpublishedChanges: false
      };

      await updateDoc(docRef, updateData);
      toast.success('Landing page berhasil dipublikasikan');
    } catch (error) {
      console.error('Error publishing landing page:', error);
      toast.error('Gagal mempublikasikan landing page');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);

    const draggedComponent = landingPage?.content.find(
      (component) => component.id === active.id
    );
    if (draggedComponent) {
      setActiveDraggedComponent(draggedComponent);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id && landingPage) {
      const oldIndex = landingPage.content.findIndex(
        (component) => component.id === active.id
      );
      const newIndex = landingPage.content.findIndex(
        (component) => component.id === over.id
      );

      setLandingPage({
        ...landingPage,
        content: arrayMove(landingPage.content, oldIndex, newIndex),
      });
    }

    setActiveId(null);
    setActiveDraggedComponent(null);
  };

  const handleAddComponent = (component: ComponentType | ComponentData) => {
    let newComponent: ComponentData;

    if (typeof component === 'string') {
      if (component === 'header') {
        newComponent = {
          id: `comp-${Date.now()}`,
          type: component,
          content: '',
          props: {
            logo: {
              src: 'https://placehold.co/200x50',
              alt: 'Logo',
              width: 200,
              height: 50
            },
            navigation: [
              { label: 'Beranda', href: '/' },
              { label: 'Tentang', href: '/about' },
              { label: 'Layanan', href: '/services' },
              { label: 'Kontak', href: '/contact' }
            ],
            ctaButton: {
              text: 'Hubungi Kami',
              href: '/contact',
              variant: 'primary'
            },
            isSticky: true,
            backgroundType: 'color',
            backgroundColor: '#ffffff'
          }
        };
      } else if (component === 'footer') {
        newComponent = {
          id: `comp-${Date.now()}`,
          type: component,
          content: '',
          props: {
            footerLinks: [
              {
                title: 'Perusahaan',
                links: [
                  { label: 'Tentang Kami', href: '/about' },
                  { label: 'Karir', href: '/careers' },
                  { label: 'Blog', href: '/blog' }
                ]
              },
              {
                title: 'Layanan',
                links: [
                  { label: 'Produk', href: '/products' },
                  { label: 'Solusi', href: '/solutions' },
                  { label: 'Pricing', href: '/pricing' }
                ]
              },
              {
                title: 'Dukungan',
                links: [
                  { label: 'FAQ', href: '/faq' },
                  { label: 'Kontak', href: '/contact' },
                  { label: 'Bantuan', href: '/help' }
                ]
              }
            ],
            socialLinks: [
              { platform: 'facebook', url: 'https://facebook.com' },
              { platform: 'twitter', url: 'https://twitter.com' },
              { platform: 'instagram', url: 'https://instagram.com' },
              { platform: 'linkedin', url: 'https://linkedin.com' }
            ],
            copyright: '© 2024 Nama Perusahaan. All rights reserved.',
            backgroundType: 'color',
            backgroundColor: '#f3f4f6'
          }
        };
      } else {
        newComponent = {
          id: `comp-${Date.now()}`,
          type: component,
          content: '',
          props: undefined
        };
      }
    } else {
      newComponent = component;
    }

    setLandingPage(prev => prev ? {
      ...prev,
      content: [...(prev.content || []), newComponent]
    } : null);
  };

  const handleUpdateComponent = (updatedComponent: ComponentData) => {
    if (!landingPage) return;

    console.log('Updating component:', updatedComponent);

    const updatedContent = landingPage.content.map((component: ComponentData) =>
      component.id === updatedComponent.id ? updatedComponent : component
    );

    setLandingPage({
      ...landingPage,
      content: updatedContent,
    });
  };

  const handleDeleteComponent = (componentId: string) => {
    if (!landingPage) return;

    console.log('Deleting component:', componentId);

    const updatedContent = landingPage.content.filter(
      (component: ComponentData) => component.id !== componentId
    );

    setLandingPage({
      ...landingPage,
      content: updatedContent,
    });

    setSelectedComponent(null);
  };

  const handleMoveUp = (componentId: string) => {
    if (!landingPage) return;

    const currentIndex = landingPage.content.findIndex(
      (component) => component.id === componentId
    );

    if (currentIndex > 0) {
      const newContent = [...landingPage.content];
      [newContent[currentIndex], newContent[currentIndex - 1]] = [
        newContent[currentIndex - 1],
        newContent[currentIndex],
      ];

      setLandingPage({
        ...landingPage,
        content: newContent,
      });
    }
  };

  const handleMoveDown = (componentId: string) => {
    if (!landingPage) return;

    const currentIndex = landingPage.content.findIndex(
      (component) => component.id === componentId
    );

    if (currentIndex < landingPage.content.length - 1) {
      const newContent = [...landingPage.content];
      [newContent[currentIndex], newContent[currentIndex + 1]] = [
        newContent[currentIndex + 1],
        newContent[currentIndex],
      ];

      setLandingPage({
        ...landingPage,
        content: newContent,
      });
    }
  };

  const handleThemeSelect = async (theme: ThemeType) => {
    if (!landingPage) return;

    try {
      setCurrentTheme(theme);
      setShowThemeSelector(false);

      // Update landing page dengan tema baru
      const updatedLandingPage = {
        ...landingPage,
        theme,
        themeConfig: themeConfigs[theme],
        updatedAt: new Date().toISOString()
      };

      // Simpan ke database
      const docRef = doc(db, 'landing_pages', landingPage.id);
      await updateDoc(docRef, {
        theme,
        themeConfig: themeConfigs[theme],
        updatedAt: serverTimestamp()
      });

      setLandingPage(updatedLandingPage);
      toast.success('Tema berhasil diperbarui');
    } catch (error) {
      console.error('Error updating theme:', error);
      toast.error('Gagal memperbarui tema');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!landingPage) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Landing page tidak ditemukan</p>
      </div>
    );
  }

  return (
    <ThemeProvider theme={currentTheme}>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        {/* Top Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border-b border-gray-200 bg-white space-y-4 md:space-y-0">
          <div className="flex-1 md:flex-none">
            <input
              type="text"
              value={landingPage?.title || ''}
              onChange={(e) => setLandingPage((prev: LandingPage | null) => prev ? { ...prev, title: e.target.value } : null)}
              className="text-lg font-semibold text-gray-900 bg-transparent border-none focus:ring-0 p-2 w-full rounded-md hover:bg-gray-50"
              placeholder="Judul Landing Page"
            />
            <input
              type="text"
              value={landingPage?.description || ''}
              onChange={(e) => setLandingPage((prev: LandingPage | null) => prev ? { ...prev, description: e.target.value } : null)}
              className="text-sm text-gray-500 bg-transparent border-none focus:ring-0 p-2 w-full rounded-md hover:bg-gray-50"
              placeholder="Deskripsi Landing Page"
            />
          </div>
          <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
            <button
              onClick={() => setShowThemeSelector(true)}
              className="flex-1 md:flex-none px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                Tema
              </span>
            </button>
            <button
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className="flex-1 md:flex-none px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              {isPreviewMode ? 'Edit' : 'Preview'}
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 md:flex-none px-3 py-1.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSaving ? 'Menyimpan...' : 'Simpan'}
            </button>
            <button
              onClick={handlePublish}
              disabled={isPublishing}
              className="flex-1 md:flex-none px-3 py-1.5 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {isPublishing ? 'Mempublikasi...' : 'Publikasi'}
            </button>
          </div>
        </div>

        <div className="flex-1 flex">
          {/* Left Sidebar - Component List */}
          {!isPreviewMode && (
            <div className="hidden md:block w-56 bg-white border-r border-gray-200">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-3 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Komponen</h2>
                </div>
                <div className="flex-1 overflow-y-auto p-3">
                  <ComponentList onAddComponent={handleAddComponent} />
                </div>
              </div>
            </div>
          )}

          {/* Center - Editor Canvas */}
          <div className={`flex-1 overflow-y-auto bg-gray-50 p-2 ${isPreviewMode ? 'md:px-8' : ''}`}>
            <div className="px-2">
              {isPreviewMode ? (
                <div className="space-y-8 max-w-4xl mx-auto">
                  {landingPage?.content.map((component: ComponentData) => (
                    <div key={component.id}>
                      {component.type === 'heading' && (
                        <div className={`${component.props?.level === 'h1' ? 'text-4xl' : 
                          component.props?.level === 'h2' ? 'text-3xl' : 
                          component.props?.level === 'h3' ? 'text-2xl' : 
                          component.props?.level === 'h4' ? 'text-xl' : 
                          component.props?.level === 'h5' ? 'text-lg' : 
                          'text-base'} font-bold text-gray-900`}>
                          {component.content}
                        </div>
                      )}
                      {component.type === 'paragraph' && (
                        <p className="text-base text-gray-600 leading-relaxed">
                          {component.content}
                        </p>
                      )}
                      {component.type === 'image' && (
                        <img 
                          src={component.content} 
                          alt={component.props?.alt || ''} 
                          className="w-full h-auto rounded-lg shadow-sm" 
                        />
                      )}
                      {component.type === 'button' && (
                        <button 
                          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                            component.props?.style === 'primary' ? 'bg-blue-600 text-white hover:bg-blue-700' :
                            component.props?.style === 'secondary' ? 'bg-gray-600 text-white hover:bg-gray-700' :
                            'border-2 border-gray-300 text-gray-700 hover:border-gray-400'
                          }`}
                        >
                          {component.content}
                        </button>
                      )}
                      {component.type === 'form' && (
                        <div className="space-y-4 bg-white p-6 rounded-lg border border-gray-200">
                          {component.props?.formFields?.map((field, index) => (
                            <div key={index} className="space-y-1">
                              <label className="block text-sm font-medium text-gray-700">
                                {field.label} {field.required && <span className="text-red-500">*</span>}
                              </label>
                              {field.type === 'textarea' ? (
                                <textarea
                                  placeholder={field.placeholder}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                  rows={4}
                                />
                              ) : (
                                <input
                                  type={field.type}
                                  placeholder={field.placeholder}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                              )}
                            </div>
                          ))}
                          <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                            Submit
                          </button>
                        </div>
                      )}
                      {component.type === 'features' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {component.props?.features?.map((feature, index) => (
                            <div key={index} className="p-6 bg-white rounded-lg border border-gray-200">
                              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                                </svg>
                              </div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                              <p className="text-gray-600">{feature.description}</p>
                            </div>
                          ))}
                        </div>
                      )}
                      {component.type === 'testimonial' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {component.props?.testimonials?.map((testimonial, index) => (
                            <div key={index} className="p-6 bg-white rounded-lg border border-gray-200">
                              <div className="flex items-center mb-4">
                                <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full" />
                                <div className="ml-4">
                                  <h4 className="text-lg font-semibold text-gray-900">{testimonial.name}</h4>
                                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                                </div>
                              </div>
                              <p className="text-gray-600 italic">"{testimonial.content}"</p>
                            </div>
                          ))}
                        </div>
                      )}
                      {component.type === 'pricing' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {component.props?.pricingPlans?.map((plan, index) => (
                            <div key={index} className={`p-6 bg-white rounded-lg border-2 ${plan.popular ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-50' : 'border-gray-200'}`}>
                              {plan.popular && (
                                <span className="inline-block px-3 py-1 text-sm text-blue-600 bg-blue-50 rounded-full mb-4">
                                  Popular
                                </span>
                              )}
                              <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                              <p className="text-3xl font-bold text-gray-900 mb-4">{plan.price}</p>
                              <ul className="space-y-3 mb-6">
                                {plan.features.map((feature, featureIndex) => (
                                  <li key={featureIndex} className="flex items-center text-gray-600">
                                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                              <a
                                href={plan.ctaLink}
                                className={`block w-full px-6 py-3 text-center rounded-lg font-medium transition-colors ${
                                  plan.popular ? 'bg-blue-600 text-white hover:bg-blue-700' : 'border-2 border-gray-300 text-gray-700 hover:border-gray-400'
                                }`}
                              >
                                {plan.ctaText}
                              </a>
                            </div>
                          ))}
                        </div>
                      )}
                      {component.type === 'cta' && (
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-center">
                          <h2 className="text-2xl font-bold text-white mb-4">{component.content}</h2>
                          <button className="px-8 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                            Get Started
                          </button>
                        </div>
                      )}
                      {component.type === 'spacer' && (
                        <div style={{ height: component.props?.height || 20 }} />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={Array.isArray(landingPage?.content) ? landingPage.content.map((item: ComponentData) => item.id) : []}
                    strategy={verticalListSortingStrategy}
                  >
                    <DroppableContainer>
                      {landingPage?.content.map((component: ComponentData) => (
                        <ComponentRenderer
                          key={component.id}
                          component={component}
                          onSelect={() => setSelectedComponent(component)}
                          onDelete={() => handleDeleteComponent(component.id)}
                          isEditor={true}
                          onMoveUp={() => handleMoveUp(component.id)}
                          onMoveDown={() => handleMoveDown(component.id)}
                        />
                      ))}
                    </DroppableContainer>
                  </SortableContext>

                  <DragOverlay>
                    {activeDraggedComponent && (
                      <div className="opacity-50">
                        {React.createElement(componentMap[activeDraggedComponent.type as keyof typeof componentMap], {
                          content: activeDraggedComponent.content,
                          props: activeDraggedComponent.props,
                        })}
                      </div>
                    )}
                  </DragOverlay>
                </DndContext>
              )}
            </div>
          </div>

          {/* Right Sidebar - Properties Panel */}
          {!isPreviewMode && (
            <div className="hidden md:block w-80 bg-white border-l border-gray-200">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Properti</h2>
                  {selectedComponent && (
                    <button
                      onClick={() => setSelectedComponent(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  {selectedComponent && (
                    <ComponentProperties
                      component={selectedComponent}
                      onUpdate={handleUpdateComponent}
                      onDelete={handleDeleteComponent}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Component List - Bottom Panel */}
        {!isPreviewMode && isMobile && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
            <ComponentList onAddComponent={handleAddComponent} />
          </div>
        )}

        {/* Mobile Properties Panel */}
        {selectedComponent && (
          <div className="md:hidden fixed inset-y-0 right-0 z-50 w-full bg-white border-l border-gray-200 transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Properti</h2>
                <button 
                  onClick={() => setSelectedComponent(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 pb-28">
                <ComponentProperties
                  component={selectedComponent}
                  onUpdate={handleUpdateComponent}
                  onDelete={handleDeleteComponent}
                />
              </div>
            </div>
          </div>
        )}

        {/* Modal pemilih tema */}
        {showThemeSelector && (
          <ThemeSelector
            onSelectTheme={handleThemeSelect}
            onClose={() => setShowThemeSelector(false)}
          />
        )}
      </div>
    </ThemeProvider>
  );
} 