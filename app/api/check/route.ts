import { NextResponse, NextRequest } from 'next/server';
import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export const dynamic = 'force-dynamic';

interface LandingPage {
  id: string;
  userId: string;
  slug: string;
  title?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const slug = searchParams.get('slug');
    const userId = searchParams.get('userId');
    const listAll = searchParams.get('listAll') === 'true';

    console.log('Request params:', { slug, userId, listAll });

    if (listAll) {
      console.log('Fetching all landing pages...');
      const querySnapshot = await getDocs(collection(db, 'landing_pages'));
      const pages = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as LandingPage));
      console.log('Found pages:', JSON.stringify(pages, null, 2));

      return NextResponse.json({
        message: 'Daftar landing pages',
        data: pages
      });
    }

    if (!slug || !userId) {
      console.log('Missing required params:', { slug, userId });
      return NextResponse.json(
        { error: 'Slug dan userId harus diisi' },
        { status: 400 }
      );
    }

    console.log('Fetching landing page with:', { slug, userId });
    const querySnapshot = await getDocs(collection(db, 'landing_pages'));
    const pages = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as LandingPage));
    console.log('All pages:', JSON.stringify(pages, null, 2));
    const page = pages.find(p => p.userId === userId && p.slug === slug);
    
    if (!page) {
      console.log('No landing page found with slug:', slug);
      return NextResponse.json(
        { message: 'Landing page tidak ditemukan' },
        { status: 404 }
      );
    }

    console.log('Found landing page:', JSON.stringify(page, null, 2));
    return NextResponse.json({
      message: 'Landing page ditemukan',
      data: page
    });

  } catch (error) {
    console.error('Detailed error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengecek landing page' },
      { status: 500 }
    );
  }
} 