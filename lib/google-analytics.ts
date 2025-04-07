import { BetaAnalyticsDataClient } from '@google-analytics/data';

// Validasi environment variables
if (!process.env.GOOGLE_ANALYTICS_CLIENT_EMAIL || !process.env.GOOGLE_ANALYTICS_PRIVATE_KEY) {
  console.warn('Missing Google Analytics environment variables. Analytics will be disabled.');
}

// Inisialisasi client Google Analytics
const analyticsDataClient = process.env.GOOGLE_ANALYTICS_CLIENT_EMAIL && process.env.GOOGLE_ANALYTICS_PRIVATE_KEY
  ? new BetaAnalyticsDataClient({
      credentials: {
        client_email: process.env.GOOGLE_ANALYTICS_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_ANALYTICS_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      projectId: process.env.GOOGLE_ANALYTICS_PROJECT_ID,
    })
  : null;

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
  if (!analyticsDataClient) {
    return [
      {
        date: new Date().toISOString().split('T')[0],
        visitors: 0,
        pageViews: 0,
        bounceRate: 0,
        avgSessionDuration: 0,
        conversionRate: 0,
      },
    ];
  }

  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${process.env.GOOGLE_ANALYTICS_PROPERTY_ID}`,
      dateRanges: [
        {
          startDate: '30daysAgo',
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
          name: 'screenPageViews',
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
      avgSessionDuration: parseFloat(row.metricValues?.[3].value || '0'),
      conversionRate: parseFloat(row.metricValues?.[4].value || '0'),
    })) || [];
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    console.log('Using dummy data due to error');
    return [
      {
        date: new Date().toISOString().split('T')[0],
        visitors: 0,
        pageViews: 0,
        bounceRate: 0,
        avgSessionDuration: 0,
        conversionRate: 0,
      },
    ];
  }
} 