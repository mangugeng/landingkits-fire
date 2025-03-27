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
  ArrowRightOnRectangleIcon,
  Squares2X2Icon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Landing Page', href: '/dashboard/landingpage', icon: DocumentTextIcon },
  { name: 'Template', href: '/dashboard/templates', icon: Squares2X2Icon },
  { name: 'Pesan', href: '/dashboard/messages', icon: ChatBubbleLeftRightIcon },
  { name: 'Analytics', href: '/dashboard/analytics', icon: ChartBarIcon },
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
    <nav className="space-y-1 px-2 py-4">
      {navigation.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              isActive
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
              'group flex items-center px-2 py-2 text-base font-medium rounded-md'
            )}
          >
            <item.icon
              className={cn(
                isActive ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
                'mr-4 flex-shrink-0 h-6 w-6'
              )}
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