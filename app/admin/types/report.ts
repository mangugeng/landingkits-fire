export interface Report {
  id: string;
  title: string;
  description: string;
  type: 'analytics' | 'users' | 'landing_pages' | 'conversions';
  format: 'pdf' | 'csv' | 'excel';
  dateRange: {
    start: string;
    end: string;
  };
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
  downloadUrl?: string;
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: Report['type'];
  format: Report['format'];
  defaultDateRange: '7d' | '30d' | '90d' | 'custom';
} 