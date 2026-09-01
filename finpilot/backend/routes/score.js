const express = require('express');
const router = express.Router();
const { getFinancialScore } = require('../controllers/scoreController');

router.post('/', getFinancialScore);

module.exports = router;
