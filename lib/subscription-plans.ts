import type { SubscriptionPlan } from '../types/subscription';

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    tier: 'FREE',
    price: {
      monthly: 0,
      yearly: 0
    },
    features: [
      'Fitur dasar',
      '1 landing page',
      'Template terbatas'
    ],
    maxLandingPages: 1,
    customDomain: false,
    analytics: false,
    prioritySupport: false
  },
  {
    id: 'basic',
    name: 'Basic',
    tier: 'BASIC',
    price: {
      monthly: 99000,
      yearly: 990000
    },
    features: [
      '5 landing page',
      'Semua template',
      'Custom domain'
    ],
    maxLandingPages: 5,
    customDomain: true,
    analytics: false,
    prioritySupport: false
  },
  {
    id: 'pro',
    name: 'Pro',
    tier: 'PRO',
    price: {
      monthly: 199000,
      yearly: 1990000
    },
    features: [
      'Landing page unlimited',
      'Semua fitur Basic',
      'Analytics dashboard',
      'Priority support'
    ],
    maxLandingPages: -1, // unlimited
    customDomain: true,
    analytics: true,
    prioritySupport: true
  }
]; 