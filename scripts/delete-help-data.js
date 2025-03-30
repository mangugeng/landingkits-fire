const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, deleteDoc, doc } = require('firebase/firestore');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Firebase configuration
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function deleteData() {
    try {
        // Delete FAQs
        const faqsSnapshot = await getDocs(collection(db, 'faqs'));
        for (const doc of faqsSnapshot.docs) {
            await deleteDoc(doc.ref);
            console.log('Deleted FAQ:', doc.data().question);
        }

        // Delete Guides
        const guidesSnapshot = await getDocs(collection(db, 'guides'));
        for (const doc of guidesSnapshot.docs) {
            await deleteDoc(doc.ref);
            console.log('Deleted Guide:', doc.data().title);
        }

        console.log('Data deletion completed successfully!');
    } catch (error) {
        console.error('Error deleting data:', error);
    }
}

deleteData(); 