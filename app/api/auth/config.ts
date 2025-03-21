import GoogleProvider from 'next-auth/providers/google';
import { FirestoreAdapter } from '@auth/firebase-adapter';
import { cert } from 'firebase-admin/app';

// Fungsi untuk memproses private key
const getPrivateKey = () => {
  // Ambil private key dari environment variable
  const key = process.env.FIREBASE_PRIVATE_KEY;
  
  if (!key) {
    throw new Error('FIREBASE_PRIVATE_KEY is not set in environment variables');
  }

  // Hapus quotes di awal dan akhir jika ada
  const cleanKey = key.replace(/^["']|["']$/g, '');
  
  // Ganti literal \n dengan baris baru yang sebenarnya
  return cleanKey.replace(/\\n/g, '\n');
};

export const authConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  adapter: FirestoreAdapter({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: getPrivateKey(),
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
}; 