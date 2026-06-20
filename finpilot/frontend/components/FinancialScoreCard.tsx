'use client';

import { useEffect, useState } from 'react';
import { Wallet, TrendingDown, PiggyBank, CreditCard, Sparkles, AlertTriangle, ShieldAlert, CheckCircle2 } from 'lucide-react';
import GlassCard, { CardHeader } from './GlassCard';
import ScoreRing from './ScoreRing';
import { api, ScoreResponse, Insight } from '@/lib/api';
import { formatNumber } from '@/lib/format';

export type FinancialFormValues = { income: number; expenses: number; savings: number; debt: number };

const insightIcon: Record<Insight['type'], typeof Sparkles> = {
  positive: CheckCircle2,
  alert: AlertTriangle,
  warning: AlertTriangle,
  risk: ShieldAlert
};

const insightTone: Record<Insight['type'], string> = {
  positive: 'text-state-success border-state-success/30 bg-state-success/10',
  alert: 'text-state-warning border-state-warning/30 bg-state-warning/10',
  warning: 'text-state-warning border-state-warning/30 bg-state-warning/10',
  risk: 'text-state-danger border-state-danger/30 bg-state-danger/10'
};

interface FinancialScoreCardProps {
  inputs: FinancialFormValues;
  onChange: (next: FinancialFormValues) => void;
}

export default function FinancialScoreCard({ inputs, onChange }: FinancialScoreCardProps) {
  const [result, setResult] = useState<ScoreResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.getScore(inputs);
        setResult(res);
      } catch (e) {
        // swallow — handled by empty state
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => clearTimeout(timeout);
  }, [inputs]);

  function update(field: keyof FinancialFormValues, value: string) {
    onChange({ ...inputs, [field]: Number(value) || 0 });
  }

  const fields: { key: keyof typeof inputs; label: string; icon: typeof Wallet }[] = [
    { key: 'income', label: 'Monthly income', icon: Wallet },
    { key: 'expenses', label: 'Monthly expenses', icon: TrendingDown },
    { key: 'savings', label: 'Current savings', icon: PiggyBank },
    { key: 'debt', label: 'Total debt', icon: CreditCard }
  ];

  return (
    <GlassCard className="p-6 md:p-10" glow>
      <CardHeader
        eyebrow="Section 01"
        title="Financial Health Score"
        description="Tell us your numbers and we'll score your financial health in real time."
        icon={<Sparkles className="h-5 w-5 text-accent-cyan" />}
      />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_1px_1fr]">
        {/* Inputs */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {fields.map(({ key, label, icon: Icon }) => (
            <div key={key}>
              <label className="field-label">{label}</label>
              <div className="relative">
                <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
                <input
                  type="number"
                  min={0}
                  value={inputs[key]}
                  onChange={(e) => update(key, e.target.value)}
                  className="input-field pl-10"
                  placeholder="0"
                />
              </div>
            </div>
          ))}

          {/* Metric chips */}
          {result && (
            <div className="col-span-full mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <MetricChip label="Savings rate" value={`${formatNumber(result.metrics.savingsRate)}%`} />
              <MetricChip label="Expense ratio" value={`${formatNumber(result.metrics.expenseRatio)}%`} />
              <MetricChip label="Debt / income" value={`${formatNumber(result.metrics.debtToIncome)}%`} />
              <MetricChip label="Cushion" value={`${formatNumber(result.metrics.monthsOfCushion)} mo`} />
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="hidden bg-glass-border lg:block" />

        {/* Score ring + insights */}
        <div className="flex flex-col items-center gap-6">
          <div className={`transition-opacity duration-300 ${loading ? 'opacity-60' : 'opacity-100'}`}>
            <ScoreRing score={result?.score ?? 0} label={result?.label ?? 'Calculating'} tone={result?.tone ?? 'warning'} />
          </div>

          <div className="w-full space-y-2.5">
            {(result?.topInsights ?? []).map((insight, i) => {
              const Icon = insightIcon[insight.type];
              return (
                <div
                  key={i}
                  className={`flex items-start gap-2.5 rounded-xl border px-3.5 py-2.5 text-xs leading-relaxed ${insightTone[insight.type]}`}
                >
                  <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span>{insight.message}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

function MetricChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-glass-border bg-base-900/40 px-3.5 py-2.5">
      <p className="text-[10px] font-medium uppercase tracking-wider text-ink-faint">{label}</p>
      <p className="mt-1 font-mono text-sm font-semibold text-ink">{value}</p>
    </div>
  );
}
