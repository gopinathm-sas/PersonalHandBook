import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  ShoppingBag, 
  Coffee, 
  Car, 
  Home as HomeIcon,
  Trash2,
  Zap,
  TrendingUp
} from 'lucide-react';

interface Transaction {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
}

const BudgetTab: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [monthlyTarget] = useState(50000); // Localized to ₹50k

  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('persona_budget');
    if (saved) {
      try {
        setTransactions(JSON.parse(saved));
      } catch (e) {
        setTransactions([]);
      }
    } else {
      setTransactions([
        { id: '1', title: 'Blue Tokai Coffee', amount: 350.00, category: 'Food', date: new Date().toISOString() },
        { id: '2', title: 'Uber Premier', amount: 840.00, category: 'Travel', date: new Date().toISOString() },
      ]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('persona_budget', JSON.stringify(transactions));
  }, [transactions]);

  const totalSpent = useMemo(() => 
    transactions.reduce((sum, t) => sum + (Number(t.amount) || 0), 0), 
  [transactions]);

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newAmount) return;
    const t: Transaction = {
      id: Date.now().toString(),
      title: newTitle,
      amount: parseFloat(newAmount),
      category: 'General',
      date: new Date().toISOString()
    };
    setTransactions(prev => [t, ...prev]);
    setNewTitle('');
    setNewAmount('');
    setShowAddForm(false);
  };

  return (
    <div className="p-6 animate-in fade-in duration-500 min-h-full bg-[#F0F7F4] dark:bg-[#0F172A]">
      <header className="flex justify-between items-center mb-8 pt-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Wallet</h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">Expense Tracking (INR)</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className={`p-3 rounded-full shadow-lg transition-all ${showAddForm ? 'bg-slate-900 dark:bg-slate-700 text-white rotate-45' : 'bg-[#38BDF8] text-white'}`}
        >
          <Plus size={24} />
        </button>
      </header>

      {showAddForm && (
        <form onSubmit={handleManualAdd} className="mb-8 bg-white/80 dark:bg-slate-900/80 ios-blur p-6 rounded-[32px] border border-white dark:border-slate-800 shadow-xl animate-in zoom-in-95">
          <div className="space-y-4">
            <input type="text" placeholder="Merchant" className="w-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white outline-none" value={newTitle} onChange={e => setNewTitle(e.target.value)} required />
            <input type="number" step="1" placeholder="Amount (₹)" className="w-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white outline-none" value={newAmount} onChange={e => setNewAmount(e.target.value)} required />
            <button type="submit" className="w-full bg-slate-900 dark:bg-sky-500 text-white font-black py-4 rounded-2xl tracking-widest uppercase text-xs">Add Record</button>
          </div>
        </form>
      )}

      <section className="glass-card bg-white dark:bg-slate-900 rounded-[35px] p-8 mb-8 relative overflow-hidden border border-slate-50 dark:border-slate-800">
        <div className="absolute top-0 right-0 p-6 text-sky-100 dark:text-sky-900/20">
          <TrendingUp size={80} />
        </div>
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Monthly Spending</h3>
        <div className="flex items-baseline gap-2 mb-6">
           <span className="text-4xl font-black text-slate-900 dark:text-white">₹{totalSpent.toLocaleString('en-IN')}</span>
           <span className="text-xs font-bold text-slate-400">/ ₹{monthlyTarget.toLocaleString('en-IN')}</span>
        </div>
        <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#38BDF8] to-sky-500 transition-all duration-1000" style={{ width: `${Math.min((totalSpent / monthlyTarget) * 100, 100)}%` }} />
        </div>
      </section>

      <div className="space-y-4 pb-32">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Transactions</h3>
        {transactions.map(t => (
          <div key={t.id} className="bg-white dark:bg-slate-900 p-5 rounded-[30px] flex items-center gap-4 group hover:shadow-md transition-all border border-slate-50 dark:border-slate-800">
            <div className="w-12 h-12 bg-sky-50 dark:bg-sky-900/20 rounded-2xl flex items-center justify-center shrink-0 border border-sky-100 dark:border-sky-900/30">
              <ShoppingBag size={20} className="text-sky-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">{t.title}</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{new Date(t.date).toLocaleDateString('en-IN')}</p>
            </div>
            <div className="text-right">
              <span className="font-black text-slate-900 dark:text-white text-sm">-₹{Number(t.amount).toLocaleString('en-IN')}</span>
              <button 
                onClick={() => setTransactions(prev => prev.filter(item => item.id !== t.id))}
                className="block ml-auto text-slate-200 hover:text-red-400 transition-colors mt-1"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetTab;