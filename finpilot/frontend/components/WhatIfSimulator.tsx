// frontend/components/WhatIfSimulator.tsx
'use client';

import { useEffect, useState } from 'react';
import { Wand2, TrendingUp, TrendingDown, Minus, ArrowRight } from 'lucide-react';
import GlassCard, { CardHeader } from './GlassCard';
import { api, ScoreResponse } from '@/lib/api';
import { formatCurrency } from '@/lib/format';
import type { FinancialFormValues } from './FinancialScoreCard';

interface WhatIfSimulatorProps {
  /** Same shared inputs object already lifted in app/page.tsx — pass it straight through. */
  inputs: FinancialFormValues;
}

export default function WhatIfSimulator({ inputs }: WhatIfSimulatorProps) {
  const [incomeBoost, setIncomeBoost] = useState(10); // %
  const [expenseCut, setExpenseCut] = useState(10); // %
  const [savingsBoost, setSavingsBoost] = useState(20); // %

  const [currentResult, setCurrentResult] = useState<ScoreResponse | null>(null);
  const [simulatedResult, setSimulatedResult] = useState<ScoreResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const adjusted = {
    income: Math.round(inputs.income * (1 + incomeBoost / 100)),
    expenses: Math.round(inputs.expenses * (1 - expenseCut / 100)),
    savings: Math.round(inputs.savings * (1 + savingsBoost / 100)),
    debt: inputs.debt
  };

  useEffect(() => {
    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        // Reuses the existing /api/score endpoint — no backend changes needed.
        const [current, simulated] = await Promise.all([api.getScore(inputs), api.getScore(adjusted)]);
        setCurrentResult(current);
        setSimulatedResult(simulated);
      } catch (e) {
        // swallow — gauges simply stay on their last known values
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputs, incomeBoost, expenseCut, savingsBoost]);

  const delta = (simulatedResult?.score ?? 0) - (currentResult?.score ?? 0);
  const DeltaIcon = delta > 0 ? TrendingUp : delta < 0 ? TrendingDown : Minus;
  const deltaTone = delta > 0 ? 'text-state-success' : delta < 0 ? 'text-state-danger' : 'text-ink-muted';

  return (
    <GlassCard className="p-6 md:p-10" glow id="what-if">
      <CardHeader
        eyebrow="Section 02"
        title="What-If Simulator"
        description="Drag the levers to see how small habit changes ripple through your financial health score — in real time."
        icon={<Wand2 className="h-5 w-5 text-accent-purple" />}
      />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_1px_1fr]">
        {/* Sliders */}
        <div className="space-y-6">
          <SliderRow label="Increase income" value={incomeBoost} setValue={setIncomeBoost} min={0} max={50} step={1} />
          <SliderRow label="Reduce expenses" value={expenseCut} setValue={setExpenseCut} min={0} max={50} step={1} />
          <SliderRow label="Increase savings" value={savingsBoost} setValue={setSavingsBoost} min={0} max={100} step={1} />

          <div className="grid grid-cols-3 gap-3 pt-2">
            <AdjustedChip label="New income" value={formatCurrency(adjusted.income, { compact: true })} />
            <AdjustedChip label="New expenses" value={formatCurrency(adjusted.expenses, { compact: true })} />
            <AdjustedChip label="New savings" value={formatCurrency(adjusted.savings, { compact: true })} />
          </div>
        </div>

        {/* Divider */}
        <div className="hidden bg-glass-border lg:block" />

        {/* Comparison */}
        <div className={`flex flex-col items-center justify-center gap-6 transition-opacity duration-300 ${loading ? 'opacity-60' : 'opacity-100'}`}>
          <div className="flex items-center gap-4 sm:gap-8">
            <MiniScoreGauge gradientId="currentGauge" label="Current" score={currentResult?.score ?? 0} tone={currentResult?.tone ?? 'warning'} />
            <ArrowRight className="h-5 w-5 shrink-0 text-ink-faint" />
            <MiniScoreGauge gradientId="simulatedGauge" label="Simulated" score={simulatedResult?.score ?? 0} tone={simulatedResult?.tone ?? 'warning'} />
          </div>

          <div className={`flex items-center gap-2 rounded-full border border-glass-border bg-glass px-4 py-2 ${deltaTone}`}>
            <DeltaIcon className="h-4 w-4" />
            <span className="font-mono text-sm font-semibold">
              {delta > 0 ? '+' : ''}
              {delta} points
            </span>
          </div>

          <p className="max-w-xs text-center text-xs leading-relaxed text-ink-muted">
            Simulated score reflects a {incomeBoost}% income increase, {expenseCut}% expense cut, and {savingsBoost}%
            savings boost applied to your current numbers.
          </p>
        </div>
      </div>
    </GlassCard>
  );
}

function SliderRow({ label, value, setValue, min, max, step }: { label: string; value: number; setValue: (v: number) => void; min: number; max: number; step: number }) {
  const percent = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="field-label !mb-0">{label}</label>
        <span className="font-mono text-xs font-semibold text-accent-cyan">+{value}%</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-base-700 accent-accent-purple transition-all duration-200"
        style={{ background: `linear-gradient(to right, #8B5CF6 0%, #22D3EE ${percent}%, rgba(255,255,255,0.08) ${percent}%)` }}
      />
    </div>
  );
}

function AdjustedChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-glass-border bg-base-900/40 px-3 py-2.5 text-center">
      <p className="text-[10px] font-medium uppercase tracking-wider text-ink-faint">{label}</p>
      <p className="mt-1 font-mono text-xs font-semibold text-ink">{value}</p>
    </div>
  );
}

/**
 * Compact gradient ring used only for the current-vs-simulated comparison.
 * Kept local to this file (rather than reusing the hero ScoreRing) so each
 * instance gets its own SVG gradient id — avoids duplicate-id collisions
 * when two gauges render side by side on the same page.
 */
function MiniScoreGauge({ gradientId, label, score, tone, size = 120 }: { gradientId: string; label: string; score: number; tone: 'success' | 'warning' | 'danger'; size?: number }) {
  const stroke = size * 0.09;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.max(0, Math.min(100, score)) / 100);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="55%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#22D3EE" />
            </linearGradient>
          </defs>
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.3s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-2xl font-bold text-ink tabular-nums">{score}</span>
        </div>
      </div>
      <span
        className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
          tone === 'success' ? 'border-state-success/30 bg-state-success/10 text-state-success' : tone === 'warning' ? 'border-state-warning/30 bg-state-warning/10 text-state-warning' : 'border-state-danger/30 bg-state-danger/10 text-state-danger'
        }`}
      >
        {label}
      </span>
    </div>
  );
}