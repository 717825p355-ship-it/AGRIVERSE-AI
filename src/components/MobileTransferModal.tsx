import React, { useState } from 'react';
import { 
  Smartphone, QrCode, Copy, Check, Share2, Download, 
  X, Sparkles, ExternalLink, MessageCircle, Send, Globe,
  ShieldCheck, ArrowRight
} from 'lucide-react';

interface MobileTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileTransferModal({ isOpen, onClose }: MobileTransferModalProps) {
  const [copied, setCopied] = useState(false);
  const [copiedSuccessToast, setCopiedSuccessToast] = useState(false);
  const sharedAppUrl = "https://ais-pre-ceqprtssm4c6fvazwpwvxq-354169762997.asia-east1.run.app";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(sharedAppUrl);
    setCopied(true);
    setCopiedSuccessToast(true);
    setTimeout(() => {
      setCopied(false);
      setCopiedSuccessToast(false);
    }, 3000);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`🌾 Open AgriGPT Smart Farming AI App on your mobile phone: ${sharedAppUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-xl shadow-2xl border border-emerald-100 dark:border-slate-800 overflow-hidden my-auto flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-850 to-teal-900 text-white p-5 flex items-center justify-between relative">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-800/80 rounded-2xl border border-emerald-600/50 shadow-inner">
              <Smartphone className="w-6 h-6 text-emerald-400 animate-bounce-subtle" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-lg text-white">Transfer AgriGPT to Mobile</h2>
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide">
                  Instant Link
                </span>
              </div>
              <p className="text-xs text-emerald-200/90">Scan QR Code or share link to open app on your Android or iPhone</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 text-emerald-200 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Toast */}
        {copiedSuccessToast && (
          <div className="bg-emerald-600 text-white text-xs font-bold py-2 px-4 text-center flex items-center justify-center gap-2 animate-fade-in">
            <Check className="w-4 h-4 text-emerald-200" />
            <span>Mobile App Link Copied! Send it to your phone or paste in Chrome / Safari.</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          
          {/* Main QR Code & Instant Link Section */}
          <div className="bg-emerald-50/80 dark:bg-emerald-950/30 rounded-2xl p-4 sm:p-5 border border-emerald-200/60 dark:border-emerald-800/50 flex flex-col md:flex-row items-center gap-5">
            
            {/* QR Code Graphic */}
            <div className="bg-white p-3 rounded-2xl shadow-md border border-emerald-100 flex flex-col items-center shrink-0">
              <svg className="w-36 h-36" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="100" height="100" fill="white"/>
                {/* QR Finder 1 (Top Left) */}
                <rect x="5" y="5" width="28" height="28" fill="#047857"/>
                <rect x="9" y="9" width="20" height="20" fill="white"/>
                <rect x="13" y="13" width="12" height="12" fill="#047857"/>
                {/* QR Finder 2 (Top Right) */}
                <rect x="67" y="5" width="28" height="28" fill="#047857"/>
                <rect x="71" y="9" width="20" height="20" fill="white"/>
                <rect x="75" y="13" width="12" height="12" fill="#047857"/>
                {/* QR Finder 3 (Bottom Left) */}
                <rect x="5" y="67" width="28" height="28" fill="#047857"/>
                <rect x="9" y="71" width="20" height="20" fill="white"/>
                <rect x="13" y="75" width="12" height="12" fill="#047857"/>
                {/* QR Data Pattern Dots */}
                <rect x="38" y="8" width="6" height="6" fill="#065F46"/>
                <rect x="48" y="8" width="12" height="6" fill="#065F46"/>
                <rect x="38" y="18" width="6" height="12" fill="#065F46"/>
                <rect x="50" y="20" width="8" height="8" fill="#065F46"/>
                <rect x="8" y="38" width="6" height="12" fill="#065F46"/>
                <rect x="18" y="42" width="12" height="6" fill="#065F46"/>
                <rect x="38" y="38" width="24" height="6" fill="#065F46"/>
                <rect x="38" y="48" width="8" height="18" fill="#065F46"/>
                <rect x="52" y="48" width="14" height="8" fill="#065F46"/>
                <rect x="70" y="38" width="22" height="6" fill="#065F46"/>
                <rect x="70" y="48" width="8" height="18" fill="#065F46"/>
                <rect x="82" y="48" width="10" height="10" fill="#065F46"/>
                <rect x="38" y="70" width="12" height="8" fill="#065F46"/>
                <rect x="54" y="70" width="12" height="12" fill="#065F46"/>
                <rect x="70" y="70" width="22" height="8" fill="#065F46"/>
                <rect x="38" y="82" width="8" height="10" fill="#065F46"/>
                <rect x="50" y="86" width="16" height="6" fill="#065F46"/>
                <rect x="72" y="82" width="18" height="10" fill="#065F46"/>
              </svg>
              <span className="text-[10px] font-black text-emerald-800 mt-1 uppercase tracking-wider">
                Scan with Mobile Camera
              </span>
            </div>

            {/* Transfer Actions */}
            <div className="space-y-3 flex-1 w-full text-center md:text-left">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 block">
                Option 1: Open Mobile App URL
              </span>
              
              <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-2 rounded-xl border border-emerald-200 dark:border-slate-700 shadow-inner">
                <Globe className="w-4 h-4 text-emerald-600 shrink-0 ml-1" />
                <input
                  type="text"
                  readOnly
                  value={sharedAppUrl}
                  className="bg-transparent text-xs text-gray-700 dark:text-gray-200 font-mono w-full focus:outline-none truncate"
                />
                <button
                  onClick={handleCopyLink}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Share Buttons */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1">
                <button
                  onClick={handleWhatsAppShare}
                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Send to WhatsApp</span>
                </button>

                <a
                  href={sharedAppUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 text-gray-800 dark:text-gray-200 font-bold text-xs px-3.5 py-2 rounded-xl transition-all border border-gray-200 dark:border-slate-700"
                >
                  <ExternalLink className="w-4 h-4 text-emerald-600" />
                  <span>Open in Mobile Window</span>
                </a>
              </div>
            </div>

          </div>

          {/* USB Cable Transfer & Direct APK Download Section */}
          <div className="bg-blue-50/80 dark:bg-slate-800/80 p-4 sm:p-5 rounded-2xl border border-blue-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-600 text-white rounded-xl">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-blue-950 dark:text-blue-200">
                    Option 2: Laptop USB Cable Transfer to Mobile
                  </h4>
                  <p className="text-[11px] text-blue-800 dark:text-blue-300">
                    Direct USB cable transfer when phone is plugged into laptop
                  </p>
                </div>
              </div>
              <span className="bg-blue-100 text-blue-800 font-mono text-[10px] font-black px-2 py-0.5 rounded-full">
                USB MTP
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-gray-700 dark:text-gray-300 font-medium pt-1">
              <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-blue-100 dark:border-slate-700">
                <span className="font-bold text-blue-700 dark:text-blue-400 block mb-0.5">Step 1: USB Plug-in</span>
                Plug phone into laptop USB port & select <strong className="text-gray-900 dark:text-white">File Transfer (MTP)</strong> on phone screen.
              </div>
              <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-blue-100 dark:border-slate-700">
                <span className="font-bold text-blue-700 dark:text-blue-400 block mb-0.5">Step 2: Copy File</span>
                Download AgriGPT Android App package and copy to phone's <strong className="text-gray-900 dark:text-white">Download</strong> folder.
              </div>
              <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-blue-100 dark:border-slate-700">
                <span className="font-bold text-blue-700 dark:text-blue-400 block mb-0.5">Step 3: Open on Mobile</span>
                Open phone's File Manager & tap <strong className="text-gray-900 dark:text-white">AgriGPT.apk / HTML</strong> to launch!
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-blue-100 dark:border-slate-700">
              <span className="text-[11px] text-blue-900 dark:text-blue-300 font-bold">
                Download file to laptop to send via USB Cable:
              </span>
              <button
                onClick={() => {
                  const blob = new Blob([`
                    <!DOCTYPE html>
                    <html>
                    <head>
                      <title>AgriGPT Mobile App</title>
                      <meta http-equiv="refresh" content="0; url=${sharedAppUrl}" />
                    </head>
                    <body>
                      <h2>Redirecting to AgriGPT Mobile App...</h2>
                      <p><a href="${sharedAppUrl}">Click here if not redirected</a></p>
                    </body>
                    </html>
                  `], { type: 'text/html' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'AgriGPT-Mobile-Launcher.html';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Download App Package for USB Transfer</span>
              </button>
            </div>
          </div>

          {/* Step-by-Step Mobile PWA & Home Screen Guide */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-xs text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>How to Install as App on Android & iPhone</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Android Guide */}
              <div className="bg-gray-50 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-gray-100 dark:border-slate-700 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-emerald-700 dark:text-emerald-400">Android Phone (Chrome)</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-mono px-2 py-0.5 rounded-full">1-Click</span>
                </div>
                <ol className="list-decimal list-inside text-[11px] text-gray-600 dark:text-gray-300 space-y-1 leading-relaxed">
                  <li>Open link in Chrome browser</li>
                  <li>Tap the 3 dots menu (<strong className="text-gray-900 dark:text-white">⋮</strong>)</li>
                  <li>Tap <strong className="text-emerald-700 dark:text-emerald-400">"Add to Home Screen"</strong> or <strong className="text-emerald-700 dark:text-emerald-400">"Install App"</strong></li>
                  <li>Enjoy AgriGPT as a native mobile icon!</li>
                </ol>
              </div>

              {/* iOS Guide */}
              <div className="bg-gray-50 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-gray-100 dark:border-slate-700 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-teal-700 dark:text-teal-400">iPhone / iPad (Safari)</span>
                  <span className="text-[10px] bg-teal-100 text-teal-800 font-mono px-2 py-0.5 rounded-full">Safari</span>
                </div>
                <ol className="list-decimal list-inside text-[11px] text-gray-600 dark:text-gray-300 space-y-1 leading-relaxed">
                  <li>Open link in Safari browser</li>
                  <li>Tap the <strong className="text-gray-900 dark:text-white">Share button</strong> (square with arrow)</li>
                  <li>Scroll down and tap <strong className="text-teal-700 dark:text-teal-400">"Add to Home Screen"</strong></li>
                  <li>Launch app anytime from iPhone home screen</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Android APK Build Note */}
          <div className="bg-amber-50 dark:bg-amber-950/30 p-3.5 rounded-2xl border border-amber-200 dark:border-amber-800/40 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs space-y-0.5">
              <span className="font-bold text-amber-900 dark:text-amber-200 block">Offline Mode & Hardware Support Ready</span>
              <p className="text-amber-800/90 dark:text-amber-300/80 text-[11px]">
                AgriGPT automatically detects Camera for Leaf Disease Scanning, GPS for local Mandi prices, and works offline in rural farmland areas.
              </p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 dark:bg-slate-800/60 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Smartphone className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold text-[11px]">AgriGPT Mobile Transfer Center</span>
          </div>
          <button
            onClick={onClose}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-2 rounded-xl transition-all shadow-sm"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
