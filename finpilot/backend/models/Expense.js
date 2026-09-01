const mongoose = require('mongoose');

const CATEGORIES = ['food', 'transport', 'entertainment', 'utilities', 'health', 'shopping', 'savings', 'education', 'other'];

const expenseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true },
  amount: { type: Number, required: true, min: 0 },
  category: { type: String, enum: CATEGORIES, default: 'other' },
  date: { type: Date, default: Date.now },
  note: { type: String, trim: true, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
module.exports.CATEGORIES = CATEGORIES;
