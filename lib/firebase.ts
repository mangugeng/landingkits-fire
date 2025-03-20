import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAwufH3J-mnF8kfwSgIlEuzyrbf38Cwp-0",
  authDomain: "landingkits.firebaseapp.com",
  projectId: "landingkits",
  storageBucket: "landingkits.firebasestorage.app",
  messagingSenderId: "983038900293",
  appId: "1:983038900293:web:bd97b09155ba48251f4b2c",
  measurementId: "G-1FH6JG9DGJ"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Analytics
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

// Export analytics
export { analytics }; 