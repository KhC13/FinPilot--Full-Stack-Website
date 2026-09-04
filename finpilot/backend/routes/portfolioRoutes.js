const express = require('express');
const router = express.Router();
const { getPortfolio, addHolding, updateHolding, deleteHolding } = require('../controllers/portfolioController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getPortfolio)
  .post(addHolding);

router.route('/:id')
  .patch(updateHolding)
  .delete(deleteHolding);

module.exports = router;