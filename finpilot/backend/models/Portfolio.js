const mongoose = require('mongoose');

const holdingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  symbol: { type: String, required: true, uppercase: true, trim: true },
  name: { type: String, required: true, trim: true },
  assetType: { 
    type: String, 
    enum: ['Equity', 'Mutual Funds', 'ETFs', 'Index Funds', 'Debt / Fixed Income', 'Other'],
    required: true 
  },
  quantity: { type: Number, required: true, min: 0.0001 },
  buyPrice: { type: Number, required: true, min: 0 },
  currentPrice: { type: Number, default: 0, min: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Portfolio', holdingSchema);