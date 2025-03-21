import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { sendMail } from '@/lib/mail';

// Fungsi untuk memverifikasi webhook signature
function verifyWebhookSignature(receivedToken: string | null) {
  const webhookToken = process.env.XENDIT_WEBHOOK_TOKEN;
  return receivedToken === webhookToken;
}

export async function POST(request: Request) {
  try {
    // Verifikasi webhook signature
    const headersList = headers();
    const token = headersList.get('x-callback-token');
    
    if (!verifyWebhookSignature(token)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const data = await request.json();
    const { 
      id: xenditInvoiceId,
      status,
      external_id
    } = data;

    // Dapatkan invoice dari Firestore
    const invoiceRef = doc(db, 'invoices', xenditInvoiceId);
    const invoiceSnap = await getDoc(invoiceRef);

    if (!invoiceSnap.exists()) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    const invoice = invoiceSnap.data();
    const [userId, planId] = external_id.split('-');

    // Update status invoice
    await updateDoc(invoiceRef, {
      status: status.toLowerCase(),
      updatedAt: new Date().toISOString(),
    });

    if (status === 'PAID') {
      // Update subscription user
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const user = userSnap.data();
        
        await updateDoc(userRef, {
          subscription: {
            planId,
            startDate: new Date().toISOString(),
            status: 'active',
          },
        });

        // Kirim email konfirmasi
        await sendMail({
          to: user.email,
          subject: 'Pembayaran Berhasil - LandingKits',
          html: `
            <h1>Terima kasih atas pembayaran Anda</h1>
            <p>Pembayaran Anda untuk Plan ${planId} telah berhasil.</p>
            <p>Langganan Anda sudah aktif dan Anda dapat mulai menggunakan semua fitur premium.</p>
          `,
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
} 