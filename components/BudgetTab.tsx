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
        { id: '2', title: 'Weekly Groceries', amount: 82.00, category: 'Food', date: new Date().toISOString() },
        { id: '3', title: 'Uber Ride', amount: 24.00, category: 'Travel', date: new Date().toISOString() },
        { id: '4', title: 'Apple Store', amount: 129.00, category: 'Shopping', date: new Date().toISOString() },
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
    if (transactions.length > 0) {
      localStorage.setItem('persona_budget', JSON.stringify(transactions));
    }
  }, [transactions]);

  const totalSpent = useMemo(() => 
    transactions.reduce((sum, t) => sum + (Number(t.amount) || 0), 0), 
  [transactions]);

  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    transactions.forEach(t => {
      totals[t.category] = (totals[t.category] || 0) + (Number(t.amount) || 0);
    });
    return totals;
  }, [transactions]);

  const chartSegments = useMemo(() => {
    let cumulativePercent = 0;
    return CATEGORIES.map(cat => {
      const value = categoryTotals[cat.name] || 0;
      const percent = totalSpent > 0 ? value / totalSpent : 0;
      const start = cumulativePercent;
      cumulativePercent += percent;
      return { name: cat.name, color: cat.color, percent, start, end: cumulativePercent };
    }).filter(s => s.percent > 0);
  }, [categoryTotals, totalSpent]);

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

  const processAutoDetected = async () => {
    if (!detectedSms) return;
    setIsAiProcessing(true);
    try {
      const result = await analyzeExpenseSMS(detectedSms);
      if (result && result.title && result.amount) {
        const t: Transaction = {
          id: Date.now().toString(),
          title: result.title,
          amount: result.amount,
          category: result.category || 'Food',
          date: new Date().toISOString(),
          isAiProcessed: true
        };
        setTransactions(prev => [t, ...prev]);
        setDetectedSms(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiProcessing(false);
    }
  };

  return (
    <div className="p-6 animate-in fade-in duration-500 min-h-full">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Budget</h1>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-1.5 h-1.5 bg-lime-500 rounded-full animate-pulse" />
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Live SMS Syncing</p>
          </div>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className={`p-3 rounded-full shadow-lg transition-all ${showAddForm ? 'bg-gray-900 text-white rotate-45' : 'bg-[#D9F99D] text-gray-900'}`}
        >
          <Plus size={24} />
        </button>
      </header>

      {detectedSms && !isAiProcessing && (
        <div className="mb-6 bg-[#1A1A1A] text-white p-5 rounded-[32px] shadow-2xl border border-white/10">
          <div className="flex items-start gap-4">
            <div className="bg-[#D9F99D] p-3 rounded-2xl shrink-0">
              <Zap size={20} className="text-black" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-[10px] font-black uppercase text-[#D9F99D] tracking-widest mb-1">Clipboard Data</p>
              <p className="text-xs text-gray-300 font-medium truncate italic mb-3">"{detectedSms}"</p>
              <div className="flex gap-2">
                <button onClick={processAutoDetected} className="flex-1 bg-[#D9F99D] text-black text-[10px] font-black py-2.5 rounded-xl uppercase tracking-wider">Analyze & Add</button>
                <button onClick={() => setDetectedSms(null)} className="px-4 bg-white/10 text-white text-[10px] font-black py-2.5 rounded-xl uppercase tracking-wider">Dismiss</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isAiProcessing && (
        <div className="mb-6 bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center justify-center gap-4">
          <Loader2 className="animate-spin text-lime-600" size={24} />
          <span className="text-xs font-black uppercase tracking-widest text-gray-500">AI Analyzing...</span>
        </div>
      )}

      {showAddForm && (
        <form onSubmit={handleManualAdd} className="mb-8 bg-white p-6 rounded-[32px] border border-gray-100 shadow-xl">
          <div className="space-y-4">
            <input type="text" placeholder="Merchant" className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold outline-none" value={newTitle} onChange={e => setNewTitle(e.target.value)} required />
            <div className="flex gap-3">
              <input type="number" step="0.01" placeholder="Amount" className="flex-1 bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold outline-none" value={newAmount} onChange={e => setNewAmount(e.target.value)} required />
              <select className="flex-1 bg-gray-50 border-none rounded-2xl p-4 text-xs font-bold outline-none" value={newCategory} onChange={e => setNewCategory(e.target.value)}>
                {CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <button type="submit" className="w-full bg-[#1A1A1A] text-white font-black py-4 rounded-2xl tracking-widest uppercase text-xs">Save Expense</button>
          </div>
        </form>
      )}

      <section className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 mb-6 min-h-[300px]">
        <h3 className="text-xl font-extrabold text-gray-900 mb-6">Analysis</h3>

        <div className="h-48 w-full relative mb-6 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-40 h-40 transform -rotate-90">
            {chartSegments.length === 0 ? (
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#F3F4F6" strokeWidth="12" />
            ) : (
              chartSegments.map((s, i) => {
                const radius = 40;
                const circumference = 2 * Math.PI * radius;
                const strokeDasharray = `${s.percent * circumference} ${circumference}`;
                const strokeDashoffset = -s.start * circumference;
                return (
                  <circle
                    key={s.name}
                    cx="50" cy="50" r={radius}
                    fill="transparent"
                    stroke={s.color}
                    strokeWidth="12"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-1000"
                  />
                );
              })
            )}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Total</span>
            <span className="text-xl font-black text-gray-900">${totalSpent.toFixed(0)}</span>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Spending Progress</span>
            <span className="text-xs font-black text-gray-900">{Math.round((totalSpent / monthlyTarget) * 100)}%</span>
          </div>
          <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#D9F99D] to-[#A3E635] transition-all duration-1000" style={{ width: `${Math.min((totalSpent / monthlyTarget) * 100, 100)}%` }} />
          </div>
        </div>
        
        <div className="flex justify-between gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <div key={cat.name} className="flex-1 min-w-[70px]">
              <div className="flex items-center gap-1.5 mb-1">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cat.color }} />
                <span className="text-[10px] font-bold text-gray-500 uppercase">{cat.name}</span>
              </div>
              <div className="h-1 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full transition-all duration-700" style={{ backgroundColor: cat.color, width: `${Math.min(((categoryTotals[cat.name] || 0) / (totalSpent || 1)) * 100, 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Recent Transactions</h3>
        {transactions.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-xs font-bold uppercase tracking-widest">No entries</div>
        ) : (
          transactions.map(t => {
            const cat = CATEGORIES.find(c => c.name === t.category) || CATEGORIES[0];
            const Icon = cat.icon;
            return (
              <div key={t.id} className="bg-white p-5 rounded-[32px] shadow-sm border border-gray-100 flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${cat.color}20` }}>
                  <Icon size={20} style={{ color: cat.color }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-gray-900 text-sm">{t.title}</h4>
                    {t.isAiProcessed && <Sparkles size={12} className="text-lime-500" />}
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-0.5">{cat.name}</p>
                </div>
                <div className="text-right flex items-center gap-3">
                  <span className="font-black text-gray-900 text-sm">-${Number(t.amount).toFixed(2)}</span>
                  <button onClick={() => setTransactions(prev => prev.filter(x => x.id !== t.id))} className="p-2 text-gray-200 hover:text-red-400 opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default BudgetTab;