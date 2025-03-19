'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FiHome, 
  FiUsers, 
  FiSettings, 
  FiBarChart2, 
  FiFileText,
  FiLayout
} from 'react-icons/fi';

const menuItems = [
  { name: 'Dashboard', href: '/admin', icon: FiHome },
  { name: 'Users', href: '/admin/users', icon: FiUsers },
  { name: 'Landing Pages', href: '/admin/landing-pages', icon: FiLayout },
  { name: 'Analytics', href: '/admin/analytics', icon: FiBarChart2 },
  { name: 'Reports', href: '/admin/reports', icon: FiFileText },
  { name: 'Settings', href: '/admin/settings', icon: FiSettings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white shadow-lg">
      <nav className="mt-5 px-2">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                  isActive
                    ? 'bg-blue-100 text-blue-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon
                  className={`mr-4 flex-shrink-0 h-6 w-6 ${
                    isActive ? 'text-blue-900' : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
} 