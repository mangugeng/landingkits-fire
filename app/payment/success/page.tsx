import { redirect } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

export default async function PaymentSuccessPage({
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
            <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500" />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Pembayaran Berhasil!
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Terima kasih telah berlangganan LandingKits
            </p>
          </div>

          <div className="mt-6">
            <div className="rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    Detail Transaksi
                  </h3>
                  <div className="mt-2 text-sm text-green-700">
                    <ul className="list-disc space-y-1 pl-5">
                      <li>ID Transaksi: {transaction.externalId}</li>
                      <li>Total Pembayaran: Rp {transaction.amount.toLocaleString('id-ID')}</li>
                      <li>Status: Berhasil</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <a
                href="/dashboard"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Kembali ke Dashboard
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 