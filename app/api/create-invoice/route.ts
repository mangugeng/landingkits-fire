import { NextResponse } from 'next/server';
import Xendit from 'xendit-node';
import { getServerSession } from 'next-auth';
import { authConfig } from '../auth/config';
import { db } from '../../../lib/firebase';
import { doc, setDoc, collection } from 'firebase/firestore';
import type { CreateInvoiceRequest } from 'xendit-node/invoice/models/CreateInvoiceRequest';
import type { Invoice } from 'xendit-node/invoice/models/Invoice';

const xenditClient = new Xendit({
  secretKey: process.env.XENDIT_SECRET_KEY!,
});

// Inisialisasi Invoice API
const invoiceApi = xenditClient.Invoice;

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { planId, userId, amount } = await request.json();

    // Buat invoice di Xendit
    const invoiceData: CreateInvoiceRequest = {
      externalId: `${userId}-${planId}-${Date.now()}`,
      amount,
      payerEmail: session.user.email!,
      description: `Langganan LandingKits - Plan ${planId}`,
      successRedirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscription?status=success`,
      failureRedirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscription?status=failed`,
    };

    const invoice = await invoiceApi.createInvoice({
      data: invoiceData
    });

    // Simpan data invoice ke Firestore
    const invoicesRef = collection(db, 'invoices');
    await setDoc(doc(invoicesRef, invoice.id), {
      userId,
      planId,
      amount,
      status: 'pending',
      createdAt: new Date().toISOString(),
      xenditInvoiceId: invoice.id,
      xenditInvoiceUrl: invoice.invoiceUrl,
    });

    return NextResponse.json({ invoiceUrl: invoice.invoiceUrl });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json(
      { error: 'Failed to create invoice' },
      { status: 500 }
    );
  }
} 