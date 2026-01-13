
import React, { useState } from 'react';
import { MoreHorizontal, Bell, ChevronLeft, ChevronRight, Droplets, Footprints, ArrowUpRight } from 'lucide-react';
import { HealthData } from '../types';

const HealthTab: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState(15);

  const days = [
    { name: 'Sun', date: 12 },
    { name: 'Mon', date: 13 },
    { name: 'Tue', date: 14 },
    { name: 'Wed', date: 15, active: true },
    { name: 'Thu', date: 16 },
    { name: 'Fri', date: 17 },
    { name: 'Sat', date: 18 },
  ];

  return (
    <div className="p-6 animate-in fade-in duration-500">
      {/* Top Header */}
      <header className="flex justify-between items-center mb-6">
        <div>
          <p className="text-gray-400 text-sm font-medium">Good morning 👋</p>
          <div className="h-6 w-32 bg-gray-200 rounded-full mt-1 animate-pulse" /> {/* Placeholder for name */}
        </div>
        <button className="p-3 bg-white rounded-full shadow-sm border border-gray-100">
          <Bell size={20} className="text-gray-800" />
        </button>
      </header>

      {/* Calendar Strip */}
      <section className="bg-[#D9F99D]/30 rounded-[32px] p-5 mb-6 border border-[#D9F99D]/50">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-gray-900">November 2025</h2>
          <div className="flex gap-2">
            <button className="p-1 bg-white rounded-full shadow-sm"><ChevronLeft size={16} /></button>
            <button className="p-1 bg-white rounded-full shadow-sm"><ChevronRight size={16} /></button>
          </div>
        </div>
        <div className="flex justify-between">
          {days.map((day) => (
            <div 
              key={day.date} 
              onClick={() => setSelectedDay(day.date)}
              className={`flex flex-col items-center gap-2 p-2 rounded-2xl transition-all cursor-pointer ${day.date === selectedDay ? 'bg-[#D9F99D] shadow-sm' : ''}`}
            >
              <span className="text-[10px] font-bold text-gray-500 uppercase">{day.name}</span>
              <span className={`text-sm font-bold ${day.date === selectedDay ? 'text-gray-900' : 'text-gray-400'}`}>{day.date}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Breakfast Card */}
      <section className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-extrabold text-gray-900">Breakfast</h3>
          <button className="p-1 text-gray-400"><MoreHorizontal size={20} /></button>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-2xl font-black text-gray-900">456 <span className="text-gray-400 text-lg">/ 512 kcal</span></span>
          </div>
          <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden flex">
            <div className="h-full bg-gradient-to-r from-[#D9F99D] to-[#A3E635] w-[85%]" />
          </div>
        </div>

        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">3 Ingredients</p>
        <div className="flex justify-between gap-2">
          <IngredientPill label="Avocado" kcal={200} color="#FCA5A5" />
          <IngredientPill label="Bread" kcal={150} color="#93C5FD" />
          <IngredientPill label="Olive oil" kcal={80} color="#6EE7B7" />
        </div>
      </section>

      {/* Two Column Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-[32px] p-5 shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Step to walk</p>
              <h4 className="text-2xl font-black text-gray-900">5,234 <span className="text-xs text-gray-400 font-bold uppercase">step</span></h4>
            </div>
            <div className="p-2 bg-gray-50 rounded-xl"><Footprints size={18} className="text-gray-400" /></div>
          </div>
        </div>

        <div className="bg-white rounded-[32px] p-5 shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Drink water</p>
              <h4 className="text-2xl font-black text-gray-900">12 <span className="text-xs text-gray-400 font-bold uppercase">glass</span></h4>
            </div>
            <div className="p-2 bg-gray-50 rounded-xl"><Droplets size={18} className="text-gray-400" /></div>
          </div>
        </div>

        {/* Heart Rate Full Width */}
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 col-span-2">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm font-bold text-gray-900">Heart Rate</p>
              <p className="text-[10px] font-medium text-gray-400">Higher than usual</p>
            </div>
            <ArrowUpRight size={20} className="text-gray-400" />
          </div>
          <div className="flex items-center gap-4">
             <span className="text-3xl font-black text-gray-900">140 <span className="text-xs font-bold text-gray-400 uppercase">bpm</span></span>
             <div className="flex-1 h-12 flex items-center justify-center">
                {/* Simplified Waveform */}
                <svg viewBox="0 0 100 20" className="w-full h-full text-[#FB7185] stroke-current fill-none">
                  <path d="M0 10 L10 10 L15 5 L20 15 L25 10 L35 10 L40 0 L45 20 L50 10 L60 10 L65 5 L70 15 L75 10 L100 10" strokeWidth="2" strokeLinecap="round" />
                </svg>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const IngredientPill: React.FC<{ label: string, kcal: number, color: string }> = ({ label, kcal, color }) => (
  <div className="flex-1 flex flex-col gap-1">
    <div className="flex items-center gap-1.5 mb-1">
      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-[10px] font-bold text-gray-500">{label}</span>
    </div>
    <div className="h-1 rounded-full bg-gray-100 overflow-hidden">
      <div className="h-full" style={{ backgroundColor: color, width: '60%' }} />
    </div>
    <span className="text-[10px] font-black text-gray-900 mt-1">{kcal} kcal</span>
  </div>
);

export default HealthTab;