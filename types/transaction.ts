export interface Transaction {
  id: string;
  userId: string;
  planId: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  paymentMethod?: string;
  externalId: string;
  interval: 'MONTH' | 'YEAR';
  createdAt: string;
  updatedAt: string;
  metadata?: {
    invoiceUrl?: string;
    xenditInvoiceId?: string;
    [key: string]: any;
  };
} 