'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { auth, db } from '../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
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
import { ComponentList } from '../../components/ComponentList';
import { ComponentProperties } from '../../components/ComponentProperties';
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
} from '../../components/EditorComponents';

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
  
  return (
    <div 
      onClick={() => onSelect(component)}
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
      className="space-y-4 min-h-[200px] p-4 border-2 border-dashed border-gray-300 rounded-lg"
      data-droppable-id="canvas"
    >
      {children}
    </div>
  );
};

export default function EditorPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<LandingPage | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hasUnpublishedChanges, setHasUnpublishedChanges] = useState(false);
  const [editingComponent, setEditingComponent] = useState<ComponentData | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<ComponentData | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/auth');
        return;
      }

      try {
        const pageId = Array.isArray(params.id) ? params.id[0] : params.id;
        const docRef = doc(db, 'landing_pages', pageId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data() as LandingPage;
          if (data.userId !== user.uid) {
            router.push('/dashboard');
            return;
          }
          setPage({
            ...data,
            content: Array.isArray(data.content) ? data.content : []
          });
          setTitle(data.title);
          setDescription(data.description);
          setHasUnpublishedChanges(data.hasUnpublishedChanges || false);
        } else {
          router.push('/dashboard');
          return;
        }
      } catch (error) {
        console.error('Error fetching page:', error);
        router.push('/dashboard');
        return;
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, params.id]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (active.id.toString().startsWith('sidebar-')) {
      const componentType = active.id.toString().replace('sidebar-', '') as ComponentData['type'];
      handleAddComponent(componentType);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !page) return;

    if (active.id !== over.id) {
      const oldIndex = page.content.findIndex((item) => item.id === active.id);
      const newIndex = page.content.findIndex((item) => item.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        setPage(prev => prev ? {
          ...prev,
          content: arrayMove(prev.content, oldIndex, newIndex)
        } : null);
        setHasUnpublishedChanges(true);
      }
    }
  };

  const handleSave = async () => {
    try {
      if (!page) return;

      const pageId = page.id || (Array.isArray(params.id) ? params.id[0] : params.id);
      if (!pageId) {
        console.error('Page ID not available');
        toast.error('ID halaman tidak tersedia');
        return;
      }

      // Pastikan semua field terdefinisi dengan nilai default
      const pageData = {
        id: pageId,
        title: title || '',
        description: description || '',
        content: Array.isArray(page.content) ? page.content.map(component => {
          // Pastikan setiap komponen memiliki struktur yang valid
          const validComponent = {
            id: component.id || generateId(),
            type: component.type,
            content: component.content || '',
            props: {
              ...component.props,
              // Pastikan setiap properti komponen memiliki nilai default
              variant: component.props?.variant || 'primary',
              size: component.props?.size || 'md',
              alignment: component.props?.alignment || 'left',
              backgroundColor: component.props?.backgroundColor || '',
              textColor: component.props?.textColor || '',
              imageUrl: component.props?.imageUrl || '',
              imageAlt: component.props?.imageAlt || '',
              formFields: Array.isArray(component.props?.formFields) ? component.props.formFields.map(field => ({
                type: field.type || 'text',
                label: field.label || '',
                placeholder: field.placeholder || '',
                required: field.required || false,
                options: Array.isArray(field.options) ? field.options : []
              })) : [],
              features: Array.isArray(component.props?.features) ? component.props.features.map(feature => ({
                title: feature.title || '',
                description: feature.description || '',
                icon: feature.icon || ''
              })) : [],
              testimonials: Array.isArray(component.props?.testimonials) ? component.props.testimonials.map(testimonial => ({
                name: testimonial.name || '',
                role: testimonial.role || '',
                content: testimonial.content || '',
                avatar: testimonial.avatar || ''
              })) : [],
              pricingPlans: Array.isArray(component.props?.pricingPlans) ? component.props.pricingPlans.map(plan => ({
                name: plan.name || '',
                price: plan.price || '',
                features: Array.isArray(plan.features) ? plan.features : [],
                ctaText: plan.ctaText || '',
                ctaLink: plan.ctaLink || '',
                popular: plan.popular || false
              })) : [],
              height: typeof component.props?.height === 'number' ? component.props.height : 40,
              description: component.props?.description || '',
              ctaText: component.props?.ctaText || 'Get Started'
            }
          };

          // Hapus properti yang undefined
          Object.keys(validComponent.props).forEach(key => {
            if (validComponent.props[key as keyof typeof validComponent.props] === undefined) {
              delete validComponent.props[key as keyof typeof validComponent.props];
            }
          });

          return validComponent;
        }) : [],
        status: page.status || 'draft',
        slug: page.slug || '',
        userId: page.userId || '',
        createdAt: page.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        publishedAt: page.publishedAt || null
      };

      // Hapus field yang undefined dari pageData
      Object.keys(pageData).forEach(key => {
        if (pageData[key as keyof typeof pageData] === undefined) {
          delete pageData[key as keyof typeof pageData];
        }
      });

      // Pastikan content adalah array
      if (!Array.isArray(pageData.content)) {
        pageData.content = [];
      }

      console.log('Saving page with ID:', pageId);
      console.log('Data to update:', JSON.stringify(pageData, null, 2));

      await updateDoc(doc(db, 'landing_pages', pageId), pageData);
      setHasUnpublishedChanges(false);
      toast.success('Perubahan berhasil disimpan');
    } catch (error) {
      console.error('Error saving page:', error);
      toast.error('Gagal menyimpan perubahan');
    }
  };

  const handlePublish = async () => {
    if (!auth.currentUser) return;

    try {
      const pageId = page?.id || (Array.isArray(params.id) ? params.id[0] : params.id);
      if (!pageId) {
        console.error('Page ID not available');
        toast.error('ID halaman tidak tersedia');
        return;
      }

      console.log('Publishing page with ID:', pageId);
      const pageRef = doc(db, 'landing_pages', pageId);
      
      const updateData = {
        status: 'published' as const,
        publishedAt: new Date().toISOString(),
        hasUnpublishedChanges: false
      };

      console.log('Updating with data:', updateData);
      await updateDoc(pageRef, updateData);

      // Update local state
      setPage(prev => prev ? {
        ...prev,
        ...updateData
      } : null);

      setHasUnpublishedChanges(false);
      toast.success('Halaman berhasil dipublikasikan!');
    } catch (error) {
      console.error('Error publishing page:', error);
      toast.error('Gagal mempublikasikan halaman');
    }
  };

  const handleAddComponent = (type: ComponentData['type']) => {
    if (!page) return;

    const newComponent: ComponentData = {
      id: `comp-${Date.now()}`,
      type,
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
             undefined
    };

    setPage(prev => prev ? {
      ...prev,
      content: [...(prev.content || []), newComponent]
    } : null);
  };

  const handleEditComponent = (id: string) => {
    console.log('Edit component clicked:', id);
    if (!page) return;
    const component = page.content.find(c => c.id === id);
    console.log('Found component:', component);
    if (component) {
      setEditingComponent(component);
      setIsEditModalOpen(true);
    }
  };

  const handleDeleteComponent = (id: string) => {
    console.log('Delete component clicked:', id);
    if (!page) return;
    console.log('Current page content:', page.content);
    
    // Hapus komponen dari content
    setPage(prev => {
      if (!prev) return null;
      const newContent = prev.content.filter(c => c.id !== id);
      console.log('New content after delete:', newContent);
      return {
        ...prev,
        content: newContent
      };
    });

    // Reset selectedComponent ke null untuk mengosongkan panel properti
    setSelectedComponent(null);
    
    setHasUnpublishedChanges(true);
  };

  const handleUpdateComponent = (updatedComponent: ComponentData) => {
    if (!page) return;
    setPage(prev => prev ? {
      ...prev,
      content: prev.content.map(c => 
        c.id === updatedComponent.id ? updatedComponent : c
      )
    } : null);
    setHasUnpublishedChanges(true);
    setIsEditModalOpen(false);
    setEditingComponent(null);
  };

  const handleComponentSelect = (component: ComponentData) => {
    setSelectedComponent(component);
  };

  const handleComponentUpdate = (updatedComponent: ComponentData) => {
    if (!page) return;

    const newContent = page.content.map((comp: ComponentData) => {
      if (comp.id === updatedComponent.id) {
        return updatedComponent;
      }
      return comp;
    });

    setPage({
      ...page,
      content: newContent
    });
    setHasUnpublishedChanges(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Sticky Navbar */}
      <nav className="sticky top-0 bg-white border-b border-gray-200 z-50">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                <span className="hidden lg:inline">Kembali ke Dashboard</span>
              </button>
              <h1 className="text-xl font-semibold text-gray-900 hidden lg:block">Edit Landing Page</h1>
            </div>

            <div className="flex items-center gap-4">
              {hasUnpublishedChanges && (
                <span className="hidden lg:inline-block text-sm text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
                  Ada perubahan yang belum dipublish
                </span>
              )}
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="flex items-center justify-center px-3 lg:px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  title="Simpan"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 lg:mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="hidden lg:inline">Simpan</span>
                </button>
                <button
                  onClick={handlePublish}
                  className="flex items-center justify-center px-3 lg:px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md"
                  title="Publish"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 lg:mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="hidden lg:inline">Publish</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Title and Description */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Judul Halaman
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setHasUnpublishedChanges(true);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deskripsi
            </label>
            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setHasUnpublishedChanges(true);
              }}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Sidebar - Component List */}
        <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto lg:block hidden">
          <ComponentList onAddComponent={handleAddComponent} />
        </div>

        {/* Main Canvas */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-4 lg:p-8 pb-32 lg:pb-8">
            <div className="bg-white rounded-lg shadow-sm p-4 lg:p-8">
              <DroppableContainer>
                <SortableContext items={page?.content || []} strategy={verticalListSortingStrategy}>
                  {page?.content.map((component: ComponentData, index: number) => (
                    <SortableComponent 
                      key={component.id} 
                      component={component} 
                      index={index} 
                      selectedComponent={selectedComponent}
                      onSelect={handleComponentSelect}
                    />
                  ))}
                </SortableContext>
              </DroppableContainer>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Properties Panel */}
        <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto lg:block hidden">
          <ComponentProperties
            selectedComponent={selectedComponent}
            onUpdate={handleComponentUpdate}
            onDelete={handleDeleteComponent}
          />
        </div>

        {/* Mobile: Bottom Component List */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40">
          <div className="overflow-x-auto">
            <div className="flex space-x-4 pb-2">
              <ComponentList onAddComponent={handleAddComponent} isMobile={true} />
            </div>
          </div>
        </div>

        {/* Mobile: Properties Panel Dialog */}
        {selectedComponent && (
          <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl max-h-[80vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
                <h3 className="text-lg font-medium">Properties</h3>
                <button 
                  onClick={() => setSelectedComponent(null)}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <ComponentProperties
                  selectedComponent={selectedComponent}
                  onUpdate={handleComponentUpdate}
                  onDelete={handleDeleteComponent}
                  isMobile={true}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 