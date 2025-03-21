'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { auth, db } from '../../../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
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
import ComponentList from '../../../components/ComponentList';
import { ComponentProperties } from '../../../components/ComponentProperties';
import {
  ComponentData,
  HeadingComponent,
  ParagraphComponent,
  ImageComponent,
  ButtonComponent,
  FormComponent,
  CTAComponent,
  FeaturesComponent,
  TestimonialComponent,
  PricingComponent,
  SpacerComponent
} from '../../../components/EditorComponents';
import { collection, getDocs, query, where } from 'firebase/firestore';
import DashboardLayout from '../../../../components/dashboard/DashboardLayout';

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
}

// Fungsi untuk generate ID unik
const generateId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

const componentMap = {
  heading: HeadingComponent,
  paragraph: ParagraphComponent,
  image: ImageComponent,
  button: ButtonComponent,
  form: FormComponent,
  cta: CTAComponent,
  features: FeaturesComponent,
  testimonial: TestimonialComponent,
  pricing: PricingComponent,
  spacer: SpacerComponent
};

interface SortableComponentProps {
  component: ComponentData;
  index: number;
  selectedComponent: ComponentData | null;
  onSelect: (component: ComponentData) => void;
}

const SortableComponent = ({ component, index, selectedComponent, onSelect }: SortableComponentProps) => {
  const Component = componentMap[component.type];
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return (
    <div 
      onClick={() => isMobile && onSelect(component)}
      className={`relative cursor-pointer transition-all ${
        selectedComponent?.id === component.id ? 'ring-2 ring-blue-600 ring-opacity-100' : 'hover:ring-2 hover:ring-blue-300 hover:ring-opacity-50'
      }`}
    >
      <Component content={component.content} props={component.props} />
    </div>
  );
};

const DroppableContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div 
      className="space-y-4 min-h-[200px] p-2 md:p-4 border-2 border-dashed border-gray-300 rounded-lg"
      data-droppable-id="canvas"
    >
      {children}
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
      fetchLandingPage(user.uid);
    });

    return () => unsubscribe();
  }, [router, params]);

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

      const updateData = {
        title: landingPage.title,
        description: landingPage.description,
        content: landingPage.content,
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

  const handleAddComponent = (type: string) => {
    if (!landingPage) return;

    const newComponent: ComponentData = {
      id: generateId(),
      type: type as keyof typeof componentMap,
      content: type === 'heading' ? 'New Heading' :
               type === 'paragraph' ? 'New paragraph text...' :
               type === 'button' ? 'Click me' :
               type === 'image' ? 'https://placehold.co/400x300' :
               type === 'cta' ? 'Call to Action' :
               '',
      props: type === 'button' ? { variant: 'primary' } :
             type === 'form' ? {
               formFields: [
                 { type: 'text', label: 'Name', placeholder: 'Enter your name', required: true },
                 { type: 'email', label: 'Email', placeholder: 'Enter your email', required: true },
                 { type: 'textarea', label: 'Message', placeholder: 'Enter your message', required: true }
               ]
             } :
             type === 'features' ? {
               features: [
                 { title: 'Feature 1', description: 'Description for feature 1', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
                 { title: 'Feature 2', description: 'Description for feature 2', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
                 { title: 'Feature 3', description: 'Description for feature 3', icon: 'M13 10V3L4 14h7v7l9-11h-7z' }
               ]
             } :
             type === 'testimonial' ? {
               testimonials: [
                 { name: 'John Doe', role: 'CEO', content: 'Great product!', avatar: 'https://placehold.co/100' },
                 { name: 'Jane Smith', role: 'Designer', content: 'Amazing service!', avatar: 'https://placehold.co/100' },
                 { name: 'Mike Johnson', role: 'Developer', content: 'Best in class!', avatar: 'https://placehold.co/100' }
               ]
             } :
             type === 'pricing' ? {
               pricingPlans: [
                 { name: 'Basic', price: '$9', features: ['Feature 1', 'Feature 2', 'Feature 3'], ctaText: 'Get Started', ctaLink: '#', popular: false },
                 { name: 'Pro', price: '$29', features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4'], ctaText: 'Get Started', ctaLink: '#', popular: true },
                 { name: 'Enterprise', price: '$99', features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4', 'Feature 5'], ctaText: 'Get Started', ctaLink: '#', popular: false }
               ]
             } :
             {}
    };

    setLandingPage({
      ...landingPage,
      content: [...landingPage.content, newComponent],
    });
  };

  const handleUpdateComponent = (updatedComponent: ComponentData) => {
    if (!landingPage) return;

    const updatedContent = landingPage.content.map((component) =>
      component.id === updatedComponent.id ? updatedComponent : component
    );

    setLandingPage({
      ...landingPage,
      content: updatedContent,
    });
  };

  const handleDeleteComponent = (componentId: string) => {
    if (!landingPage) return;

    const updatedContent = landingPage.content.filter(
      (component) => component.id !== componentId
    );

    setLandingPage({
      ...landingPage,
      content: updatedContent,
    });

    setSelectedComponent(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!landingPage) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        {/* Top Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border-b border-gray-200 bg-white space-y-4 md:space-y-0">
          <div className="flex-1 md:flex-none">
            <input
              type="text"
              value={landingPage?.title || ''}
              onChange={(e) => setLandingPage(prev => prev ? { ...prev, title: e.target.value } : null)}
              className="text-lg font-semibold text-gray-900 bg-transparent border-none focus:ring-0 p-2 w-full rounded-md hover:bg-gray-50"
              placeholder="Judul Landing Page"
            />
            <input
              type="text"
              value={landingPage?.description || ''}
              onChange={(e) => setLandingPage(prev => prev ? { ...prev, description: e.target.value } : null)}
              className="text-sm text-gray-500 bg-transparent border-none focus:ring-0 p-2 w-full rounded-md hover:bg-gray-50"
              placeholder="Deskripsi Landing Page"
            />
            </div>
          <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
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

        {/* Main Content Area - 3 Column Layout */}
        <div className="flex-1 flex">
          {/* Left Sidebar - Component List */}
          <div className="hidden md:block w-64 bg-white border-r border-gray-200">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Komponen</h2>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <ComponentList onAddComponent={handleAddComponent} />
              </div>
            </div>
          </div>

          {/* Center - Editor Canvas */}
          <div className="flex-1 overflow-y-auto bg-gray-50 p-2 md:p-4">
            <div className="max-w-4xl mx-auto">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                  <SortableContext
                  items={landingPage?.content.map((item) => item.id) || []}
                    strategy={verticalListSortingStrategy}
                  >
                  <DroppableContainer>
                    {landingPage?.content.map((component, index) => (
                      <SortableComponent
                        key={component.id}
                        component={component}
                        index={index}
                        selectedComponent={selectedComponent}
                        onSelect={setSelectedComponent}
                      />
                    ))}
                  </DroppableContainer>
                  </SortableContext>

                <DragOverlay>
                  {activeDraggedComponent && (
                    <div className="opacity-50">
                      {React.createElement(componentMap[activeDraggedComponent.type], {
                        content: activeDraggedComponent.content,
                        props: activeDraggedComponent.props,
                      })}
                    </div>
                  )}
                </DragOverlay>
              </DndContext>
          </div>
        </div>

          {/* Right Sidebar - Properties Panel */}
          <div className={`hidden md:block w-80 bg-white border-l border-gray-200 ${!selectedComponent && 'opacity-50'}`}>
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
                {selectedComponent ? (
              <ComponentProperties
                selectedComponent={selectedComponent}
                    onUpdate={handleUpdateComponent}
                onDelete={handleDeleteComponent}
                    isMobile={isMobile}
              />
                ) : (
                  <div className="text-center text-gray-500 mt-4">
                    Pilih komponen untuk mengedit properti
                  </div>
            )}
          </div>
        </div>
      </div>

          {/* Mobile Component List - Bottom Panel */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
            <div className="p-2 pb-6">
              <div className="flex flex-row flex-nowrap overflow-x-auto py-1">
                {Object.entries(componentMap).map(([type, Component]) => (
                  <button
                    key={type}
                    onClick={() => handleAddComponent(type)}
                    className="flex items-center gap-2 flex-shrink-0 px-3 py-2 mx-1 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors"
                    title={type.charAt(0).toUpperCase() + type.slice(1)}
                  >
                    <div className="w-5 h-5 flex items-center justify-center text-gray-600">
                      {type === 'heading' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 5h14M5 12h14M5 19h14" />
                        </svg>
                      )}
                      {type === 'paragraph' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      )}
                      {type === 'image' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4-4m0 0L20 4m-4 4l4-4M4 8v12a2 2 0 002 2h12a2 2 0 002-2V8M4 8l4-4h8l4 4M8 12a2 2 0 100-4 2 2 0 000 4z" />
                        </svg>
                      )}
                      {type === 'button' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 7v6a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                        </svg>
                      )}
                      {type === 'form' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                      )}
                      {type === 'cta' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                      )}
                      {type === 'features' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                      )}
                      {type === 'testimonial' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      )}
                      {type === 'pricing' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      {type === 'spacer' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0L16 3m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
          </div>
        </div>
      </div>

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
                selectedComponent={selectedComponent}
                    onUpdate={handleUpdateComponent}
                onDelete={handleDeleteComponent}
                    isMobile={isMobile}
              />
            </div>
          </div>
        </div>
      )}
    </div>
      </div>
    </DashboardLayout>
  );
} 