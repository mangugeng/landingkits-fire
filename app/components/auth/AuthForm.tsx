'use client';

import { useState } from 'react';
import { auth, db } from '../../lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  fetchSignInMethodsForEmail,
  sendEmailVerification,
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const router = useRouter();

  const saveUserToFirestore = async (user: User) => {
    try {
      console.log('Saving user to Firestore:', user.uid);
      const userData = {
        email: user.email,
        role: 'tenant',
        createdAt: new Date().toISOString(),
        emailVerified: user.emailVerified,
        displayName: user.displayName || '',
        photoURL: user.photoURL || ''
      };
      console.log('User data to be saved:', userData);
      console.log('Firestore instance:', db);

      // Cek apakah data user sudah ada
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        console.log('User data already exists, updating with merge...');
        // Update data yang sudah ada dengan merge
        await setDoc(userRef, {
          email: user.email,
          emailVerified: user.emailVerified,
          displayName: user.displayName || '',
          photoURL: user.photoURL || ''
        }, { merge: true });
      } else {
        // Jika data belum ada, buat dokumen baru
        await setDoc(userRef, userData);
      }
      
      console.log('User saved successfully');
    } catch (error: any) {
      console.error('Error saving user to Firestore:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Error details:', error.details);
      throw error;
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setVerificationSent(false);

    try {
      // Cek metode sign-in yang tersedia untuk email
      const methods = await fetchSignInMethodsForEmail(auth, email);
      console.log('Existing sign-in methods:', methods);
      
      if (isSignUp) {
        if (methods.length > 0) {
          if (methods.includes('google.com')) {
            setError('Email ini sudah terdaftar dengan Google. Silakan gunakan tombol Sign in with Google.');
            return;
          } else if (methods.includes('password')) {
            setError('Email ini sudah terdaftar. Silakan login.');
            return;
          }
        }
        
        console.log('Creating user account...');
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log('User created successfully:', user.uid);
        
        // Kirim email verifikasi
        console.log('Sending verification email...');
        await sendEmailVerification(user);
        setVerificationSent(true);
        console.log('Verification email sent');
        
        // Simpan data user ke Firestore
        console.log('Saving user data to Firestore...');
        await saveUserToFirestore(user);
        console.log('User data saved');
        
        // Logout user setelah pendaftaran
        console.log('Signing out user...');
        await auth.signOut();
        console.log('User signed out');
      } else {
        // Jika user sudah ada, langsung login
        console.log('Starting login process for:', email);
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log('User logged in successfully:', user.uid);
        
        if (!user.emailVerified) {
          setError('Email belum diverifikasi. Silakan cek email Anda untuk verifikasi.');
          await auth.signOut();
          return;
        }
        
        // Jika email sudah diverifikasi, simpan data ke Firestore jika belum ada
        await saveUserToFirestore(user);
        
        // Redirect ke dashboard
        router.push('/dashboard');
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError('');

    try {
      console.log('Starting Google authentication...');
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log('Google authentication successful:', user.uid);
      
      // Simpan data user ke Firestore
      await saveUserToFirestore(user);
      
      // Redirect ke dashboard
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Google authentication error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {isSignUp ? 'Daftar' : 'Masuk'}
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {verificationSent && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          Email verifikasi telah dikirim. Silakan cek email Anda untuk verifikasi akun.
        </div>
      )}

      <form onSubmit={handleEmailAuth}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Memproses...' : isSignUp ? 'Daftar' : 'Masuk'}
        </button>
      </form>

      <div className="mt-4">
        <button
          onClick={handleGoogleAuth}
          disabled={loading}
          className="w-full bg-white border border-gray-300 text-gray-700 p-2 rounded hover:bg-gray-50 disabled:opacity-50 flex items-center justify-center"
        >
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google"
            className="w-5 h-5 mr-2"
          />
          Lanjutkan dengan Google
        </button>
      </div>

      <p className="mt-4 text-center text-sm">
        {isSignUp ? 'Sudah punya akun?' : 'Belum punya akun?'}{' '}
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-blue-500 hover:underline"
        >
          {isSignUp ? 'Masuk' : 'Daftar'}
        </button>
      </p>
    </div>
  );
} 