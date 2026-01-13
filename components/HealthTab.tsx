import React, { useState, useEffect } from 'react';
import { Bell, Footprints, Droplets, ArrowUpRight, MoreHorizontal, ChevronLeft, ChevronRight, Sparkles, BrainCircuit, Zap } from 'lucide-react';
import { analyzeHealthData } from '../services/geminiService';
import { HealthData } from '../types';

const HealthTab: React.FC = () => {
  const [insight, setInsight] = useState<{ summary: string; trends: string[]; recommendations: string[] } | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

  const currentMetrics: HealthData = {
    steps: 5234,
    calories: 456,
    heartRate: 140,
    sleepHours: 6.5,
    activityMinutes: 45
  };

  useEffect(() => {
    const fetchAIInsights = async () => {
      setLoadingInsight(true);
      const data = await analyzeHealthData(currentMetrics);
      if (data) setInsight(data);
      setLoadingInsight(false);
    };
    fetchAIInsights();
  }, []);

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
    <div className="p-6 animate-in fade-in duration-500 bg-[#F8FAFC] dark:bg-[#0F172A] min-h-full transition-colors duration-400">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-slate-400 dark:text-slate-500 text-sm font-medium">Good morning 👋</h2>
          <div className="flex items-center gap-2 mt-1">
             <div className="w-16 h-4 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
             <span className="text-[10px] font-black text-lime-600 dark:text-lime-400 bg-lime-50 dark:bg-lime-900/20 px-2 py-0.5 rounded-md uppercase tracking-widest">Active Status</span>
          </div>
        </div>
        <button className="w-12 h-12 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center border border-slate-100 dark:border-slate-800 shadow-sm relative">
          <Bell size={22} className="text-slate-600 dark:text-slate-400" />
          <div className="absolute top-3 right-3 w-2 h-2 bg-red-400 rounded-full border-2 border-white dark:border-slate-900"></div>
        </button>
      </header>

      {/* AI Intelligence Section */}
      <section className="mb-6">
        <div className="flex items-center gap-2 mb-3 px-1">
          <BrainCircuit size={16} className="text-slate-400 dark:text-slate-600" />
          <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">Deep Intelligence</h3>
        </div>
        <div className="bg-gradient-to-br from-[#EEF9E1] to-white dark:from-lime-900/20 dark:to-slate-900 rounded-[32px] p-6 border border-white dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="absolute top-4 right-4 text-lime-500/20">
            <Sparkles size={48} />
          </div>
          
          {loadingInsight ? (
            <div className="flex flex-col gap-3 py-2">
              <div className="h-4 w-3/4 bg-slate-200/50 dark:bg-slate-700/50 animate-pulse rounded-full"></div>
              <div className="h-4 w-1/2 bg-slate-200/50 dark:bg-slate-700/50 animate-pulse rounded-full"></div>
            </div>
          ) : insight ? (
            <div className="space-y-4">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-relaxed">
                {insight.summary}
              </p>
              <div className="flex flex-wrap gap-2">
                {insight.recommendations.map((rec, i) => (
                  <div key={i} className="flex items-center gap-1.5 bg-white/60 dark:bg-slate-800/60 px-3 py-1.5 rounded-full border border-white/80 dark:border-slate-700/50 shadow-sm">
                    <Zap size={12} className="text-lime-600 dark:text-lime-400" />
                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* Calendar Section */}
      <section className="bg-[#EEF9E1] dark:bg-lime-900/10 rounded-[32px] p-5 mb-6">
        <div className="flex justify-between items-center mb-6 px-2">
          <h3 className="font-bold text-slate-800 dark:text-slate-200">November 2025</h3>
          <div className="flex gap-2">
            <button className="w-7 h-7 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm text-slate-600 dark:text-slate-400"><ChevronLeft size={16}/></button>
            <button className="w-7 h-7 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm text-slate-600 dark:text-slate-400"><ChevronRight size={16}/></button>
          </div>
        </div>
        <div className="flex justify-between text-center">
          {days.map(day => (
            <div key={day.date} className="flex flex-col gap-3">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-tight">{day.name}</span>
              <div className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-colors ${day.active ? 'bg-[#D9F99D] text-slate-900' : 'text-slate-400 dark:text-slate-700'}`}>
                {day.date}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Breakfast Card */}
      <section className="bg-white dark:bg-slate-900 rounded-[32px] p-6 mb-4 shadow-sm border border-slate-50 dark:border-slate-800">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Breakfast</h3>
          <button className="text-slate-300 dark:text-slate-700"><MoreHorizontal size={20} /></button>
        </div>
        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-3xl font-bold text-slate-900 dark:text-white">456</span>
          <span className="text-slate-400 dark:text-slate-600 font-medium">/ 512 kcal</span>
        </div>
        <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full mb-6 overflow-hidden">
          <div className="h-full bg-[#A3E635] w-[70%] rounded-full"></div>
        </div>
        
        <div className="flex justify-between">
          {[
            { label: 'Avocado', color: 'bg-rose-300', val: '200 kcal', w: 'w-full' },
            { label: 'Bread', color: 'bg-sky-300', val: '150 kcal', w: 'w-3/4' },
            { label: 'Olive oil', color: 'bg-emerald-300', val: '80 kcal', w: 'w-1/2' }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">{item.label}</span>
              </div>
              <div className="h-1 w-20 bg-slate-100 dark:bg-slate-800 rounded-full mt-1 overflow-hidden">
                  <div className={`h-full ${item.color} ${item.w}`}></div>
              </div>
              <span className="text-[10px] font-bold text-slate-900 dark:text-slate-200 mt-1">{item.val}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {[
          { label: 'STEP TO WALK', val: '5,234', unit: 'STEP', Icon: Footprints },
          { label: 'DRINK WATER', val: '12', unit: 'GLASS', Icon: Droplets }
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-[32px] p-6 shadow-sm border border-slate-50 dark:border-slate-800">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stat.val} <span className="text-[10px] text-slate-400">{stat.unit}</span></p>
              </div>
              <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
                <stat.Icon size={18} className="text-slate-300 dark:text-slate-600" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Heart Rate Section */}
      <section className="bg-white dark:bg-slate-900 rounded-[32px] p-6 shadow-sm border border-slate-50 dark:border-slate-800 relative overflow-hidden">
        <div className="flex justify-between items-start mb-2">
            <div>
                <h3 className="font-bold text-slate-900 dark:text-white">Heart Rate</h3>
                <p className="text-[10px] text-slate-400 dark:text-slate-600">Higher than usual</p>
            </div>
            <ArrowUpRight size={18} className="text-slate-300 dark:text-slate-600" />
        </div>
        <div className="flex items-center gap-4">
            <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-slate-900 dark:text-white">140</span>
                <span className="text-[10px] font-bold text-slate-400">BPM</span>
            </div>
            <div className="flex-1 h-12">
                <svg width="100%" height="40" viewBox="0 0 200 40" fill="none">
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