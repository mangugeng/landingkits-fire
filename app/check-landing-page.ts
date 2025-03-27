import { db } from './lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

async function checkLandingPage() {
  try {
    const landingPagesRef = collection(db, 'landing_pages');
    const q = query(
      landingPagesRef,
      where('slug', '==', 'tokoku')
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log('Landing page dengan slug "tokoku" tidak ditemukan');
      return;
    }

    querySnapshot.forEach((doc) => {
      console.log('Data landing page ditemukan:');
      console.log('ID:', doc.id);
      console.log('Data:', doc.data());
    });
  } catch (error) {
    console.error('Error checking landing page:', error);
  }
}

checkLandingPage(); 