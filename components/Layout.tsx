import React from 'react';
import { TabType } from '../types';
import { 
  Home, 
  BarChart2, 
  Maximize, 
  Clock, 
  User 
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const tabs = [
    { type: TabType.HEALTH, icon: Home, label: 'Home' },
    { type: TabType.BUDGET, icon: BarChart2, label: 'Stats' },
    { type: TabType.ASSISTANT, icon: Maximize, label: 'Capture', isSpecial: true },
    { type: TabType.TODO, icon: Clock, label: 'History' },
    { type: TabType.SETTINGS, icon: User, label: 'Profile' },
  ];

  return (
    <div className="flex flex-col h-full w-full max-w-md mx-auto bg-[#F8FAFC] dark:bg-[#0F172A] overflow-hidden relative transition-colors duration-400">
      <main className="flex-1 overflow-y-auto">
        {children}
        {/* Padding for the floating bar */}
        <div className="h-40" />
      </main>

      {/* Liquid Glass Bottom Navigation */}
      <div className="absolute bottom-8 left-8 right-8 z-50">
        <nav className="liquid-nav rounded-[45px] p-2 flex items-center justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.type;
            
            if (tab.isSpecial) {
                return (
                    <button
                        key={tab.label}
                        onClick={() => setActiveTab(tab.type)}
                        className="capture-button w-14 h-14 rounded-full flex items-center justify-center text-white active:scale-90 transition-all duration-300 z-10"
                    >
                        <Maximize size={24} strokeWidth={2.5} className="relative z-20" />
                    </button>
                );
            }

            return (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab.type)}
                className={`group relative w-12 h-12 flex items-center justify-center rounded-full transition-all duration-500 ${
                  isActive ? 'liquid-active' : 'hover:bg-white/40 dark:hover:bg-slate-800/40'
                }`}
              >
                <Icon 
                  size={22} 
                  strokeWidth={isActive ? 2.5 : 2}
                  className={`liquid-icon transition-all duration-300 ${
                    isActive ? 'text-[#1A1A1A] active-icon' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                  }`}
                />
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Layout;