'use client';
import Navbar from '@/components/Navbar'; 
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import { Target, Plus, Trash2, Edit2, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Goal {
  _id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
}

export default function GoalsPage() {
  const router = useRouter();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [error, setError] = useState('');
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');

  const fetchGoals = async () => {
    try {
      const token = authApi.getToken();
      const res = await fetch('/api/goals', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setGoals(data.data);
      else setError(data.message || 'Failed to fetch goals');
    } catch (err) {
      setError('Network error loading financial goals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    const token = authApi.getToken();
    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
    } else {
      setIsAuthenticated(true);
      fetchGoals(); 
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = authApi.getToken();
    const payload = { name, targetAmount: Number(targetAmount), currentAmount: Number(currentAmount), targetDate };
    
    try {
      const url = editingGoal ? `/api/goals/${editingGoal._id}` : '/api/goals';
      const method = editingGoal ? 'PATCH' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        resetForm();
        fetchGoals();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to save goal');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this goal?')) return;
    const token = authApi.getToken();
    try {
      await fetch(`/api/goals/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      fetchGoals();
    } catch (err) {
      setError('Failed to delete goal');
    }
  };

  const resetForm = () => {
    setEditingGoal(null);
    setName('');
    setTargetAmount('');
    setCurrentAmount('');
    setTargetDate('');
  };

  const calculateMetrics = (goal: Goal) => {
    const progress = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
    const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
    
    const target = new Date(goal.targetDate);
    const now = new Date();
    const monthsRemaining = (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth());
    
    let requiredMonthly = 0;
    if (remaining > 0 && monthsRemaining > 0) {
      requiredMonthly = Math.ceil(remaining / monthsRemaining);
    }

    let status = 'On Track';
    if (progress >= 100) status = 'Goal Achieved';
    else if (monthsRemaining <= 0) status = 'Deadline Passed';
    else if (monthsRemaining <= 3) status = 'Needs Attention';

    return { progress, remaining, requiredMonthly, status, monthsRemaining };
  };

 

  if (loading) return <div className="min-h-screen bg-[#0a0b10] text-white flex items-center justify-center">Loading your financial goals...</div>;

  return (
    <div className="min-h-screen bg-[#0a0b10] text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6 space-y-8">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Goal Progress Dashboard</h1>
            <p className="text-slate-400">Track and manage your target financial milestones</p>
          </div>
        </header>

        {error && <div className="p-4 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg flex items-center gap-2"><AlertCircle className="w-5 h-5"/>{error}</div>}

        {/* Goal Creator Form */}
        <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-xl space-y-4">
          <h2 className="text-xl font-semibold text-white">{editingGoal ? 'Edit Goal' : 'Create New Goal'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input className="input-field" placeholder="Goal Name" value={name} onChange={e => setName(e.target.value)} required />
            <input className="input-field" type="number" placeholder="Target Amount" value={targetAmount} onChange={e => setTargetAmount(e.target.value)} required />
            <input className="input-field" type="number" placeholder="Current Amount" value={currentAmount} onChange={e => setCurrentAmount(e.target.value)} required />
            <input className="input-field" type="date" value={targetDate} onChange={e => setTargetDate(e.target.value)} required />
          </div>
          <div className="flex justify-end gap-2">
            {editingGoal && <button type="button" onClick={resetForm} className="btn-ghost">Cancel</button>}
            <button type="submit" className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4"/>{editingGoal ? 'Update Goal' : 'Add Goal'}</button>
          </div>
        </form>

        {/* Goal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map(goal => {
            const { progress, remaining, requiredMonthly, status } = calculateMetrics(goal);
            return (
              <div key={goal._id} className="glass-card p-6 rounded-xl flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-white">{goal.name}</h3>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      status === 'Goal Achieved' ? 'bg-green-500/20 text-green-300' :
                      status === 'Needs Attention' ? 'bg-amber-500/20 text-amber-300' :
                      status === 'Deadline Passed' ? 'bg-red-500/20 text-red-300' : 'bg-blue-500/20 text-blue-300'
                    }`}>
                      {status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-4">Target Date: {new Date(goal.targetDate).toLocaleDateString()}</p>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm font-medium text-slate-300">
                      <span>₹{goal.currentAmount.toLocaleString()}</span>
                      <span>₹{goal.targetAmount.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2.5">
                      <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                    <span className="text-xs text-slate-400 float-right mt-1">{progress}% Complete</span>
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-4 space-y-1 text-sm">
                  <div className="flex justify-between text-slate-400">
                    <span>Remaining:</span>
                    <span className="font-medium text-white">₹{remaining.toLocaleString()}</span>
                  </div>
                  {remaining > 0 && status !== 'Deadline Passed' && (
                    <div className="flex justify-between text-slate-400">
                      <span>Required Monthly:</span>
                      <span className="font-medium text-blue-400">₹{requiredMonthly.toLocaleString()}/mo</span>
                    </div>
                  )}
                  <div className="flex justify-end gap-2 pt-3">
                    <button onClick={() => { setEditingGoal(goal); setName(goal.name); setTargetAmount(String(goal.targetAmount)); setCurrentAmount(String(goal.currentAmount)); setTargetDate(goal.targetDate.split('T')[0]); }} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"><Edit2 className="w-4 h-4"/></button>
                    <button onClick={() => handleDelete(goal._id)} className="p-1.5 hover:bg-red-500/10 rounded-lg text-red-400"><Trash2 className="w-4 h-4"/></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}