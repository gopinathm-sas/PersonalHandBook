import React, { useState, useEffect, useRef } from 'react';
import { 
  User, 
  Bell, 
  ShieldCheck, 
  Cpu, 
  Database, 
  ChevronRight, 
  Moon,
  Sun,
  LogOut,
  Trash2,
  Sparkles,
  Camera,
  Check,
  Edit2
} from 'lucide-react';

const SettingsTab: React.FC = () => {
  const [aiEnabled, setAiEnabled] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [biometrics, setBiometrics] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Profile State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [userName, setUserName] = useState('Administrator');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load Theme
    const savedTheme = localStorage.getItem('theme');
    const darkModeActive = savedTheme === 'dark';
    setIsDarkMode(darkModeActive);
    if (darkModeActive) {
      document.documentElement.classList.add('dark');
    }

    // Load Profile
    const savedName = localStorage.getItem('user_name');
    if (savedName) setUserName(savedName);
    
    const savedImage = localStorage.getItem('user_image');
    if (savedImage) setProfileImage(savedImage);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setProfileImage(base64);
        localStorage.setItem('user_image', base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfile = () => {
    localStorage.setItem('user_name', userName);
    setIsEditingProfile(false);
  };

  const clearData = () => {
    if (confirm("Are you sure you want to clear all Handbook data? This cannot be undone.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const SettingRow = ({ icon: Icon, label, value, type = 'toggle', onClick }: any) => (
    <div className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group" onClick={onClick}>
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm border border-slate-50 dark:border-slate-700 group-hover:scale-110 transition-transform">
          <Icon size={18} className="text-slate-400 dark:text-slate-500 group-hover:text-lime-500 transition-colors" />
        </div>
        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{label}</span>
      </div>
      
      {type === 'toggle' ? (
        <button 
          onClick={(e) => { e.stopPropagation(); onClick(); }}
          className={`w-12 h-6 rounded-full transition-all relative ${value ? 'bg-lime-400' : 'bg-slate-200 dark:bg-slate-700'}`}
        >
          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${value ? 'left-7' : 'left-1'}`} />
        </button>
      ) : (
        <ChevronRight size={18} className="text-slate-300 dark:text-slate-600" />
      )}
    </div>
  );

  return (
    <div className="p-6 animate-in fade-in zoom-in-95 duration-500 min-h-full dark:bg-[#0F172A] pb-40">
      <header className="pt-4 mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Settings</h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">Handbook Configuration</p>
        </div>
        {isEditingProfile && (
          <button 
            onClick={saveProfile}
            className="bg-lime-500 text-white p-2 rounded-full shadow-lg shadow-lime-500/30 animate-in zoom-in"
          >
            <Check size={20} />
          </button>
        )}
      </header>

      {/* Profile Section */}
      <section className={`bg-white dark:bg-slate-900/50 rounded-[35px] p-6 mb-6 flex items-center gap-4 border transition-all duration-300 ${isEditingProfile ? 'border-lime-400 ring-4 ring-lime-50 dark:ring-lime-900/10' : 'border-slate-100 dark:border-slate-800'} shadow-xl dark:shadow-none relative`}>
        <div 
          className="relative group cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="w-20 h-20 bg-gradient-to-br from-lime-100 to-emerald-50 dark:from-lime-900/20 dark:to-emerald-900/10 rounded-[28px] flex items-center justify-center border-2 border-white dark:border-slate-700 shadow-inner overflow-hidden">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User size={38} className="text-lime-500" />
            )}
          </div>
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-[28px] flex items-center justify-center">
            <Camera size={20} className="text-white" />
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleImageUpload} 
          />
        </div>

        <div className="flex-1">
          {isEditingProfile ? (
            <input 
              autoFocus
              className="bg-slate-50 dark:bg-slate-800 border-none text-lg font-black text-slate-800 dark:text-white w-full rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-lime-400"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onBlur={() => { if(userName.trim() === '') setUserName('User'); }}
              placeholder="Your Name"
            />
          ) : (
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-slate-800 dark:text-white">{userName}</h2>
              <button onClick={() => setIsEditingProfile(true)} className="text-slate-300 hover:text-lime-500 transition-colors">
                <Edit2 size={14} />
              </button>
            </div>
          )}
          <p className="text-[10px] font-black text-lime-600 dark:text-lime-400 uppercase tracking-widest bg-lime-50 dark:bg-lime-900/20 px-2 py-0.5 rounded-md inline-block mt-1">Pro Access</p>
          <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 mt-1">ID: HB-8829-001X</p>
        </div>
      </section>

      {/* Intelligence Section */}
      <div className="space-y-2 mb-6">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 mb-2">Intelligence</h3>
        <div className="bg-white dark:bg-slate-900/50 rounded-[32px] overflow-hidden border border-slate-100 dark:border-slate-800">
          <SettingRow 
            icon={Sparkles} 
            label="Gemini Vision Engine" 
            value={aiEnabled} 
            onClick={() => setAiEnabled(!aiEnabled)} 
          />
          <div className="h-[1px] bg-slate-50 dark:bg-slate-800/50 mx-4" />
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
        <div className="bg-white dark:bg-slate-900/50 rounded-[32px] overflow-hidden border border-slate-100 dark:border-slate-800">
          <SettingRow 
            icon={isDarkMode ? Moon : Sun} 
            label="Dark Mode" 
            value={isDarkMode} 
            onClick={toggleDarkMode} 
          />
          <div className="h-[1px] bg-slate-50 dark:bg-slate-800/50 mx-4" />
          <SettingRow 
            icon={Bell} 
            label="Smart Notifications" 
            value={notifications} 
            onClick={() => setNotifications(!notifications)} 
          />
          <div className="h-[1px] bg-slate-50 dark:bg-slate-800/50 mx-4" />
          <SettingRow 
            icon={ShieldCheck} 
            label="FaceID / Biometrics" 
            value={biometrics} 
            onClick={() => setBiometrics(!biometrics)} 
          />
        </div>
      </div>

      {/* Storage & Data */}
      <div className="space-y-2 mb-8">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 mb-2">Storage & Data</h3>
        <div className="bg-white dark:bg-slate-900/50 rounded-[32px] overflow-hidden border border-slate-100 dark:border-slate-800">
          <SettingRow 
            icon={Database} 
            label="Backup to Cloud" 
            type="link" 
          />
          <div className="h-[1px] bg-slate-50 dark:bg-slate-800/50 mx-4" />
          <button 
            onClick={clearData}
            className="w-full flex items-center gap-4 p-4 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors group text-left"
          >
            <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm border border-slate-50 dark:border-slate-700">
              <Trash2 size={18} className="text-red-400" />
            </div>
            <span className="text-sm font-bold text-red-500">Clear All Handbook Data</span>
          </button>
        </div>
      </div>

      <div className="text-center px-10">
        <p className="text-[10px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-widest">Version 2.5.1 Platinum</p>
        <p className="text-[9px] font-bold text-slate-300 dark:text-slate-700 mt-1">Designed for iOS Simulator Staging</p>
      </div>
    </div>
  );
};

export default SettingsTab;