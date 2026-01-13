import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Calendar, 
  Receipt,
  Loader2, 
  Trash2, 
  Plus, 
  CheckCircle2, 
  Sparkles,
  CheckSquare,
  Square,
  X,
  Fingerprint,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { processInviteImage, processReceiptImage } from '../services/geminiService';
import { Reminder } from '../types';

const AssistantTab: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingType, setProcessingType] = useState<'invite' | 'receipt' | null>(null);
  const [showManualForm, setShowManualForm] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({ title: '', date: '', time: '', location: '' });

  useEffect(() => {
    const saved = localStorage.getItem('persona_reminders');
    if (saved) setReminders(JSON.parse(saved));
    else setReminders([{ id: '1', title: 'Welcome to Handbook', dateTime: new Date().toISOString(), location: 'Dashboard', sourceType: 'manual' }]);
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
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64 = (reader.result as string).split(',')[1];
        if (processingType === 'invite') {
          const result = await processInviteImage(base64);
          if (result?.title) {
            setReminders(prev => [{ id: `auto-${Date.now()}`, title: result.title, dateTime: result.dateTime, location: result.location, sourceType: 'image' }, ...prev]);
            setSuccessData({ type: 'invite', ...result });
          }
        }
      } catch (err) { console.error(err); }
      finally { setIsProcessing(false); }
    };
    reader.readAsDataURL(file);
  };

  const handleBulkDelete = () => {
    setReminders(prev => prev.filter(r => !selectedIds.has(r.id)));
    setSelectedIds(new Set());
    setIsSelectionMode(false);
  };

  return (
    <div className="p-6 animate-in slide-in-from-right duration-500 bg-[#F0F7F4] min-h-full">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Assistant</h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">Smart Management</p>
        </div>
        <div className="flex gap-2">
          {reminders.length > 0 && (
            <button onClick={() => {setIsSelectionMode(!isSelectionMode); setSelectedIds(new Set());}} className={`p-3 rounded-full transition-all border ${isSelectionMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-400 border-slate-100'}`}>
              {isSelectionMode ? <X size={20} /> : <CheckSquare size={20} />}
            </button>
          )}
          <button onClick={() => setShowManualForm(!showManualForm)} className={`p-3 rounded-full shadow-lg transition-all ${showManualForm ? 'bg-slate-900 text-white rotate-45' : 'bg-[#38BDF8] text-white'}`}>
            <Plus size={24} />
          </button>
        </div>
      </header>

      {isProcessing && (
        <div className="p-4 bg-sky-50 rounded-3xl border border-sky-100 flex items-center gap-3 mb-6">
          <Loader2 className="animate-spin text-sky-500" size={18} />
          <span className="text-xs font-bold text-sky-700">AI Assistant Processing...</span>
        </div>
      )}

      <div className="space-y-4 pb-32">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {isSelectionMode ? `${selectedIds.size} Selected` : 'Schedule'}
          </h3>
          <button onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')} className="text-[9px] font-black uppercase text-slate-500 bg-white px-3 py-1.5 rounded-full border border-slate-100">
            {sortOrder === 'asc' ? 'Newest First' : 'Oldest First'}
          </button>
        </div>

        {sortedReminders.map(rem => {
          const isSelected = selectedIds.has(rem.id);
          return (
            <div 
              key={rem.id} 
              onClick={() => isSelectionMode && (setSelectedIds(prev => {
                const next = new Set(prev);
                if (next.has(rem.id)) next.delete(rem.id);
                else next.add(rem.id);
                return next;
              }))}
              className={`glass-card p-5 rounded-[30px] transition-all flex items-center gap-4 ${isSelected ? 'border-sky-300 ring-2 ring-sky-100' : 'border-white'} ${isSelectionMode ? 'cursor-pointer active:scale-[0.98]' : ''}`}
            >
              {isSelectionMode && (
                <div className={`transition-all ${isSelected ? 'text-sky-500' : 'text-slate-200'}`}>
                  {isSelected ? <CheckSquare size={22} /> : <Square size={22} />}
                </div>
              )}
              <div className="w-12 h-12 bg-sky-50 rounded-2xl flex items-center justify-center shrink-0 border border-sky-100">
                <Calendar size={20} className="text-sky-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm text-slate-800">{rem.title}</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase">{new Date(rem.dateTime).toLocaleDateString()}</p>
              </div>
              {!isSelectionMode && (
                <button onClick={() => setReminders(prev => prev.filter(r => r.id !== rem.id))} className="p-2 text-slate-200 hover:text-red-400">
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {isSelectionMode && selectedIds.size > 0 && (
        <div className="fixed bottom-32 left-8 right-8 z-[60] animate-in slide-in-from-bottom-10">
          <div className="bg-white/90 ios-blur border border-slate-100 rounded-full p-3 flex items-center justify-between shadow-2xl">
            <span className="text-xs font-black uppercase text-slate-800 tracking-widest pl-4">{selectedIds.size} Selected</span>
            <button onClick={handleBulkDelete} className="bg-red-500 text-white px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest active:scale-95 flex items-center gap-2">
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </div>
      )}
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
    </div>
  );
};

export default AssistantTab;