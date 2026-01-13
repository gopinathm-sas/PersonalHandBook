import React from 'react';
import { Bell } from 'lucide-react';

const HealthTab: React.FC = () => {
  return (
    <div className="p-8 animate-in fade-in duration-700 h-full flex flex-col">
      <header className="flex justify-between items-start mb-12 pt-4">
        <h1 className="text-5xl font-black text-white tracking-tighter">Home</h1>
        <button className="p-3 bg-white/5 rounded-full border border-white/10">
          <Bell size={24} className="text-white/80" />
        </button>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40">
        <p className="text-lg font-medium text-white/60">Your daily overview will appear here.</p>
      </div>
    </div>
  );
};

export default HealthTab;