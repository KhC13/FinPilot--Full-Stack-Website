'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass } from 'lucide-react';
import DownloadReportButton from '@/components/DownloadReportButton';
import { useFinancial } from '@/lib/FinancialContext';

const navLinks = [
  { href: '/score',       label: 'Health Score' },
  { href: '/what-if',     label: 'What-If' },
  { href: '/future-cost', label: 'Future Cost' },
  { href: '/investment',  label: 'Investments' },
  { href: '/insights',    label: 'Insights' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { inputs } = useFinancial();

  return (
    <header className="sticky top-0 z-50 border-b border-glass-border bg-base-950/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">

        {/* Logo */}
        <Link href="/score" className="flex items-center gap-3">
          <img src="/logo.png" alt="FinPilot logo" width={40} height={40} className="rounded-xl" />
          <div>
            <p className="font-display text-base font-bold leading-none text-ink">FinPilot</p>
            <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-ink-muted">
              Your Financial Co-Pilot
            </p>
          </div>
        </Link>

        {/* Nav links */}
        <nav className="hidden items-center gap-6 font-body text-sm font-medium text-ink-muted md:flex">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`transition-colors hover:text-ink ${
                pathname === href ? 'text-ink font-semibold' : ''
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Download button — top right */}
        <DownloadReportButton inputs={inputs} />

      </div>
    </header>
  );
}