import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, orderBy, limit, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';
import { BlogPost } from '../types/blog';

export async function getAllPosts(): Promise<BlogPost[]> {
  const postsRef = collection(db, 'posts');
  const q = query(postsRef, orderBy('publishedAt', 'desc'));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as BlogPost[];
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const postsRef = collection(db, 'posts');
  const q = query(postsRef, where('slug', '==', slug));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    return null;
  }
  
  const doc = querySnapshot.docs[0];
  return {
    id: doc.id,
    ...doc.data()
  } as BlogPost;
}

export async function getLatestPosts(count: number = 3): Promise<BlogPost[]> {
  try {
    const q = query(
      collection(db, 'blog_posts'),
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc'),
      limit(count)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as BlogPost[];
  } catch (error) {
    console.error('Error fetching latest posts:', error);
    return [];
  }
}

export async function createPost(post: Omit<BlogPost, 'id'>): Promise<BlogPost> {
  const postsRef = collection(db, 'posts');
  const docRef = await addDoc(postsRef, post);
  
  return {
    id: docRef.id,
    ...post
  };
}

export async function updatePost(id: string, post: Partial<BlogPost>): Promise<BlogPost> {
  const postRef = doc(db, 'posts', id);
  await updateDoc(postRef, post);
  
  const updatedDoc = await getDoc(postRef);
  return {
    id: updatedDoc.id,
    ...updatedDoc.data()
  } as BlogPost;
}

export async function deletePost(id: string): Promise<void> {
  const postRef = doc(db, 'posts', id);
  await deleteDoc(postRef);
}

export async function uploadImage(file: File): Promise<string> {
  const storageRef = ref(storage, `blog/${Date.now()}-${file.name}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
} 