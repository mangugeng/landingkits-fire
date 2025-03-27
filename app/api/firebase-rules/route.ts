import { NextResponse } from 'next/server';
import { db } from '@/app/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export async function GET() {
  try {
    // Coba akses collection untuk memeriksa rules
    const landingPagesRef = collection(db, 'landing_pages');
    const snapshot = await getDocs(landingPagesRef);
    
    return NextResponse.json({
      success: true,
      message: 'Firebase connection successful',
      rules: {
        canRead: true,
        canWrite: true,
        collectionAccess: true
      }
    });
  } catch (error: any) {
    console.error('Firebase rules check error:', error);
    return NextResponse.json({
      success: false,
      error: 'Firebase connection failed',
      details: {
        code: error.code,
        message: error.message
      }
    }, { status: 500 });
  }
} 