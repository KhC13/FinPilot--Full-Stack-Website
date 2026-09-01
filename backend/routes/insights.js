const express = require('express');
const router = express.Router();
const { getInsights } = require('../controllers/insightsController');

router.post('/', getInsights);

module.exports = router;
