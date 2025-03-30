'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AuthProvider } from "@/app/contexts/AuthContext";
import {
  Menu,
  X,
  Home,
  FileText,
  Files,
  MessageSquare,
  BarChart,
  Search,
  Globe,
  CreditCard,
  User,
  Settings,
  HelpCircle,
} from 'lucide-react';

const navigation = [
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: Home,
    description: 'Ringkasan aktivitas dan statistik'
  },
  { 
    name: 'Landing Pages', 
    href: '/dashboard/landingpage', 
    icon: FileText,
    description: 'Kelola landing page Anda'
  },
  { 
    name: 'Template', 
    href: '/dashboard/templates', 
    icon: Files,
    description: 'Pilih dan sesuaikan template'
  },
  { 
    name: 'Pesan', 
    href: '/dashboard/messages', 
    icon: MessageSquare,
    description: 'Lihat dan balas pesan'
  },
  { 
    name: 'Analytics', 
    href: '/dashboard/analytics', 
    icon: BarChart,
    description: 'Analisis performa landing page'
  },
  { 
    name: 'SEO', 
    href: '/dashboard/seo', 
    icon: Search,
    description: 'Optimalkan SEO landing page'
  },
  { 
    name: 'Domains', 
    href: '/dashboard/domains', 
    icon: Globe,
    description: 'Kelola domain dan subdomain'
  },
  { 
    name: 'Subscription', 
    href: '/dashboard/subscription', 
    icon: CreditCard,
    description: 'Kelola langganan dan pembayaran'
  },
  { 
    name: 'Profile', 
    href: '/dashboard/profile', 
    icon: User,
    description: 'Atur profil dan preferensi'
  },
  { 
    name: 'Settings', 
    href: '/dashboard/settings', 
    icon: Settings,
    description: 'Konfigurasi akun dan sistem'
  },
  {
    name: 'Help',
    href: '/dashboard/help',
    icon: HelpCircle,
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Mobile Sidebar */}
        <div className={cn(
          "fixed inset-0 z-50 lg:hidden",
          sidebarOpen ? "block" : "hidden"
        )}>
          <div className="fixed inset-0 bg-gray-900/80" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-white">
            <div className="flex h-16 items-center justify-between px-4 border-b">
              <h2 className="text-lg font-semibold">Dashboard</h2>
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                <X className="h-6 w-6" />
              </Button>
            </div>
            <ScrollArea className="h-[calc(100vh-4rem)]">
              <nav className="space-y-1 p-4">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                      )}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </ScrollArea>
          </div>
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r bg-white px-6 pb-4">
            <div className="flex h-16 shrink-0 items-center border-b">
              <h2 className="text-lg font-semibold">Dashboard</h2>
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <li key={item.name}>
                          <Link
                            href={item.href}
                            className={cn(
                              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                              isActive
                                ? "bg-blue-50 text-blue-600"
                                : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                            )}
                          >
                            <item.icon className="h-5 w-5" />
                            {item.name}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:pl-72">
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <div className="flex items-center gap-2">
              {navigation.map((item) => {
                if (pathname === item.href) {
                  return (
                    <div key={item.name} className="flex items-center gap-2">
                      <item.icon className="h-5 w-5 text-blue-600" />
                      <div className="flex items-center gap-2">
                        <h1 className="text-lg font-semibold text-gray-900">{item.name}</h1>
                        <span className="text-gray-400">|</span>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>

          <main className="py-10">
            <div className="px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AuthProvider>
  );
} 