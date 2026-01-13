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
    <div className="flex flex-col h-full w-full max-w-md mx-auto bg-black overflow-hidden relative shadow-2xl">
      <main className="flex-1 overflow-y-auto bg-black text-white">
        {children}
        <div className="h-32" /> {/* Bottom spacer for navigation */}
      </main>

      {/* Liquid Glass Navigation Bar */}
      <div className="absolute bottom-8 left-4 right-4 z-50">
        <nav className="bg-[#1A1A1A]/70 ios-blur rounded-[32px] border border-white/5 p-1.5 flex items-center justify-between shadow-2xl">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.type;
            
            return (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab.type)}
                className={`relative flex flex-col items-center justify-center flex-1 py-2.5 transition-all duration-300 active:scale-90`}
              >
                {isActive && (
                  <div className="absolute inset-x-1 inset-y-0.5 bg-white/10 liquid-glass rounded-2xl animate-in fade-in zoom-in duration-300 shimmer" />
                )}
                
                <div className={`relative z-10 p-1.5 transition-all duration-300 ${isActive ? 'scale-110' : 'scale-100 opacity-60 hover:opacity-100'}`}>
                  <Icon 
                    size={22} 
                    className={`transition-colors duration-300 ${isActive ? 'text-[#38BDF8]' : 'text-white'}`}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                </div>
                
                <span className={`relative z-10 text-[9px] font-bold mt-0.5 transition-all duration-300 tracking-tight ${isActive ? 'text-white' : 'text-white/40'}`}>
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