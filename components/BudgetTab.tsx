import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  ShoppingBag, 
  Coffee, 
  Car, 
  Home as HomeIcon,
  Trash2,
  Sparkles,
  Loader2,
  Zap
} from 'lucide-react';
import { analyzeExpenseSMS } from '../services/geminiService';

interface Transaction {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  isAiProcessed?: boolean;
}

const CATEGORIES = [
  { name: 'Food', icon: Coffee, color: '#FCA5A5' },
  { name: 'Shopping', icon: ShoppingBag, color: '#93C5FD' },
  { name: 'Travel', icon: Car, color: '#6EE7B7' },
  { name: 'Home', icon: HomeIcon, color: '#FCD34D' },
];

const BudgetTab: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [detectedSms, setDetectedSms] = useState<string | null>(null);
  const [monthlyTarget] = useState(2500);

  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState('Food');

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

    const checkClipboard = async () => {
      try {
        const text = await navigator.clipboard.readText();
        if (!text) return;
        const isTransaction = /[\$£€]|paid|spent|transaction|debited|amount/i.test(text);
        if (isTransaction && text.length > 10 && text.length < 300) {
          setDetectedSms(text);
        }
      } catch (err) {}
    };

    const interval = setInterval(checkClipboard, 5000);
    return () => clearInterval(interval);
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
      category: newCategory,
      date: new Date().toISOString()
    };
    setTransactions(prev => [t, ...prev]);
    setNewTitle('');
    setNewAmount('');
    setShowAddForm(false);
  };

  return (
    <div className="p-6 animate-in fade-in duration-500 min-h-full bg-black">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Budget</h1>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-1.5 h-1.5 bg-[#38BDF8] rounded-full animate-pulse" />
            <p className="text-white/40 font-bold uppercase text-[10px] tracking-widest">Live SMS Syncing</p>
          </div>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className={`p-3 rounded-full shadow-lg transition-all ${showAddForm ? 'bg-white text-black rotate-45' : 'bg-[#38BDF8] text-black'}`}
        >
          <Plus size={24} />
        </button>
      </header>

      {detectedSms && (
        <div className="mb-6 bg-[#1A1A1A]/80 ios-blur text-white p-5 rounded-[32px] border border-[#38BDF8]/30 shimmer">
          <div className="flex items-start gap-4">
            <div className="bg-[#38BDF8]/20 p-3 rounded-2xl shrink-0"><Zap size={20} className="text-[#38BDF8]" /></div>
            <div className="flex-1 overflow-hidden">
              <p className="text-[10px] font-black uppercase text-[#38BDF8] tracking-widest mb-1">Clipboard Data</p>
              <p className="text-xs text-white/60 italic mb-3 truncate">"{detectedSms}"</p>
              <div className="flex gap-2">
                <button className="flex-1 bg-white text-black text-[10px] font-black py-2.5 rounded-xl uppercase">Analyze</button>
                <button onClick={() => setDetectedSms(null)} className="px-4 bg-white/5 text-white/40 text-[10px] font-black py-2.5 rounded-xl uppercase">Dismiss</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddForm && (
        <form onSubmit={handleManualAdd} className="mb-8 bg-[#1A1A1A] p-6 rounded-[32px] border border-white/10 shadow-xl">
          <div className="space-y-4">
            <input type="text" placeholder="Merchant" className="w-full bg-black border border-white/10 rounded-2xl p-4 text-sm font-bold text-white outline-none" value={newTitle} onChange={e => setNewTitle(e.target.value)} required />
            <input type="number" step="0.01" placeholder="Amount" className="w-full bg-black border border-white/10 rounded-2xl p-4 text-sm font-bold text-white outline-none" value={newAmount} onChange={e => setNewAmount(e.target.value)} required />
            <button type="submit" className="w-full bg-[#38BDF8] text-black font-black py-4 rounded-2xl tracking-widest uppercase text-xs">Save Expense</button>
          </div>
        </form>
      )}

      <section className="bg-[#1A1A1A]/50 ios-blur rounded-[32px] p-6 border border-white/5 mb-6">
        <h3 className="text-xs font-black text-white/40 uppercase tracking-widest mb-6 text-center">Monthly Insight</h3>
        <div className="flex flex-col items-center justify-center mb-6">
           <span className="text-4xl font-black text-white">${totalSpent.toFixed(2)}</span>
           <span className="text-[10px] font-black text-[#38BDF8] uppercase tracking-[0.2em] mt-2">Total Spent</span>
        </div>
        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#38BDF8] to-[#22D3EE] transition-all duration-1000" style={{ width: `${Math.min((totalSpent / monthlyTarget) * 100, 100)}%` }} />
        </div>
      </section>

      <div className="space-y-4 pb-12">
        <h3 className="text-[10px] font-black text-white/40 uppercase tracking-widest px-2">Timeline</h3>
        {transactions.map(t => (
          <div key={t.id} className="bg-[#1A1A1A]/80 p-5 rounded-[32px] border border-white/5 flex items-center gap-4 group hover:border-white/20 transition-all">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 border border-white/5">
              <ShoppingBag size={20} className="text-white/40" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-white text-sm">{t.title}</h4>
              <p className="text-[10px] font-bold text-white/20 uppercase mt-0.5">{t.category}</p>
            </div>
            <span className="font-black text-white text-sm">-${Number(t.amount).toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetTab;