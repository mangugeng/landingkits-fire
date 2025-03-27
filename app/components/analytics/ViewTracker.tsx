"use client";

import { useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface ViewTrackerProps {
  slug: string;
  userId: string;
}

export default function ViewTracker({ slug, userId }: ViewTrackerProps) {
  console.log('ViewTracker rendered with props:', { slug, userId });

  useEffect(() => {
    console.log('ViewTracker useEffect triggered');
    
    const trackView = async () => {
      console.log('Starting view tracking for page:', { slug, userId });
      
      try {
        // Get page ID first
        const baseUrl = `https://${window.location.host}`;
        const checkUrl = `${baseUrl}/api/check?slug=${slug}&userId=${userId}`;
        console.log('Fetching page data from:', checkUrl);
        
        const pageResponse = await fetch(checkUrl);
        console.log('Page response status:', pageResponse.status);
        
        const pageData = await pageResponse.json();
        console.log('Page data received:', pageData);

        if (!pageData.data?.id) {
          console.error('Page not found:', pageData);
          toast.error('Page not found');
          return;
        }

        const pageId = pageData.data.id;
        console.log('Found page ID:', pageId);

        // Track the view
        const trackUrl = `${baseUrl}/api/track`;
        console.log('Sending tracking request to:', trackUrl);
        
        const response = await fetch(trackUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            pageId,
            eventType: 'view'
          })
        });
        
        console.log('Tracking response status:', response.status);
        const data = await response.json();
        console.log('Tracking response data:', data);

        if (data.success) {
          console.log('View tracked successfully');
          toast.success('View tracked');
        } else {
          console.error('Tracking failed:', data.error);
          toast.error('Failed to track view');
        }
      } catch (error: any) {
        console.error('Error tracking view:', error);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        toast.error('Error tracking view');
      }
    };

    trackView();
  }, [slug, userId]);

  return null;
} 