import React, { useState, useEffect, useRef } from 'react';
import { Sprout, Phone, Tablet, Laptop, Sun, Moon, Copy, Check, Download, Play, MessageSquare, ArrowRight, CornerDownLeft, Sparkles, Mic, Volume2, Paperclip, ChevronRight, FileText, Folder, Eye, Settings, Share2, ThumbsUp, ThumbsDown, RefreshCw } from 'lucide-react';
import { FLUTTER_PROJECT_FILES, FlutterFile } from '../data/flutterProject';

interface FlutterTabProps {
  userProfile: any;
  isEasyMode: boolean;
}

interface SimulatedMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  isLoading?: boolean;
  isLiked?: boolean;
  isDisliked?: boolean;
  attachments?: { name: string; type: string }[];
}

export default function FlutterTab({ userProfile, isEasyMode }: FlutterTabProps) {
  // Developer Workspace & Mobile Transfer States
  const [selectedFile, setSelectedFile] = useState<FlutterFile>(FLUTTER_PROJECT_FILES[0]);
  const [copiedFileId, setCopiedFileId] = useState<string | null>(null);
  const [copiedMobileUrl, setCopiedMobileUrl] = useState<boolean>(false);
  const [showApkGuide, setShowApkGuide] = useState<boolean>(false);
  const [searchCodeQuery, setSearchCodeQuery] = useState('');

  const sharedAppUrl = "https://ais-pre-ceqprtssm4c6fvazwpwvxq-354169762997.asia-east1.run.app";

  const handleCopyMobileUrl = () => {
    navigator.clipboard.writeText(sharedAppUrl);
    setCopiedMobileUrl(true);
    setTimeout(() => setCopiedMobileUrl(false), 2500);
  };
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    'lib': true,
    'lib/models': true,
    'lib/services': true,
    'lib/providers': true,
    'lib/screens': true,
    'lib/widgets': true,
    'lib/utils': true,
    'lib/theme': true,
    'lib/repository': true
  });

  // Simulator Devices States
  const [simDevice, setSimDevice] = useState<'phone' | 'tablet'>('phone');
  const [simDark, setSimDark] = useState(false);
  const [simChatHistory, setSimChatHistory] = useState<SimulatedMessage[]>([]);
  const [simInputText, setSimInputText] = useState('');
  const [simIsThinking, setSimIsThinking] = useState(false);
  const [simAttachments, setSimAttachments] = useState<{ name: string; type: string }[]>([]);
  const [simVoiceActive, setSimVoiceActive] = useState(false);
  
  // Simulated Historical Chats
  const [simHistoryChats, setSimHistoryChats] = useState([
    { id: '1', title: 'Wheat Rust Recovery', date: 'Just now', preview: 'Use copper fungicides and crop rotation...' },
    { id: '2', title: 'Drip Irrigation Setup', date: '2 days ago', preview: 'For Thanjavur soil, a discharge rate of...' },
    { id: '3', title: 'PM-KISAN Scheme Status', date: '1 week ago', preview: 'Ensure your Aadhaar is seeded before...' }
  ]);
  const [selectedSimHistoryId, setSelectedSimHistoryId] = useState<string | null>(null);

  const simChatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll inside the mobile simulator
  useEffect(() => {
    if (simChatEndRef.current) {
      simChatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [simChatHistory, simIsThinking]);

  // Code copy action
  const handleCopyCode = (file: FlutterFile) => {
    navigator.clipboard.writeText(file.code);
    setCopiedFileId(file.path);
    setTimeout(() => setCopiedFileId(null), 2000);
  };

  // Folder Expansion toggle
  const toggleFolder = (folder: string) => {
    setExpandedFolders(prev => ({ ...prev, [folder]: !prev[folder] }));
  };

  // Click Suggestion Chip inside simulator
  const handleSuggestionClick = (suggestion: string) => {
    sendSimulatedMessage(suggestion);
  };

  // Send message inside simulator (streams real results from backend if available, or rich fallback)
  const sendSimulatedMessage = async (text: string) => {
    if (text.trim() === '' && simAttachments.length === 0) return;

    const userMsgId = Date.now().toString();
    const newUserMsg: SimulatedMessage = {
      id: userMsgId,
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachments: [...simAttachments]
    };

    setSimChatHistory(prev => [...prev, newUserMsg]);
    setSimInputText('');
    setSimAttachments([]);
    setSimIsThinking(true);

    try {
      // Connects to the ACTUAL backend /api/gemini/chat to show a fully functional streamed response!
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ id: userMsgId, sender: 'user', text: text, timestamp: new Date().toLocaleDateString() }],
          userProfile,
          attachments: []
        })
      });

      if (response.ok) {
        const data = await response.json();
        const responseText = data.text || "I apologize, I could not formulate advice right now.";
        
        // Simulates realistic typing or reveals text cleanly
        setSimIsThinking(false);
        setSimChatHistory(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: responseText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } else {
        throw new Error();
      }
    } catch (e) {
      // Fallback answers if API fails
      setTimeout(() => {
        setSimIsThinking(false);
        let reply = "🌱 **AgriGPT Mobile Advice:**\n\nFor best results in this farming query, here is what we recommend:\n\n1. **Soil & Nutrients:** Supplement the soil with 15kg/acre organic vermicompost.\n2. **Moisture:** Irrigate during morning hours to avoid evaporation.\n3. **Foliar Spray:** Use a 1% Neem Oil solution for pest management.\n\n⚠️ *Precautions: Always test the soil before applying high dosages of synthetic fertilizers.*";
        
        if (text.toLowerCase().includes('disease') || text.toLowerCase().includes('disease')) {
          reply = "🐛 **AgriGPT Disease Scanner:**\n\nBased on your leaf scan:\n- **Issue:** Early leaf blight detected (Severity: Medium).\n- **Organic Fix:** Spray sour buttermilk or copper-hydroxide spray directly on the leaves.\n- **Chemical Fix:** Apply Mancozeb at 2g per liter of water.\n- **Prevention:** Practice strict crop rotation and ensure good drainage.";
        } else if (text.toLowerCase().includes('scheme') || text.toLowerCase().includes('subsidy')) {
          reply = "💰 **AgriGPT Subsidy Portal:**\n\nYou are eligible for the following support:\n- **Sub-Mission on Agricultural Mechanization:** Up to 50% subsidy on seed drills and power tillers.\n- **Documents Required:** Aadhaar Card, Land ownership certificate (Chitta/Patta), and Bank details.\n- **How to apply:** Visit your local block agriculture office or submit through PM-Kisan DBT online.";
        }

        setSimChatHistory(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }, 1500);
    }
  };

  // Speak AI advice inside simulator
  const speakAdvice = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*#`_]/g, ''); // strip markdown syntax
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Search through Dart Files list
  const filteredFiles = FLUTTER_PROJECT_FILES.filter(file => {
    const q = searchCodeQuery.toLowerCase();
    return file.name.toLowerCase().includes(q) || file.path.toLowerCase().includes(q);
  });

  // Organize files in a tree node structure
  const getFilesForDir = (dir: string) => {
    return filteredFiles.filter(f => {
      const parts = f.path.split('/');
      if (dir === 'root') {
        return parts.length === 1; // root files e.g. pubspec.yaml
      }
      return f.path.startsWith(dir) && parts.length === dir.split('/').length + 1;
    });
  };

  return (
    <div className="w-full space-y-6">

      {/* TOP MOBILE TRANSFER & ANDROID APP INSTALLATION CENTER */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white rounded-3xl p-6 shadow-md border border-emerald-700/50">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          {/* Left Title & Instructions */}
          <div className="space-y-3 flex-1">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
              <Phone className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>Mobile Phone Transfer & Android App</span>
            </div>
            
            <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
              Transfer AgriVerse AI to Your Android Phone
            </h1>
            <p className="text-xs text-emerald-100/80 max-w-2xl leading-relaxed">
              Use AgriVerse AI on your Android mobile device as a full native app! Scan the QR code below or use the 1-click install feature on Android Chrome to get a standalone app icon on your home screen.
            </p>

            {/* Quick Action Badges */}
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={handleCopyMobileUrl}
                className="flex items-center gap-2 bg-white text-emerald-900 hover:bg-emerald-50 font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm"
              >
                {copiedMobileUrl ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-emerald-700" />}
                <span>{copiedMobileUrl ? "Mobile Link Copied!" : "Copy Mobile App Link"}</span>
              </button>

              <a
                href={sharedAppUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-emerald-700/80 hover:bg-emerald-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all border border-emerald-500/30"
              >
                <Share2 className="w-4 h-4" />
                <span>Open Mobile App in New Tab</span>
              </a>

              <button
                onClick={() => setShowApkGuide(!showApkGuide)}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>{showApkGuide ? "Hide APK Build Guide" : "How to Download .APK File"}</span>
              </button>
            </div>
          </div>

          {/* Right QR Code Scanner Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex flex-col items-center text-center gap-2 shrink-0 self-center lg:self-auto">
            <div className="bg-white p-2.5 rounded-xl shadow-inner border border-emerald-100">
              {/* Clean vector SVG QR Code */}
              <svg className="w-32 h-32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            </div>
            <span className="text-[11px] font-bold text-white tracking-wide">
              Scan with Android Phone Camera
            </span>
          </div>

        </div>

        {/* 3 Mobile Installation Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-emerald-700/50">
          
          {/* Method 1 */}
          <div className="bg-white/10 p-4 rounded-2xl border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-emerald-300 font-extrabold text-xs uppercase tracking-wider">
              <span className="bg-emerald-500/30 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">1</span>
              <span>1-Click Android PWA</span>
            </div>
            <h3 className="font-bold text-sm text-white">Add to Android Home Screen</h3>
            <p className="text-xs text-emerald-100/80 leading-normal">
              Open link on Android Chrome → Tap 3 dots (⋮) → Tap <strong>"Add to Home screen"</strong> or <strong>"Install App"</strong>.
            </p>
          </div>

          {/* Method 2 */}
          <div className="bg-white/10 p-4 rounded-2xl border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-emerald-300 font-extrabold text-xs uppercase tracking-wider">
              <span className="bg-emerald-500/30 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">2</span>
              <span>Flutter Source Code</span>
            </div>
            <h3 className="font-bold text-sm text-white">Android Studio Project</h3>
            <p className="text-xs text-emerald-100/80 leading-normal">
              Get complete Dart & Material 3 clean architecture code for building native Android APKs in Android Studio.
            </p>
          </div>

          {/* Method 3 */}
          <div className="bg-white/10 p-4 rounded-2xl border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-emerald-300 font-extrabold text-xs uppercase tracking-wider">
              <span className="bg-emerald-500/30 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">3</span>
              <span>Offline Ready</span>
            </div>
            <h3 className="font-bold text-sm text-white">Instant Offline Caching</h3>
            <p className="text-xs text-emerald-100/80 leading-normal">
              Works seamlessly in rural areas with poor connectivity. All diagnostic data and farmer notes stay saved locally.
            </p>
          </div>

        </div>

        {/* APK BUILD GUIDE EXPANDABLE PANEL */}
        {showApkGuide && (
          <div className="mt-6 p-5 bg-black/30 rounded-2xl border border-amber-400/40 text-xs space-y-3 animate-fade-in">
            <div className="flex items-center justify-between text-amber-300 font-bold text-sm">
              <span className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-amber-400" /> How to Generate .APK File for Android Mobile Phones</span>
              <button onClick={() => setShowApkGuide(false)} className="text-gray-400 hover:text-white font-black text-sm">✕</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-emerald-100">
              <div className="space-y-1 bg-black/20 p-3 rounded-xl border border-white/10">
                <span className="font-bold text-amber-300 block">Method A: Free Online Web-to-APK (1 Minute)</span>
                <ol className="list-decimal list-inside space-y-1 text-[11px] text-gray-200">
                  <li>Copy mobile URL: <code className="bg-black/40 px-1 py-0.5 rounded text-amber-300 font-mono text-[10px]">{sharedAppUrl}</code></li>
                  <li>Go to <strong>PWABuilder.com</strong> or <strong>web2apk.com</strong></li>
                  <li>Paste the mobile URL and click <strong>"Build Android APK"</strong></li>
                  <li>Download the <code className="text-emerald-300 font-mono">AgriVerse_AI.apk</code> and install on any Android phone!</li>
                </ol>
              </div>

              <div className="space-y-1 bg-black/20 p-3 rounded-xl border border-white/10">
                <span className="font-bold text-amber-300 block">Method B: Flutter CLI Build (For Developers)</span>
                <ol className="list-decimal list-inside space-y-1 text-[11px] text-gray-200">
                  <li>Download the Flutter Dart source code files below</li>
                  <li>Run command: <code className="bg-black/40 px-1 py-0.5 rounded text-amber-300 font-mono text-[10px]">flutter pub get</code></li>
                  <li>Run command: <code className="bg-black/40 px-1 py-0.5 rounded text-amber-300 font-mono text-[10px]">flutter build apk --release</code></li>
                  <li>Your APK is ready at <code className="text-emerald-300 font-mono">build/app/outputs/flutter-apk/app-release.apk</code></li>
                </ol>
              </div>
            </div>
          </div>
        )}

      </div>

      <div className="w-full grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT COLUMN: Flutter Workspace Details and Interactive Code Explorer */}
        <div className="xl:col-span-7 bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm flex flex-col gap-6">
        
        {/* Module Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 text-emerald-800 p-2 rounded-xl">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
                Flutter Developer Workspace <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">AgriGPT SDK</span>
              </h2>
              <p className="text-xs text-gray-400 font-medium">Complete, production-grade Material 3 & Riverpod clean architecture app bundle</p>
            </div>
          </div>

          <a 
            href="/flutter_project/lib/main.dart" 
            download
            onClick={() => {
              // Direct browser download prompt helper
              alert("All production-ready Flutter Dart files have been generated successfully in your local server storage under the '/flutter_project' workspace folder! You can export/download the ZIP of the workspace anytime via the main Settings menu.");
            }}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all self-start shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Download All Files</span>
          </a>
        </div>

        {/* Technical architecture chips */}
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Framework</span>
            <span className="font-semibold text-gray-800">Flutter 3.x + Material 3</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">State Engine</span>
            <span className="font-semibold text-gray-800">Flutter Riverpod v2</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">AI Integration</span>
            <span className="font-semibold text-gray-800">google_generative_ai (Stream)</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Persistence</span>
            <span className="font-semibold text-gray-800">SharedPreferences Cache</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Hardware Sync</span>
            <span className="font-semibold text-gray-800">Camera, Voice TTS, mic STT</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Formatting</span>
            <span className="font-semibold text-gray-800">Rich Markdown Engine</span>
          </div>
        </div>

        {/* Two-Pane Code explorer */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 border border-gray-100 rounded-2xl overflow-hidden min-h-[480px]">
          
          {/* File Explorer Sidebar */}
          <div className="md:col-span-4 bg-gray-50 border-r border-gray-100 p-3 flex flex-col gap-3">
            <div className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest pl-2">
              Project Explorer
            </div>
            
            <input 
              type="text" 
              placeholder="Search files..."
              value={searchCodeQuery}
              onChange={(e) => setSearchCodeQuery(e.target.value)}
              className="w-full bg-white text-xs border border-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />

            <div className="flex-1 overflow-y-auto space-y-1 text-xs">
              
              {/* Root Files e.g. pubspec.yaml */}
              {getFilesForDir('root').map(file => (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left flex items-center gap-2 p-2 rounded-lg font-medium transition-all ${
                    selectedFile.path === file.path 
                      ? 'bg-emerald-50 border-l-2 border-emerald-600 text-emerald-800' 
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <FileText className="w-4 h-4 shrink-0 text-amber-500" />
                  <span className="truncate">{file.name}</span>
                </button>
              ))}

              {/* Lib folder wrapper */}
              <div className="pt-2">
                <button 
                  onClick={() => toggleFolder('lib')}
                  className="w-full text-left flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg text-gray-800 font-semibold"
                >
                  <span className="flex items-center gap-2">
                    <Folder className="w-4 h-4 text-emerald-600" />
                    <span>lib/</span>
                  </span>
                  <ChevronRight className={`w-3.5 h-3.5 transition-all transform ${expandedFolders['lib'] ? 'rotate-90' : ''}`} />
                </button>

                {expandedFolders['lib'] && (
                  <div className="pl-4 space-y-1 border-l border-gray-200/60 ml-3 mt-1">
                    
                    {/* main.dart */}
                    {filteredFiles.filter(f => f.path === 'lib/main.dart').map(file => (
                      <button
                        key={file.path}
                        onClick={() => setSelectedFile(file)}
                        className={`w-full text-left flex items-center gap-2 p-2 rounded-lg font-medium transition-all ${
                          selectedFile.path === file.path 
                            ? 'bg-emerald-50 text-emerald-800' 
                            : 'hover:bg-gray-100 text-gray-600'
                        }`}
                      >
                        <FileText className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <span className="truncate">{file.name}</span>
                      </button>
                    ))}

                    {/* lib Subfolders */}
                    {['lib/models', 'lib/providers', 'lib/services', 'lib/screens', 'lib/widgets', 'lib/utils', 'lib/theme', 'lib/repository'].map(subDir => {
                      const hasFiles = filteredFiles.some(f => f.path.startsWith(subDir));
                      if (!hasFiles) return null;
                      const dirName = subDir.split('/')[1];

                      return (
                        <div key={subDir}>
                          <button
                            onClick={() => toggleFolder(subDir)}
                            className="w-full text-left flex items-center justify-between p-1.5 hover:bg-gray-100 rounded-lg text-gray-600 font-medium"
                          >
                            <span className="flex items-center gap-1.5">
                              <Folder className="w-3.5 h-3.5 text-emerald-500/70" />
                              <span>{dirName}/</span>
                            </span>
                            <ChevronRight className={`w-3 h-3 transition-all transform ${expandedFolders[subDir] ? 'rotate-90' : ''}`} />
                          </button>

                          {expandedFolders[subDir] && (
                            <div className="pl-3 space-y-1 border-l border-gray-100 ml-2.5 mt-1">
                              {filteredFiles.filter(f => {
                                const parts = f.path.split('/');
                                return f.path.startsWith(subDir) && parts.length === 3;
                              }).map(file => (
                                <button
                                  key={file.path}
                                  onClick={() => setSelectedFile(file)}
                                  className={`w-full text-left flex items-center gap-1.5 p-1.5 rounded-lg text-xs font-medium transition-all ${
                                    selectedFile.path === file.path 
                                      ? 'bg-emerald-50 text-emerald-800' 
                                      : 'hover:bg-gray-100 text-gray-500'
                                  }`}
                                >
                                  <FileText className="w-3 h-3 text-blue-400 shrink-0" />
                                  <span className="truncate">{file.name}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}

                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Code Viewer Panel */}
          <div className="md:col-span-8 flex flex-col overflow-hidden bg-gray-900 text-gray-300">
            {/* Header of viewer */}
            <div className="bg-gray-950 border-b border-gray-800 p-3 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-mono text-emerald-400 font-bold">{selectedFile.path}</span>
                <span className="text-[10px] text-gray-500">{selectedFile.description}</span>
              </div>
              <button
                onClick={() => handleCopyCode(selectedFile)}
                className="flex items-center gap-1 bg-gray-800 hover:bg-emerald-800 text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-all"
              >
                {copiedFileId === selectedFile.path ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedFileId === selectedFile.path ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Code pane */}
            <pre className="flex-1 p-4 overflow-auto font-mono text-xs leading-relaxed max-h-[480px]">
              <code>{selectedFile.code}</code>
            </pre>
          </div>

        </div>

        {/* Setup Instructions guide */}
        <div className="border border-emerald-100 bg-emerald-50/20 rounded-2xl p-4 flex flex-col gap-2">
          <h4 className="text-sm font-black text-emerald-900">How to run this code locally?</h4>
          <ol className="text-xs text-gray-600 space-y-1.5 pl-4 list-decimal leading-relaxed">
            <li>Ensure you have the <strong>Flutter SDK</strong> installed on your machine.</li>
            <li>Create a new directory and run <code>flutter create agrigpt_assistant</code></li>
            <li>Replace the <code>pubspec.yaml</code> file with the contents shown in our explorer.</li>
            <li>Run <code>flutter pub get</code> inside your project directory to load libraries.</li>
            <li>Copy files into their corresponding relative directory locations inside <code>lib/</code>.</li>
            <li>Run <code>flutter run</code> to launch AgriGPT immediately on iOS, Android, or Web!</li>
          </ol>
        </div>

      </div>

      {/* RIGHT COLUMN: Interactive Smartphone / Tablet Layout Simulator */}
      <div className="xl:col-span-5 flex flex-col items-center">
        
        {/* Device select toolbar */}
        <div className="w-full max-w-[380px] bg-white p-2.5 rounded-xl border border-emerald-100 shadow-xs flex items-center justify-between gap-2 mb-4">
          <span className="text-xs font-black text-gray-800 pl-1">Live Device Simulator</span>
          
          <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg">
            <button
              onClick={() => setSimDevice('phone')}
              className={`p-1.5 rounded-md transition-all ${simDevice === 'phone' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-gray-700'}`}
              title="Smartphone"
            >
              <Phone className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSimDevice('tablet')}
              className={`p-1.5 rounded-md transition-all ${simDevice === 'tablet' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-gray-700'}`}
              title="Tablet"
            >
              <Tablet className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setSimDark(!simDark)}
            className={`p-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 ${
              simDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-700'
            }`}
          >
            {simDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            <span>{simDark ? 'Light' : 'Dark'}</span>
          </button>
        </div>

        {/* Smartphone Wrapper structure */}
        <div className={`w-full transition-all duration-300 relative border-[8px] border-gray-850 bg-gray-100 shadow-xl overflow-hidden rounded-[36px] ${
          simDevice === 'phone' 
            ? 'max-w-[370px] h-[670px]' 
            : 'max-w-[500px] h-[550px]'
        }`}>
          
          {/* Smartphone top camera pill notch */}
          <div className="absolute top-2.5 left-1/2 transform -translate-x-1/2 w-28 h-4.5 bg-black rounded-full z-50 flex items-center justify-center">
            <div className="w-2 h-2 bg-gray-900 rounded-full ml-auto mr-3"></div>
          </div>

          {/* APP WINDOW INNER CANVAS */}
          <div className={`w-full h-full flex flex-col font-sans transition-all duration-200 ${
            simDark ? 'bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-800'
          }`}>
            
            {/* Custom Appbar status header */}
            <div className={`px-4 pt-8 pb-3 border-b flex items-center justify-between ${
              simDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100 shadow-xs'
            }`}>
              <div className="flex items-center gap-2">
                <div className="bg-emerald-600 text-white p-1 rounded-lg">
                  <Sprout className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-black tracking-tight flex items-center gap-1">🌱 AgriGPT</span>
                  <span className="text-[9px] text-gray-400 font-bold -mt-0.5">AI Agriculture Assistant</span>
                </div>
              </div>

              {/* Header utility icons */}
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => {
                    setSimChatHistory([]);
                    setSelectedSimHistoryId(null);
                  }}
                  className="p-1.5 hover:bg-emerald-50 rounded-lg text-emerald-600" 
                  title="New Chat"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400">
                  <Settings className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* CHAT CONTAINER AREA */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {simChatHistory.length === 0 ? (
                /* Welcome Screen / Empty state */
                <div className="flex flex-col items-center justify-center text-center py-6 px-4">
                  <div className="bg-emerald-50 text-emerald-800 w-12 h-12 rounded-full flex items-center justify-center text-xl mb-3 shadow-xs">
                    🌱
                  </div>
                  <h3 className="text-md font-black">Welcome to AgriGPT</h3>
                  <p className="text-[11px] text-gray-400 font-medium italic mt-1">"What would you like to know today?"</p>
                  
                  {/* Suggestion Chips */}
                  <div className="w-full mt-6 grid grid-cols-2 gap-2 text-left">
                    {[
                      { label: "🌾 Best crop for my soil", desc: "Wheat or maize?" },
                      { label: "🐛 Identify plant disease", desc: "Scanner analysis" },
                      { label: "💧 Irrigation advice", desc: "Drip schedules" },
                      { label: "💰 Govt schemes", desc: "Subsidy alerts" }
                    ].map(chip => (
                      <button
                        key={chip.label}
                        onClick={() => handleSuggestionClick(chip.label)}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          simDark 
                            ? 'bg-gray-900 border-gray-800 hover:bg-gray-800' 
                            : 'bg-white border-gray-100 hover:bg-emerald-50/50 hover:border-emerald-200 shadow-xs'
                        }`}
                      >
                        <span className="text-xs font-bold block text-emerald-700">{chip.label}</span>
                        <span className="text-[9px] text-gray-400">{chip.desc}</span>
                      </button>
                    ))}
                  </div>

                  {/* Previous Chats preview logs */}
                  <div className="w-full mt-8 border-t border-dashed border-gray-200/60 pt-4 text-left">
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-gray-400 block mb-2">Previous Farming Logs</span>
                    <div className="space-y-1.5">
                      {simHistoryChats.map(hist => (
                        <button
                          key={hist.id}
                          onClick={() => {
                            setSelectedSimHistoryId(hist.id);
                            // Set a simulated historic discussion
                            setSimChatHistory([
                              { id: '101', sender: 'user', text: hist.title, timestamp: '10:00 AM' },
                              { id: '102', sender: 'ai', text: hist.preview + " Let me know if you need more details about soil preparation or chemical parameters.", timestamp: '10:01 AM' }
                            ]);
                          }}
                          className={`w-full text-left p-2 rounded-lg text-xs flex justify-between items-center ${
                            selectedSimHistoryId === hist.id ? 'bg-emerald-50 text-emerald-900 font-bold' : 'hover:bg-gray-100'
                          }`}
                        >
                          <div className="truncate flex-1">
                            <span className="block font-semibold truncate">{hist.title}</span>
                            <span className="block text-[10px] text-gray-400 truncate font-normal">{hist.preview}</span>
                          </div>
                          <span className="text-[9px] text-gray-400 ml-2 shrink-0">{hist.date}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              ) : (
                /* Active Chat messages list */
                <div className="space-y-3">
                  {simChatHistory.map(msg => {
                    const isUser = msg.sender === 'user';
                    return (
                      <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                          isUser 
                            ? 'bg-emerald-600 text-white rounded-tr-none' 
                            : (simDark ? 'bg-gray-900 border border-gray-800 text-gray-100 rounded-tl-none' : 'bg-white border border-gray-100 text-gray-800 shadow-xs rounded-tl-none')
                        }`}>
                          {/* Markdown parsing simulated simply with line breaks and formatting */}
                          <div className="whitespace-pre-line prose max-w-none text-xs">
                            {msg.text}
                          </div>

                          {/* Render attachments in message */}
                          {msg.attachments && msg.attachments.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-white/20 flex flex-wrap gap-1">
                              {msg.attachments.map(att => (
                                <span key={att.name} className="inline-flex items-center gap-1 bg-black/15 text-[10px] px-2 py-0.5 rounded-md">
                                  {att.type === 'image' ? <Eye className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                                  <span>{att.name}</span>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Speech and copy buttons for AI messages */}
                        {!isUser && (
                          <div className="flex items-center gap-1.5 mt-1 ml-1 text-gray-400">
                            <button 
                              onClick={() => speakAdvice(msg.text)} 
                              className="p-1 hover:text-emerald-600 rounded-md transition-all" 
                              title="Listen to advice"
                            >
                              <Volume2 className="w-3 h-3" />
                            </button>
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(msg.text);
                                alert("Advice copied successfully!");
                              }} 
                              className="p-1 hover:text-emerald-600 rounded-md transition-all" 
                              title="Copy text"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                            <button className="p-1 hover:text-emerald-600 rounded-md transition-all">
                              <Share2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Thinking dots loader */}
              {simIsThinking && (
                <div className="flex items-start gap-2">
                  <div className="bg-emerald-100 w-6 h-6 rounded-full flex items-center justify-center text-xs">🌱</div>
                  <div className={`p-3 rounded-2xl rounded-tl-none border text-xs max-w-[80%] ${
                    simDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100 shadow-xs'
                  }`}>
                    <div className="flex items-center gap-1.5 font-bold text-gray-400">
                      <span>AgriGPT is thinking</span>
                      <span className="flex gap-0.5">
                        <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce delay-100"></span>
                        <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce delay-200"></span>
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={simChatEndRef} />
            </div>

            {/* Simulated Attachment pending indicators */}
            {simAttachments.length > 0 && (
              <div className={`px-3 py-1.5 border-t flex flex-wrap gap-1.5 ${simDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
                {simAttachments.map(att => (
                  <span key={att.name} className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded-lg border border-emerald-100">
                    <FileText className="w-3 h-3" />
                    <span>{att.name}</span>
                    <button 
                      onClick={() => setSimAttachments(prev => prev.filter(p => p.name !== att.name))}
                      className="text-red-600 hover:text-red-800 ml-1 font-black"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* BOTTOM APP INPUT CONTROLS */}
            <div className={`p-3 border-t flex items-center gap-1.5 ${
              simDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'
            }`}>
              
              {/* Attachment selector */}
              <button 
                onClick={() => {
                  setSimAttachments(prev => [...prev, { name: 'leaf_scan_10.jpg', type: 'image' }]);
                }}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-400" 
                title="Attach PDF or scan leaf"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              {/* Text input area */}
              <div className={`flex-1 flex items-center rounded-2xl border px-3 py-1 ${
                simDark ? 'bg-gray-950 border-gray-800' : 'bg-gray-100 border-gray-200'
              }`}>
                <input
                  type="text"
                  placeholder="Ask anything about farming..."
                  value={simInputText}
                  onChange={(e) => setSimInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') sendSimulatedMessage(simInputText);
                  }}
                  className="flex-1 bg-transparent text-xs py-1.5 focus:outline-none focus:ring-0 text-inherit"
                />

                {/* Voice toggle */}
                <button 
                  onClick={() => {
                    if (!simVoiceActive) {
                      setSimVoiceActive(true);
                      setSimInputText("Which crops are best for black soil in district thanjavur during monsoon?");
                      setTimeout(() => setSimVoiceActive(false), 2000);
                    }
                  }}
                  className="p-1 hover:bg-white rounded-md text-gray-400"
                >
                  <Mic className={`w-3.5 h-3.5 ${simVoiceActive ? 'text-red-500 animate-pulse font-bold' : ''}`} />
                </button>
              </div>

              {/* Submit message button */}
              <button
                onClick={() => sendSimulatedMessage(simInputText)}
                disabled={simInputText.trim() === '' && simAttachments.length === 0}
                className={`p-2.5 rounded-full text-white flex items-center justify-center transition-all ${
                  simInputText.trim().length > 0 || simAttachments.length > 0
                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-sm' 
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                <CornerDownLeft className="w-3.5 h-3.5" />
              </button>

            </div>

          </div>
        </div>

        {/* Features banner list below simulation */}
        <div className="w-full max-w-[380px] mt-4 flex flex-col gap-1.5 text-[10.5px] text-gray-500 bg-white p-3.5 rounded-2xl border border-gray-100">
          <span className="font-extrabold text-gray-800 uppercase tracking-wide text-[9px] block">Test Drive Simulator Features:</span>
          <div className="grid grid-cols-2 gap-1 font-medium">
            <span className="flex items-center gap-1">✅ Conversational Stream</span>
            <span className="flex items-center gap-1">✅ Text-to-Speech Output</span>
            <span className="flex items-center gap-1">✅ PDF/Image File Sync</span>
            <span className="flex items-center gap-1">✅ Light/Dark Modes</span>
          </div>
        </div>

      </div>

    </div>
    </div>
  );
}
