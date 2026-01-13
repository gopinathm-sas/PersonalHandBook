
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface PlaceholderTabProps {
  title: string;
  icon: LucideIcon;
}

const PlaceholderTab: React.FC<PlaceholderTabProps> = ({ title, icon: Icon }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center animate-in fade-in duration-700">
      <div className="w-24 h-24 bg-gray-50 rounded-[40px] flex items-center justify-center mb-6 border border-gray-100 shadow-inner">
        <Icon size={48} className="text-gray-300" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-500 max-w-[240px]">
        This section is under development for the next update of your Persona Handbook.
      </p>
    </div>
  );
};

export default PlaceholderTab;
