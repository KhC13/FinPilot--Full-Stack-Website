'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Compass, Receipt, MessageCircle, LogOut, User, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import DownloadReportButton from '@/components/DownloadReportButton';
import { useFinancial } from '@/lib/FinancialContext';
import { authApi, AuthUser } from '@/lib/authApi';

const navLinks = [
  { href: '/score',       label: 'Health Score', },
  { href: '/what-if',     label: 'What-If',},
  { href: '/future-cost', label: 'Future Cost', },
  { href: '/investment',  label: 'Investments', },
  { href: '/insights',    label: 'Insights', },
  { href: '/expenses',    label: 'Expenses', icon: Receipt },
  { href: '/chat',        label: 'AI Advisor', icon: MessageCircle },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { inputs } = useFinancial();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUser(authApi.getStoredUser());
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleLogout() {
    authApi.logout();
    setMenuOpen(false);
    router.push('/login');
  }

  return (
    <header className="sticky top-0 z-50 border-b border-glass-border bg-base-950/70 backdrop-blur-xl">
      <div className="flex items-center justify-between px-6 py-4 md:px-10">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="FinPilot logo" width={40} height={40} className="rounded-xl" />
          <div>
            <p className="font-display text-base font-bold leading-none text-ink">FinPilot</p>
            <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-ink-muted">Your Financial Co-Pilot</p>
          </div>
        </Link>

        {/* Nav links */}
        <nav className="hidden items-center gap-5 font-body text-sm font-medium text-ink-muted lg:flex">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 transition-colors hover:text-ink ${active ? 'text-ink font-semibold' : ''}`}
              >
                {Icon && <Icon className="h-3.5 w-3.5" />}
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <DownloadReportButton inputs={inputs} />

          {/* User menu */}
          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="btn-ghost flex items-center gap-2 !px-3 !py-2"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-purple/20 border border-accent-purple/30">
                  <User className="h-3.5 w-3.5 text-accent-purple" />
                </div>
                <span className="hidden text-sm md:block">{user.name.split(' ')[0]}</span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
              </button>

              {menuOpen && (
                <div className="glass-card absolute right-0 top-full mt-2 w-52 overflow-hidden p-1 shadow-glass-card">
                  <div className="border-b border-glass-border px-3 py-2.5 mb-1">
                    <p className="text-xs font-semibold text-ink">{user.name}</p>
                    <p className="text-[11px] text-ink-faint truncate">{user.email}</p>
                  </div>
                  <Link
                    href="/expenses"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink-muted transition-colors hover:bg-glass hover:text-ink"
                  >
                    <Receipt className="h-4 w-4" /> Expense Tracker
                  </Link>
                  <Link
                    href="/chat"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink-muted transition-colors hover:bg-glass hover:text-ink"
                  >
                    <MessageCircle className="h-4 w-4" /> AI Advisor
                  </Link>
                  <div className="mt-1 border-t border-glass-border pt-1">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-state-danger transition-colors hover:bg-state-danger/10"
                    >
                      <LogOut className="h-4 w-4" /> Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="btn-ghost !px-4 !py-2 text-sm">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
