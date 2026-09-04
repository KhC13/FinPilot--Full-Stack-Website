const Goal = require('../models/Goal');

exports.getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user._id }).sort({ targetDate: 1 });
    res.json({ success: true, data: goals });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error fetching goals' });
  }
};

exports.createGoal = async (req, res) => {
  try {
    const { name, targetAmount, currentAmount, targetDate } = req.body;
    if (!name || !targetAmount || !targetDate) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }
    const goal = await Goal.create({
      user: req.user._id,
      name,
      targetAmount: Number(targetAmount),
      currentAmount: Number(currentAmount || 0),
      targetDate
    });
    res.status(201).json({ success: true, data: goal });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user._id });
    if (!goal) return res.status(404).json({ success: false, message: 'Goal not found' });

    const { name, targetAmount, currentAmount, targetDate } = req.body;
    if (name) goal.name = name;
    if (targetAmount !== undefined) goal.targetAmount = Number(targetAmount);
    if (currentAmount !== undefined) goal.currentAmount = Number(currentAmount);
    if (targetDate) goal.targetDate = targetDate;

    await goal.save();
    res.json({ success: true, data: goal });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!goal) return res.status(404).json({ success: false, message: 'Goal not found' });
    res.json({ success: true, message: 'Goal deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error deleting goal' });
  }
};