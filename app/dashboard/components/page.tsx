'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Search } from "lucide-react";
import { componentEditorService, ComponentEditor } from '@/app/lib/component-editor';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Skeleton } from "@/app/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";

export default function ComponentsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [components, setComponents] = useState<ComponentEditor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchComponents = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        setError(null);
        const fetchedComponents = await componentEditorService.getAllComponents(userId);
        if (fetchedComponents.length === 0) {
          setError('Tidak ada komponen yang tersedia');
        }
        setComponents(fetchedComponents);
      } catch (error) {
        console.error('Error fetching components:', error);
        setError('Gagal mengambil komponen. Silakan coba lagi nanti.');
        toast.error('Gagal mengambil komponen');
      } finally {
        setLoading(false);
      }
    };

    fetchComponents();
  }, [userId]);

  const filteredComponents = components.filter(component => {
    const matchesSearch = component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         component.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || component.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDeleteComponent = async (id: string) => {
    try {
      await componentEditorService.deleteComponent(id);
      setComponents(components.filter(comp => comp.id !== id));
      toast.success('Komponen berhasil dihapus');
    } catch (error) {
      console.error('Error deleting component:', error);
      toast.error('Gagal menghapus komponen');
    }
  };

  const renderLoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full mt-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderComponentCard = (component: ComponentEditor) => (
    <Card key={component.id} className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle>{component.name}</CardTitle>
        <CardDescription>{component.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Kategori: {component.category}</span>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => component.id && handleDeleteComponent(component.id)}
            >
              Hapus
            </Button>
          </div>
          <div className="text-sm text-gray-500">
            Dibuat: {new Date(component.createdAt).toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Komponen Editor</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Cari komponen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">Semua</TabsTrigger>
          <TabsTrigger value="custom">Custom</TabsTrigger>
          <TabsTrigger value="heading">Heading</TabsTrigger>
          <TabsTrigger value="paragraph">Paragraph</TabsTrigger>
          <TabsTrigger value="image">Image</TabsTrigger>
          <TabsTrigger value="button">Button</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {loading ? renderLoadingSkeleton() : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredComponents.map(renderComponentCard)}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 