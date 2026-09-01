const { generateInsights } = require('../utils/calculations');

function getInsights(req, res) {
  const { income, expenses, savings, debt } = req.body;

  if ([income, expenses, savings, debt].some((v) => v === undefined || v === null || v === '')) {
    return res.status(400).json({ error: 'income, expenses, savings and debt are all required' });
  }

  const insights = generateInsights({ income, expenses, savings, debt });
  res.json({ insights });
}

module.exports = { getInsights };
