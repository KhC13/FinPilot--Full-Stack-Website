require('dotenv').config();


console.log("Current directory:", process.cwd());
console.log("MONGODB_URI:", process.env.MONGODB_URI);

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const scoreRoutes = require('./routes/score');
const futureCostRoutes = require('./routes/futureCost');
const investmentRoutes = require('./routes/investment');
const insightsRoutes = require('./routes/insights');
// ── New routes ───────────────────────────────────────────────────
const authRoutes = require('./routes/auth');
const expenseRoutes = require('./routes/expenses');
const chatRoutes = require('./routes/chat');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

// Simple request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
});


// ── DB connection ────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((e) => console.error('MongoDB connection error:', e.message));
 
// ── Health check ─────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    name: 'FinPilot API',
    status: 'running',
    endpoints: [
      'POST /api/score', 'POST /api/future-cost',
      'POST /api/investment', 'POST /api/insights',
      'POST /api/auth/register', 'POST /api/auth/login', 'GET /api/auth/me',
      'GET|POST /api/expenses', 'PATCH|DELETE /api/expenses/:id',
      'POST /api/chat'
    ]
  });
});

app.use('/api/score', scoreRoutes);
app.use('/api/future-cost', futureCostRoutes);
app.use('/api/investment', investmentRoutes);
app.use('/api/insights', insightsRoutes);
// ── New routes ───────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/chat', chatRoutes);

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
