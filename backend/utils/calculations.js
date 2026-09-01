/**
 * Core financial calculation helpers.
 * Kept framework-agnostic so they can be unit tested independently
 * of Express request/response objects.
 */

/**
 * Calculate a 0-100 financial health score from income, expenses,
 * savings and debt.
 *
 * Weighting (sums to 100):
 *  - Savings rate     : 35 pts  -> (savings / income)
 *  - Expense ratio     : 30 pts  -> lower (expenses / income) is better
 *  - Debt-to-income    : 25 pts  -> lower (debt / (income*12)) is better
 *  - Savings cushion   : 10 pts  -> savings relative to monthly expenses (emergency fund)
 */
function calculateFinancialScore({ income, expenses, savings, debt }) {
  income = Number(income) || 0;
  expenses = Number(expenses) || 0;
  savings = Number(savings) || 0;
  debt = Number(debt) || 0;

  if (income <= 0) {
    return {
      score: 0,
      breakdown: { savingsRateScore: 0, expenseRatioScore: 0, debtScore: 0, cushionScore: 0 },
      metrics: { savingsRate: 0, expenseRatio: 0, debtToIncome: 0, monthsOfCushion: 0 }
    };
  }

  const savingsRate = savings / income; // monthly savings vs monthly income
  const expenseRatio = expenses / income;
  const debtToIncome = debt / (income * 12); // outstanding debt vs annual income
  const monthsOfCushion = expenses > 0 ? savings / expenses : 0;

  // Savings rate: 0% -> 0pts, 30%+ -> full 35pts
  const savingsRateScore = clamp((savingsRate / 0.3) * 35, 0, 35);

  // Expense ratio: 100%+ of income spent -> 0pts, 50% or less -> full 30pts
  const expenseRatioScore = clamp(((1 - expenseRatio) / 0.5) * 30, 0, 30);

  // Debt to income: 0 -> full 25pts, 100%+ annual income in debt -> 0pts
  const debtScore = clamp((1 - debtToIncome) * 25, 0, 25);

  // Cushion: 6+ months of expenses saved -> full 10pts
  const cushionScore = clamp((monthsOfCushion / 6) * 10, 0, 10);

  const rawScore = savingsRateScore + expenseRatioScore + debtScore + cushionScore;
  const score = Math.round(clamp(rawScore, 0, 100));

  return {
    score,
    breakdown: {
      savingsRateScore: round1(savingsRateScore),
      expenseRatioScore: round1(expenseRatioScore),
      debtScore: round1(debtScore),
      cushionScore: round1(cushionScore)
    },
    metrics: {
      savingsRate: round1(savingsRate * 100),
      expenseRatio: round1(expenseRatio * 100),
      debtToIncome: round1(debtToIncome * 100),
      monthsOfCushion: round1(monthsOfCushion)
    }
  };
}

function scoreLabel(score) {
  if (score >= 85) return { label: 'Excellent', tone: 'success' };
  if (score >= 70) return { label: 'Strong', tone: 'success' };
  if (score >= 50) return { label: 'Fair', tone: 'warning' };
  if (score >= 30) return { label: 'Needs Attention', tone: 'warning' };
  return { label: 'At Risk', tone: 'danger' };
}

/**
 * Project the future cost of an item/goal given annual inflation.
 * Returns a year-by-year series suitable for charting.
 */
function projectFutureCost({ cost, years, inflation = 6 }) {
  cost = Number(cost) || 0;
  years = Math.max(1, Math.round(Number(years) || 1));
  inflation = Number(inflation);
  if (Number.isNaN(inflation)) inflation = 6;

  const rate = inflation / 100;
  const series = [];

  for (let y = 0; y <= years; y++) {
    const value = cost * Math.pow(1 + rate, y);
    series.push({
      year: y,
      label: y === 0 ? 'Today' : `Year ${y}`,
      value: Math.round(value)
    });
  }

  const finalValue = series[series.length - 1].value;
  const totalIncrease = finalValue - cost;
  const increasePercent = cost > 0 ? round1((totalIncrease / cost) * 100) : 0;

  return {
    series,
    summary: {
      presentCost: Math.round(cost),
      futureCost: finalValue,
      totalIncrease,
      increasePercent,
      inflationRate: inflation,
      years
    }
  };
}

/**
 * Build a goal-based micro-investment plan: how much to invest
 * daily/monthly to reach a target amount in N years, assuming a
 * given expected annual return (compounded monthly), plus a
 * round-off "spare change" simulation.
 */
function buildInvestmentPlan({ goalAmount, years, expectedReturn = 10, monthlyExpenseTransactions = 60, avgRoundOff = 15 }) {
  goalAmount = Number(goalAmount) || 0;
  years = Math.max(0.5, Number(years) || 1);
  expectedReturn = Number(expectedReturn);
  if (Number.isNaN(expectedReturn)) expectedReturn = 10;
  monthlyExpenseTransactions = Number(monthlyExpenseTransactions) || 60;
  avgRoundOff = Number(avgRoundOff) || 15;

  const months = Math.round(years * 12);
  const monthlyRate = expectedReturn / 100 / 12;

  // Required monthly SIP to reach goalAmount via future value of annuity:
  // FV = P * [((1+r)^n - 1) / r]  =>  P = FV * r / ((1+r)^n - 1)
  let monthlyInvestment;
  if (monthlyRate === 0) {
    monthlyInvestment = goalAmount / months;
  } else {
    const growthFactor = Math.pow(1 + monthlyRate, months) - 1;
    monthlyInvestment = (goalAmount * monthlyRate) / growthFactor;
  }
  monthlyInvestment = Math.max(0, monthlyInvestment);
  const dailyInvestment = monthlyInvestment / 30;

  // Round-off / spare-change simulation: every transaction is rounded
  // up to the nearest avgRoundOff unit and the difference is invested.
  const monthlyRoundOffSavings = monthlyExpenseTransactions * (avgRoundOff / 2); // expected avg round-off per txn
  const yearlyRoundOffSavings = monthlyRoundOffSavings * 12;

  // Build month-by-month growth projection combining SIP + round-off
  const totalMonthlyContribution = monthlyInvestment + monthlyRoundOffSavings;
  const growthSeries = [];
  let corpus = 0;
  for (let m = 0; m <= months; m++) {
    if (m > 0) {
      corpus = corpus * (1 + monthlyRate) + totalMonthlyContribution;
    }
    if (m % Math.max(1, Math.round(months / 12)) === 0 || m === months) {
      growthSeries.push({ month: m, corpus: Math.round(corpus) });
    }
  }

  return {
    inputs: { goalAmount, years, expectedReturn },
    plan: {
      dailyInvestment: round1(dailyInvestment),
      monthlyInvestment: round1(monthlyInvestment),
      monthlyRoundOffSavings: round1(monthlyRoundOffSavings),
      yearlyRoundOffSavings: round1(yearlyRoundOffSavings),
      totalMonthlyContribution: round1(totalMonthlyContribution),
      months
    },
    growthSeries
  };
}

/**
 * Rule-based "smart insights" engine. Not ML, but structured to be
 * swapped out for a model later without changing the API shape.
 */
function generateInsights({ income, expenses, savings, debt }) {
  income = Number(income) || 0;
  expenses = Number(expenses) || 0;
  savings = Number(savings) || 0;
  debt = Number(debt) || 0;

  const insights = [];
  const savingsRate = income > 0 ? savings / income : 0;
  const expenseRatio = income > 0 ? expenses / income : 0;
  const debtToIncome = income > 0 ? debt / (income * 12) : 0;
  const monthsOfCushion = expenses > 0 ? savings / expenses : 0;

  // Savings checks
  if (savingsRate < 0.1) {
    insights.push({
      type: 'alert',
      severity: 'high',
      title: 'Low savings rate',
      message: `You're saving only ${round1(savingsRate * 100)}% of your income. Aim for at least 20% to build long-term wealth.`
    });
  } else if (savingsRate < 0.2) {
    insights.push({
      type: 'alert',
      severity: 'medium',
      title: 'Savings could be stronger',
      message: `Your savings rate is ${round1(savingsRate * 100)}%. Pushing toward 20% would meaningfully speed up your goals.`
    });
  } else {
    insights.push({
      type: 'positive',
      severity: 'low',
      title: 'Healthy savings habit',
      message: `Great work — you're saving ${round1(savingsRate * 100)}% of your income, above the recommended 20% benchmark.`
    });
  }

  // Expense checks
  if (expenseRatio > 0.8) {
    insights.push({
      type: 'warning',
      severity: 'high',
      title: 'High expenses',
      message: `Expenses consume ${round1(expenseRatio * 100)}% of your income, leaving little room for savings or shocks.`
    });
  } else if (expenseRatio > 0.6) {
    insights.push({
      type: 'warning',
      severity: 'medium',
      title: 'Expenses trending high',
      message: `You're spending ${round1(expenseRatio * 100)}% of your income. Trimming discretionary spend could free up cash for goals.`
    });
  }

  // Debt checks
  if (debtToIncome > 0.5) {
    insights.push({
      type: 'risk',
      severity: 'high',
      title: 'High debt risk',
      message: `Your outstanding debt is ${round1(debtToIncome * 100)}% of your annual income. Prioritize paying down high-interest debt first.`
    });
  } else if (debtToIncome > 0.2) {
    insights.push({
      type: 'risk',
      severity: 'medium',
      title: 'Moderate debt load',
      message: `Debt sits at ${round1(debtToIncome * 100)}% of annual income. Keep monitoring to avoid it becoming a drag on savings.`
    });
  }

  // Emergency fund check
  if (monthsOfCushion < 3) {
    insights.push({
      type: 'alert',
      severity: 'medium',
      title: 'Thin emergency cushion',
      message: `You have about ${round1(monthsOfCushion)} months of expenses saved. Target 3-6 months for a safety net.`
    });
  } else {
    insights.push({
      type: 'positive',
      severity: 'low',
      title: 'Solid emergency cushion',
      message: `You hold roughly ${round1(monthsOfCushion)} months of expenses in savings — a strong safety net.`
    });
  }

  // Net cash flow check
  const netFlow = income - expenses;
  if (netFlow < 0) {
    insights.push({
      type: 'risk',
      severity: 'high',
      title: 'Negative cash flow',
      message: `Your expenses exceed your income by ${Math.abs(Math.round(netFlow)).toLocaleString()} this month. This needs immediate attention.`
    });
  }

  return insights;
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

function round1(n) {
  return Math.round(n * 10) / 10;
}

module.exports = {
  calculateFinancialScore,
  scoreLabel,
  projectFutureCost,
  buildInvestmentPlan,
  generateInsights
};
