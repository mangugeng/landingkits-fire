'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FiArrowRight } from 'react-icons/fi';
import { BlogPost } from '../types/blog';

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      {post.featuredImage && (
        <div className="relative h-48">
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <div className="text-sm text-blue-600 font-medium mb-2">
          {post.category}
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {post.title}
        </h3>
        <p className="text-gray-500 line-clamp-3">
          {post.excerpt}
        </p>
        <div className="mt-4 flex items-center text-blue-600">
          <span className="text-sm font-medium">Baca selengkapnya</span>
          <FiArrowRight className="ml-2" />
        </div>
      </div>
    </Link>
  );
} 