'use client';

import { useEffect } from 'react';

export default function HomePage() {
  useEffect(() => {
    const hostname = window.location.hostname;
    const isSubdomain = hostname.includes('landingkits.com') && hostname !== 'www.landingkits.com';

    if (isSubdomain) {
      const subdomain = hostname.split('.')[0];
      window.location.href = `https://${subdomain}.landingkits.com`;
    } else {
      window.location.href = 'https://www.landingkits.com';
    }
  }, []);

  return null;
} 