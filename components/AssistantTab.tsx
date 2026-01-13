
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Camera, 
  Image as ImageIcon, 
  Calendar, 
  Receipt,
  Loader2, 
  Trash2, 
  Plus, 
  AlertCircle,
  SortAsc,
  SortDesc,
  AlertTriangle,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { processInviteImage, processReceiptImage } from '../services/geminiService';
import { Reminder } from '../types';

const AssistantTab: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingType, setProcessingType] = useState<'invite' | 'receipt' | null>(null);
  const [showManualForm, setShowManualForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<any>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [reminderToDelete, setReminderToDelete] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('persona_reminders');
    if (saved) {
      try {
        setReminders(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved reminders", e);
      }
    } else {
      setReminders([
        { id: '1', title: 'Onboarding Session', dateTime: new Date().toISOString(), location: 'Handbook Dashboard', sourceType: 'manual' }
      ]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('persona_reminders', JSON.stringify(reminders));
  }, [reminders]);

  const sortedReminders = useMemo(() => {
    return [...reminders].sort((a, b) => {
      const dateA = new Date(a.dateTime).getTime();
      const dateB = new Date(b.dateTime).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }, [reminders, sortOrder]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !processingType) return;
    
    setIsProcessing(true);
    setError(null);
    setSuccessData(null);

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64 = (reader.result as string).split(',')[1];
        
        if (processingType === 'invite') {
          const result = await processInviteImage(base64);
          if (result && result.title && result.dateTime) {
            const newReminder: Reminder = {
              id: `auto-${Date.now()}`,
              title: result.title,
              dateTime: result.dateTime,
              location: result.location || 'AI Scanned',
              sourceType: 'image'
            };
            setReminders(prev => [newReminder, ...prev]);
            setSuccessData({ type: 'invite', ...result });
          } else {
            setError("Could not read invite details.");
          }
        } else if (processingType === 'receipt') {
          const result = await processReceiptImage(base64);
          if (result && result.merchant && result.amount) {
            // Log to budget in background
            const budgetSaved = localStorage.getItem('persona_budget');
            const transactions = budgetSaved ? JSON.parse(budgetSaved) : [];
            const newT = {
              id: Date.now().toString(),
              title: result.merchant,
              amount: result.amount,
              category: result.category,
              date: new Date().toISOString(),
              isAiProcessed: true
            };
            localStorage.setItem('persona_budget', JSON.stringify([newT, ...transactions]));
            setSuccessData({ type: 'receipt', ...result });
          } else {
            setError("Could not read receipt details.");
          }
        }
      } catch (err) {
        setError("AI Assistant unavailable.");
      } finally {
        setIsProcessing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const initiateScan = (type: 'invite' | 'receipt') => {
    setProcessingType(type);
    setSuccessData(null);
    setError(null);
    fileInputRef.current?.click();
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.time) return;
    const newReminder: Reminder = {
      id: `manual-${Date.now()}`,
      title: formData.title,
      dateTime: `${formData.date}T${formData.time}`,
      location: formData.location || 'Meeting',
      sourceType: 'manual'
    };
    setReminders(prev => [newReminder, ...prev]);
    setFormData({ title: '', date: '', time: '', location: '' });
    setShowManualForm(false);
  };

  const confirmDelete = () => {
    if (reminderToDelete) {
      setReminders(prev => prev.filter(r => r.id !== reminderToDelete));
      setReminderToDelete(null);
    }
  };

  return (
    <div className="p-6 animate-in slide-in-from-right duration-500 relative min-h-full">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Assistant</h1>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-1">Smart Reminders</p>
        </div>
        <button 
          onClick={() => setShowManualForm(!showManualForm)}
          className={`p-3 rounded-full shadow-lg transition-all ${showManualForm ? 'bg-gray-900 text-white rotate-45' : 'bg-[#D9F99D] text-gray-900'}`}
        >
          <Plus size={24} />
        </button>
      </header>

      {/* Confirmation Dialog Overlay */}
      {reminderToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 ios-blur animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-xs rounded-[32px] p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">Are you sure?</h3>
            <p className="text-sm text-gray-500 mb-6 font-medium">This reminder will be permanently removed from your schedule.</p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={confirmDelete}
                className="w-full bg-red-500 text-white font-black py-4 rounded-2xl tracking-widest uppercase text-xs active:scale-95 transition-all"
              >
                Delete Anyway
              </button>
              <button 
                onClick={() => setReminderToDelete(null)}
                className="w-full bg-gray-100 text-gray-900 font-black py-4 rounded-2xl tracking-widest uppercase text-xs active:scale-95 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showManualForm && (
        <form onSubmit={handleManualSubmit} className="mb-8 bg-white p-6 rounded-[32px] border border-gray-100 shadow-xl animate-in zoom-in-95 duration-300">
          <div className="space-y-4">
            <input 
              type="text" placeholder="Title"
              className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold outline-none"
              value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required
            />
            <div className="flex gap-3">
              <input type="date" className="flex-1 bg-gray-50 border-none rounded-2xl p-4 text-xs font-bold" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
              <input type="time" className="flex-1 bg-gray-50 border-none rounded-2xl p-4 text-xs font-bold" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} required />
            </div>
            <button type="submit" className="w-full bg-[#1A1A1A] text-white font-black py-4 rounded-2xl tracking-widest uppercase text-xs">Save</button>
          </div>
        </form>
      )}

      <div className="flex gap-4 mb-8">
        <button onClick={() => initiateScan('invite')} className="flex-1 bg-white p-5 rounded-[32px] shadow-sm border border-gray-100 flex flex-col items-center gap-2 active:scale-95 transition-all hover:border-[#D9F99D]">
          <div className="p-3 bg-gray-50 rounded-2xl"><Calendar size={24} className="text-gray-400" /></div>
          <span className="text-[10px] font-black uppercase text-gray-500">Scan Invite</span>
        </button>
        <button onClick={() => initiateScan('receipt')} className="flex-1 bg-white p-5 rounded-[32px] shadow-sm border border-gray-100 flex flex-col items-center gap-2 active:scale-95 transition-all hover:border-[#D9F99D]">
          <div className="p-3 bg-gray-50 rounded-2xl"><Receipt size={24} className="text-gray-400" /></div>
          <span className="text-[10px] font-black uppercase text-gray-500">Scan Receipt</span>
        </button>
      </div>

      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} capture="environment" />

      {isProcessing && (
        <div className="p-6 bg-[#D9F99D]/20 rounded-[32px] border border-[#D9F99D] flex items-center gap-3 animate-pulse mb-6">
          <Loader2 className="animate-spin text-lime-600" size={20} />
          <span className="text-xs font-bold text-lime-800">
            {processingType === 'receipt' ? 'Analyzing Receipt...' : 'Extracting Invite...'}
          </span>
        </div>
      )}

      {successData && (
        <div className="p-5 bg-white rounded-[32px] border border-lime-100 shadow-sm mb-6 animate-in zoom-in-95 duration-300">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-lime-100 p-2 rounded-full text-lime-600"><CheckCircle2 size={16} /></div>
            <p className="text-xs font-black uppercase text-gray-900 tracking-widest">Successfully Scanned</p>
          </div>
          {successData.type === 'receipt' ? (
             <div className="bg-gray-50 p-4 rounded-2xl">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-500 uppercase">{successData.merchant}</span>
                  <span className="text-sm font-black text-gray-900">${successData.amount}</span>
                </div>
                <div className="mt-2 flex items-center gap-1.5">
                  <Sparkles size={12} className="text-lime-500" />
                  <span className="text-[10px] font-bold text-lime-600 uppercase">Logged to Budget Tracker</span>
                </div>
             </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-2xl">
              <span className="text-xs font-black text-gray-900">{successData.title}</span>
              <p className="text-[10px] font-bold text-gray-500 mt-1 uppercase">Added to your schedule</p>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-2xl mb-6 text-xs font-bold border border-red-100">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Upcoming Schedule
          </h3>
          <button 
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#D9F99D] text-[#4D7C0F] rounded-full text-[9px] font-black uppercase tracking-tighter shadow-sm hover:brightness-95 transition-all"
          >
            {sortOrder === 'asc' ? <SortAsc size={12} /> : <SortDesc size={12} />}
            {sortOrder === 'asc' ? 'Earliest' : 'Latest'}
          </button>
        </div>

        {sortedReminders.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-xs font-bold uppercase tracking-widest">
            No reminders yet
          </div>
        ) : (
          sortedReminders.map(rem => (
            <div key={rem.id} className="bg-white p-5 rounded-[32px] shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-all animate-in fade-in slide-in-from-bottom-2 group">
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center shrink-0">
                <Calendar size={20} className="text-gray-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-extrabold text-gray-900 text-sm">{rem.title}</h4>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                    {new Date(rem.dateTime).toLocaleDateString([], { month: 'short', day: 'numeric' })} • {new Date(rem.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                {rem.sourceType === 'image' && (
                  <span className="bg-[#D9F99D] text-[#4D7C0F] text-[8px] font-black px-2 py-1 rounded-full">AUTO</span>
                )}
                <button 
                  onClick={() => setReminderToDelete(rem.id)} 
                  className="p-2 text-gray-200 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AssistantTab;
