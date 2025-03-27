"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import ViewTracker from '@/app/components/analytics/ViewTracker';
import { 
  trackRegistration, 
  trackPurchase, 
  trackDownload, 
  trackContact, 
  trackSubscribe, 
  trackShare, 
  trackCTAClick 
} from '@/app/components/analytics/Tracking';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface LandingPage {
  id: string;
  title: string;
  description: string;
  content: string;
  status: 'published' | 'draft';
  createdAt: Date;
  updatedAt: Date;
  slug: string;
  userId: string;
}

export default function LandingPage() {
  const params = useParams();
  const [page, setPage] = useState<LandingPage | null>(null);
  const [loading, setLoading] = useState(true);
  const pageId = params.id as string;

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const pageDoc = await getDoc(doc(db, 'landing_pages', pageId));
        if (pageDoc.exists()) {
          setPage({
            id: pageDoc.id,
            ...pageDoc.data(),
            createdAt: pageDoc.data().createdAt.toDate(),
            updatedAt: pageDoc.data().updatedAt.toDate(),
            slug: pageDoc.data().slug,
            userId: pageDoc.data().userId
          } as LandingPage);
        } else {
          toast.error("Landing page tidak ditemukan");
        }
      } catch (error) {
        console.error('Error fetching page:', error);
        toast.error("Terjadi kesalahan saat memuat landing page");
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [pageId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Landing Page Tidak Ditemukan</h1>
          <p className="text-gray-500">Maaf, landing page yang Anda cari tidak tersedia.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Track views */}
      <ViewTracker slug={page.slug} userId={page.userId} />

      {/* Hero Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-6">{page.title}</h1>
          <p className="text-xl text-gray-600 mb-8">{page.description}</p>
          <Button 
            size="lg"
            onClick={async () => {
              await trackCTAClick(pageId);
              toast.success("Terima kasih telah mengklik CTA!");
            }}
          >
            Mulai Sekarang
          </Button>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: page.content }} />
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Fitur Utama</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Fitur 1</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Deskripsi fitur 1</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Fitur 2</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Deskripsi fitur 2</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Fitur 3</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Deskripsi fitur 3</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Hubungi Kami</h2>
          <Card className="max-w-lg mx-auto">
            <CardContent className="pt-6">
              <form onSubmit={async (e) => {
                e.preventDefault();
                await trackContact(pageId);
                toast.success("Pesan Anda telah terkirim!");
              }}>
                <div className="space-y-4">
                  <Input placeholder="Nama Lengkap" required />
                  <Input type="email" placeholder="Email" required />
                  <Textarea placeholder="Pesan" required />
                  <Button type="submit" className="w-full">
                    Kirim Pesan
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Siap Memulai?</h2>
          <p className="text-xl mb-8">Bergabunglah dengan ribuan pengguna yang telah merasakan manfaatnya</p>
          <div className="space-x-4">
            <Button 
              variant="secondary"
              onClick={async () => {
                await trackRegistration(pageId);
                toast.success("Terima kasih telah mendaftar!");
              }}
            >
              Daftar Sekarang
            </Button>
            <Button 
              variant="outline"
              onClick={async () => {
                await trackDownload(pageId);
                toast.success("Download dimulai!");
              }}
            >
              Download Ebook
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <p>&copy; 2024 {page.title}. All rights reserved.</p>
            <div className="space-x-4">
              <Button 
                variant="ghost"
                onClick={async () => {
                  await trackShare(pageId);
                  toast.success("Terima kasih telah membagikan!");
                }}
              >
                Share
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 