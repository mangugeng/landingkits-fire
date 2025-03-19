export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin: string;
  subscription: {
    plan: 'starter' | 'professional' | 'premium' | 'enterprise';
    status: 'active' | 'expired' | 'cancelled';
    startDate: string;
    endDate: string;
    features: string[];
  };
}

export interface UserFormData {
  name: string;
  email: string;
  role: 'user' | 'admin' | 'superadmin' | 'tenant' | 'customer_service';
  status: 'active' | 'inactive';
} 