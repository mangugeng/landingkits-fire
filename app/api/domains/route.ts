import { NextResponse } from 'next/server';
import { collection, addDoc, Timestamp, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: Request) {
  try {
    const { domain, userId, landingPageId } = await request.json();

    if (!domain || !userId || !landingPageId) {
      return NextResponse.json(
        { error: 'Domain, userId, dan landingPageId harus diisi' },
        { status: 400 }
      );
    }

    // Validasi format domain
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
    if (!domainRegex.test(domain)) {
      return NextResponse.json(
        { error: 'Format domain tidak valid' },
        { status: 400 }
      );
    }

    // Cek apakah domain sudah terdaftar
    const domainsRef = collection(db, 'domains');
    const q = query(domainsRef, where('domain', '==', domain));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      return NextResponse.json(
        { error: 'Domain sudah terdaftar' },
        { status: 400 }
      );
    }

    // Ambil data landing page untuk mendapatkan slug
    const landingPageRef = doc(db, 'landing_pages', landingPageId);
    const landingPageDoc = await getDoc(landingPageRef);
    
    if (!landingPageDoc.exists()) {
      return NextResponse.json(
        { error: 'Landing page tidak ditemukan' },
        { status: 404 }
      );
    }

    const landingPageData = landingPageDoc.data();

    // Tambahkan domain baru
    const docRef = await addDoc(collection(db, 'domains'), {
      domain,
      userId,
      landingPageId,
      landingPageSlug: landingPageData.slug,
      status: 'pending',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });

    return NextResponse.json({
      id: docRef.id,
      domain,
      status: 'pending'
    });
  } catch (error) {
    console.error('Error adding domain:', error);
    return NextResponse.json(
      { error: 'Gagal menambahkan domain' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId harus diisi' },
        { status: 400 }
      );
    }

    const domainsRef = collection(db, 'domains');
    const q = query(domainsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    const domains = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    }));

    return NextResponse.json(domains);
  } catch (error) {
    console.error('Error fetching domains:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data domain' },
      { status: 500 }
    );
  }
} 