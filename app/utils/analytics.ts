export function detectBrowser(userAgent: string): string {
  if (userAgent.includes('Firefox')) {
    return 'Firefox';
  } else if (userAgent.includes('Chrome')) {
    return 'Chrome';
  } else if (userAgent.includes('Safari')) {
    return 'Safari';
  } else if (userAgent.includes('Edge')) {
    return 'Edge';
  } else if (userAgent.includes('MSIE') || userAgent.includes('Trident/')) {
    return 'Internet Explorer';
  } else {
    return 'Unknown';
  }
}

export function detectDevice(userAgent: string): string {
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent)) {
    return 'Mobile';
  } else if (/iPad|Android|Tablet/.test(userAgent)) {
    return 'Tablet';
  } else {
    return 'Desktop';
  }
}

export function detectOS(userAgent: string): string {
  if (userAgent.includes('Windows')) {
    return 'Windows';
  } else if (userAgent.includes('Mac')) {
    return 'MacOS';
  } else if (userAgent.includes('Linux')) {
    return 'Linux';
  } else if (userAgent.includes('Android')) {
    return 'Android';
  } else if (userAgent.includes('iOS')) {
    return 'iOS';
  } else {
    return 'Unknown';
  }
}

export async function getUserLocation(): Promise<{ city: string; country: string }> {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return {
      city: data.city || 'Unknown',
      country: data.country_name || 'Unknown'
    };
  } catch (error) {
    console.error('Error getting user location:', error);
    return {
      city: 'Unknown',
      country: 'Unknown'
    };
  }
} 