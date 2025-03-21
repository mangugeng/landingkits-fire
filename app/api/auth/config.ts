import GoogleProvider from 'next-auth/providers/google';
import { FirestoreAdapter } from '@auth/firebase-adapter';
import { cert } from 'firebase-admin/app';

// Validasi environment variables
const validateEnvVars = () => {
  const required = {
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY
  } as const;

  const missing = Object.entries(required)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  // Log untuk debug
  console.log('Auth Configuration:', {
    projectId: required.FIREBASE_PROJECT_ID,
    clientEmail: required.FIREBASE_CLIENT_EMAIL,
    privateKeyLength: required.FIREBASE_PRIVATE_KEY?.length,
    hasGoogleClientId: !!required.GOOGLE_CLIENT_ID,
    hasGoogleClientSecret: !!required.GOOGLE_CLIENT_SECRET,
    hasFirebaseApiKey: !!required.NEXT_PUBLIC_FIREBASE_API_KEY
  });

  return required as Required<typeof required>;
};

const envVars = validateEnvVars();

// Konfigurasi auth
export const authConfig = {
  providers: [
    GoogleProvider({
      clientId: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
    }),
  ],
  adapter: FirestoreAdapter({
    credential: cert({
      projectId: envVars.FIREBASE_PROJECT_ID,
      clientEmail: envVars.FIREBASE_CLIENT_EMAIL,
      privateKey: envVars.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  }),
  callbacks: {
    session: async ({ session, user }: any) => {
      if (session?.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === 'development',
}; 