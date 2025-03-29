import { NextResponse } from 'next/server';
import { db } from '@/app/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

interface LandingPage {
  id: string;
  title: string;
  description: string;
  slug: string;
  userId: string;
  content: any[];
  status: 'draft' | 'published';
  createdAt: any;
  updatedAt: any;
  analytics?: {
    views: number;
    conversions: number;
    visitors: number;
    lastVisit?: any;
    visitHistory?: Array<{
      timestamp: any;
      type: 'view' | 'conversion';
      eventType?: string;
    }>;
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const userId = searchParams.get('userId');
    const listAll = searchParams.get('listAll') === 'true';

    console.log('Request parameters:', { slug, userId, listAll });

    if (listAll) {
      const landingPagesRef = collection(db, 'landing_pages');
      const querySnapshot = await getDocs(landingPagesRef);
      const pages = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as LandingPage[];
      
      console.log('All pages:', JSON.stringify(pages, null, 2));
      return NextResponse.json({ pages });
    }

    if (!slug || !userId) {
      return NextResponse.json(
        { error: 'Slug dan userId harus diisi' },
        { status: 400 }
      );
    }

    const landingPagesRef = collection(db, 'landing_pages');
    const q = query(
      landingPagesRef,
      where('slug', '==', slug),
      where('userId', '==', userId)
    );

    const querySnapshot = await getDocs(q);
    const pages = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as LandingPage[];
    
    console.log('All pages:', JSON.stringify(pages, null, 2));
    const page = pages.find(p => p.userId === userId && p.slug === slug);
    
    if (!page) {
      console.log('No landing page found with slug:', slug);
      return NextResponse.json(
        { error: 'Landing page tidak ditemukan' },
        { status: 404 }
      );
    }

    console.log('Found landing page:', JSON.stringify(page, null, 2));
    return NextResponse.json({
      message: 'Landing page ditemukan',
      data: page
    });
  } catch (error: any) {
    console.error('Error fetching landing page:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
} 