// Lightweight API client for the FinPilot backend.
// Uses Next.js rewrites (see next.config.js) so calls to /api/* are
// proxied to the Express server — no CORS headaches in dev.

const BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://finpilot-backend-sd6y.onrender.com";

async function postJSON<T>(path: string, body: object): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || `Request to ${path} failed with ${res.status}`);
  }

  return res.json();
}

export interface FinancialInputs {
  income: number;
  expenses: number;
  savings: number;
  debt: number;
}

export interface ScoreResponse {
  score: number;
  label: string;
  tone: 'success' | 'warning' | 'danger';
  breakdown: {
    savingsRateScore: number;
    expenseRatioScore: number;
    debtScore: number;
    cushionScore: number;
  };
  metrics: {
    savingsRate: number;
    expenseRatio: number;
    debtToIncome: number;
    monthsOfCushion: number;
  };
  topInsights: Insight[];
}

export interface FutureCostResponse {
  series: { year: number; label: string; value: number }[];
  summary: {
    presentCost: number;
    futureCost: number;
    totalIncrease: number;
    increasePercent: number;
    inflationRate: number;
    years: number;
  };
}

export interface InvestmentResponse {
  inputs: { goalAmount: number; years: number; expectedReturn: number };
  plan: {
    dailyInvestment: number;
    monthlyInvestment: number;
    monthlyRoundOffSavings: number;
    yearlyRoundOffSavings: number;
    totalMonthlyContribution: number;
    months: number;
  };
  growthSeries: { month: number; corpus: number }[];
}

export interface Insight {
  type: 'alert' | 'warning' | 'risk' | 'positive';
  severity: 'low' | 'medium' | 'high';
  title: string;
  message: string;
}

export const api = {
  getScore: (inputs: FinancialInputs) => postJSON<ScoreResponse>('/api/score', inputs),

  getFutureCost: (params: { cost: number; years: number; inflation: number }) =>
    postJSON<FutureCostResponse>('/api/future-cost', params),

  getInvestmentPlan: (params: {
    goalAmount: number;
    years: number;
    expectedReturn: number;
    monthlyExpenseTransactions?: number;
    avgRoundOff?: number;
  }) => postJSON<InvestmentResponse>('/api/investment', params),

  getInsights: (inputs: FinancialInputs) => postJSON<{ insights: Insight[] }>('/api/insights', inputs)
};