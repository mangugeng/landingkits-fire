import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/auth/', '/dashboard/'],
    },
    sitemap: 'https://landingkits.com/sitemap.xml',
  };
} 