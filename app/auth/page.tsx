'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthForm from '../components/auth/AuthForm';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Implementasi login/register akan ditambahkan nanti
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <span className="text-2xl font-bold text-blue-600">LandingKits</span>
            <span className="text-2xl font-bold text-gray-900">.com</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Selamat Datang di LandingKits
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Buat landing page profesional dengan mudah
          </p>
        </div>

        <AuthForm />
      </div>
    </div>
  );
} 