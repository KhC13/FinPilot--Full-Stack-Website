'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HeartPulse, Sliders, TrendingUp, Wallet, Target, Sparkles, LogOut } from 'lucide-react';
import { authApi } from '@/lib/api';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Health Score', href: '/health-score', icon: HeartPulse },
    { name: 'What-If', href: '/what-if', icon: Sliders },
    { name: 'Future Cost', href: '/future-cost', icon: TrendingUp },
    { name: 'Investments', href: '/investments', icon: Wallet },
    { name: 'Goals', href: '/goals', icon: Target },
    { name: 'Insights', href: '/insights', icon: Sparkles },
  ];

  const handleLogout = () => {
    authApi.removeToken();
    window.location.href = '/login';
  };

  return (
    <nav className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold tracking-tight text-blue-400">
              FinPilot
            </Link>
            <div className="hidden md:flex space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}