'use client';

import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Target, Coins, CalendarDays, Sparkle } from 'lucide-react';
import GlassCard, { CardHeader } from './GlassCard';
import { api, InvestmentResponse } from '@/lib/api';
import { formatCurrency } from '@/lib/format';

export default function InvestmentEngine() {
  const [goalAmount, setGoalAmount] = useState(500000);
  const [years, setYears] = useState(5);
  const [expectedReturn, setExpectedReturn] = useState(10);
  const [result, setResult] = useState<InvestmentResponse | null>(null);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      try {
        const res = await api.getInvestmentPlan({
          goalAmount,
          years,
          expectedReturn,
          monthlyExpenseTransactions: 60,
          avgRoundOff: 15
        });
        setResult(res);
      } catch (e) {
        // ignore
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [goalAmount, years, expectedReturn]);

  return (
    <GlassCard className="p-6 md:p-10" id="investment">
      <CardHeader
        eyebrow="Section 04"
        title="Micro-Investment Engine"
        description="A goal-based plan, broken into amounts small enough to not feel like a sacrifice."
        icon={<Target className="h-5 w-5 text-accent-blue" />}
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Inputs */}
        <div className="space-y-5">
          <div>
            <label className="field-label">Goal amount</label>
            <input
              type="number"
              min={0}
              value={goalAmount}
              onChange={(e) => setGoalAmount(Number(e.target.value) || 0)}
              className="input-field"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">Time horizon (yrs)</label>
              <input
                type="number"
                min={0.5}
                step={0.5}
                value={years}
                onChange={(e) => setYears(Number(e.target.value) || 0.5)}
                className="input-field"
              />
            </div>
            <div>
              <label className="field-label">Expected return (%)</label>
              <input
                type="number"
                min={0}
                step={0.5}
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(Number(e.target.value) || 0)}
                className="input-field"
              />
            </div>
          </div>

          {/* Daily / Monthly breakdown */}
          {result && (
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="hover-lift glass-panel rounded-2xl p-4">
                <CalendarDays className="h-4 w-4 text-accent-cyan" />
                <p className="mt-2 text-[11px] font-medium uppercase tracking-wider text-ink-faint">Invest daily</p>
                <p className="mt-1 font-mono text-lg font-bold gradient-text">{formatCurrency(result.plan.dailyInvestment)}</p>
              </div>
              <div className="hover-lift glass-panel rounded-2xl p-4">
                <Coins className="h-4 w-4 text-accent-purple" />
                <p className="mt-2 text-[11px] font-medium uppercase tracking-wider text-ink-faint">Invest monthly</p>
                <p className="mt-1 font-mono text-lg font-bold gradient-text">{formatCurrency(result.plan.monthlyInvestment)}</p>
              </div>
            </div>
          )}

          {/* Round-off simulation */}
          {result && (
            <div className="rounded-2xl border border-accent-cyan/20 bg-accent-cyan/5 p-4">
              <div className="flex items-center gap-2">
                <Sparkle className="h-4 w-4 text-accent-cyan" />
                <p className="text-xs font-semibold uppercase tracking-wider text-accent-cyan">Round-off, spare change</p>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-ink-muted">
                Rounding up everyday purchases adds roughly{' '}
                <span className="font-mono font-semibold text-ink">{formatCurrency(result.plan.monthlyRoundOffSavings)}</span> a
                month — about{' '}
                <span className="font-mono font-semibold text-ink">{formatCurrency(result.plan.yearlyRoundOffSavings)}</span> a
                year, on top of your plan.
              </p>
            </div>
          )}
        </div>

        {/* Growth chart */}
        <div className="flex flex-col">
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-ink-faint">Projected corpus growth</p>
          <div className="h-[260px] flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={result?.growthSeries ?? []} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="investStroke" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#22D3EE" />
                  </linearGradient>
                  <linearGradient id="investFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#22D3EE" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  tick={{ fill: '#94A3B8', fontSize: 11 }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
                  tickLine={false}
                  tickFormatter={(m) => `M${m}`}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fill: '#94A3B8', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => formatCurrency(v, { compact: true })}
                  width={64}
                />
                <Tooltip content={<InvestTooltip />} />
                <Area
                  type="monotone"
                  dataKey="corpus"
                  stroke="url(#investStroke)"
                  strokeWidth={3}
                  fill="url(#investFill)"
                  animationDuration={900}
                  dot={false}
                  activeDot={{ r: 5, fill: '#3B82F6', stroke: '#0A0D1C', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          {result && (
            <p className="mt-3 text-center text-xs text-ink-muted">
              On track to reach{' '}
              <span className="font-mono font-semibold text-ink">{formatCurrency(goalAmount)}</span> in {years}{' '}
              {years === 1 ? 'year' : 'years'}
            </p>
          )}
        </div>
      </div>
    </GlassCard>
  );
}

function InvestTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-panel rounded-xl px-3.5 py-2.5 text-xs shadow-glass-card">
      <p className="font-medium text-ink-muted">Month {label}</p>
      <p className="mt-0.5 font-mono text-sm font-semibold text-ink">{formatCurrency(payload[0].value)}</p>
    </div>
  );
}
