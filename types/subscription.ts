export type SubscriptionTier = 'FREE' | 'BASIC' | 'PRO' | 'ENTERPRISE';
export type SubscriptionStatus = 'ACTIVE' | 'INACTIVE' | 'CANCELLED' | 'EXPIRED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED';
export type PaymentMethod = 'CREDIT_CARD' | 'VIRTUAL_ACCOUNT' | 'EWALLET' | 'QRIS' | 'BANK_TRANSFER';

export interface SubscriptionPlan {
  id: string;
  name: string;
  tier: SubscriptionTier;
  price: {
    monthly: number;
    yearly: number;
  };
  features: string[];
  maxLandingPages: number;
  customDomain: boolean;
  analytics: boolean;
  prioritySupport: boolean;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date;
  interval: 'MONTH' | 'YEAR';
  autoRenew: boolean;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  paymentMethodId?: string;
  lastPaymentDate?: Date;
}

export interface PaymentHistory {
  id: string;
  subscriptionId: string;
  userId: string;
  invoiceId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  paymentDetails: {
    xenditPaymentId: string;
    [key: string]: any;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Invoice {
  id: string;
  userId: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  dueDate: Date;
  items: {
    description: string;
    amount: number;
    quantity: number;
  }[];
  xenditInvoiceId: string;
  paymentUrl?: string;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
} 