import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/app/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const slug = searchParams.get('slug');
    const userId = searchParams.get('userId');

    if (!slug || !userId) {
      return NextResponse.json(
        { success: false, error: 'Slug dan userId diperlukan' },
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
    if (querySnapshot.empty) {
      return NextResponse.json(
        { success: false, error: 'Landing page tidak ditemukan' },
        { status: 404 }
      );
    }

    const doc = querySnapshot.docs[0];
    const data = doc.data();

    return NextResponse.json({
      success: true,
      data: {
        id: doc.id,
        title: data.title,
        analytics: data.analytics || {
          views: 0,
          conversions: 0,
          visitors: 0,
          visitHistory: []
        }
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data analytics' },
      { status: 500 }
    );
  }
} 