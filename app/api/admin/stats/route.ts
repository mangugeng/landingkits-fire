import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  // Cek header autentikasi
  const adminLoginHeader = request.headers.get('x-admin-login');
  if (adminLoginHeader !== 'true') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Data dummy untuk statistik
  const stats = {
    totalUsers: 150,
    totalLandingPages: 45,
    totalVisitors: 12500,
    conversionRate: 3.2
  };

  return NextResponse.json(stats);
} 