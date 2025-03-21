import { google } from 'googleapis';

// Validasi environment variables
const requiredEnvVars = [
  'GOOGLE_ANALYTICS_CLIENT_EMAIL',
  'GOOGLE_ANALYTICS_PRIVATE_KEY',
  'GOOGLE_ANALYTICS_PROPERTY_ID'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing ${envVar}`);
  }
}

// Log konfigurasi untuk debug
console.log('Google Analytics Config:', {
  clientEmail: process.env.GOOGLE_ANALYTICS_CLIENT_EMAIL,
  propertyId: process.env.GOOGLE_ANALYTICS_PROPERTY_ID
});

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_ANALYTICS_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_ANALYTICS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
});

const analytics = google.analyticsdata({
  version: 'v1beta',
  auth: auth as unknown as any,
});

export async function getAnalyticsData() {
  try {
    const propertyId = process.env.GOOGLE_ANALYTICS_PROPERTY_ID;
    if (!propertyId) {
      throw new Error('Missing GOOGLE_ANALYTICS_PROPERTY_ID');
    }

    const response = await analytics.properties.runReport({
      property: `properties/${propertyId}`,
      requestBody: {
        dateRanges: [
          {
            startDate: '7daysAgo',
            endDate: 'today',
          },
        ],
        metrics: [
          {
            name: 'activeUsers',
          },
          {
            name: 'screenPageViews',
          },
        ],
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    // Return dummy data in case of error
    return {
      rows: [
        {
          dimensionValues: [{ value: '7daysAgo' }],
          metricValues: [
            { value: '150' },
            { value: '300' }
          ]
        }
      ]
    };
  }
} 