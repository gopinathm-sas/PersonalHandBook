import React, { useState } from 'react';
import { 
  User, 
  Bell, 
  ShieldCheck, 
  Cpu, 
  Database, 
  ChevronRight, 
  Moon,
  LogOut,
  Trash2,
  Sparkles,
  Smartphone
} from 'lucide-react';

const SettingsTab: React.FC = () => {
  const [aiEnabled, setAiEnabled] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [biometrics, setBiometrics] = useState(false);

  const clearData = () => {
    if (confirm("Are you sure you want to clear all Handbook data? This cannot be undone.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const SettingRow = ({ icon: Icon, label, value, type = 'toggle', onClick }: any) => (
    <div className="flex items-center justify-between p-4 hover:bg-white/50 transition-colors cursor-pointer group" onClick={onClick}>
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-slate-50 group-hover:scale-110 transition-transform">
          <Icon size={18} className="text-slate-400 group-hover:text-sky-400 transition-colors" />
        </div>
        <span className="text-sm font-bold text-slate-700">{label}</span>
      </div>
      
      {type === 'toggle' ? (
        <button 
          onClick={(e) => { e.stopPropagation(); onClick(); }}
          className={`w-12 h-6 rounded-full transition-all relative ${value ? 'bg-sky-400' : 'bg-slate-200'}`}
        >
          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${value ? 'left-7' : 'left-1'}`} />
        </button>
      ) : (
        <ChevronRight size={18} className="text-slate-300" />
      )}
    </div>
  );

  return (
    <div className="p-6 animate-in fade-in zoom-in-95 duration-500 min-h-full bg-[#F0F7F4] pb-40">
      <header className="pt-4 mb-8">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Settings</h1>
        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">Handbook Configuration</p>
      </header>

      {/* Profile Section */}
      <section className="glass-card rounded-[35px] p-6 mb-6 flex items-center gap-4 border border-white shadow-xl">
        <div className="w-16 h-16 bg-gradient-to-br from-sky-100 to-emerald-50 rounded-[24px] flex items-center justify-center border-2 border-white shadow-inner">
          <User size={32} className="text-sky-400" />
        </div>
        <div>
          <h2 className="text-lg font-black text-slate-800">Administrator</h2>
          <p className="text-[10px] font-black text-sky-500 uppercase tracking-widest bg-sky-50 px-2 py-0.5 rounded-md inline-block">Pro Access</p>
          <p className="text-[11px] font-bold text-slate-400 mt-1">ID: HB-8829-001X</p>
        </div>
      </section>

      {/* Intelligence Section */}
      <div className="space-y-2 mb-6">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 mb-2">Intelligence</h3>
        <div className="glass-card rounded-[32px] overflow-hidden border border-white">
          <SettingRow 
            icon={Sparkles} 
            label="Gemini Vision Engine" 
            value={aiEnabled} 
            onClick={() => setAiEnabled(!aiEnabled)} 
          />
          <div className="h-[1px] bg-slate-50 mx-4" />
          <SettingRow 
            icon={Cpu} 
            label="Real-time Processing" 
            value={true} 
            onClick={() => {}} 
          />
        </div>
      </div>

      {/* System Section */}
      <div className="space-y-2 mb-6">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 mb-2">Preferences</h3>
        <div className="glass-card rounded-[32px] overflow-hidden border border-white">
          <SettingRow 
            icon={Bell} 
            label="Smart Notifications" 
            value={notifications} 
            onClick={() => setNotifications(!notifications)} 
          />
          <div className="h-[1px] bg-slate-50 mx-4" />
          <SettingRow 
            icon={ShieldCheck} 
            label="FaceID / Biometrics" 
            value={biometrics} 
            onClick={() => setBiometrics(!biometrics)} 
          />
          <div className="h-[1px] bg-slate-50 mx-4" />
          <SettingRow 
            icon={Moon} 
            label="Appearance" 
            type="link" 
            onClick={() => alert('Appearance locked to Persona Pastel Theme')} 
          />
        </div>
      </div>

      {/* Storage & Data */}
      <div className="space-y-2 mb-8">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 mb-2">Storage & Data</h3>
        <div className="glass-card rounded-[32px] overflow-hidden border border-white">
          <SettingRow 
            icon={Database} 
            label="Backup to Cloud" 
            type="link" 
          />
          <div className="h-[1px] bg-slate-50 mx-4" />
          <button 
            onClick={clearData}
            className="w-full flex items-center gap-4 p-4 hover:bg-red-50 transition-colors group"
          >
            <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-slate-50">
              <Trash2 size={18} className="text-red-400" />
            </div>
            <span className="text-sm font-bold text-red-500">Clear All Handbook Data</span>
          </button>
        </div>
      </div>

      <div className="text-center px-10">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Version 2.5.1 Platinum</p>
        <p className="text-[9px] font-bold text-slate-300 mt-1">Designed for iOS Simulator Staging</p>
      </div>
    </div>
  );
};

export default SettingsTab;