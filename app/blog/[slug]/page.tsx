'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import Link from 'next/link';
import Image from 'next/image';
import { FiArrowLeft, FiCalendar, FiTag, FiFolder } from 'react-icons/fi';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string | string[];
  featuredImage: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function BlogDetail({ params }: { params: { slug: string } }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPost();
  }, [params.slug]);

  const fetchPost = async () => {
    try {
      const q = query(
        collection(db, 'blog_posts'),
        where('slug', '==', params.slug),
        where('status', '==', 'published')
      );
      
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        setPost({
          id: doc.id,
          ...doc.data()
        } as BlogPost);
      } else {
        setError('Artikel tidak ditemukan');
      }
    } catch (err) {
      console.error('Error fetching post:', err);
      setError('Gagal memuat artikel');
    } finally {
      setLoading(false);
    }
  };

  const getTags = (tags: string | string[] | undefined): string[] => {
    if (!tags) return [];
    if (Array.isArray(tags)) return tags;
    return tags.split(',').map(tag => tag.trim()).filter(tag => tag);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Artikel Tidak Ditemukan</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            href="/blog"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <FiArrowLeft className="mr-2" />
            Kembali ke Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/blog"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <FiArrowLeft className="mr-2" />
          Kembali ke Blog
        </Link>

        <article className="bg-white rounded-lg shadow-md overflow-hidden">
          {post.featuredImage && (
            <div className="relative h-96 w-full">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          
          <div className="p-8">
            <div className="flex items-center mb-4">
              <span className="inline-flex items-center text-gray-500 mr-4">
                <FiCalendar className="mr-2" />
                {new Date(post.createdAt).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
              <span className="inline-flex items-center text-gray-500 mr-4">
                <FiFolder className="mr-2" />
                {post.category}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>

            <div className="prose max-w-none mb-8">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>

            {post.tags && getTags(post.tags).length > 0 && (
              <div className="flex flex-wrap gap-2">
                <FiTag className="text-gray-500 mt-1" />
                {getTags(post.tags).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-sm text-gray-500 bg-gray-100 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </article>
      </div>
    </main>
  );
} 