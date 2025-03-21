'use client';

import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function PaymentStatus() {
  const searchParams = useSearchParams();
  const status = searchParams.get('payment');

  if (!status) return null;

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-lg text-center">
        {status === 'success' ? (
          <>
            <div className="mb-4 flex justify-center">
              <CheckCircle2 className="w-16 h-16 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">Pembayaran Berhasil!</h2>
            <p className="text-gray-600 mb-6">
              Terima kasih! Pembayaran Anda telah berhasil diproses. Anda sekarang dapat mengakses semua fitur premium.
            </p>
          </>
        ) : (
          <>
            <div className="mb-4 flex justify-center">
              <XCircle className="w-16 h-16 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">Pembayaran Gagal</h2>
            <p className="text-gray-600 mb-6">
              Maaf, pembayaran Anda tidak dapat diproses. Silakan coba lagi atau hubungi dukungan pelanggan kami.
            </p>
          </>
        )}
        
        <div className="space-y-3">
          <Link href="/dashboard" className="block">
            <Button variant="outline" className="w-full">
              Kembali ke Dashboard
            </Button>
          </Link>
          <Link href="/dashboard/subscription" className="block">
            <Button className="w-full">
              Lihat Status Berlangganan
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 