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

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">Pricing</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Pilih paket yang sesuai dengan kebutuhan Anda
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Kami menyediakan berbagai paket untuk memenuhi kebutuhan bisnis Anda, dari yang baru memulai hingga perusahaan besar.
          </p>
        </div>
        <div className="mt-16 flex justify-center">
          <div className="relative self-center rounded-full bg-gray-100 p-1">
            <button
              type="button"
              className={`${
                isAnnual ? 'bg-white shadow' : ''
              } relative w-1/2 rounded-full py-2.5 text-sm font-semibold leading-5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600`}
              onClick={() => setIsAnnual(true)}
            >
              Tahunan <span className="text-green-600">(Hemat 20%)</span>
            </button>
            <button
              type="button"
              className={`${
                !isAnnual ? 'bg-white shadow' : ''
              } relative w-1/2 rounded-full py-2.5 text-sm font-semibold leading-5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600`}
              onClick={() => setIsAnnual(false)}
            >
              Bulanan
            </button>
          </div>
        </div>
        <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-3xl p-8 ring-1 ring-gray-200 xl:p-10 ${
                plan.popular ? 'bg-gray-900 text-white ring-gray-900' : 'bg-white'
              }`}
            >
              <div className="flex items-center justify-between gap-x-4">
                <h3
                  id={plan.name}
                  className={`text-lg font-semibold leading-8 ${
                    plan.popular ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {plan.name}
                </h3>
                {plan.popular && (
                  <p className="rounded-full bg-blue-600/10 px-2.5 py-1 text-xs font-semibold leading-5 text-blue-600">
                    Paling populer
                  </p>
                )}
              </div>
              <p className="mt-4 text-sm leading-6 text-gray-600">{plan.description}</p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className={`text-4xl font-bold tracking-tight ${
                  plan.popular ? 'text-white' : 'text-gray-900'
                }`}>
                  {isAnnual && plan.price !== 'Custom' ? 
                    `Rp ${(parseInt(plan.price.replace(/[^0-9]/g, '')) * 0.8).toLocaleString('id-ID')}` : 
                    plan.price}
                </span>
                {plan.period && (
                  <span className={`text-sm font-semibold leading-6 ${
                    plan.popular ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {isAnnual ? '/tahun' : plan.period}
                  </span>
                )}
              </p>
              <Link
                href={plan.name === 'Enterprise' ? '/contact' : '/register'}
                className={`mt-6 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  plan.popular
                    ? 'bg-white text-blue-600 shadow-sm hover:bg-gray-100 focus-visible:outline-white'
                    : 'bg-blue-600 text-white shadow-sm hover:bg-blue-500 focus-visible:outline-blue-600'
                }`}
              >
                {plan.cta}
              </Link>
              <ul
                role="list"
                className="mt-8 space-y-3 text-sm leading-6 text-gray-600"
              >
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <svg
                      className={`h-6 w-5 flex-none ${
                        plan.popular ? 'text-white' : 'text-blue-600'
                      }`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
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
          ))}
        </div>
      </div>
    </div>
  );
} 