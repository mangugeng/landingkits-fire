import { NextResponse } from 'next/server';
import { subscriptionPlans } from '../../../lib/subscription-plans';

export async function GET() {
  return NextResponse.json(subscriptionPlans);
}

export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
} 