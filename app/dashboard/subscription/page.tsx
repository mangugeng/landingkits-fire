'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Cookies from 'js-cookie';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface TransactionHistory {
  id: string;
  planId: string;
  amount: number;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  createdAt: string;
  interval: 'MONTH' | 'YEAR';
}

interface Plan {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
  } | 'Custom';
  interval: 'monthly' | 'yearly';
  features: string[];
  isPopular?: boolean;
  maxPages: number;
  buttonText: string;
  buttonAction: 'payment' | 'contact' | 'start';
}

// Komponen untuk menampilkan history transaksi
function TransactionHistoryTable({ transactions, plans }: { transactions: TransactionHistory[], plans: Plan[] }) {
  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold mb-4">Riwayat Transaksi</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interval</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(transaction.createdAt), 'dd MMMM yyyy', { locale: id })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {plans.find(p => p.id === transaction.planId)?.name || transaction.planId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Rp {transaction.amount.toLocaleString('id-ID')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {transaction.interval === 'MONTH' ? 'Bulanan' : 'Tahunan'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${transaction.status === 'SUCCESS' ? 'bg-green-100 text-green-800' : 
                      transaction.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'}`}>
                    {transaction.status === 'SUCCESS' ? 'Berhasil' :
                     transaction.status === 'PENDING' ? 'Menunggu' : 'Gagal'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function SubscriptionPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<TransactionHistory[]>([]);
  const [selectedInterval, setSelectedInterval] = useState<'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    // Ambil user ID dan email dari cookie
    const userIdFromCookie = Cookies.get('user_id');
    const userEmailFromCookie = Cookies.get('user_email');
    const userLoginFromCookie = Cookies.get('user_login');

    // Jika tidak ada cookie login yang valid, redirect ke halaman auth
    if (!userLoginFromCookie || !userIdFromCookie || !userEmailFromCookie) {
      window.location.href = '/auth';
      return;
    }

    setUserId(userIdFromCookie);
    setUserEmail(userEmailFromCookie);
  }, []);

  const [currentPlan, setCurrentPlan] = useState<Plan>({
    id: 'starter',
    name: 'Starter',
    description: 'Untuk memulai perjalanan digital Anda',
    price: {
      monthly: 0,
      yearly: 0
    },
    interval: 'monthly',
    maxPages: 1,
    buttonText: 'Mulai Gratis',
    buttonAction: 'start',
    features: [
      '1 Landing Page',
      'Template Dasar',
      'Statistik Dasar',
    ]
  });

  const plans: Plan[] = [
    {
      id: 'free',
      name: 'Starter',
      description: 'Untuk memulai perjalanan digital Anda',
      price: {
        monthly: 0,
        yearly: 0
      },
      interval: 'monthly',
      maxPages: 1,
      buttonText: 'Mulai Gratis',
      buttonAction: 'start',
      features: [
        '1 Landing Page',
        'Template Dasar',
        'Statistik Dasar',
      ]
    },
    {
      id: 'basic',
      name: 'Professional',
      description: 'Solusi lengkap untuk bisnis berkembang',
      price: {
        monthly: 99000,
        yearly: 990000
      },
      interval: 'monthly',
      maxPages: 5,
      buttonText: 'Mulai Sekarang',
      buttonAction: 'payment',
      features: [
        '5 Landing Page',
        'Semua Template Premium',
        'A/B Testing',
      ],
      isPopular: true
    },
    {
      id: 'pro',
      name: 'Premium',
      description: 'Fitur eksklusif untuk bisnis premium',
      price: {
        monthly: 199000,
        yearly: 1990000
      },
      interval: 'monthly',
      maxPages: 15,
      buttonText: 'Mulai Sekarang',
      buttonAction: 'payment',
      features: [
        '15 Landing Page',
        'Semua Template Premium',
        'A/B Testing',
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Solusi khusus untuk perusahaan besar',
      price: 'Custom',
      interval: 'monthly',
      maxPages: -1, // unlimited
      buttonText: 'Hubungi Kami',
      buttonAction: 'contact',
      features: [
        'Unlimited Landing Page',
        'Semua Template Premium',
        'A/B Testing',
      ]
    }
  ];

  // Tambahkan useEffect untuk mengambil history transaksi
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!userId) return;
      
      try {
        const response = await fetch(`/api/payments/history?userId=${userId}`);
        if (!response.ok) throw new Error('Failed to fetch transactions');
        
        const data = await response.json();
        setTransactions(data.transactions);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        toast.error('Gagal memuat riwayat transaksi');
      }
    };

    fetchTransactions();
  }, [userId]);

  const handleSubscribe = async (plan: Plan) => {
    if (!userId || !userEmail) {
      toast.error('Sesi login tidak valid, silakan login ulang');
      window.location.href = '/auth';
      return;
    }

    if (plan.buttonAction === 'payment') {
      try {
        setIsLoading(true);
        // Buat invoice di Xendit
        const response = await fetch('/api/payments/create-invoice', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            planId: plan.id,
            userId: userId,
            email: userEmail,
            interval: plan.interval === 'monthly' ? 'MONTH' : 'YEAR',
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Gagal membuat invoice');
        }

        const data = await response.json();

        if (data.invoiceUrl) {
          // Redirect ke halaman pembayaran Xendit
          window.location.href = data.invoiceUrl;
        } else {
          throw new Error('URL invoice tidak valid');
        }
      } catch (error: any) {
        console.error('Error creating invoice:', error);
        toast.error(error.message || 'Gagal membuat invoice pembayaran');
      } finally {
        setIsLoading(false);
      }
    } else if (plan.buttonAction === 'contact') {
      // Redirect ke halaman kontak untuk Enterprise
      window.location.href = '/contact';
    } else {
      // Untuk plan Starter (gratis)
      try {
        setIsLoading(true);
        const response = await fetch('/api/update-subscription', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            planId: plan.id,
            userId: userId,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Gagal mengupdate langganan');
        }

        setCurrentPlan(plan);
        toast.success('Berhasil mengaktifkan plan Starter');
      } catch (error: any) {
        console.error('Error updating subscription:', error);
        toast.error(error.message || 'Gagal mengaktifkan plan');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Langganan</h1>
            <p className="mt-1 text-sm text-gray-500">
              Pilih paket yang sesuai dengan kebutuhan Anda
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSelectedInterval('monthly')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                selectedInterval === 'monthly'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Bulanan
            </button>
            <button
              onClick={() => setSelectedInterval('yearly')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                selectedInterval === 'yearly'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tahunan
            </button>
          </div>
        </div>
      </div>

      {/* Available Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-lg border ${
              plan.isPopular ? 'border-blue-500 shadow-lg' : 'border-gray-200'
            } p-6`}
          >
            {plan.isPopular && (
              <span className="absolute top-0 right-0 -mt-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                Terpopuler
              </span>
            )}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
              <p className="text-sm text-gray-500">{plan.description}</p>
              <p className="mt-4 text-3xl font-bold text-gray-900">
                {plan.price === 'Custom' ? (
                  'Custom'
                ) : (
                  <>
                    {plan.price[selectedInterval] === 0 ? (
                      'Gratis'
                    ) : (
                      <>
                        Rp {plan.price[selectedInterval].toLocaleString('id-ID')}
                        <span className="text-base font-normal text-gray-500">
                          /{selectedInterval === 'monthly' ? 'bulan' : 'tahun'}
                        </span>
                      </>
                    )}
                  </>
                )}
              </p>
              {selectedInterval === 'yearly' && plan.price !== 'Custom' && plan.price.yearly > 0 && (
                <p className="mt-1 text-sm text-green-600">
                  Hemat 20% dengan berlangganan tahunan
                </p>
              )}
            </div>
            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-gray-600">{feature}</span>
                </li>
              ))}
              <li className="pt-3">
                <button
                  className="text-sm text-blue-600 hover:text-blue-700"
                  onClick={() => {/* TODO: Show full features */}}
                >
                  Selengkapnya
                </button>
              </li>
            </ul>
            <button
              onClick={() => handleSubscribe(plan)}
              disabled={isLoading || currentPlan.id === plan.id}
              className={`w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 ${
                currentPlan.id === plan.id
                  ? 'bg-gray-400 cursor-not-allowed'
                  : plan.isPopular
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-600 hover:bg-gray-700'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Memproses...
                </div>
              ) : currentPlan.id === plan.id ? (
                'Plan Saat Ini'
              ) : (
                plan.buttonText
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Transaction History */}
      <TransactionHistoryTable transactions={transactions} plans={plans} />
    </DashboardLayout>
  );
} 