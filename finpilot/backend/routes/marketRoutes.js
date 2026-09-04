const express = require('express');
const router = express.Router();

const {
  getMarketOverview,
  getStockPrices,
  getStockHistory,
  searchStocks,
} = require('../controllers/marketController');

router.get('/overview', getMarketOverview);
router.get('/prices', getStockPrices);
router.get('/history', getStockHistory);
router.get('/search', searchStocks);

module.exports = router;
