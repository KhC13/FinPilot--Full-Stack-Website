const Portfolio = require('../models/Portfolio');

exports.getPortfolio = async (req, res) => {
  try {
    const holdings = await Portfolio.find({ user: req.user._id }).sort({ createdAt: -1 });
    
    const totalInvested = holdings.reduce((acc, h) => acc + (h.quantity * h.buyPrice), 0);
    const currentValue = holdings.reduce((acc, h) => acc + (h.quantity * (h.currentPrice || h.buyPrice)), 0);
    const totalGainLoss = currentValue - totalInvested;
    const totalGainLossPercent = totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0;

    res.json({
      success: true,
      summary: {
        totalInvested,
        currentValue,
        totalGainLoss,
        totalGainLossPercent
      },
      data: holdings
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error fetching portfolio' });
  }
};

exports.addHolding = async (req, res) => {
  try {
    const { symbol, name, assetType, quantity, buyPrice, currentPrice } = req.body;
    
    if (!symbol || !name || !assetType || !quantity || !buyPrice) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const holding = await Portfolio.create({
      user: req.user._id,
      symbol: symbol.toUpperCase(),
      name,
      assetType,
      quantity: Number(quantity),
      buyPrice: Number(buyPrice),
      currentPrice: Number(currentPrice || buyPrice)
    });

    res.status(201).json({ success: true, data: holding });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateHolding = async (req, res) => {
  try {
    const holding = await Portfolio.findOne({ _id: req.params.id, user: req.user._id });
    if (!holding) return res.status(404).json({ success: false, message: 'Holding not found' });

    const { symbol, name, assetType, quantity, buyPrice, currentPrice } = req.body;
    
    if (symbol) holding.symbol = symbol.toUpperCase();
    if (name) holding.name = name;
    if (assetType) holding.assetType = assetType;
    if (quantity !== undefined) holding.quantity = Number(quantity);
    if (buyPrice !== undefined) holding.buyPrice = Number(buyPrice);
    if (currentPrice !== undefined) holding.currentPrice = Number(currentPrice);

    await holding.save();
    res.json({ success: true, data: holding });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteHolding = async (req, res) => {
  try {
    const holding = await Portfolio.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!holding) return res.status(404).json({ success: false, message: 'Holding not found' });
    
    res.json({ success: true, message: 'Holding removed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error deleting holding' });
  }
};