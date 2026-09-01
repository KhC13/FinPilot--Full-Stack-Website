const Expense = require('../models/Expense');

async function getExpenses(req, res) {
  try {
    const { month, year, category } = req.query;
    const filter = { user: req.user._id };

    if (month && year) {
      const start = new Date(Number(year), Number(month) - 1, 1);
      const end = new Date(Number(year), Number(month), 0, 23, 59, 59, 999);
      filter.date = { $gte: start, $lte: end };
    }
    if (category && category !== 'all') filter.category = category;

    const expenses = await Expense.find(filter).sort({ date: -1 });

    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const byCategory = expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {});

    res.json({ expenses, total, byCategory });
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch expenses.' });
  }
}

async function createExpense(req, res) {
  const { title, amount, category, date, note } = req.body;
  if (!title || amount === undefined) {
    return res.status(400).json({ error: 'Title and amount are required.' });
  }
  try {
    const expense = await Expense.create({
      user: req.user._id,
      title,
      amount: Number(amount),
      category: category || 'other',
      date: date ? new Date(date) : new Date(),
      note: note || ''
    });
    res.status(201).json({ expense });
  } catch (e) {
    res.status(500).json({ error: 'Failed to create expense.' });
  }
}

async function updateExpense(req, res) {
  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!expense) return res.status(404).json({ error: 'Expense not found.' });
    res.json({ expense });
  } catch (e) {
    res.status(500).json({ error: 'Failed to update expense.' });
  }
}

async function deleteExpense(req, res) {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!expense) return res.status(404).json({ error: 'Expense not found.' });
    res.json({ message: 'Expense deleted.' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete expense.' });
  }
}

module.exports = { getExpenses, createExpense, updateExpense, deleteExpense };
