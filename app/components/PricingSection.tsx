'use client';

import { useState } from 'react';
import Link from 'next/link';

const plans = [
  {
    name: 'Starter',
    price: 'Gratis',
    description: 'Untuk memulai perjalanan digital Anda',
    features: [
      '1 Landing Page',
      'Template Dasar',
      'Statistik Dasar',
      '1 Domain',
      'Support Email',
      'Optimasi SEO Dasar',
      'Form Builder Dasar'
    ],
    cta: 'Mulai Gratis',
    popular: false
  },
  {
    name: 'Professional',
    price: 'Rp 299.000',
    period: '/bulan',
    description: 'Solusi lengkap untuk bisnis berkembang',
    features: [
      '5 Landing Page',
      'Semua Template Premium',
      'A/B Testing',
      'Analitik Lanjutan',
      '5 Domain',
      'Priority Support',
      'Integrasi Form',
      'Optimasi SEO Lanjutan',
      'Custom Fonts',
      'Integrasi Payment Gateway'
    ],
    cta: 'Mulai Sekarang',
    popular: true
  },
  {
    name: 'Premium',
    price: 'Rp 599.000',
    period: '/bulan',
    description: 'Fitur eksklusif untuk bisnis premium',
    features: [
      '15 Landing Page',
      'Semua Template Premium',
      'A/B Testing',
      'Analitik Lanjutan',
      '10 Domain',
      '24/7 Support',
      'Integrasi API',
      'Custom Domain',
      'SSL Gratis',
      'Optimasi SEO Premium',
      'Integrasi CRM',
      'Custom Integrations',
      'Dedicated IP',
      'CDN Global'
    ],
    cta: 'Mulai Sekarang',
    popular: false
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'Solusi khusus untuk perusahaan besar',
    features: [
      'Unlimited Landing Page',
      'Semua Template Premium',
      'A/B Testing',
      'Analitik Lanjutan',
      'Unlimited Domain',
      'Dedicated Support',
      'Integrasi API',
      'Custom Development',
      'SLA Garansi',
      'Training Tim',
      'Optimasi SEO Enterprise',
      'Integrasi Custom',
      'Dedicated Server',
      'Custom Workflows',
      'White Label Options',
      'Account Manager Dedicated'
    ],
    cta: 'Hubungi Kami',
    popular: false
  }
];

export default function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [showPopup, setShowPopup] = useState(false);

  const FeaturePopup = ({ features, onClose }: { features: string[], onClose: () => void }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Semua Fitur</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <ul className="space-y-3">
            {features.map((feature) => (
              <li key={feature} className="flex gap-x-3 text-sm text-gray-600">
                <svg
                  className="h-6 w-5 flex-none text-blue-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clipRule="evenodd"
                  />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white py-12 sm:py-12">
      {showPopup && (
        <FeaturePopup
          features={selectedFeatures}
          onClose={() => setShowPopup(false)}
        />
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Paket Harga</h2>
          <p className="mt-4 text-lg text-gray-600">
            Pilih paket yang sesuai dengan kebutuhan Anda
          </p>
        </div>
        <div className="mx-auto max-w-4xl text-center">
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Kami menyediakan berbagai paket untuk memenuhi kebutuhan bisnis Anda, dari yang baru memulai hingga perusahaan besar.
          </p>
        </div>
        <div className="mt-16 flex justify-center">
          <div className="relative self-center rounded-full bg-gray-100 p-1 w-72">
            <div className="absolute -top-8 left-[25%] transform -translate-x-1/2">
              <div className="relative bg-red-500 text-white px-2 py-0.5 rounded-lg text-xs font-semibold">
                <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-500 rotate-45"></span>
                20%
              </div>
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                className={`${
                  isAnnual ? 'bg-white shadow' : ''
                } relative w-[48%] rounded-full py-3 text-sm font-semibold leading-5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600`}
                onClick={() => setIsAnnual(true)}
              >
                Tahunan
              </button>
              <button
                type="button"
                className={`${
                  !isAnnual ? 'bg-white shadow' : ''
                } relative w-[48%] rounded-full py-3 text-sm font-semibold leading-5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600`}
                onClick={() => setIsAnnual(false)}
              >
                Bulanan
              </button>
            </div>
          </div>
        </div>
        <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl p-8 ring-1 ring-gray-200 xl:p-10 flex flex-col ${
                plan.popular ? 'bg-gray-100 text-gray-900 ring-gray-900' : 'bg-white'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 right-8">
                  <div className="relative bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-semibold">
                    <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-600 rotate-45"></span>
                    Terpopuler
                  </div>
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center justify-between gap-x-4">
                  <h3
                    id={plan.name}
                    className={`text-lg font-semibold leading-8 ${
                      plan.popular ? 'text-gray-900' : 'text-gray-900'
                    }`}
                  >
                    {plan.name}
                  </h3>
                </div>
                <p className="mt-4 text-sm leading-6 text-gray-600">{plan.description}</p>
                <div className="mt-6 text-center">
                  <div className="flex items-baseline justify-center">
                    {plan.price !== 'Gratis' && plan.price !== 'Custom' && (
                      <span className="text-4xl font-bold">Rp</span>
                    )}
                    <span className="text-4xl font-bold ml-2">
                      {isAnnual && plan.price !== 'Custom' && plan.price !== 'Gratis' ? 
                        `${((parseInt(plan.price.replace(/[^0-9]/g, '')) * 0.8)).toLocaleString('id-ID')}`.replace('Rp ', '') : 
                        plan.price.replace('Rp ', '')}
                    </span>
                    {plan.period && (
                      <span className="text-xs text-gray-600 ml-1 -mt-6">
                        {isAnnual ? '/tahun' : plan.period}
                      </span>
                    )}
                  </div>
                </div>
                <ul
                  role="list"
                  className="mt-8 space-y-3 text-sm leading-6 text-gray-600"
                >
                  {plan.features.slice(0, 3).map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <svg
                        className={`h-6 w-5 flex-none ${
                          plan.popular ? 'text-blue-600' : 'text-blue-600'
                        }`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                {plan.features.length > 3 && (
                  <button
                    onClick={() => {
                      setSelectedFeatures(plan.features);
                      setShowPopup(true);
                    }}
                    className="mt-3 text-sm text-blue-600 hover:text-blue-500 font-medium"
                  >
                    Selengkapnya
                  </button>
                )}
              </div>
              <Link
                href={plan.name === 'Enterprise' ? '/contact' : '/register'}
                className={`mt-8 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  plan.popular
                    ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-500 focus-visible:outline-blue-600'
                    : 'bg-blue-600 text-white shadow-sm hover:bg-blue-500 focus-visible:outline-blue-600'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 