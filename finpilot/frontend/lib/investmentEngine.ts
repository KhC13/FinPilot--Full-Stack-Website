export interface MatchingInput {
  availableAmount: number;
  monthlyInvestment: number;
  riskTolerance: 'Low' | 'Moderate' | 'High';
  horizonYears: number;
  healthScore?: number;
  currentAllocation?: Record<string, number>; // AssetType -> Total Amount
}

export interface MatchingResult {
  assetCategory: string;
  matchScore: number;
  recommendationLabel: 'Matches Your Profile' | 'Potentially Suitable' | 'Worth Researching' | 'Higher Risk' | 'Concentration Risk';
  reasons: string[];
}

export function evaluateInvestments(input: MatchingInput): MatchingResult[] {
  const categories = ['Equity', 'Mutual Funds', 'ETFs', 'Index Funds', 'Debt / Fixed Income'];
  const results: MatchingResult[] = [];

  const totalPortfolio = Object.values(input.currentAllocation || {}).reduce((a, b) => a + b, 0);

  for (const cat of categories) {
    let score = 70;
    const reasons: string[] = [];

    // Horizon Rule
    if (input.horizonYears >= 5 && (cat === 'Equity' || cat === 'Index Funds' || cat === 'Mutual Funds')) {
      score += 15;
      reasons.push(`Fits long-term horizon (${input.horizonYears}+ years) for growth assets.`);
    } else if (input.horizonYears < 3 && cat === 'Debt / Fixed Income') {
      score += 20;
      reasons.push('Ideal for shorter-term preservation (<3 years).');
    }

    // Risk Rule
    if (input.riskTolerance === 'Low' && cat === 'Debt / Fixed Income') {
      score += 15;
      reasons.push('Aligns with conservative risk tolerance.');
    } else if (input.riskTolerance === 'High' && cat === 'Equity') {
      score += 15;
      reasons.push('Aligns with aggressive capital appreciation profile.');
    }

    // Health Score Integration
    if (input.healthScore && input.healthScore > 75) {
      score += 5;
      reasons.push(`Solid financial health score (${input.healthScore}/100) supports growth investing.`);
    }

    // Concentration Risk Check
    if (totalPortfolio > 0 && input.currentAllocation?.[cat]) {
      const share = (input.currentAllocation[cat] / totalPortfolio) * 100;
      if (share > 50) {
        score -= 20;
        reasons.push(`Concentration Risk: ${cat} currently makes up ${share.toFixed(0)}% of your portfolio.`);
      }
    }

    score = Math.min(100, Math.max(10, score));

    let label: MatchingResult['recommendationLabel'] = 'Worth Researching';
    if (reasons.some(r => r.startsWith('Concentration Risk'))) {
      label = 'Concentration Risk';
    } else if (score >= 85) {
      label = 'Matches Your Profile';
    } else if (score >= 70) {
      label = 'Potentially Suitable';
    } else if (input.riskTolerance === 'Low' && cat === 'Equity') {
      label = 'Higher Risk';
    }

    results.push({ assetCategory: cat, matchScore: score, recommendationLabel: label, reasons });
  }

  return results.sort((a, b) => b.matchScore - a.matchScore);
}