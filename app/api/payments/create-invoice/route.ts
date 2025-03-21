import { NextResponse } from 'next/server';
import { Invoice } from '../../../../lib/xendit';
import { subscriptionPlans } from '../../../../lib/subscription-plans';
import type { SubscriptionPlan } from '../../../../types/subscription';
import type { CreateInvoiceOperationRequest, CreateInvoiceRequest } from '../../../../types/xendit';

export async function POST(request: Request) {
  try {
    console.log('Starting create invoice process...');

    // Validasi environment variables
    if (!process.env.XENDIT_SECRET_KEY) {
      console.error('XENDIT_SECRET_KEY is not defined');
      return NextResponse.json(
        { error: 'Server configuration error: XENDIT_SECRET_KEY is not defined' },
        { status: 500 }
      );
    }

    if (!process.env.NEXT_PUBLIC_APP_URL) {
      console.error('NEXT_PUBLIC_APP_URL is not defined');
      return NextResponse.json(
        { error: 'Server configuration error: NEXT_PUBLIC_APP_URL is not defined' },
        { status: 500 }
      );
    }

    console.log('Environment variables validated');

    const body = await request.json();
    const { planId, interval, userId, email } = body;

    console.log('Request body:', { planId, interval, userId, email });

    // Validate required fields
    if (!planId || !interval || !userId || !email) {
      console.error('Missing required fields:', { planId, interval, userId, email });
      return NextResponse.json(
        { error: 'Missing required fields', details: { planId, interval, userId, email } },
        { status: 400 }
      );
    }

    console.log('Required fields validated');

    // Find the selected plan
    console.log('Available plans:', subscriptionPlans);
    const plan: SubscriptionPlan | undefined = subscriptionPlans.find((p: SubscriptionPlan) => p.id === planId);
    if (!plan) {
      console.error('Invalid plan selected:', planId);
      return NextResponse.json(
        { error: 'Invalid plan selected', details: { planId, availablePlans: subscriptionPlans.map(p => p.id) } },
        { status: 400 }
      );
    }

    console.log('Plan found:', plan);

    // Calculate amount based on interval
    let amount;
    if (typeof plan.price === 'number') {
      amount = plan.price;
    } else if (plan.price && typeof plan.price === 'object') {
      amount = interval === 'MONTH' ? plan.price.monthly : plan.price.yearly;
    } else {
      console.error('Invalid price format:', plan.price);
      return NextResponse.json(
        { error: 'Invalid price format', details: { price: plan.price } },
        { status: 400 }
      );
    }

    if (!amount || amount <= 0) {
      console.error('Invalid amount:', amount);
      return NextResponse.json(
        { error: 'Invalid amount', details: { amount, interval, price: plan.price } },
        { status: 400 }
      );
    }

    console.log('Amount calculated:', amount);

    try {
      const invoiceData: CreateInvoiceRequest = {
        externalId: `sub_${userId}_${Date.now()}`,
        amount,
        payerEmail: email,
        description: `Subscription to ${plan.name} Plan (${interval.toLowerCase()}ly)`,
        invoiceDuration: '86400', // 24 hours
        currency: 'IDR',
        successRedirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
        failureRedirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=failed`,
        items: [
          {
            name: `${plan.name} Plan - ${interval.toLowerCase()}ly subscription`,
            quantity: 1,
            price: amount,
            category: 'Subscription'
          }
        ]
      };

      console.log('Creating invoice with data:', invoiceData);

      const invoice = await Invoice.createInvoice({
        data: invoiceData
      });

      console.log('Invoice created successfully:', invoice);

      return NextResponse.json({
        invoice_url: invoice.invoiceUrl,
        invoice_id: invoice.id,
        status: invoice.status
      });
    } catch (xenditError: any) {
      console.error('Xendit API Error:', xenditError?.message || xenditError);
      console.error('Xendit Error Details:', {
        message: xenditError?.message,
        code: xenditError?.code,
        stack: xenditError?.stack,
        data: xenditError?.data
      });
      return NextResponse.json(
        { 
          error: 'Failed to create Xendit invoice', 
          details: xenditError?.message,
          code: xenditError?.code,
          data: xenditError?.data
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error creating invoice:', error);
    console.error('Error details:', {
      message: error?.message,
      stack: error?.stack
    });
    return NextResponse.json(
      { 
        error: 'Failed to create invoice',
        details: error?.message,
        stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
} 