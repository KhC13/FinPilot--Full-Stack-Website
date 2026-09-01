'use client';

import { useState } from 'react';
import { Download, Loader2, FileWarning } from 'lucide-react';
import { api } from '@/lib/api';
import { generateFinancialReportPDF } from '@/utils/generatePDF';
import type { FinancialFormValues } from './FinancialScoreCard';

interface DownloadReportButtonProps {
  /** Same shared inputs object already lifted in app/page.tsx. */
  inputs: FinancialFormValues;
  /**
   * Optional — pass these if the user has customized the Future Cost
   * Simulator / Investment Engine inputs and you want the PDF to match
   * exactly what's on screen. Falls back to the same defaults those
   * sections use otherwise.
   */
  futureCostParams?: { cost: number; years: number; inflation: number };
  investmentParams?: { goalAmount: number; years: number; expectedReturn: number };
  className?: string;
}

const defaultFutureCostParams = { cost: 1000000, years: 10, inflation: 6 };
const defaultInvestmentParams = { goalAmount: 500000, years: 5, expectedReturn: 10 };

export default function DownloadReportButton({
  inputs,
  futureCostParams = defaultFutureCostParams,
  investmentParams = defaultInvestmentParams,
  className = ''
}: DownloadReportButtonProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  async function handleDownload() {
    setStatus('loading');
    try {
      // Pulls from the existing, unmodified API endpoints — same client
      // functions every other section already uses.
      const [score, futureCost, investment, insightsRes] = await Promise.all([
        api.getScore(inputs),
        api.getFutureCost(futureCostParams),
        api.getInvestmentPlan(investmentParams),
        api.getInsights(inputs)
      ]);

      generateFinancialReportPDF({
        inputs,
        score,
        futureCost,
        investment,
        insights: insightsRes.insights
      });
      setStatus('idle');
    } catch (e) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2500);
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleDownload}
        disabled={status === 'loading'}
        className={`btn-primary ${status === 'loading' ? 'cursor-wait opacity-80' : ''} ${className}`}
      >
        {status === 'loading' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating report...
          </>
        ) : (
          <>
            <Download className="h-4 w-4" />
            Download PDF report
          </>
        )}
      </button>

      {status === 'error' && (
        <span className="flex items-center gap-1.5 text-xs text-state-danger">
          <FileWarning className="h-3.5 w-3.5" />
          Couldn&apos;t generate the report. Please try again.
        </span>
      )}
    </div>
  );
}