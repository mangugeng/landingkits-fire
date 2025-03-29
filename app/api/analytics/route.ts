import { NextResponse } from 'next/server';
import { recordVisit, recordConversion, getAnalytics } from '@/app/lib/analytics';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slug, userId, type, metadata } = body;

    if (!slug || !userId) {
      return NextResponse.json(
        { error: 'Slug dan userId diperlukan' },
        { status: 400 }
      );
    }

    let result;
    if (type === 'conversion') {
      result = await recordConversion(slug, userId, metadata);
    } else {
      result = await recordVisit(slug, userId, metadata);
    }

    if (!result.success) {
      return NextResponse.json(
        { error: 'Gagal mencatat analytics' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in analytics API:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan internal' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const userId = searchParams.get('userId');

    if (!slug || !userId) {
      return NextResponse.json(
        { error: 'Slug dan userId diperlukan' },
        { status: 400 }
      );
    }

    const analytics = await getAnalytics(slug, userId);
    if (!analytics) {
      return NextResponse.json(
        { error: 'Data analytics tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error in analytics API:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan internal' },
      { status: 500 }
    );
  }
} 