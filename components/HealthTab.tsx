import React from 'react';
import { Bell, Activity, Zap, Moon } from 'lucide-react';

const HealthTab: React.FC = () => {
  return (
    <div className="p-8 animate-in fade-in duration-700 bg-[#F0F7F4] min-h-full">
      <header className="flex justify-between items-start mb-8 pt-4">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Home</h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">Daily Overview</p>
        </div>
        <button className="p-3 bg-white rounded-full border border-slate-100 shadow-sm">
          <Bell size={24} className="text-slate-400" />
        </button>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-6 rounded-[35px] flex flex-col gap-4">
          <div className="w-10 h-10 bg-rose-50 rounded-2xl flex items-center justify-center border border-rose-100">
            <Activity size={20} className="text-rose-400" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Heart Rate</p>
            <p className="text-2xl font-black text-slate-800">72 <span className="text-xs text-slate-400 font-bold">BPM</span></p>
          </div>
        </div>
        
        <div className="glass-card p-6 rounded-[35px] flex flex-col gap-4">
          <div className="w-10 h-10 bg-amber-50 rounded-2xl flex items-center justify-center border border-amber-100">
            <Zap size={20} className="text-amber-400" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Energy</p>
            <p className="text-2xl font-black text-slate-800">1,240 <span className="text-xs text-slate-400 font-bold">KCAL</span></p>
          </div>
        </div>

        <div className="glass-card p-6 rounded-[35px] col-span-2 flex items-center gap-6">
          <div className="w-14 h-14 bg-indigo-50 rounded-[24px] flex items-center justify-center border border-indigo-100">
            <Moon size={28} className="text-indigo-400" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sleep Quality</p>
            <p className="text-xl font-black text-slate-800">8h 12m</p>
            <div className="h-1.5 w-full bg-slate-100 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-indigo-400 w-3/4 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthTab;