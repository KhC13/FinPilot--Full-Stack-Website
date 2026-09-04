const mongoose = require('mongoose');

const marketCacheSchema = new mongoose.Schema(
  {
    tickerSymbol: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    currentPrice: {
      type: Number,
      required: true,
    },
    rawApiData: {
      type: Object, // Stores the messy, unstructured JSON from the third-party API
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
      expires: 3600, // MongoDB will automatically delete this document after 1 hour (3600 seconds)
    },
  }
);

module.exports = mongoose.model('MarketCache', marketCacheSchema);