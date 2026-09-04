const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    totalScore: {
      type: Number,
      required: true,
      min: 0,
      max: 1000, // Adjust based on your scoring logic
    },
    factors: {
      savingsHealth: { type: Number, default: 0 },
      debtRatio: { type: Number, default: 0 },
      investmentGrowth: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Score', scoreSchema);