'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import dynamic from 'next/dynamic';
import { FiSave, FiX, FiZap } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { storage } from '../../../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Import ReactQuill secara dinamis untuk menghindari error SSR
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false }) as any;
import 'react-quill/dist/quill.snow.css';

// Fungsi untuk mengubah teks menjadi slug
const createSlug = (text: string): string => {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Hapus karakter khusus kecuali spasi dan strip
    .replace(/\s+/g, '-') // Ganti spasi dengan strip
    .replace(/-+/g, '-') // Hapus strip berulang
    .replace(/^-|-$/g, ''); // Hapus strip di awal dan akhir
};

export default function NewBlogPost() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isDraft, setIsDraft] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Update slug ketika judul berubah
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    const newSlug = createSlug(newTitle);
    setSlug(newSlug);
  };

  const generateContent = async () => {
    if (!title) {
      toast.error('Judul harus diisi terlebih dahulu');
      return;
    }

    setIsGenerating(true);
    try {
      // Generate category and slug first
      const metadataResponse = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Berdasarkan judul artikel berikut, berikan kategori (satu kata) dan slug URL yang SEO-friendly:
          Judul: ${title}
          
          Format output yang diharapkan:
          Kategori: [kategori]
          Slug: [slug-url]`,
          temperature: 0.7,
          max_tokens: 100,
        }),
      });

      if (!metadataResponse.ok) {
        throw new Error('Failed to generate metadata');
      }

      const metadataData = await metadataResponse.json();
      if (metadataData.error) {
        throw new Error(metadataData.error);
      }

      const metadataText = metadataData.text;
      
      // Parse category and slug from response
      const categoryMatch = metadataText.match(/Kategori:\s*([^\n]+)/);
      const slugMatch = metadataText.match(/Slug:\s*([^\n]+)/);
      
      if (categoryMatch && slugMatch) {
        setCategory(categoryMatch[1].trim());
        setSlug(slugMatch[1].trim());
      }

      // Generate article content
      const contentResponse = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Buat artikel blog dengan judul "${title}" dalam kategori "${categoryMatch[1].trim()}". 
          Artikel harus informatif, menarik, dan mudah dibaca.
          Gunakan format HTML dengan struktur berikut:
          
          <h2>Pendahuluan</h2>
          [Paragraf pendahuluan yang menarik]
          
          <h2>Poin Utama 1</h2>
          [Konten poin utama 1]
          
          <h2>Poin Utama 2</h2>
          [Konten poin utama 2]
          
          <h2>Poin Utama 3</h2>
          [Konten poin utama 3]
          
          <h2>Kesimpulan</h2>
          [Paragraf kesimpulan yang menarik]
          
          Pastikan setiap bagian memiliki minimal 2-3 paragraf yang informatif dan terstruktur dengan baik.`,
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (!contentResponse.ok) {
        throw new Error('Failed to generate content');
      }

      const contentData = await contentResponse.json();
      if (contentData.error) {
        throw new Error(contentData.error);
      }

      setContent(contentData.text);

      // Generate excerpt from content
      const excerptResponse = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Buat ringkasan singkat (excerpt) dari artikel berikut dalam 2-3 kalimat yang menarik:
          ${contentData.text}`,
          temperature: 0.7,
          max_tokens: 100,
        }),
      });

      if (!excerptResponse.ok) {
        throw new Error('Failed to generate excerpt');
      }

      const excerptData = await excerptResponse.json();
      if (excerptData.error) {
        throw new Error(excerptData.error);
      }

      setExcerpt(excerptData.text);

      // Generate tags
      const tagsResponse = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Berdasarkan artikel berikut, berikan 5-7 tag yang relevan:
          ${contentData.text}
          
          Format output yang diharapkan:
          Tag1, Tag2, Tag3, Tag4, Tag5, Tag6, Tag7`,
          temperature: 0.7,
          max_tokens: 100,
        }),
      });

      if (!tagsResponse.ok) {
        throw new Error('Failed to generate tags');
      }

      const tagsData = await tagsResponse.json();
      if (tagsData.error) {
        throw new Error(tagsData.error);
      }

      const generatedTags = tagsData.text.split(',').map((tag: string) => tag.trim());
      setTags(generatedTags.join(', '));

    } catch (error) {
      console.error('Error generating content:', error);
      toast.error(error instanceof Error ? error.message : 'Gagal menghasilkan konten');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPublishing(true);

    try {
      const postData = {
        title,
        slug,
        excerpt,
        content,
        category,
        tags: tags.split(',').map(tag => tag.trim()),
        featuredImage: featuredImage ? featuredImage : null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: isDraft ? 'draft' : 'published',
        author: 'Admin', // Nanti bisa diganti dengan data user yang login
      };

      await addDoc(collection(db, 'blog_posts'), postData);
      router.push('/admin/blog');
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Terjadi kesalahan saat membuat artikel');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      // Validasi tipe file
      if (!file.type.startsWith('image/')) {
        toast.error('File harus berupa gambar');
        return;
      }

      // Validasi ukuran file (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Ukuran file maksimal 5MB');
        return;
      }

      // Upload ke Firebase Storage
      const storageRef = ref(storage, `blog-images/${Date.now()}-${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      setFeaturedImage(downloadURL);
      toast.success('Gambar berhasil diupload');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Gagal mengupload gambar');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex gap-6">
      {/* Main Content */}
      <div className="flex-1">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Buat Artikel Baru</h1>
            <button
              onClick={generateContent}
              disabled={isGenerating}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
            >
              <FiZap className="mr-2" />
              {isGenerating ? 'Generating...' : 'Generate dengan AI'}
            </button>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Judul Artikel
            </label>
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan judul artikel"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ringkasan
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Masukkan ringkasan artikel"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Konten
            </label>
            <div className="h-[500px]">
              <ReactQuill
                value={content}
                onChange={setContent}
                className="h-[450px]"
              />
            </div>
          </div>

          {/* Featured Image Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Featured Image
            </label>
            <div className="flex items-center space-x-4">
              {featuredImage && (
                <div className="relative w-32 h-32">
                  <img
                    src={featuredImage}
                    alt="Featured"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setFeaturedImage('')}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              )}
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100
                      disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  {isUploading && (
                    <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
                      <div className="w-full max-w-xs">
                        <div className="bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full animate-pulse"></div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2 text-center">Mengupload gambar...</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-80">
        <div className="bg-white rounded-lg shadow p-6 sticky top-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pengaturan Artikel</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug URL
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="judul-artikel"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Teknologi"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (pisahkan dengan koma)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="web, teknologi, internet"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isDraft"
                checked={isDraft}
                onChange={(e) => setIsDraft(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isDraft" className="ml-2 block text-sm text-gray-900">
                Simpan sebagai draft
              </label>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={handleSubmit}
                disabled={isPublishing}
                className="flex-1 flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <FiSave className="mr-2" />
                {isPublishing ? 'Menyimpan...' : 'Simpan'}
              </button>
              <button
                onClick={() => router.back()}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiX className="mr-2" />
                Batal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 