import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import Xendit from 'xendit-node';
import { Transaction } from '@/types/transaction';
import { subscriptionPlans } from '@/lib/subscription-plans';

// Inisialisasi Xendit client
const xenditClient = new Xendit({
  secretKey: process.env.XENDIT_SECRET_KEY!
});

const { Invoice } = xenditClient;

export async function POST(request: Request) {
  try {
    const { userId, planId, interval } = await request.json();

    // Validasi input
    if (!userId || !planId || !interval) {
      return NextResponse.json({ 
        error: 'Data tidak lengkap' 
      }, { status: 400 });
    }

    // Ambil data user
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      return NextResponse.json({ 
        error: 'User tidak ditemukan' 
      }, { status: 404 });
    }
    const userData = userDoc.data();

    // Ambil data plan dari subscription plans yang sudah didefinisikan
    const planData = subscriptionPlans.find(plan => plan.id === planId);
    if (!planData) {
      return NextResponse.json({ 
        error: 'Plan tidak ditemukan' 
      }, { status: 404 });
    }

    // Tentukan harga berdasarkan interval
    const price = interval === 'MONTH' ? planData.price.monthly : planData.price.yearly;

    // Generate external ID
    const externalId = `${userId}-${planId}-${Date.now()}`;

    // Buat transaksi di Firebase
    const transaction: Omit<Transaction, 'id'> = {
      userId,
      planId,
      amount: price,
      status: 'PENDING',
      externalId,
      interval,
      currency: 'IDR',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const transactionRef = await addDoc(collection(db, 'transactions'), transaction);

    // Buat invoice di Xendit
    const invoice = await Invoice.createInvoice({
      data: {
        externalId: externalId,
        amount: price,
        currency: 'IDR',
        payerEmail: userData.email,
        description: `Langganan ${planData.name} - ${interval === 'MONTH' ? 'Bulanan' : 'Tahunan'}`,
        customer: {
          givenNames: userData.name || userData.email,
          email: userData.email
        },
        successRedirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
        failureRedirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/failed`,
        items: [{
          name: planData.name,
          quantity: 1,
          price: price,
          category: 'Subscription'
        }]
      }
    });

    // Update transaksi dengan data invoice
    await updateDoc(doc(db, 'transactions', transactionRef.id), {
      metadata: {
        invoiceUrl: invoice.invoiceUrl,
        xenditInvoiceId: invoice.id
      }
    });

    return NextResponse.json({
      success: true,
      invoiceUrl: invoice.invoiceUrl,
      transactionId: transactionRef.id
    });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json({ 
      error: 'Gagal membuat invoice' 
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
} 