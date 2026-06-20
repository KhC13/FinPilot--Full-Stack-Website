'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import FinancialScoreCard, { FinancialFormValues } from '@/components/FinancialScoreCard';
import FutureCostSimulator from '@/components/FutureCostSimulator';
import InvestmentEngine from '@/components/InvestmentEngine';
import SmartInsights from '@/components/SmartInsights';
import WhatIfSimulator from '@/components/WhatIfSimulator';
import DownloadReportButton from '@/components/DownloadReportButton';

const initialInputs: FinancialFormValues = { income: 80000, expenses: 45000, savings: 15000, debt: 120000 };

export default function DashboardPage() {
  const [inputs, setInputs] = useState<FinancialFormValues>(initialInputs);

  return (
    <main className="relative">
      <Navbar />

      <div className="mx-auto max-w-7xl px-6 pb-24 pt-14 md:px-10">
        {/* Hero */}
        <section className="mb-14 max-w-2xl animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-glass-border bg-glass px-3.5 py-1.5 text-xs font-medium text-ink-muted">
            <Sparkles className="h-3.5 w-3.5 text-accent-cyan" />
            Real-time financial guidance
          </span>
          <h1 className="mt-5 text-4xl font-bold leading-[1.1] text-ink md:text-5xl">
            Plan smarter with your <span className="gradient-text">financial co-pilot</span>
          </h1>
          <p className="mt-4 text-base leading-relaxed text-ink-muted md:text-lg">
            FinPilot reads your income, spending, and goals to score your financial health, project how
            inflation reshapes the future, and lay out an investment plan you can actually stick to.
          </p>
          <div className="mt-6">
            <DownloadReportButton inputs={inputs} />
          </div>
        </section>

        {/* Sections */}
        <div className="flex flex-col gap-8" id="score">
          <FinancialScoreCard inputs={inputs} onChange={setInputs} />
          <WhatIfSimulator inputs={inputs} />
          <FutureCostSimulator />
          <InvestmentEngine />
          <SmartInsights inputs={inputs} />
        </div>

        {/* Footer */}
        <footer className="mt-20 flex flex-col items-center gap-2 border-t border-glass-border pt-8 text-center">
          <p className="font-display text-sm font-semibold text-ink">FinPilot</p>
          <p className="text-xs text-ink-muted">Built as a demo financial co-pilot. Not financial advice.</p>
        </footer>
      </div>
    </main>
  );
}
