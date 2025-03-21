'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { 
  HomeIcon,
  DocumentTextIcon,
  ChartBarIcon,
  GlobeAltIcon,
  CreditCardIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Landing Pages', href: '/dashboard/landingpage', icon: DocumentTextIcon },
  { name: 'Analytics', href: '/dashboard/analytics', icon: ChartBarIcon },
  { name: 'Domains', href: '/dashboard/domains', icon: GlobeAltIcon },
  { name: 'Subscription', href: '/dashboard/subscription', icon: CreditCardIcon },
  { name: 'Profile', href: '/dashboard/profile', icon: UserIcon },
  { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon },
];

export default function DashboardNav() {
  const pathname = usePathname();

  const handleLogout = () => {
    signOut({
      callbackUrl: '/home'
    });
  };

  return (
    <nav className="space-y-1 p-4">
      {navigation.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
              isActive
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <item.icon
              className={`mr-3 h-5 w-5 flex-shrink-0 ${
                isActive ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500'
              }`}
              aria-hidden="true"
            />
            {item.name}
          </Link>
        );
      })}
      
      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full mt-4 group flex items-center px-3 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 hover:text-red-900"
      >
        <ArrowRightOnRectangleIcon
          className="mr-3 h-5 w-5 flex-shrink-0 text-red-400 group-hover:text-red-500"
          aria-hidden="true"
        />
        Keluar
      </button>
    </nav>
  );
} 