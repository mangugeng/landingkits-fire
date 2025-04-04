'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  DocumentDuplicateIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  SwatchIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: HomeIcon,
  },
  {
    name: 'Landing Pages',
    href: '/dashboard/landingpage',
    icon: DocumentDuplicateIcon,
  },
  {
    name: 'Analytics',
    href: '/dashboard/analytics',
    icon: ChartBarIcon,
  },
  {
    name: 'Tema',
    href: '/dashboard/theme',
    icon: SwatchIcon,
  },
  {
    name: 'Pengaturan',
    href: '/dashboard/settings',
    icon: Cog6ToothIcon,
  },
  {
    name: 'Tim',
    href: '/dashboard/team',
    icon: UserGroupIcon,
  },
  {
    name: 'Pesan',
    href: '/dashboard/messages',
    icon: ChatBubbleLeftRightIcon,
  },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {navigation.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`
              group flex items-center px-3 py-2 text-sm font-medium rounded-md
              ${
                isActive
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }
            `}
          >
            <item.icon
              className={`
                mr-3 flex-shrink-0 h-6 w-6
                ${
                  isActive
                    ? 'text-gray-500'
                    : 'text-gray-400 group-hover:text-gray-500'
                }
              `}
              aria-hidden="true"
            />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
} 