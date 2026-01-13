
import React from 'react';
import { TabType } from '../types';
import { 
  Home, 
  BarChart2, 
  Scan, 
  CheckCircle2, 
  User 
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const tabs = [
    { type: TabType.HEALTH, icon: Home },
    { type: TabType.BUDGET, icon: BarChart2 },
    { type: TabType.ASSISTANT, icon: Scan, isCenter: true },
    { type: TabType.TODO, icon: CheckCircle2 },
    { type: TabType.SETTINGS, icon: User },
  ];

  return (
    <div className="flex flex-col h-full w-full max-w-md mx-auto bg-white overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.1)]">
      <main className="flex-1 overflow-y-auto bg-[#F8FAFC]">
        {children}
        <div className="h-32" /> {/* Bottom spacer */}
      </main>

      <div className="absolute bottom-6 left-6 right-6 z-50">
        <nav className="bg-white rounded-[40px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100/50 p-2 flex items-center justify-between">
          {tabs.map((tab, idx) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.type;
            
            if (tab.isCenter) {
              return (
                <button
                  key="center-btn"
                  onClick={() => setActiveTab(TabType.ASSISTANT)}
                  className="bg-[#1A1A1A] text-white p-4 rounded-full shadow-lg transform active:scale-90 transition-all"
                >
                  <Icon size={24} />
                </button>
              );
            }

            return (
              <button
                key={tab.type || idx}
                onClick={() => setActiveTab(tab.type)}
                className="relative flex items-center justify-center w-12 h-12 transition-all duration-300"
              >
                {isActive && (
                  <div className="absolute inset-0 bg-[#D9F99D] rounded-full animate-in zoom-in duration-300" />
                )}
                <Icon 
                  size={20} 
                  className={`relative z-10 ${isActive ? 'text-[#1A1A1A]' : 'text-gray-400'}`} 
                  strokeWidth={isActive ? 2.5 : 2}
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
