const { projectFutureCost } = require('../utils/calculations');

function getFutureCost(req, res) {
  const { cost, years, inflation } = req.body;

  if (cost === undefined || cost === null || cost === '' || years === undefined || years === null || years === '') {
    return res.status(400).json({ error: 'cost and years are required' });
  }

  const result = projectFutureCost({
    cost,
    years,
    inflation: inflation === undefined || inflation === '' ? 6 : inflation
  });

  res.json(result);
}

module.exports = { getFutureCost };
