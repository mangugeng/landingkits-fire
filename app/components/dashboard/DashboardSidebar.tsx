'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { 
  HomeIcon, 
  DocumentTextIcon,
  ChartBarIcon,
  GlobeAltIcon,
  CreditCardIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  Squares2X2Icon,
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const menuItems = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Landing Pages', href: '/dashboard/landingpage', icon: DocumentTextIcon },
  { name: 'Template', href: '/dashboard/templates', icon: Squares2X2Icon },
  { name: 'Pesan', href: '/dashboard/messages', icon: ChatBubbleLeftRightIcon },
  { name: 'Analytics', href: '/dashboard/analytics', icon: ChartBarIcon },
  { name: 'SEO', href: '/dashboard/seo', icon: MagnifyingGlassIcon },
  { name: 'Domains', href: '/dashboard/domains', icon: GlobeAltIcon },
  { name: 'Subscription', href: '/dashboard/subscription', icon: CreditCardIcon },
  { name: 'Profile', href: '/dashboard/profile', icon: UserIcon },
  { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/auth');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
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
      </div>

      {/* Logout Button */}
      <div className="mt-auto pt-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="group flex w-full items-center px-2 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 hover:text-red-900"
        >
          <ArrowLeftOnRectangleIcon
            className="mr-3 h-5 w-5 flex-shrink-0 text-red-400 group-hover:text-red-500"
            aria-hidden="true"
          />
          Keluar
        </button>
      </div>
    </div>
  );
} 