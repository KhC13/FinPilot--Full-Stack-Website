'use client';

import { Compass } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-glass-border bg-base-950/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
            <Compass className="h-5 w-5 text-white" strokeWidth={2.25} />
          </div>
          <div>
            <p className="font-display text-base font-bold leading-none text-ink">FinPilot</p>
            <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-ink-muted">
              Your Financial Co-Pilot
            </p>
          </div>
        </div>

        <nav className="hidden items-center gap-8 font-body text-sm font-medium text-ink-muted md:flex">
          <a href="#score" className="transition-colors hover:text-ink">
            Health Score
          </a>
          <a href="#future-cost" className="transition-colors hover:text-ink">
            Future Cost
          </a>
          <a href="#investment" className="transition-colors hover:text-ink">
            Investments
          </a>
          <a href="#insights" className="transition-colors hover:text-ink">
            Insights
          </a>
        </nav>

        <button className="btn-primary !px-4 !py-2 text-xs">Get Started</button>
      </div>
    </header>
  );
}
