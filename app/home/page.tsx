'use client';

import { useEffect } from 'react';

export default function HomePage() {
  useEffect(() => {
    const hostname = window.location.hostname;
    if (hostname === 'landingkits.com' || hostname === 'www.landingkits.com') {
      window.location.href = 'https://www.landingkits.com';
    }
  }, []);

  return null;
} 