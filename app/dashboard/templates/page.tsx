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
import { templateService, Template } from '@/app/lib/templates';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import { Skeleton } from "@/app/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";

export default function TemplatesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [newLandingPageTitle, setNewLandingPageTitle] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedTemplates = await templateService.getAllTemplates();
        if (fetchedTemplates.length === 0) {
          setError('Tidak ada template yang tersedia');
        }
        setTemplates(fetchedTemplates);
      } catch (error) {
        console.error('Error fetching templates:', error);
        setError('Gagal mengambil template. Silakan coba lagi nanti.');
        toast.error('Gagal mengambil template');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateLandingPage = async () => {
    if (!selectedTemplate || !userId || !newLandingPageTitle) return;

    try {
      // Simpan template yang dipilih di localStorage
      localStorage.setItem('selectedTemplate', JSON.stringify(selectedTemplate));
      
      // Arahkan ke halaman create dengan parameter template
      router.push(`/dashboard/landingpage/create?template=${selectedTemplate.id}`);
      
      toast.success('Membuat landing page dari template...');
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error creating landing page:', error);
      toast.error('Gagal membuat landing page');
    }
  };

  const renderTemplateCard = (template: Template) => (
    <Card key={template.id} className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle>{template.name}</CardTitle>
        <CardDescription>{template.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="aspect-video bg-gray-100 rounded-md mb-4">
          {template.thumbnail && (
            <img 
              src={template.thumbnail} 
              alt={template.name}
              className="w-full h-full object-cover rounded-md"
            />
          )}
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="w-full"
              onClick={() => setSelectedTemplate(template)}
            >
              Buat Landing Page
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Buat Landing Page Baru</DialogTitle>
              <DialogDescription>
                Masukkan judul untuk landing page Anda
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Judul Landing Page</Label>
                <Input
                  id="title"
                  value={newLandingPageTitle}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewLandingPageTitle(e.target.value)}
                  placeholder="Masukkan judul landing page"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateLandingPage}>
                Buat Landing Page
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );

  const renderLoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full mt-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="aspect-video w-full rounded-md mb-4" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Template</h1>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Cari template..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">Semua</TabsTrigger>
            <TabsTrigger value="business">Bisnis</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="ecommerce">E-commerce</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            {loading ? renderLoadingSkeleton() : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map(renderTemplateCard)}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 