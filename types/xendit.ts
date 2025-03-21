export interface XenditInvoiceItem {
  name: string;
  quantity: number;
  price: number;
  category?: string;
}

export interface CreateInvoiceRequest {
  externalId: string;
  amount: number;
  currency: string;
  payerEmail: string;
  description: string;
  customer?: {
    givenNames: string;
    email: string;
  };
  successRedirectUrl?: string;
  failureRedirectUrl?: string;
  items?: Array<{
    name: string;
    quantity: number;
    price: number;
    category: string;
  }>;
}

export interface CreateInvoiceOperationRequest {
  data: CreateInvoiceRequest;
  forUserId?: string;
}

export interface Invoice {
  id: string;
  externalId: string;
  userId: string;
  status: string;
  amount: number;
  payerEmail: string;
  description: string;
  invoiceUrl: string;
  expiryDate: Date;
  availableBanks: any[];
  availableRetailOutlets: any[];
  availableEwallets: any[];
  shouldExcludeCreditCard: boolean;
  shouldSendEmail: boolean;
  created: Date;
  updated: Date;
  currency: string;
}

export interface XenditInvoice {
  id: string;
  externalId: string;
  userId: string;
  status: string;
  amount: number;
  payerEmail: string;
  description: string;
  invoiceUrl: string;
  expiryDate: string;
  createdAt: string;
  updatedAt: string;
} 