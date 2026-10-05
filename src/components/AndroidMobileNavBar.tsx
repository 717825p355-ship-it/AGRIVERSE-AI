import React, { useState, useEffect } from 'react';
import { 
  Sprout, Camera, MessageSquare, Award, Smartphone, 
  Home, Bell, FileText, BookOpen, FolderLock, Shield, 
  Sun, Moon, Menu, X, Sparkles, Volume2, Wifi, BatteryCharging,
  ChevronUp, LogOut, Share2, Download, Globe, Briefcase
} from 'lucide-react';
import { t, LanguageCode } from '../lib/translations';

interface AndroidMobileNavBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onOpenPermissions: () => void;
  onShowSplash: () => void;
  onLogout?: () => void;
  onOpenTransferModal?: () => void;
  currentLanguage?: LanguageCode;
  onLanguageChange?: (lang: LanguageCode) => void;
}

export default function AndroidMobileNavBar({
  activeTab,
  setActiveTab,
  darkMode,
  setDarkMode,
  onOpenPermissions,
  onShowSplash,
  onLogout,
  onOpenTransferModal,
  currentLanguage = 'English',
  onLanguageChange
}: AndroidMobileNavBarProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  // Update digital clock for top Android status bar
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const bottomNavItems = [
    { id: 'dashboard', label: t('dashboard', currentLanguage), icon: <Home className="w-5 h-5" /> },
    { id: 'crop', label: t('cropAdvice', currentLanguage), icon: <Sprout className="w-5 h-5" /> },
    { id: 'analysis', label: t('diseaseDetector', currentLanguage), icon: <Camera className="w-5 h-5" /> },
    { id: 'chat', label: t('chat', currentLanguage), icon: <MessageSquare className="w-5 h-5" /> },
    { id: 'schemes', label: t('subsidies', currentLanguage), icon: <Award className="w-5 h-5" /> },
  ];

  const secondaryTabs = [
    { id: 'reminders', label: t('reminders', currentLanguage), icon: <Bell className="w-4.5 h-4.5" /> },
    { id: 'notes', label: t('notes', currentLanguage), icon: <FileText className="w-4.5 h-4.5" /> },
    { id: 'career', label: t('business', currentLanguage), icon: <Briefcase className="w-4.5 h-4.5" /> },
    { id: 'learning', label: t('study', currentLanguage), icon: <BookOpen className="w-4.5 h-4.5" /> },
    { id: 'cabinet', label: t('offlineFile', currentLanguage), icon: <FolderLock className="w-4.5 h-4.5" /> },
    { id: 'flutter', label: t('androidApk', currentLanguage), icon: <Smartphone className="w-4.5 h-4.5" /> },
  ];

  return (
    <>
      {/* 1. TOP ANDROID STATUS & BRANDING BAR */}
      <div className="bg-emerald-950 text-white select-none border-b border-emerald-900 sticky top-0 z-40">
        
        {/* System Bar Row (Time, Signals, Battery) */}
        <div className="px-4 py-1 flex items-center justify-between text-[10px] font-mono text-emerald-300/80 bg-black/20">
          <div className="flex items-center gap-1.5 font-bold">
            <span>{currentTime || '09:41'}</span>
            <span className="text-emerald-500">•</span>
            <span>AgriGPT 5G</span>
          </div>
          <div className="flex items-center gap-3">
            <Wifi className="w-3 h-3 text-emerald-400" />
            <div className="flex items-center gap-1">
              <span>98%</span>
              <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Action Header Row */}
        <div className="px-4 py-2.5 flex items-center justify-between gap-2">
          
          {/* Logo & App Name */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2 text-left"
          >
            <div className="w-8 h-8 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-xl p-0.5 flex items-center justify-center shadow-sm">
              <div className="w-full h-full bg-emerald-950 rounded-[10px] flex items-center justify-center">
                <Sprout className="w-4.5 h-4.5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm tracking-tight text-white">AgriGPT</span>
                <span className="bg-emerald-800 text-emerald-200 text-[9px] font-black px-1.5 py-0.2 rounded uppercase">
                  Android
                </span>
              </div>
              <span className="text-[10px] text-emerald-300/80 font-medium block -mt-0.5">
                Smart Agriculture AI
              </span>
            </div>
          </button>

          {/* Header Controls */}
          <div className="flex items-center gap-1.5">
            {/* Transfer to Mobile Button */}
            {onOpenTransferModal && (
              <button
                onClick={onOpenTransferModal}
                title="Transfer App to Mobile / USB Connect"
                className="p-2 bg-teal-800 hover:bg-teal-700 border border-teal-600/60 rounded-xl text-teal-200 transition-all flex items-center gap-1 text-xs font-bold"
              >
                <Share2 className="w-4 h-4 text-teal-300" />
                <span className="hidden sm:inline">Transfer</span>
              </button>
            )}

            {/* Permissions Button */}
            <button
              onClick={onOpenPermissions}
              title="Android Permissions"
              className="p-2 bg-emerald-900 hover:bg-emerald-800 border border-emerald-700/60 rounded-xl text-emerald-300 transition-all flex items-center gap-1"
            >
              <Shield className="w-4 h-4 text-emerald-400" />
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              title="Toggle Dark Mode"
              className="p-2 bg-emerald-900 hover:bg-emerald-800 border border-emerald-700/60 rounded-xl text-emerald-300 transition-all"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-emerald-200" />}
            </button>

            {/* Log Out Button */}
            {onLogout && (
              <button
                onClick={onLogout}
                title="Log Out / Return to Login Page"
                className="p-2 bg-red-950/80 hover:bg-red-900 border border-red-700/60 rounded-xl text-red-300 transition-all flex items-center gap-1 text-xs font-bold"
              >
                <LogOut className="w-4 h-4 text-red-400" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            )}

            {/* Drawer Menu Toggle */}
            <button
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              className="p-2 bg-emerald-700 hover:bg-emerald-600 rounded-xl text-white font-bold transition-all flex items-center gap-1 text-xs"
            >
              {isDrawerOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
            </button>
          </div>

        </div>

      </div>

      {/* 2. MORE TABS DRAWER OVERLAY */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end animate-fade-in">
          <div className="w-4/5 max-w-xs bg-white dark:bg-slate-900 h-full p-5 flex flex-col justify-between shadow-2xl border-l border-emerald-100 overflow-y-auto">
            
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-emerald-600" />
                  <span className="font-black text-sm text-gray-900 dark:text-white">Android Navigation</span>
                </div>
                <button 
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2">Core Features</p>
                {bottomNavItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsDrawerOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-xs font-bold transition-all ${
                      activeTab === item.id 
                        ? 'bg-emerald-600 text-white shadow-sm' 
                        : 'text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-1 pt-3 border-t border-gray-100 dark:border-slate-800">
                <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2">Management & Files</p>
                {secondaryTabs.map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsDrawerOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-xs font-bold transition-all ${
                      activeTab === item.id 
                        ? 'bg-emerald-600 text-white shadow-sm' 
                        : 'text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-slate-800 space-y-2">
              {/* Regional Language Switcher in Drawer */}
              {onLanguageChange && (
                <div className="w-full flex items-center justify-between p-3 bg-emerald-50 dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-bold border border-emerald-100 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{t('language', currentLanguage)}</span>
                  </div>
                  <select
                    value={currentLanguage}
                    onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
                    className="bg-white dark:bg-slate-900 font-extrabold px-2 py-1 rounded-lg border border-emerald-200 text-xs text-emerald-950 dark:text-emerald-200 focus:outline-none"
                  >
                    <option value="English">English</option>
                    <option value="Tamil">தமிழ் (Tamil)</option>
                    <option value="Hindi">हिंदी (Hindi)</option>
                    <option value="Telugu">తెలుగు (Telugu)</option>
                    <option value="Kannada">ಕನ್ನಡ (Kannada)</option>
                    <option value="Malayalam">മലയാളം (Malayalam)</option>
                    <option value="Marathi">मराठी (Marathi)</option>
                    <option value="Bengali">বাংলা (Bengali)</option>
                    <option value="Gujarati">ગુજરાતી (Gujarati)</option>
                    <option value="Punjabi">ਪੰਜਾਬੀ (Punjabi)</option>
                  </select>
                </div>
              )}

              {onOpenTransferModal && (
                <button
                  onClick={() => {
                    onOpenTransferModal();
                    setIsDrawerOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-3 bg-teal-50 dark:bg-slate-800 text-teal-800 dark:text-teal-300 rounded-xl text-xs font-bold border border-teal-100 dark:border-slate-700"
                >
                  <div className="flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-teal-600" />
                    <span>{t('transferToMobile', currentLanguage)}</span>
                  </div>
                  <span className="text-[10px] bg-teal-200 dark:bg-teal-900 text-teal-900 dark:text-teal-200 px-2 py-0.5 rounded-full">
                    USB / QR
                  </span>
                </button>
              )}

              <button
                onClick={() => {
                  onOpenPermissions();
                  setIsDrawerOpen(false);
                }}
                className="w-full flex items-center justify-between p-3 bg-emerald-50 dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-bold"
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span>{t('permissions', currentLanguage)}</span>
                </div>
                <span className="text-[10px] bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 px-2 py-0.5 rounded-full">
                  Config
                </span>
              </button>

              <button
                onClick={() => {
                  onShowSplash();
                  setIsDrawerOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 p-2.5 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 rounded-xl text-xs font-bold hover:bg-gray-200"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Play Android Splash Screen</span>
              </button>

              {onLogout && (
                <button
                  onClick={() => {
                    setIsDrawerOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 p-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-extrabold transition-all shadow-md mt-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out / Log Out to Login Page</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* 3. MATERIAL DESIGN 3 BOTTOM NAVIGATION DOCK (FIXED ON MOBILE SCREENS) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-gray-200 dark:border-slate-800 px-2 py-1.5 shadow-lg select-none">
        <div className="flex items-center justify-around">
          {bottomNavItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all active:scale-95 group"
              >
                <div className={`p-1.5 rounded-2xl transition-all ${
                  isActive 
                    ? 'bg-emerald-600 text-white shadow-md scale-105' 
                    : 'text-gray-500 dark:text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400'
                }`}>
                  {item.icon}
                </div>
                <span className={`text-[10px] font-bold mt-1 tracking-tight ${
                  isActive ? 'text-emerald-700 dark:text-emerald-400 font-black' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
