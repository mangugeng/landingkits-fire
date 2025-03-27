import { NextResponse } from 'next/server';
import { db } from '@/app/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, userId } = body;

    // Generate slug dari title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const landingPageData = {
      title,
      description,
      content: [
        {
          type: 'heading',
          content: title,
          props: {
            level: 'h1'
          }
        },
        {
          type: 'paragraph',
          content: description
        },
        {
          type: 'button',
          content: 'Mulai Sekarang',
          props: {
            variant: 'primary',
            ctaType: 'register'
          }
        },
        {
          type: 'form',
          content: 'Form Kontak',
          props: {
            formType: 'contact',
            formFields: [
              {
                label: 'Nama',
                type: 'text',
                placeholder: 'Masukkan nama Anda',
                required: true
              },
              {
                label: 'Email',
                type: 'email',
                placeholder: 'Masukkan email Anda',
                required: true
              },
              {
                label: 'Pesan',
                type: 'textarea',
                placeholder: 'Masukkan pesan Anda',
                required: true
              }
            ]
          }
        }
      ],
      status: 'published',
      userId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      publishedAt: Timestamp.now(),
      slug,
      analytics: {
        views: 0,
        conversions: 0,
        visitors: 0,
        visitHistory: []
      }
    };

    const docRef = await addDoc(collection(db, 'landing_pages'), landingPageData);

    return NextResponse.json({
      success: true,
      data: {
        id: docRef.id,
        ...landingPageData
      }
    });
  } catch (error) {
    console.error('Error creating landing page:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal membuat landing page' },
      { status: 500 }
    );
  }
} 