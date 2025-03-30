'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { useAuth } from "@/app/contexts/AuthContext";
import { MagnifyingGlassIcon, InformationCircleIcon, GlobeAltIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

interface LandingPage {
  id: string;
  title: string;
  slug: string;
  domain?: string;
  subdomain?: string;
  seo: {
    title: string;
    description: string;
    keywords: string;
    ogImage: string;
    ogTitle: string;
    ogDescription: string;
  };
}

export default function SEODashboard() {
  const { user } = useAuth();
  const [landingPages, setLandingPages] = useState<LandingPage[]>([]);
  const [selectedPage, setSelectedPage] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [isTipsOpen, setIsTipsOpen] = useState(false);

  useEffect(() => {
    fetchLandingPages();
  }, []);

  const fetchLandingPages = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "landing_pages"));
      const pages = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as LandingPage[];
      setLandingPages(pages);
      if (pages.length > 0) {
        setSelectedPage(pages[0].id);
      }
    } catch (error) {
      console.error("Error fetching landing pages:", error);
      toast.error("Gagal mengambil data landing page");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSEO = async (pageId: string, seoData: any, domainData: any) => {
    try {
      const pageRef = doc(db, "landing_pages", pageId);
      await updateDoc(pageRef, {
        seo: seoData,
        domain: domainData.domain,
        subdomain: domainData.subdomain
      });
      toast.success("Pengaturan berhasil diperbarui");
      fetchLandingPages();
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Gagal memperbarui pengaturan");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const selectedLandingPage = landingPages.find(page => page.id === selectedPage);

  return (
    <div className="container mx-auto p-8">
      {/* Landing Page Selector */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Pilih Landing Page</CardTitle>
          <CardDescription>Pilih landing page yang ingin Anda atur SEO-nya</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedPage} onValueChange={setSelectedPage}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih landing page" />
            </SelectTrigger>
            <SelectContent>
              {landingPages.map((page) => (
                <SelectItem key={page.id} value={page.id}>
                  {page.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* SEO Settings for Selected Page */}
      {selectedLandingPage ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Domain Card */}
          <Card className="border border-gray-200 flex flex-col h-full">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <GlobeAltIcon className="h-5 w-5 text-blue-600" />
                <div>
                  <CardTitle className="text-xl">Pengaturan Domain</CardTitle>
                  <CardDescription>Atur domain dan subdomain untuk landing page Anda</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const domainData = {
                  domain: formData.get('domain'),
                  subdomain: formData.get('subdomain'),
                };
                handleUpdateSEO(selectedLandingPage.id, selectedLandingPage.seo, domainData);
              }}>
                <div className="flex flex-col h-full">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="domain">Domain Kustom</Label>
                      <Input
                        id="domain"
                        name="domain"
                        defaultValue={selectedLandingPage.domain || ""}
                        placeholder="example.com"
                      />
                      <p className="text-sm text-gray-500">Masukkan domain kustom Anda (opsional)</p>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="subdomain">Subdomain</Label>
                      <Input
                        id="subdomain"
                        name="subdomain"
                        defaultValue={selectedLandingPage.subdomain || ""}
                        placeholder="landing"
                      />
                      <p className="text-sm text-gray-500">Masukkan subdomain (opsional)</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">
                        URL Lengkap: {selectedLandingPage.domain ? `https://${selectedLandingPage.subdomain ? selectedLandingPage.subdomain + '.' : ''}${selectedLandingPage.domain}` : `https://${selectedLandingPage.slug}.landingkits.com`}
                      </p>
                    </div>
                  </div>
                  <div className="mt-auto pt-4">
                    <Button type="submit" className="w-full">
                      Simpan Pengaturan Domain
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Basic SEO Card */}
          <Card className="border border-gray-200 flex flex-col h-full">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <MagnifyingGlassIcon className="h-5 w-5 text-blue-600" />
                <div>
                  <CardTitle className="text-xl">SEO Dasar</CardTitle>
                  <CardDescription>Optimalkan landing page Anda untuk mesin pencari</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const seoData = {
                  ...selectedLandingPage.seo,
                  title: formData.get('title'),
                  description: formData.get('description'),
                  keywords: formData.get('keywords'),
                };
                handleUpdateSEO(selectedLandingPage.id, seoData, { domain: selectedLandingPage.domain, subdomain: selectedLandingPage.subdomain });
              }}>
                <div className="flex flex-col h-full">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Meta Title</Label>
                      <Input
                        id="title"
                        name="title"
                        defaultValue={selectedLandingPage.seo?.title || ""}
                        placeholder="Contoh: Landing Page Terbaik untuk Bisnis Anda"
                        maxLength={60}
                      />
                      <p className="text-sm text-gray-500">Judul yang akan muncul di hasil pencarian Google</p>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="description">Meta Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        defaultValue={selectedLandingPage.seo?.description || ""}
                        placeholder="Deskripsi singkat tentang landing page Anda"
                        rows={3}
                        maxLength={160}
                      />
                      <p className="text-sm text-gray-500">Deskripsi yang akan muncul di bawah judul di hasil pencarian</p>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="keywords">Keywords</Label>
                      <Input
                        id="keywords"
                        name="keywords"
                        defaultValue={selectedLandingPage.seo?.keywords || ""}
                        placeholder="landing page, bisnis, marketing, dll"
                      />
                      <p className="text-sm text-gray-500">Kata kunci yang relevan dengan konten landing page</p>
                    </div>
                  </div>
                  <div className="mt-auto pt-4">
                    <Button type="submit" className="w-full">
                      Simpan Pengaturan SEO
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Social Media Card */}
          <Card className="border border-gray-200 flex flex-col h-full">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <div>
                  <CardTitle className="text-xl">Social Media Sharing</CardTitle>
                  <CardDescription>Optimalkan tampilan saat link dibagikan di media sosial</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const seoData = {
                  ...selectedLandingPage.seo,
                  ogImage: formData.get('ogImage'),
                  ogTitle: formData.get('ogTitle'),
                  ogDescription: formData.get('ogDescription'),
                };
                handleUpdateSEO(selectedLandingPage.id, seoData, { domain: selectedLandingPage.domain, subdomain: selectedLandingPage.subdomain });
              }}>
                <div className="flex flex-col h-full">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="ogImage">OG Image URL</Label>
                      <Input
                        id="ogImage"
                        name="ogImage"
                        defaultValue={selectedLandingPage.seo?.ogImage || ""}
                        placeholder="https://example.com/image.jpg"
                      />
                      <p className="text-sm text-gray-500">Gambar yang akan muncul saat link dibagikan di media sosial</p>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="ogTitle">OG Title</Label>
                      <Input
                        id="ogTitle"
                        name="ogTitle"
                        defaultValue={selectedLandingPage.seo?.ogTitle || ""}
                        placeholder="Judul yang menarik untuk social media"
                      />
                      <p className="text-sm text-gray-500">Judul yang akan muncul saat link dibagikan di media sosial</p>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="ogDescription">OG Description</Label>
                      <Textarea
                        id="ogDescription"
                        name="ogDescription"
                        defaultValue={selectedLandingPage.seo?.ogDescription || ""}
                        placeholder="Deskripsi singkat untuk social media sharing"
                        rows={3}
                      />
                      <p className="text-sm text-gray-500">Deskripsi yang akan muncul saat link dibagikan di media sosial</p>
                    </div>
                  </div>
                  <div className="mt-auto pt-4">
                    <Button type="submit" className="w-full">
                      Simpan Pengaturan Social Media
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="text-center py-12">
          <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada landing page</h3>
          <p className="mt-1 text-sm text-gray-500">Buat landing page terlebih dahulu untuk mengatur SEO.</p>
        </div>
      )}
    </div>
  );
} 