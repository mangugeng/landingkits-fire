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
import Cookies from 'js-cookie';

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
        
        // Set cookie untuk menandakan user sudah login
        Cookies.set('user_login', 'true', { expires: 7 }); // Cookie berlaku 7 hari
        
        // Redirect ke dashboard
        router.push('/dashboard');
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      let errorMessage = 'Terjadi kesalahan saat autentikasi.';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Email ini sudah terdaftar.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Email tidak valid.';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Operasi tidak diizinkan.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password terlalu lemah.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'Akun ini telah dinonaktifkan.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'Akun tidak ditemukan.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Password salah.';
          break;
        default:
          errorMessage = error.message;
      }
      
      setError(errorMessage);
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
      
      // Set cookie untuk menandakan user sudah login
      Cookies.set('user_login', 'true', { expires: 7 }); // Cookie berlaku 7 hari
      
      // Redirect ke dashboard
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Google authentication error:', error);
      let errorMessage = 'Terjadi kesalahan saat autentikasi dengan Google.';
      
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          errorMessage = 'Autentikasi dibatalkan.';
          break;
        case 'auth/popup-blocked':
          errorMessage = 'Pop-up diblokir oleh browser.';
          break;
        case 'auth/cancelled-popup-request':
          errorMessage = 'Permintaan autentikasi dibatalkan.';
          break;
        default:
          errorMessage = error.message;
      }
      
      setError(errorMessage);
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
            disabled={loading}
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
            disabled={loading}
          />
        </div>

        <div className="flex items-center justify-between mb-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Loading...' : isSignUp ? 'Daftar' : 'Masuk'}
          </button>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Atau</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleAuth}
          disabled={loading}
          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
            />
          </svg>
          {loading ? 'Loading...' : 'Masuk dengan Google'}
        </button>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {isSignUp ? 'Sudah punya akun? Masuk' : 'Belum punya akun? Daftar'}
          </button>
        </div>
      </form>
    </div>
  );
} 