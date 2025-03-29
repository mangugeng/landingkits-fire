'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';
import { useAuth } from '@/app/context/AuthContext';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/app/components/ui/alert';
import { Loader2, CheckCircle2, XCircle, AlertCircle, Info } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";

interface Domain {
  id: string;
  domain: string;
  status: 'pending' | 'valid' | 'invalid';
  landingPageId?: string;
  landingPageSlug?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface LandingPage {
  id: string;
  title: string;
  slug: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function DomainsPage() {
  const { user } = useAuth();
  const [domains, setDomains] = useState<Domain[]>([]);
  const [landingPages, setLandingPages] = useState<LandingPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [newDomain, setNewDomain] = useState('');
  const [verifying, setVerifying] = useState<string | null>(null);
  const [selectedLandingPage, setSelectedLandingPage] = useState<string>('');

  useEffect(() => {
    fetchDomains();
    fetchLandingPages();
  }, [user]);

  const fetchLandingPages = async () => {
    if (!user) return;
    
    try {
      const landingPagesRef = collection(db, 'landing_pages');
      const q = query(
        landingPagesRef, 
        where('userId', '==', user.uid),
        where('status', '==', 'published')
      );
      const querySnapshot = await getDocs(q);
      
      const landingPagesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title,
        slug: doc.data().slug,
        status: doc.data().status,
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as LandingPage[];
      
      setLandingPages(landingPagesData);
    } catch (err) {
      console.error('Error fetching landing pages:', err);
      setError('Gagal mengambil data landing page');
    }
  };

  const fetchDomains = async () => {
    if (!user) return;
    
    try {
      const domainsRef = collection(db, 'domains');
      const q = query(domainsRef, where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      
      const domainsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Domain[];
      
      setDomains(domainsData);
    } catch (err) {
      setError('Gagal mengambil data domain');
      console.error('Error fetching domains:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDomain = async () => {
    if (!user || !newDomain || !selectedLandingPage) return;

    try {
      setError(null);
      setSuccess(null);
      
      const response = await fetch('/api/domains', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          domain: newDomain,
          userId: user.uid,
          landingPageId: selectedLandingPage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal menambahkan domain');
      }

      setSuccess('Domain berhasil ditambahkan');
      setNewDomain('');
      setSelectedLandingPage('');
      fetchDomains();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menambahkan domain');
    }
  };

  const handleVerifyDomain = async (domainId: string) => {
    try {
      setVerifying(domainId);
      setError(null);
      setSuccess(null);

      const response = await fetch(`/api/domains/${domainId}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal memverifikasi domain');
      }

      setSuccess('Domain berhasil diverifikasi');
      fetchDomains();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memverifikasi domain');
    } finally {
      setVerifying(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Kelola Domain</h1>

      <Tabs defaultValue="domains" className="space-y-4">
        <TabsList>
          <TabsTrigger value="domains">Domain Saya</TabsTrigger>
          <TabsTrigger value="setup">Panduan Setup</TabsTrigger>
        </TabsList>

        <TabsContent value="domains" className="space-y-6">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-6">
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Sukses</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Tambah Domain Baru</CardTitle>
              <CardDescription>
                Tambahkan custom domain untuk landing page Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Input
                    placeholder="Masukkan domain (contoh: example.com)"
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    className="flex-1"
                  />
                  <Select value={selectedLandingPage} onValueChange={setSelectedLandingPage}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Pilih Landing Page" />
                    </SelectTrigger>
                    <SelectContent>
                      {landingPages.map((page) => (
                        <SelectItem key={page.id} value={page.id}>
                          {page.title} ({page.slug})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddDomain} disabled={!newDomain || !selectedLandingPage}>
                  Tambah Domain
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6">
            {domains.map((domain) => (
              <Card key={domain.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{domain.domain}</h3>
                      <p className="text-sm text-muted-foreground">
                        Status: {domain.status === 'valid' ? 'Valid' : 'Pending'}
                      </p>
                      {domain.landingPageSlug && (
                        <p className="text-sm text-muted-foreground">
                          Landing Page: {domain.landingPageSlug}
                        </p>
                      )}
                    </div>
                    {domain.status === 'pending' && (
                      <Button
                        variant="outline"
                        onClick={() => handleVerifyDomain(domain.id)}
                        disabled={verifying === domain.id}
                      >
                        {verifying === domain.id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Memverifikasi...
                          </>
                        ) : (
                          'Verifikasi Domain'
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {domains.length === 0 && (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">
                    Belum ada domain yang ditambahkan
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="setup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Panduan Setup Domain</CardTitle>
              <CardDescription>
                Ikuti langkah-langkah berikut untuk mengatur custom domain Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold">1. Menambahkan Domain</h3>
                <p className="text-sm text-muted-foreground">
                  Masukkan domain Anda di form "Tambah Domain Baru" dan pilih landing page yang ingin dihubungkan.
                  Pastikan format domain benar (contoh: example.com).
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">2. Verifikasi Domain</h3>
                <p className="text-sm text-muted-foreground">
                  Setelah domain ditambahkan, status akan menjadi "Pending".
                  Klik tombol "Verifikasi Domain" untuk memulai proses verifikasi.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">3. Konfigurasi DNS</h3>
                <p className="text-sm text-muted-foreground">
                  Setelah verifikasi berhasil, tambahkan record DNS berikut di provider domain Anda:
                </p>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm">
                    {`# Record A
Type: A
Name: @
Value: 76.76.21.21

# Record CNAME
Type: CNAME
Name: www
Value: cname.vercel-dns.com`}
                  </pre>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">4. Menghubungkan dengan Landing Page</h3>
                <p className="text-sm text-muted-foreground">
                  Setelah DNS terkonfigurasi, domain akan terhubung dengan landing page yang dipilih.
                  Status domain akan berubah menjadi "Valid" dalam 24-48 jam.
                </p>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Catatan Penting</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Pastikan domain sudah terdaftar di provider domain</li>
                    <li>DNS propagation bisa memakan waktu hingga 48 jam</li>
                    <li>Domain harus dalam status aktif</li>
                    <li>Pastikan tidak ada SSL certificate yang konflik</li>
                  </ul>
                </AlertDescription>
              </Alert>

              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Troubleshooting</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Jika verifikasi gagal, periksa format domain dan status domain</li>
                    <li>Jika DNS tidak aktif, periksa konfigurasi DNS dan tunggu propagation</li>
                    <li>Hubungi support jika masih mengalami masalah</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 