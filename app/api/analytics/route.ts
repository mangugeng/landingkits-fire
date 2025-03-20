import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAnalyticsData } from '../../lib/google-analytics';

export async function GET(request: NextRequest) {
  try {
    const data = await getAnalyticsData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics data' }, { status: 500 });
  }
} 