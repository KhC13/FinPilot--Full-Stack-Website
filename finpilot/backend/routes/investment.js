const express = require('express');
const router = express.Router();
const { getInvestmentPlan } = require('../controllers/investmentController');

router.post('/', getInvestmentPlan);

module.exports = router;
