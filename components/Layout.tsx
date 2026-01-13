import React from 'react';
import { TabType } from '../types';
import { 
  Home, 
  Heart, 
  Plus, 
  Library, 
  Settings 
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const tabs = [
    { type: TabType.HEALTH, icon: Home, label: 'Home' },
    { type: TabType.ASSISTANT, icon: Heart, label: 'Health' },
    { type: TabType.TODO, icon: Plus, label: 'Capture' },
    { type: TabType.LIBRARY, icon: Library, label: 'Library' },
    { type: TabType.SETTINGS, icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="flex flex-col h-full w-full max-w-md mx-auto bg-[#F0F7F4] overflow-hidden relative shadow-2xl">
      <main className="flex-1 overflow-y-auto bg-[#F0F7F4] text-[#1A1A1A]">
        {children}
        <div className="h-32" /> {/* Bottom spacer for navigation */}
      </main>

      {/* Liquid Glass Navigation Bar */}
      <div className="absolute bottom-8 left-6 right-6 z-50">
        <nav className="bg-white/70 ios-blur rounded-[35px] border border-white/40 p-2 flex items-center justify-between shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.type;
            
            return (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab.type)}
                className={`relative flex flex-col items-center justify-center flex-1 py-2 transition-all duration-300 active:scale-90`}
              >
                <div className={`relative z-10 p-2 rounded-2xl transition-all duration-500 overflow-hidden ${isActive ? 'active-liquid scale-110' : 'opacity-40 grayscale hover:opacity-80 hover:grayscale-0'}`}>
                  {/* The Liquid Shimmer Overlay */}
                  {isActive && <div className="absolute inset-0 bg-gradient-to-tr from-sky-400/20 to-transparent animate-pulse" />}
                  
                  <Icon 
                    size={24} 
                    className={`liquid-icon transition-colors duration-300 ${isActive ? 'text-[#38BDF8] drop-shadow-[0_0_10px_rgba(56,189,248,0.5)]' : 'text-slate-600'}`}
                    strokeWidth={isActive ? 2.5 : 2}
                  />

                  {/* Shimmer Effect */}
                  {isActive && <div className="shimmer-icon absolute inset-0 pointer-events-none" />}
                </div>
                
                <span className={`relative z-10 text-[9px] font-bold mt-1 transition-all duration-300 tracking-tight ${isActive ? 'text-[#1A1A1A]' : 'text-slate-400'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Layout;