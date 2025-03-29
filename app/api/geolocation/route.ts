import { NextResponse } from 'next/server';

export const runtime = 'edge';

// Cache untuk menyimpan hasil geolocation
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 jam dalam milliseconds

export async function GET(request: Request) {
  try {
    // Dapatkan IP dari request
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0] : '';

    if (!ip) {
      return NextResponse.json({
        country: 'ID',
        city: 'Jakarta',
        region: 'DKI Jakarta',
        lat: -6.2088,
        lon: 106.8456
      });
    }

    // Cek cache
    const cachedData = cache.get(ip);
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      return NextResponse.json(cachedData.data);
    }

    // Gunakan ip-api.com dengan rate limiting yang lebih baik
    const response = await fetch(`https://ip-api.com/json/${ip}`, {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch location: ${response.status}`);
    }

    const data = await response.json();

    if (!data || data.status === 'fail') {
      const fallbackData = {
        country: 'ID',
        city: 'Jakarta',
        region: 'DKI Jakarta',
        lat: -6.2088,
        lon: 106.8456
      };
      cache.set(ip, { data: fallbackData, timestamp: Date.now() });
      return NextResponse.json(fallbackData);
    }

    const result = {
      country: data.countryCode || 'ID',
      city: data.city || 'Jakarta',
      region: data.regionName || 'DKI Jakarta',
      lat: data.lat || -6.2088,
      lon: data.lon || 106.8456
    };

    // Simpan ke cache
    cache.set(ip, { data: result, timestamp: Date.now() });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in geolocation API:', error);
    return NextResponse.json({
      country: 'ID',
      city: 'Jakarta',
      region: 'DKI Jakarta',
      lat: -6.2088,
      lon: 106.8456
    });
  }
} 