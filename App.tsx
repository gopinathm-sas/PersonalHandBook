import React, { useState } from 'react';
import Layout from './components/Layout';
import HealthTab from './components/HealthTab';
import AssistantTab from './components/AssistantTab';
import BudgetTab from './components/BudgetTab';
import TodoTab from './components/TodoTab';
import PlaceholderTab from './components/PlaceholderTab';
import SettingsTab from './components/SettingsTab';
import { TabType } from './types';
import { Wallet, CheckSquare, BookOpen, Settings } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.HEALTH);

  const renderContent = () => {
    switch (activeTab) {
      case TabType.HEALTH:
        return <HealthTab />;
      case TabType.ASSISTANT:
        return <AssistantTab />;
      case TabType.BUDGET:
        return <BudgetTab />;
      case TabType.TODO:
        return <TodoTab />;
      case TabType.LIBRARY:
        return <PlaceholderTab title="Personal Library" icon={BookOpen} />;
      case TabType.SETTINGS:
        return <SettingsTab />;
      default:
        return <HealthTab />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="w-full h-full">
        {renderContent()}
      </div>
    </Layout>
  );
};

export default App;