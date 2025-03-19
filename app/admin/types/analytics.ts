export interface AnalyticsData {
  totalViews: number;
  totalConversions: number;
  conversionRate: number;
  averageTimeOnPage: number;
  bounceRate: number;
  topPages: {
    id: string;
    title: string;
    views: number;
    conversions: number;
    conversionRate: number;
  }[];
  trafficSources: {
    source: string;
    count: number;
    percentage: number;
  }[];
  dailyStats: {
    date: string;
    views: number;
    conversions: number;
  }[];
  deviceStats: {
    device: string;
    count: number;
    percentage: number;
  }[];
  locationStats: {
    location: string;
    count: number;
    percentage: number;
  }[];
} 