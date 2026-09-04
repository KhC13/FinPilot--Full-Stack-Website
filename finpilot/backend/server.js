const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Existing Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/score', require('./routes/score'));
const futureCostRoutes = require('./routes/futureCost');
const investmentRoutes = require('./routes/investment');
const insightsRoutes = require('./routes/insights');

app.use('/api/future-cost', futureCostRoutes);
app.use('/api/investment', investmentRoutes);
app.use('/api/insights', insightsRoutes);

// Newly Mounted Routes
app.use('/api/goals', require('./routes/goalRoutes'));
app.use('/api/portfolio', require('./routes/portfolioRoutes'));
app.use('/api/market', require('./routes/marketRoutes'));

// Health check
app.get('/health', (req, res) => res.send('FinPilot API is running...'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));