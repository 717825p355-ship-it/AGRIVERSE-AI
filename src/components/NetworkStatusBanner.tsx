import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCcw, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function NetworkStatusBanner() {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [showRestoredToast, setShowRestoredToast] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowRestoredToast(true);
      setTimeout(() => setShowRestoredToast(false), 4000);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOnline) {
    return (
      <div className="bg-amber-600 text-white text-xs font-bold px-4 py-2 flex items-center justify-between shadow-md border-b border-amber-700 animate-fade-in select-none">
        <div className="flex items-center gap-2">
          <WifiOff className="w-4 h-4 text-amber-200 animate-pulse" />
          <span>Offline Mode Active • Reading from Android Local Cache</span>
        </div>
        <span className="text-[10px] bg-amber-800/80 px-2 py-0.5 rounded-full font-mono">
          No Internet
        </span>
      </div>
    );
  }

  if (showRestoredToast) {
    return (
      <div className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 flex items-center justify-between shadow-md border-b border-emerald-700 animate-fade-in select-none">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>Internet Connection Restored • Syncing AgriGPT AI Models</span>
        </div>
        <span className="text-[10px] bg-emerald-800/80 px-2 py-0.5 rounded-full font-mono">
          Online
        </span>
      </div>
    );
  }

  return null;
}
