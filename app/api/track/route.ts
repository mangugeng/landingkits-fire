import { NextResponse } from 'next/server';
import { db } from '@/app/lib/firebase';
import { doc, updateDoc, increment, Timestamp, arrayUnion } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pageId, eventType } = body;

    console.log('Received tracking request:', { pageId, eventType });

    if (!pageId || !eventType) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const analyticsRef = doc(db, 'landing_pages', pageId);
    console.log('Analytics ref:', analyticsRef.path);

    const now = Timestamp.now();
    console.log('Current timestamp:', now.toDate());

    const updateData = {
      'analytics.views': increment(1),
      'analytics.visitors': increment(1),
      'analytics.lastVisit': now,
      'analytics.visitHistory': arrayUnion({
        timestamp: now,
        type: eventType
      })
    };
    console.log('Update data:', updateData);

    await updateDoc(analyticsRef, updateData);
    console.log('Analytics updated successfully');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error tracking event:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);

    return NextResponse.json(
      { 
        success: false, 
        error: error.message,
        code: error.code
      },
      { status: 500 }
    );
  }
} 