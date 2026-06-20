const { buildInvestmentPlan } = require('../utils/calculations');

function getInvestmentPlan(req, res) {
  const { goalAmount, years, expectedReturn, monthlyExpenseTransactions, avgRoundOff } = req.body;

  if (goalAmount === undefined || goalAmount === null || goalAmount === '' || years === undefined || years === null || years === '') {
    return res.status(400).json({ error: 'goalAmount and years are required' });
  }

  const result = buildInvestmentPlan({
    goalAmount,
    years,
    expectedReturn: expectedReturn === undefined || expectedReturn === '' ? 10 : expectedReturn,
    monthlyExpenseTransactions,
    avgRoundOff
  });

  res.json(result);
}

module.exports = { getInvestmentPlan };
