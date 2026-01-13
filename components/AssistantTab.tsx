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
  Sparkles,
  CheckSquare,
  Square,
  X,
  Fingerprint
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
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);
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

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleBulkDelete = () => {
    setReminders(prev => prev.filter(r => !selectedIds.has(r.id)));
    setSelectedIds(new Set());
    setIsSelectionMode(false);
  };

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedIds(new Set());
  };

  return (
    <div className="p-6 animate-in slide-in-from-right duration-500 relative min-h-full bg-black text-white">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Assistant</h1>
          <p className="text-white/40 font-bold uppercase text-[10px] tracking-widest mt-1 italic">Smart Intelligence</p>
        </div>
        <div className="flex gap-2">
          {reminders.length > 0 && (
            <button 
              onClick={toggleSelectionMode}
              className={`p-3 rounded-full transition-all border ${isSelectionMode ? 'bg-white text-black border-white' : 'bg-white/5 text-white border-white/10'}`}
            >
              {isSelectionMode ? <X size={20} /> : <CheckSquare size={20} />}
            </button>
          )}
          <button 
            onClick={() => setShowManualForm(!showManualForm)}
            className={`p-3 rounded-full shadow-lg transition-all ${showManualForm ? 'bg-white text-black rotate-45' : 'bg-[#38BDF8] text-black'}`}
          >
            <Plus size={24} />
          </button>
        </div>
      </header>

      {/* Manual Add Form */}
      {showManualForm && (
        <form onSubmit={handleManualSubmit} className="mb-8 bg-[#1A1A1A] p-6 rounded-[32px] border border-white/10 shadow-xl animate-in zoom-in-95 duration-300">
          <div className="space-y-4">
            <input 
              type="text" placeholder="Title"
              className="w-full bg-black border border-white/10 rounded-2xl p-4 text-sm font-bold outline-none text-white placeholder:text-white/20"
              value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required
            />
            <div className="flex gap-3">
              <input type="date" className="flex-1 bg-black border border-white/10 rounded-2xl p-4 text-xs font-bold text-white" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
              <input type="time" className="flex-1 bg-black border border-white/10 rounded-2xl p-4 text-xs font-bold text-white" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} required />
            </div>
            <button type="submit" className="w-full bg-white text-black font-black py-4 rounded-2xl tracking-widest uppercase text-xs">Save</button>
          </div>
        </form>
      )}

      {/* Scan Options */}
      <div className="flex gap-4 mb-8">
        <button onClick={() => initiateScan('invite')} className="flex-1 bg-white/5 p-5 rounded-[32px] border border-white/5 flex flex-col items-center gap-2 active:scale-95 transition-all hover:bg-white/10">
          <div className="p-3 bg-white/5 rounded-2xl text-[#38BDF8]"><Calendar size={24} /></div>
          <span className="text-[10px] font-black uppercase text-white/60">Scan Invite</span>
        </button>
        <button onClick={() => initiateScan('receipt')} className="flex-1 bg-white/5 p-5 rounded-[32px] border border-white/5 flex flex-col items-center gap-2 active:scale-95 transition-all hover:bg-white/10">
          <div className="p-3 bg-white/5 rounded-2xl text-[#38BDF8]"><Receipt size={24} /></div>
          <span className="text-[10px] font-black uppercase text-white/60">Scan Receipt</span>
        </button>
      </div>

      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} capture="environment" />

      {/* AI Processing Status */}
      {isProcessing && (
        <div className="p-6 bg-[#38BDF8]/10 rounded-[32px] border border-[#38BDF8]/20 flex items-center gap-3 animate-pulse mb-6">
          <Loader2 className="animate-spin text-[#38BDF8]" size={20} />
          <span className="text-xs font-bold text-[#38BDF8]">
            {processingType === 'receipt' ? 'Analyzing Receipt...' : 'Extracting Invite...'}
          </span>
        </div>
      )}

      {/* Success Indicators */}
      {successData && (
        <div className="p-5 bg-white/5 rounded-[32px] border border-[#38BDF8]/20 shadow-sm mb-6 animate-in zoom-in-95 duration-300">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-[#38BDF8]/20 p-2 rounded-full text-[#38BDF8]"><CheckCircle2 size={16} /></div>
            <p className="text-xs font-black uppercase text-[#38BDF8] tracking-widest">Successfully Scanned</p>
          </div>
          {successData.type === 'receipt' ? (
             <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-white/60 uppercase">{successData.merchant}</span>
                  <span className="text-sm font-black text-white">${successData.amount}</span>
                </div>
                <div className="mt-2 flex items-center gap-1.5">
                  <Sparkles size={12} className="text-[#38BDF8]" />
                  <span className="text-[10px] font-bold text-[#38BDF8] uppercase tracking-tighter">Synced to Budget</span>
                </div>
             </div>
          ) : (
            <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
              <span className="text-xs font-black text-white">{successData.title}</span>
              <p className="text-[10px] font-bold text-white/40 mt-1 uppercase">Added to Schedule</p>
            </div>
          )}
        </div>
      )}

      {/* Schedule Header */}
      <div className="space-y-4 mb-32">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-[10px] font-black text-white/40 uppercase tracking-widest">
            {isSelectionMode ? `Selected ${selectedIds.size} Items` : 'Upcoming Schedule'}
          </h3>
          <button 
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 text-white/60 rounded-full text-[9px] font-black uppercase border border-white/10"
          >
            {sortOrder === 'asc' ? <SortAsc size={12} /> : <SortDesc size={12} />}
            {sortOrder === 'asc' ? 'Earliest' : 'Latest'}
          </button>
        </div>

        {/* Reminders List */}
        {sortedReminders.length === 0 ? (
          <div className="text-center py-12 text-white/20 text-xs font-bold uppercase tracking-widest">
            No active reminders
          </div>
        ) : (
          sortedReminders.map(rem => {
            const isSelected = selectedIds.has(rem.id);
            return (
              <div 
                key={rem.id} 
                onClick={() => isSelectionMode && toggleSelection(rem.id)}
                className={`group relative bg-[#1A1A1A] p-5 rounded-[32px] border transition-all duration-300 flex items-center gap-4 ${
                  isSelected ? 'border-[#38BDF8] shadow-[0_0_20px_rgba(56,189,248,0.1)]' : 'border-white/5 hover:border-white/20'
                } ${isSelectionMode ? 'cursor-pointer active:scale-[0.98]' : ''}`}
              >
                {isSelectionMode && (
                  <div className={`transition-all duration-300 ${isSelected ? 'text-[#38BDF8]' : 'text-white/20'}`}>
                    {isSelected ? <CheckSquare size={24} /> : <Square size={24} />}
                  </div>
                )}
                
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 border border-white/5">
                  <Calendar size={20} className="text-white/40" />
                </div>
                
                <div className="flex-1">
                  <h4 className={`font-extrabold text-sm transition-colors ${isSelected ? 'text-white' : 'text-white/80'}`}>{rem.title}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-tighter">
                      {new Date(rem.dateTime).toLocaleDateString([], { month: 'short', day: 'numeric' })} • {new Date(rem.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                {!isSelectionMode && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setReminders(prev => prev.filter(r => r.id !== rem.id));
                    }} 
                    className="p-2 text-white/10 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
                
                {rem.sourceType === 'image' && !isSelectionMode && (
                  <span className="bg-[#38BDF8]/10 text-[#38BDF8] text-[8px] font-black px-2 py-1 rounded-full border border-[#38BDF8]/20">AI</span>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Bulk Action Bar (Liquid Glass) */}
      {isSelectionMode && selectedIds.size > 0 && (
        <div className="fixed bottom-32 left-8 right-8 z-[60] animate-in slide-in-from-bottom-10 duration-500">
          <div className="bg-[#1A1A1A]/90 ios-blur border border-[#38BDF8]/40 rounded-full p-3 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-4 pl-4">
              <div className="w-8 h-8 bg-[#38BDF8]/20 rounded-full flex items-center justify-center text-[#38BDF8]">
                <Fingerprint size={16} />
              </div>
              <span className="text-xs font-black uppercase text-white tracking-widest">{selectedIds.size} Selected</span>
            </div>
            <button 
              onClick={handleBulkDelete}
              className="bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all active:scale-95 flex items-center gap-2"
            >
              <Trash2 size={14} />
              Delete All
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssistantTab;