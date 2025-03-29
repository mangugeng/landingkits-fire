"use client";

import { useEffect } from 'react';
import AnalyticsCollector from './AnalyticsCollector';

interface ViewTrackerProps {
  slug: string;
  userId: string;
}

export default function ViewTracker({ slug, userId }: ViewTrackerProps) {
  useEffect(() => {
    console.log('Tracking view for:', slug);
  }, [slug]);

  return <AnalyticsCollector slug={slug} userId={userId} />;
} 