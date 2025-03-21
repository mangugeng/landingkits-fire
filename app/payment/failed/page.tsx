import { redirect } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { XCircleIcon } from '@heroicons/react/24/solid';

export default async function PaymentFailedPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const externalId = searchParams.external_id;

  if (!externalId) {
    redirect('/dashboard');
  }

  // Ambil data transaksi
  const transactionsRef = collection(db, 'transactions');
  const q = query(transactionsRef, where('externalId', '==', externalId));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    redirect('/dashboard');
  }

  const transaction = querySnapshot.docs[0].data();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <XCircleIcon className="mx-auto h-12 w-12 text-red-500" />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Pembayaran Gagal
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Mohon maaf, pembayaran Anda tidak berhasil diproses
            </p>
          </div>

          <div className="mt-6">
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Detail Transaksi
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <ul className="list-disc space-y-1 pl-5">
                      <li>ID Transaksi: {transaction.externalId}</li>
                      <li>Total Pembayaran: Rp {transaction.amount.toLocaleString('id-ID')}</li>
                      <li>Status: Gagal</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <a
                href="/dashboard"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Kembali ke Dashboard
              </a>
              <a
                href={transaction.metadata?.invoiceUrl || '/dashboard'}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Coba Lagi
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 