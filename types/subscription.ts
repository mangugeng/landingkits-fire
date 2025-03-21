export type SubscriptionTier = 'FREE' | 'BASIC' | 'PRO' | 'ENTERPRISE';
export type SubscriptionStatus = 
  | 'ACTIVE'      // Subscription aktif
  | 'PENDING'     // Menunggu pembayaran
  | 'EXPIRED'     // Sudah berakhir
  | 'CANCELLED'   // Dibatalkan
  | 'GRACE'       // Masa tenggang
  | 'SUSPENDED';  // Ditangguhkan
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED';
export type PaymentMethod = 'CREDIT_CARD' | 'VIRTUAL_ACCOUNT' | 'EWALLET' | 'QRIS' | 'BANK_TRANSFER';

export type SubscriptionInterval = 'MONTH' | 'YEAR';

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
  description: string;
  metadata?: {
    popularPlan?: boolean;
    maxProjects?: number;
    [key: string]: any;
  };
}

export interface Subscription {
  userId: string;
  status: SubscriptionStatus;
  plan: 'BASIC' | 'PRO' | 'ENTERPRISE';
  startDate: string;
  endDate: string;
  graceEndDate?: string;
  interval: 'MONTH' | 'YEAR';
  cancelReason?: string;
  renewalAttempts: number;
  lastPaymentDate: string;
  nextPaymentDate: string;
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

export interface SubscriptionLog {
  subscriptionId: string;
  userId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  timestamp: string;
  details: {
    oldStatus?: SubscriptionStatus;
    newStatus?: SubscriptionStatus;
    reason?: string;
  };
} 