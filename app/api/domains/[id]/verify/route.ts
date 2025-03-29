import { NextResponse } from 'next/server';
import { doc, updateDoc, Timestamp, getDoc } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'ID domain harus diisi' },
        { status: 400 }
      );
    }

    // Ambil data domain
    const domainRef = doc(db, 'domains', id);
    const domainDoc = await getDoc(domainRef);

    if (!domainDoc.exists()) {
      return NextResponse.json(
        { error: 'Domain tidak ditemukan' },
        { status: 404 }
      );
    }

    const domainData = domainDoc.data();

    // Simulasi verifikasi domain (dalam implementasi nyata, ini akan memeriksa DNS records)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Update status domain
    await updateDoc(domainRef, {
      status: 'valid',
      updatedAt: Timestamp.now()
    });

    return NextResponse.json({
      id,
      status: 'valid',
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error verifying domain:', error);
    return NextResponse.json(
      { error: 'Gagal memverifikasi domain' },
      { status: 500 }
    );
  }
} 