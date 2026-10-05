import React, { useEffect, useState } from 'react';
import { Sprout, Sparkles, Smartphone, CheckCircle, ChevronRight, ShieldCheck } from 'lucide-react';

interface AndroidSplashScreenProps {
  onDismiss: () => void;
}

export default function AndroidSplashScreen({ onDismiss }: AndroidSplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing Android 10+ Native Engine...');

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setProgress(35);
      setStatusText('Loading Material Design 3 & Leaf AI Models...');
    }, 400);

    const timer2 = setTimeout(() => {
      setProgress(75);
      setStatusText('Checking Camera, GPS & Microphone Permissions...');
    }, 1100);

    const timer3 = setTimeout(() => {
      setProgress(100);
      setStatusText('AgriGPT Android App Ready!');
    }, 1800);

    const timer4 = setTimeout(() => {
      onDismiss();
    }, 2300);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onDismiss]);

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-emerald-900 via-emerald-850 to-slate-950 flex flex-col items-center justify-between p-8 text-white select-none animate-fade-in overflow-hidden">
      
      {/* Top Header Badge */}
      <div className="w-full flex items-center justify-between pt-4">
        <div className="flex items-center gap-2 bg-emerald-800/60 border border-emerald-500/30 px-3 py-1.5 rounded-full text-[11px] font-bold text-emerald-200 backdrop-blur-md">
          <Smartphone className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>Android Mobile Edition</span>
        </div>
        <button
          onClick={onDismiss}
          className="text-xs font-bold text-emerald-300 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-all flex items-center gap-1"
        >
          <span>Skip</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Logo & Animated Sprout */}
      <div className="flex flex-col items-center text-center my-auto space-y-6">
        <div className="relative">
          <div className="w-28 h-28 bg-gradient-to-tr from-emerald-600 to-teal-400 rounded-3xl p-1 shadow-2xl flex items-center justify-center animate-bounce-subtle">
            <div className="w-full h-full bg-emerald-950/90 rounded-[22px] flex items-center justify-center relative overflow-hidden">
              <Sprout className="w-14 h-14 text-emerald-400 drop-shadow-lg" />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/20 to-transparent pointer-events-none" />
            </div>
          </div>
          <div className="absolute -top-2 -right-2 bg-amber-400 text-slate-950 rounded-full p-1.5 shadow-lg border-2 border-emerald-900">
            <Sparkles className="w-4 h-4 fill-slate-950" />
          </div>
        </div>

        <div className="space-y-2 max-w-xs">
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center justify-center gap-2">
            <span>AgriGPT</span>
            <span className="text-xs bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-md font-mono">v3.4</span>
          </h1>
          <p className="text-xs text-emerald-200/90 font-medium">
            Smart Agriculture AI for Android Mobile
          </p>
        </div>

        {/* Feature Pill Tags */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] font-bold text-emerald-300">
          <span className="bg-emerald-900/80 border border-emerald-700/50 px-2.5 py-1 rounded-lg">Leaf Disease Scanner</span>
          <span className="bg-emerald-900/80 border border-emerald-700/50 px-2.5 py-1 rounded-lg">Voice Guidance</span>
          <span className="bg-emerald-900/80 border border-emerald-700/50 px-2.5 py-1 rounded-lg">GPS Weather & Mandi</span>
        </div>
      </div>

      {/* Bottom Progress Bar & Loading Indicator */}
      <div className="w-full max-w-xs space-y-3 pb-6">
        <div className="w-full bg-emerald-950/80 border border-emerald-800/60 rounded-full h-2.5 overflow-hidden p-0.5 shadow-inner">
          <div
            className="bg-gradient-to-r from-emerald-400 to-teal-300 h-full rounded-full transition-all duration-300 ease-out shadow-sm"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] font-medium text-emerald-300/80">
          <span className="truncate pr-2">{statusText}</span>
          <span className="font-mono font-bold text-emerald-200">{progress}%</span>
        </div>

        <div className="pt-2 flex items-center justify-center gap-2 text-[10px] text-emerald-400/70 font-semibold border-t border-emerald-800/40">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Android 10+ Permission Ready • Material 3 UI</span>
        </div>
      </div>

    </div>
  );
}
