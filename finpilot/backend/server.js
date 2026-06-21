require('dotenv').config();
const express = require('express');
const cors = require('cors');

const scoreRoutes = require('./routes/score');
const futureCostRoutes = require('./routes/futureCost');
const investmentRoutes = require('./routes/investment');
const insightsRoutes = require('./routes/insights');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

// Simple request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
});

app.get('/', (req, res) => {
  res.json({
    name: 'FinPilot API',
    status: 'running',
    endpoints: [
      'POST /api/score',
      'POST /api/future-cost',
      'POST /api/investment',
      'POST /api/insights'
    ]
  });
});

app.use('/api/score', scoreRoutes);
app.use('/api/future-cost', futureCostRoutes);
app.use('/api/investment', investmentRoutes);
app.use('/api/insights', insightsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`FinPilot API running on port ${PORT}`);
});
