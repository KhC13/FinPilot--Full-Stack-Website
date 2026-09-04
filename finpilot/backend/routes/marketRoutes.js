const express = require('express');
const router = express.Router();

const {
  getMarketOverview,
  getStockPrices,
  getStockHistory,
} = require('../controllers/marketController');

router.get('/overview', getMarketOverview);
router.get('/prices', getStockPrices);
router.get('/history', getStockHistory);

module.exports = router;
