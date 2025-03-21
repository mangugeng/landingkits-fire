import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import { SubscriptionService } from '@/lib/services/subscription';
import nodemailer from 'nodemailer';

// Konfigurasi transporter email
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Fungsi untuk mengirim email
async function sendMail(to: string, subject: string, html: string) {
  try {
    await transporter.sendMail({
      from: `"LandingKits" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });
    console.log('Email sent successfully to:', to);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

// Fungsi untuk menghitung tanggal berakhir subscription
function calculateEndDate(interval: 'MONTH' | 'YEAR'): Date {
  const date = new Date();
  if (interval === 'MONTH') {
    date.setMonth(date.getMonth() + 1);
  } else {
    date.setFullYear(date.getFullYear() + 1);
  }
  return date;
}

// Fungsi untuk mengupdate status subscription user
async function updateUserSubscription(userId: string, planId: string, interval: 'MONTH' | 'YEAR') {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      throw new Error('User tidak ditemukan');
    }

    const user = userSnap.data();
    const endDate = calculateEndDate(interval);

    // Update subscription status
    await updateDoc(userRef, {
      subscription: {
        planId,
        status: 'ACTIVE',
        startDate: new Date().toISOString(),
        endDate: endDate.toISOString(),
        interval
      }
    });

    // Kirim email konfirmasi
    await sendMail(user.email, 'Subscription Aktif - LandingKits', `
      <h1>Selamat! Subscription Anda Telah Aktif</h1>
      <p>Detail subscription:</p>
      <ul>
        <li>Plan: ${planId}</li>
        <li>Durasi: ${interval === 'MONTH' ? 'Bulanan' : 'Tahunan'}</li>
        <li>Tanggal Mulai: ${new Date().toLocaleDateString('id-ID')}</li>
        <li>Tanggal Berakhir: ${endDate.toLocaleDateString('id-ID')}</li>
      </ul>
      <p>Selamat menggunakan layanan premium LandingKits!</p>
    `);

    return true;
  } catch (error) {
    console.error('Error updating user subscription:', error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    // Validasi webhook token
    const headersList = headers();
    const token = headersList.get('x-callback-token');
    
    if (token !== process.env.XENDIT_WEBHOOK_TOKEN) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const payload = await request.json();
    console.log('Received webhook payload:', payload);

    // Validasi payload
    if (!payload.external_id || !payload.status) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // Cari transaksi berdasarkan external_id
    const transactionsRef = collection(db, 'transactions');
    const q = query(transactionsRef, where('externalId', '==', payload.external_id));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    const transaction = querySnapshot.docs[0];
    const transactionData = transaction.data();

    // Update status transaksi
    await updateDoc(doc(db, 'transactions', transaction.id), {
      status: payload.status === 'PAID' ? 'SUCCESS' : 'FAILED',
      updatedAt: new Date().toISOString()
    });

    // Jika pembayaran berhasil, update subscription user
    if (payload.status === 'PAID') {
      try {
        await SubscriptionService.updateSubscription(
          transactionData.userId,
          transactionData.planId,
          transactionData.interval
        );

        // Set reminder untuk 7 dan 3 hari sebelum berakhir
        setTimeout(() => {
          SubscriptionService.sendExpirationReminder(transactionData.userId);
        }, 1000 * 60 * 60 * 24 * (transactionData.interval === 'MONTH' ? 23 : 358)); // 23 hari atau 358 hari

        setTimeout(() => {
          SubscriptionService.sendExpirationReminder(transactionData.userId);
        }, 1000 * 60 * 60 * 24 * (transactionData.interval === 'MONTH' ? 27 : 362)); // 27 hari atau 362 hari
      } catch (error) {
        console.error('Failed to update user subscription:', error);
        // Tetap return success karena pembayaran berhasil
        // Tapi log error untuk investigasi
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
} 