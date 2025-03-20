'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import DashboardLayout from '../../components/dashboard/DashboardLayout';

interface Plan {
  id: string;
  name: string;
  price: number;
  interval: 'monthly' | 'yearly';
  features: string[];
  isPopular?: boolean;
}

interface PaymentHistory {
  id: string;
  date: string;
  amount: number;
  status: 'success' | 'pending' | 'failed';
  plan: string;
  invoiceUrl: string;
}

export default function SubscriptionPage() {
  const [currentPlan, setCurrentPlan] = useState<Plan>({
    id: 'pro',
    name: 'Pro',
    price: 99000,
    interval: 'monthly',
    features: [
      'Unlimited landing pages',
      'Custom domains',
      'Analytics & reporting',
      'Priority support',
      'Advanced templates'
    ]
  });

  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([
    {
      id: '1',
      date: '2024-03-20',
      amount: 99000,
      status: 'success',
      plan: 'Pro Monthly',
      invoiceUrl: '#'
    },
    {
      id: '2',
      date: '2024-02-20',
      amount: 99000,
      status: 'success',
      plan: 'Pro Monthly',
      invoiceUrl: '#'
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const plans: Plan[] = [
    {
      id: 'starter',
      name: 'Starter',
      price: 49000,
      interval: 'monthly',
      features: [
        '5 landing pages',
        'Basic templates',
        'Basic analytics',
        'Email support'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 99000,
      interval: 'monthly',
      features: [
        'Unlimited landing pages',
        'Custom domains',
        'Analytics & reporting',
        'Priority support',
        'Advanced templates'
      ],
      isPopular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 199000,
      interval: 'monthly',
      features: [
        'Unlimited landing pages',
        'Custom domains',
        'Advanced analytics',
        '24/7 support',
        'All templates',
        'API access',
        'Custom integrations'
      ]
    }
  ];

  const handleSubscribe = async (planId: string) => {
    setIsLoading(true);
    try {
      // Simulasi API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const selectedPlan = plans.find(plan => plan.id === planId);
      if (selectedPlan) {
        setCurrentPlan(selectedPlan);
        toast.success('Berhasil berlangganan plan baru');
      }
    } catch (error) {
      toast.error('Gagal melakukan langganan');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Apakah Anda yakin ingin membatalkan langganan?')) {
      return;
    }

    setIsLoading(true);
    try {
      // Simulasi API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCurrentPlan(plans[0]); // Set ke plan starter
      toast.success('Langganan berhasil dibatalkan');
    } catch (error) {
      toast.error('Gagal membatalkan langganan');
    } finally {
      setIsLoading(false);
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
              Kelola langganan dan pembayaran Anda
            </p>
          </div>
        </div>
      </div>

      {/* Current Plan */}
      <div className="bg-white shadow rounded-lg mb-6 lg:mb-8">
        <div className="px-4 lg:px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Plan Saat Ini</h2>
        </div>
        <div className="p-4 lg:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{currentPlan.name}</h3>
              <p className="mt-1 text-sm text-gray-500">
                Rp {currentPlan.price.toLocaleString('id-ID')}/bulan
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCancelSubscription}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                Batalkan Langganan
              </button>
              <button
                onClick={() => window.location.href = '/dashboard/billing'}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Kelola Pembayaran
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Available Plans */}
      <div className="bg-white shadow rounded-lg mb-6 lg:mb-8">
        <div className="px-4 lg:px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Plan Tersedia</h2>
        </div>
        <div className="p-4 lg:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-lg border ${
                  plan.isPopular ? 'border-blue-500 shadow-lg' : 'border-gray-200'
                } p-6`}
              >
                {plan.isPopular && (
                  <span className="absolute top-0 right-0 -mt-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Populer
                  </span>
                )}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                  <p className="mt-1 text-3xl font-bold text-gray-900">
                    Rp {plan.price.toLocaleString('id-ID')}
                    <span className="text-base font-normal text-gray-500">/bulan</span>
                  </p>
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
                </ul>
                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isLoading || currentPlan.id === plan.id}
                  className={`w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 ${
                    currentPlan.id === plan.id
                      ? 'bg-gray-400 cursor-not-allowed'
                      : plan.isPopular
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-gray-600 hover:bg-gray-700'
                  }`}
                >
                  {currentPlan.id === plan.id ? 'Plan Saat Ini' : 'Pilih Plan'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 lg:px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Riwayat Pembayaran</h2>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jumlah
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paymentHistory.map((payment) => (
                <tr key={payment.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(payment.date).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.plan}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Rp {payment.amount.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      payment.status === 'success' ? 'bg-green-100 text-green-800' :
                      payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {payment.status === 'success' ? 'Sukses' :
                       payment.status === 'pending' ? 'Pending' : 'Gagal'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a
                      href={payment.invoiceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Download
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden divide-y divide-gray-200">
          {paymentHistory.map((payment) => (
            <div key={payment.id} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{payment.plan}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(payment.date).toLocaleDateString('id-ID')}
                  </p>
                </div>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  payment.status === 'success' ? 'bg-green-100 text-green-800' :
                  payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {payment.status === 'success' ? 'Sukses' :
                   payment.status === 'pending' ? 'Pending' : 'Gagal'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-900">
                  Rp {payment.amount.toLocaleString('id-ID')}
                </p>
                <a
                  href={payment.invoiceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-900"
                >
                  Download Invoice
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
} 