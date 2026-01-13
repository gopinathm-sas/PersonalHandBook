import React from 'react';
import { Bell, Footprints, Droplets, ArrowUpRight, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';

const HealthTab: React.FC = () => {
  const days = [
    { name: 'SUN', date: 12 },
    { name: 'MON', date: 13 },
    { name: 'TUE', date: 14 },
    { name: 'WED', date: 15, active: true },
    { name: 'THU', date: 16 },
    { name: 'FRI', date: 17 },
    { name: 'SAT', date: 18 },
  ];

  return (
    <div className="p-6 animate-in fade-in duration-500 bg-[#F8FAFC] min-h-full">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-slate-400 text-sm font-medium">Good morning 👋</h2>
          <div className="w-24 h-4 bg-slate-100 rounded-full mt-1"></div>
        </div>
        <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-slate-100 shadow-sm relative">
          <Bell size={22} className="text-slate-600" />
          <div className="absolute top-3 right-3 w-2 h-2 bg-red-400 rounded-full border-2 border-white"></div>
        </button>
      </header>

      {/* Calendar Section */}
      <section className="bg-[#EEF9E1] rounded-[32px] p-5 mb-6">
        <div className="flex justify-between items-center mb-6 px-2">
          <h3 className="font-bold text-slate-800">November 2025</h3>
          <div className="flex gap-2">
            <button className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm"><ChevronLeft size={16}/></button>
            <button className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm"><ChevronRight size={16}/></button>
          </div>
        </div>
        <div className="flex justify-between text-center">
          {days.map(day => (
            <div key={day.date} className="flex flex-col gap-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{day.name}</span>
              <div className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-colors ${day.active ? 'bg-[#D9F99D] text-slate-900' : 'text-slate-400'}`}>
                {day.date}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Breakfast Card */}
      <section className="bg-white rounded-[32px] p-6 mb-4 shadow-sm border border-slate-50">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-xl font-bold text-slate-900">Breakfast</h3>
          <button className="text-slate-300"><MoreHorizontal size={20} /></button>
        </div>
        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-3xl font-bold text-slate-900">456</span>
          <span className="text-slate-400 font-medium">/ 512 kcal</span>
        </div>
        <div className="h-2.5 w-full bg-slate-100 rounded-full mb-6 overflow-hidden">
          <div className="h-full bg-[#A3E635] w-[70%] rounded-full"></div>
        </div>
        
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">3 INGREDIENTS</p>
        <div className="flex justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-rose-300"></div>
              <span className="text-xs font-bold text-slate-500">Avocado</span>
            </div>
            <div className="h-1 w-20 bg-slate-100 rounded-full mt-1 overflow-hidden">
                <div className="h-full bg-rose-300 w-full"></div>
            </div>
            <span className="text-[10px] font-bold text-slate-900 mt-1">200 kcal</span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-sky-300"></div>
              <span className="text-xs font-bold text-slate-500">Bread</span>
            </div>
            <div className="h-1 w-20 bg-slate-100 rounded-full mt-1 overflow-hidden">
                <div className="h-full bg-sky-300 w-3/4"></div>
            </div>
            <span className="text-[10px] font-bold text-slate-900 mt-1">150 kcal</span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-300"></div>
              <span className="text-xs font-bold text-slate-500">Olive oil</span>
            </div>
            <div className="h-1 w-20 bg-slate-100 rounded-full mt-1 overflow-hidden">
                <div className="h-full bg-emerald-300 w-1/2"></div>
            </div>
            <span className="text-[10px] font-bold text-slate-900 mt-1">80 kcal</span>
          </div>
        </div>
      </section>

      {/* Row: Steps & Water */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-50 flex flex-col justify-between">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">STEP TO WALK</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">5,234 <span className="text-[10px] text-slate-400">STEP</span></p>
                </div>
                <div className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center">
                    <Footprints size={18} className="text-slate-300" />
                </div>
            </div>
        </div>
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-50 flex flex-col justify-between">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">DRINK WATER</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">12 <span className="text-[10px] text-slate-400">GLASS</span></p>
                </div>
                <div className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center">
                    <Droplets size={18} className="text-slate-300" />
                </div>
            </div>
        </div>
      </div>

      {/* Heart Rate Section */}
      <section className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-50 relative overflow-hidden">
        <div className="flex justify-between items-start mb-2">
            <div>
                <h3 className="font-bold text-slate-900">Heart Rate</h3>
                <p className="text-[10px] text-slate-400">Higher than usual</p>
            </div>
            <ArrowUpRight size={18} className="text-slate-300" />
        </div>
        
        <div className="flex items-center gap-4">
            <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-slate-900">140</span>
                <span className="text-[10px] font-bold text-slate-400">BPM</span>
            </div>
            {/* Custom Pulse Waveform */}
            <div className="flex-1 h-12">
                <svg width="100%" height="40" viewBox="0 0 200 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path 
                        d="M0 20 L40 20 L45 10 L50 30 L55 20 L80 20 L85 5 L95 35 L105 20 L130 20 L135 15 L140 25 L145 20 L200 20" 
                        stroke="#FF7B8D" 
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        className="heart-pulse"
                    />
                </svg>
            </div>
        </div>
      </section>
    </div>
  );
};

export default HealthTab;