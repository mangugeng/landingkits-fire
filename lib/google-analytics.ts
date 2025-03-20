import { BetaAnalyticsDataClient } from '@google-analytics/data';

// Validasi environment variables
if (!process.env.GOOGLE_ANALYTICS_CLIENT_EMAIL || !process.env.GOOGLE_ANALYTICS_PRIVATE_KEY) {
  throw new Error('Missing Google Analytics environment variables');
}

// Inisialisasi client Google Analytics
const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GOOGLE_ANALYTICS_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_ANALYTICS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
});

// Data dummy untuk development
const dummyData = [
  {
    date: '2024-03-19',
    visitors: 150,
    pageViews: 300,
    bounceRate: 45.5,
    avgSessionDuration: 180,
    conversionRate: 2.5
  },
  {
    date: '2024-03-18',
    visitors: 145,
    pageViews: 290,
    bounceRate: 46.2,
    avgSessionDuration: 175,
    conversionRate: 2.3
  },
  {
    date: '2024-03-17',
    visitors: 160,
    pageViews: 320,
    bounceRate: 44.8,
    avgSessionDuration: 185,
    conversionRate: 2.7
  }
];

export async function getAnalyticsData(): Promise<Array<{
  date: string;
  visitors: number;
  pageViews: number;
  bounceRate: number;
  avgSessionDuration: number;
  conversionRate: number;
}>> {
  try {
    const propertyId = process.env.GOOGLE_ANALYTICS_PROPERTY_ID;
    if (!propertyId) {
      console.log('Using dummy data: Property ID not configured');
      return dummyData;
    }

    // Validasi format Property ID
    if (!/^\d+$/.test(propertyId)) {
      console.log('Using dummy data: Invalid Property ID format');
      return dummyData;
    }

    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: '7daysAgo',
          endDate: 'today',
        },
      ],
      dimensions: [
        {
          name: 'date',
        },
      ],
      metrics: [
        {
          name: 'activeUsers',
        },
        {
          name: 'screenPageViewsPerSession',
        },
        {
          name: 'bounceRate',
        },
        {
          name: 'averageSessionDuration',
        },
        {
          name: 'conversions',
        },
      ],
    });

    return response.rows?.map((row) => ({
      date: row.dimensionValues?.[0].value || '',
      visitors: parseInt(row.metricValues?.[0].value || '0'),
      pageViews: parseInt(row.metricValues?.[1].value || '0'),
      bounceRate: parseFloat(row.metricValues?.[2].value || '0'),
      avgSessionDuration: parseInt(row.metricValues?.[3].value || '0'),
      conversionRate: parseFloat(row.metricValues?.[4].value || '0'),
    })) || dummyData;
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    console.log('Using dummy data due to error');
    return dummyData;
  }
} 