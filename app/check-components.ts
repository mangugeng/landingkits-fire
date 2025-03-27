const { db } = require('./lib/firebase.singleton');
const { collection, getDocs, query, where } = require('firebase/firestore');

async function checkComponents() {
  try {
    const componentsRef = collection(db, 'component_editor');
    const q = query(componentsRef, where('isActive', '==', true));
    const querySnapshot = await getDocs(q);
    
    console.log('Jumlah komponen yang ditemukan:', querySnapshot.size);
    
    querySnapshot.forEach((doc: any) => {
      const data = doc.data();
      console.log('Komponen:', {
        id: doc.id,
        name: data.name,
        description: data.description,
        category: data.category,
        userId: data.userId,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
        isActive: data.isActive
      });
    });
  } catch (error) {
    console.error('Error checking components:', error);
  }
}

checkComponents(); 