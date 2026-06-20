const { calculateFinancialScore, scoreLabel, generateInsights } = require('../utils/calculations');

function getFinancialScore(req, res) {
  const { income, expenses, savings, debt } = req.body;

  if ([income, expenses, savings, debt].some((v) => v === undefined || v === null || v === '')) {
    return res.status(400).json({ error: 'income, expenses, savings and debt are all required' });
  }

  const result = calculateFinancialScore({ income, expenses, savings, debt });
  const { label, tone } = scoreLabel(result.score);
  const insights = generateInsights({ income, expenses, savings, debt }).slice(0, 3);

  res.json({
    score: result.score,
    label,
    tone,
    breakdown: result.breakdown,
    metrics: result.metrics,
    topInsights: insights
  });
}

module.exports = { getFinancialScore };
