const express = require('express');
const router = express.Router();
const { getFutureCost } = require('../controllers/futureCostController');

router.post('/', getFutureCost);

module.exports = router;
