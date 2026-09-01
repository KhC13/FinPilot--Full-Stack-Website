'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Receipt, Loader2, Filter } from 'lucide-react';
import Navbar from '@/components/Navbar';
import AuthGuard from '@/components/AuthGuard';
import GlassCard, { CardHeader } from '@/components/GlassCard';
import { expenseApi, Expense } from '@/lib/authApi';
import { formatCurrency } from '@/lib/format';

const CATEGORIES = ['all', 'food', 'transport', 'entertainment', 'utilities', 'health', 'shopping', 'savings', 'education', 'other'];

const CATEGORY_COLORS: Record<string, string> = {
  food: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  transport: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  entertainment: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  utilities: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  health: 'bg-green-500/20 text-green-400 border-green-500/30',
  shopping: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  savings: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  education: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  other: 'bg-glass text-ink-muted border-glass-border'
};

const now = new Date();

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [total, setTotal] = useState(0);
  const [byCategory, setByCategory] = useState<Record<string, number>>({});
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterMonth, setFilterMonth] = useState(now.getMonth() + 1);
  const [filterYear, setFilterYear] = useState(now.getFullYear());
  const [loading, setLoading] = useState(true);

  // Form state
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('other');
  const [date, setDate] = useState(now.toISOString().slice(0, 10));
  const [note, setNote] = useState('');
  const [adding, setAdding] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await expenseApi.getAll({
        month: filterMonth,
        year: filterYear,
        category: filterCategory
      });
      setExpenses(res.expenses);
      setTotal(res.total);
      setByCategory(res.byCategory);
    } catch (e) {
      // silently fail — auth guard handles unauthenticated
    } finally {
      setLoading(false);
    }
  }, [filterMonth, filterYear, filterCategory]);

  useEffect(() => { fetchExpenses(); }, [fetchExpenses]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');
    if (!title || !amount) { setFormError('Title and amount are required.'); return; }
    setAdding(true);
    try {
      await expenseApi.create({ title, amount: Number(amount), category, date, note });
      setTitle(''); setAmount(''); setNote(''); setCategory('other');
      fetchExpenses();
    } catch (err: any) {
      setFormError(err.message || 'Failed to add expense.');
    } finally {
      setAdding(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await expenseApi.delete(id);
      fetchExpenses();
    } catch (e) { /* ignore */ }
  }

  const topCategory = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0];

  return (
    <AuthGuard>
      <main className="relative min-h-screen">
  {/* Background image with dark overlay so text stays readable */}
  <div
    className="pointer-events-none fixed inset-0 -z-10"
    style={{
      backgroundImage: 'url(/exp.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}
  />
  {/* Dark overlay — adjust opacity to taste (currently 80%) */}
  <div className="pointer-events-none fixed inset-0 -z-10 bg-base-950/60" />
        <Navbar />
        <div className="mx-auto max-w-5xl px-6 py-14 md:px-10">

          <GlassCard className="p-6 md:p-10">
            <CardHeader
              eyebrow="Expense Tracker"
              title="Your Spending"
              description="Track, categorise, and understand where your money goes each month."
              icon={<Receipt className="h-5 w-5 text-accent-cyan" />}
            />

            {/* Summary stats */}
            <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
              <StatChip label="Total this month" value={formatCurrency(total)} highlight />
              <StatChip label="Transactions" value={String(expenses.length)} />
              <StatChip label="Biggest category" value={topCategory ? `${topCategory[0]}` : '—'} />
              <StatChip label="Avg per day" value={formatCurrency(total / 30)} />
            </div>

            {/* Category breakdown bar */}
            {Object.keys(byCategory).length > 0 && (
              <div className="mb-8">
                <p className="field-label mb-3">Breakdown by category</p>
                <div className="flex h-3 w-full overflow-hidden rounded-full">
                  {Object.entries(byCategory)
                    .sort((a, b) => b[1] - a[1])
                    .map(([cat, val]) => (
                      <div
                        key={cat}
                        title={`${cat}: ${formatCurrency(val)}`}
                        style={{
                          width: `${(val / total) * 100}%`,
                          background: cat === 'food' ? '#f97316' : cat === 'transport' ? '#3b82f6' : cat === 'health' ? '#22c55e' : cat === 'savings' ? '#22d3ee' : cat === 'entertainment' ? '#a855f7' : cat === 'shopping' ? '#ec4899' : '#8b5cf6',
                          transition: 'all 0.5s'
                        }}
                      />
                    ))}
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {Object.entries(byCategory).sort((a, b) => b[1] - a[1]).map(([cat, val]) => (
                    <span key={cat} className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${CATEGORY_COLORS[cat] || CATEGORY_COLORS.other}`}>
                      {cat} · {formatCurrency(val, { compact: true })}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.4fr]">
              {/* Add form */}
              <div>
                <p className="field-label mb-4">Add expense</p>
                <form onSubmit={handleAdd} className="space-y-3">
                  <input type="text" placeholder="Title (e.g. Zomato dinner)" value={title} onChange={e => setTitle(e.target.value)} className="input-field" />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="number" min={0} placeholder="Amount (Rs.)" value={amount} onChange={e => setAmount(e.target.value)} className="input-field" />
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} className="input-field" />
                  </div>
                  <select value={category} onChange={e => setCategory(e.target.value)} className="input-field">
                    {CATEGORIES.filter(c => c !== 'all').map(c => (
                      <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                    ))}
                  </select>
                  <input type="text" placeholder="Note (optional)" value={note} onChange={e => setNote(e.target.value)} className="input-field" />
                  {formError && <p className="text-xs text-state-danger">{formError}</p>}
                  <button type="submit" disabled={adding} className="btn-primary w-full justify-center">
                    {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                    {adding ? 'Adding…' : 'Add expense'}
                  </button>
                </form>
              </div>

              {/* Expense list */}
              <div>
                {/* Filters */}
                <div className="mb-4 flex items-center gap-3">
                  <Filter className="h-4 w-4 shrink-0 text-ink-faint" />
                  <select value={filterMonth} onChange={e => setFilterMonth(Number(e.target.value))} className="input-field !py-1.5 text-xs">
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {new Date(2024, i).toLocaleString('default', { month: 'long' })}
                      </option>
                    ))}
                  </select>
                  <select value={filterYear} onChange={e => setFilterYear(Number(e.target.value))} className="input-field !py-1.5 text-xs">
                    {[2023, 2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>

                {/* Scroll list */}
                <div className="max-h-[380px] space-y-2 overflow-y-auto no-scrollbar pr-1">
                  {loading ? (
                    <div className="flex h-32 items-center justify-center">
                      <Loader2 className="h-5 w-5 animate-spin text-ink-muted" />
                    </div>
                  ) : expenses.length === 0 ? (
                    <p className="py-10 text-center text-sm text-ink-muted">No expenses this month yet.</p>
                  ) : (
                    expenses.map(exp => (
                      <div key={exp._id} className="glass-panel flex items-center justify-between gap-3 rounded-xl px-4 py-3">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-ink">{exp.title}</p>
                          <div className="mt-0.5 flex items-center gap-2">
                            <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${CATEGORY_COLORS[exp.category] || CATEGORY_COLORS.other}`}>
                              {exp.category}
                            </span>
                            <span className="text-[11px] text-ink-faint">
                              {new Date(exp.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </span>
                          </div>
                        </div>
                        <span className="shrink-0 font-mono text-sm font-semibold text-ink">{formatCurrency(exp.amount)}</span>
                        <button onClick={() => handleDelete(exp._id)} className="shrink-0 rounded-lg p-1.5 text-ink-faint transition-colors hover:bg-state-danger/10 hover:text-state-danger">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </main>
    </AuthGuard>
  );
}

function StatChip({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl border px-4 py-3 ${highlight ? 'border-accent-purple/30 bg-accent-purple/10' : 'border-glass-border bg-base-900/40'}`}>
      <p className="text-[10px] font-medium uppercase tracking-wider text-ink-faint">{label}</p>
      <p className={`mt-1 font-mono text-sm font-semibold ${highlight ? 'gradient-text' : 'text-ink'}`}>{value}</p>
    </div>
  );
}
