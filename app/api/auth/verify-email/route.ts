import { NextResponse } from 'next/server';
import { auth } from '@/lib/firebase';
import { sendEmailVerification, applyActionCode } from 'firebase/auth';
import { sendMail } from '@/lib/mail';

export async function POST(request: Request) {
  try {
    const { user } = await request.json();
    
    if (!user || !user.email) {
      return NextResponse.json({ error: 'Email tidak valid' }, { status: 400 });
    }

    // Kirim email verifikasi
    await sendMail({
      to: user.email,
      subject: 'Verifikasi Email - LandingKits',
      html: `
        <h1>Selamat Datang di LandingKits!</h1>
        <p>Terima kasih telah mendaftar. Silakan verifikasi email Anda dengan mengklik tombol di bawah ini:</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/verify-email?code=${user.emailVerificationToken}" 
           style="display: inline-block; 
                  background-color: #4F46E5; 
                  color: white; 
                  padding: 12px 24px; 
                  text-decoration: none; 
                  border-radius: 6px;
                  margin: 16px 0;">
          Verifikasi Email
        </a>
        <p>Atau salin dan tempel link berikut di browser Anda:</p>
        <p>${process.env.NEXT_PUBLIC_APP_URL}/verify-email?code=${user.emailVerificationToken}</p>
        <p>Link ini akan kadaluarsa dalam 24 jam.</p>
        <p>Jika Anda tidak merasa mendaftar di LandingKits, abaikan email ini.</p>
      `
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending verification email:', error);
    return NextResponse.json({ error: 'Gagal mengirim email verifikasi' }, { status: 500 });
  }
}

// Endpoint untuk memverifikasi email
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json({ error: 'Kode verifikasi tidak valid' }, { status: 400 });
    }

    // Verifikasi kode
    await applyActionCode(auth, code);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error verifying email:', error);
    return NextResponse.json({ error: 'Gagal memverifikasi email' }, { status: 500 });
  }
} 