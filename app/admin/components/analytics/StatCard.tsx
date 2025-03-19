'use client';

import { FiEye, FiTarget, FiClock, FiXCircle } from 'react-icons/fi';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: 'views' | 'conversions' | 'time' | 'bounce';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export default function StatCard({ title, value, icon, trend }: StatCardProps) {
  const getIcon = () => {
    switch (icon) {
      case 'views':
        return <FiEye className="h-6 w-6" />;
      case 'conversions':
        return <FiTarget className="h-6 w-6" />;
      case 'time':
        return <FiClock className="h-6 w-6" />;
      case 'bounce':
        return <FiXCircle className="h-6 w-6" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className="p-3 rounded-full bg-blue-100 text-blue-600">
          {getIcon()}
        </div>
        <div className="ml-4">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <div className="flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            {trend && (
              <p className={`ml-2 text-sm font-medium ${
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 