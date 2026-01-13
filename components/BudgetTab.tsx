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
  const [monthlyTarget] = useState(2500);

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
        { id: '1', title: 'Starbucks Coffee', amount: 5.50, category: 'Food', date: new Date().toISOString() },
        { id: '2', title: 'Uber Ride', amount: 24.00, category: 'Travel', date: new Date().toISOString() },
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
    <div className="p-6 animate-in fade-in duration-500 min-h-full bg-[#F0F7F4]">
      <header className="flex justify-between items-center mb-8 pt-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Wallet</h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">Expense Tracking</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className={`p-3 rounded-full shadow-lg transition-all ${showAddForm ? 'bg-slate-900 text-white rotate-45' : 'bg-[#38BDF8] text-white'}`}
        >
          <Plus size={24} />
        </button>
      </header>

      {showAddForm && (
        <form onSubmit={handleManualAdd} className="mb-8 bg-white/80 ios-blur p-6 rounded-[32px] border border-white shadow-xl animate-in zoom-in-95">
          <div className="space-y-4">
            <input type="text" placeholder="Merchant" className="w-full bg-white border border-slate-100 rounded-2xl p-4 text-sm font-bold text-slate-900 outline-none" value={newTitle} onChange={e => setNewTitle(e.target.value)} required />
            <input type="number" step="0.01" placeholder="Amount" className="w-full bg-white border border-slate-100 rounded-2xl p-4 text-sm font-bold text-slate-900 outline-none" value={newAmount} onChange={e => setNewAmount(e.target.value)} required />
            <button type="submit" className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl tracking-widest uppercase text-xs">Add Record</button>
          </div>
        </form>
      )}

      <section className="glass-card rounded-[35px] p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 text-sky-100">
          <TrendingUp size={80} />
        </div>
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Monthly Spending</h3>
        <div className="flex items-baseline gap-2 mb-6">
           <span className="text-4xl font-black text-slate-900">${totalSpent.toFixed(2)}</span>
           <span className="text-xs font-bold text-slate-400">/ $2,500</span>
        </div>
        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#38BDF8] to-sky-500 transition-all duration-1000" style={{ width: `${Math.min((totalSpent / monthlyTarget) * 100, 100)}%` }} />
        </div>
      </section>

      <div className="space-y-4 pb-32">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Transactions</h3>
        {transactions.map(t => (
          <div key={t.id} className="glass-card p-5 rounded-[30px] flex items-center gap-4 group hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-sky-50 rounded-2xl flex items-center justify-center shrink-0 border border-sky-100">
              <ShoppingBag size={20} className="text-sky-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-slate-800 text-sm">{t.title}</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{new Date(t.date).toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              <span className="font-black text-slate-900 text-sm">-${Number(t.amount).toFixed(2)}</span>
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