'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { toast } from 'sonner';
import { templateService } from '@/app/lib/templates';
import { landingPageService } from '@/app/lib/landingpage';

function CreateLandingPageForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [slug, setSlug] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  useEffect(() => {
    // Cek apakah ada template yang dipilih
    const templateId = searchParams.get('template');
    if (templateId) {
      const template = localStorage.getItem('selectedTemplate');
      if (template) {
        setSelectedTemplate(JSON.parse(template));
        // Set judul default dari template
        setTitle(`${JSON.parse(template).name} - Landing Page`);
      }
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user?.uid) return;

    try {
      setIsLoading(true);

      let landingPageId;
      if (selectedTemplate) {
        // Buat landing page dari template
        landingPageId = await templateService.createLandingPageFromTemplate(
          selectedTemplate.id,
          user.uid,
          title,
          slug
        );
      } else {
        // Buat landing page baru
        landingPageId = await landingPageService.createLandingPage({
          title,
          description,
          slug,
          userId: user.uid,
          content: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          isActive: true,
          status: 'draft',
          views: 0,
          conversions: 0
        });
      }

      toast.success('Landing page berhasil dibuat!');
      router.push(`/dashboard/editor/${landingPageId}`);
    } catch (error) {
      console.error('Error creating landing page:', error);
      toast.error('Gagal membuat landing page');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">
        {selectedTemplate ? 'Buat Landing Page dari Template' : 'Buat Landing Page Baru'}
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="space-y-2">
          <Label htmlFor="title">Judul</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Masukkan judul landing page"
            required
          />
        </div>

        {!selectedTemplate && (
          <>
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Masukkan deskripsi landing page"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="masukkan-slug"
                required
              />
            </div>
          </>
        )}

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Membuat...' : 'Buat Landing Page'}
        </Button>
      </form>
    </div>
  );
}

export default function CreateLandingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateLandingPageForm />
    </Suspense>
  );
} 