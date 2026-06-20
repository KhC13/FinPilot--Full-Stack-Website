'use client';

import { useEffect, useState } from 'react';
import { Brain, AlertTriangle, ShieldAlert, CheckCircle2 } from 'lucide-react';
import GlassCard, { CardHeader } from './GlassCard';
import { api, Insight } from '@/lib/api';
import type { FinancialFormValues } from './FinancialScoreCard';

const iconMap: Record<Insight['type'], typeof AlertTriangle> = {
  positive: CheckCircle2,
  alert: AlertTriangle,
  warning: AlertTriangle,
  risk: ShieldAlert
};

const styleMap: Record<Insight['type'], { border: string; bg: string; text: string; tagText: string }> = {
  positive: { border: 'border-state-success/25', bg: 'bg-state-success/5', text: 'text-state-success', tagText: 'Positive' },
  alert: { border: 'border-state-warning/25', bg: 'bg-state-warning/5', text: 'text-state-warning', tagText: 'Alert' },
  warning: { border: 'border-state-warning/25', bg: 'bg-state-warning/5', text: 'text-state-warning', tagText: 'Warning' },
  risk: { border: 'border-state-danger/25', bg: 'bg-state-danger/5', text: 'text-state-danger', tagText: 'Risk' }
};

export default function SmartInsights({ inputs }: { inputs: FinancialFormValues }) {
  const [insights, setInsights] = useState<Insight[]>([]);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      try {
        const res = await api.getInsights(inputs);
        setInsights(res.insights);
      } catch (e) {
        // ignore
      }
    }, 350);
    return () => clearTimeout(timeout);
  }, [inputs]);

  return (
    <GlassCard className="p-6 md:p-10" id="insights">
      <CardHeader
        eyebrow="Section 05"
        title="Smart Insights"
        description="Rule-based reads on your financial habits, refreshed as you adjust your numbers."
        icon={<Brain className="h-5 w-5 text-accent-cyan" />}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {insights.map((insight, i) => {
          const Icon = iconMap[insight.type];
          const style = styleMap[insight.type];
          return (
            <div
              key={i}
              className={`hover-lift rounded-2xl border p-4 ${style.border} ${style.bg}`}
            >
              <div className="flex items-center justify-between">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg border ${style.border} ${style.bg}`}>
                  <Icon className={`h-4 w-4 ${style.text}`} />
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${style.text}`}>
                  {style.tagText}
                </span>
              </div>
              <h3 className="mt-3 font-display text-sm font-semibold text-ink">{insight.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">{insight.message}</p>
            </div>
          );
        })}

        {insights.length === 0 && (
          <p className="col-span-full text-center text-sm text-ink-muted">
            Adjust your numbers above to generate personalized insights.
          </p>
        )}
      </div>
    </GlassCard>
  );
}
