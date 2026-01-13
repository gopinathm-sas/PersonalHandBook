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
    <div className="flex flex-col h-full w-full max-w-md mx-auto bg-[#F8FAFC] overflow-hidden relative">
      <main className="flex-1 overflow-y-auto">
        {children}
        <div className="h-32" />
      </main>

      {/* Floating Capsule Navigation Bar */}
      <div className="absolute bottom-6 left-6 right-6 z-50">
        <nav className="nav-capsule rounded-[40px] p-2 px-3 flex items-center justify-between">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.type;
            
            if (tab.isSpecial) {
                return (
                    <button
                        key={tab.label}
                        onClick={() => setActiveTab(tab.type)}
                        className="w-14 h-14 bg-[#1A1A1A] rounded-full flex items-center justify-center text-white shadow-lg active:scale-90 transition-transform"
                    >
                        <Maximize size={24} strokeWidth={2.5} />
                    </button>
                );
            }

            return (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab.type)}
                className={`relative p-3 rounded-full transition-all duration-300 ${isActive ? 'lime-accent' : 'text-slate-400'}`}
              >
                <Icon 
                  size={22} 
                  strokeWidth={isActive ? 2.5 : 2}
                  className={isActive ? 'text-[#1A1A1A]' : 'text-slate-300'}
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