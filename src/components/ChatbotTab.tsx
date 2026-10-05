import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, ChatMessage, SavedItem, RecentActivity } from '../types';
import { 
  Send, Mic, MicOff, Volume2, VolumeX, Save, Trash2, 
  Sparkles, ShieldAlert, Wifi, WifiOff, RefreshCw, BookmarkCheck,
  Copy, Check, Sprout, Bot, User, CornerDownLeft, Info,
  Search, Sun, Moon, ThumbsUp, ThumbsDown, Plus, Menu, X,
  Paperclip, Image, Camera, FileText, Share2, AlertTriangle, ArrowRight, RotateCcw, StopCircle
} from 'lucide-react';
import voiceController, { LANGUAGE_CODES } from '../lib/voice';

interface ChatbotTabProps {
  userProfile: UserProfile;
  isEasyMode: boolean;
  isOffline: boolean;
  onSaveItem: (item: Omit<SavedItem, 'id' | 'timestamp'>) => void;
  onLogActivity?: (activity: RecentActivity) => void;
}

interface ChatSession {
  id: string;
  title: string;
  timestamp: string;
  messages: ChatMessage[];
}

const SUGGESTED_PROMPTS = [
  {
    category: "Crop Recommendation",
    icon: "🌾",
    title: "Best Crop for My Land",
    desc: "Ask AI which crop suits your specific land.",
    prompt: "Which crop is best for my land?"
  },
  {
    category: "Fertilizer Guide",
    icon: "🌱",
    title: "Fertilizer for Tomato",
    desc: "Get fertilizer recommendations for tomato.",
    prompt: "Which fertilizer is best for tomato?"
  },
  {
    category: "Disease Treatment",
    icon: "🐛",
    title: "Plant Disease Cure",
    desc: "Symptoms, causes, organic & chemical cure.",
    prompt: "What is the cause and treatment for black spots on tomato leaves?"
  },
  {
    category: "Govt Schemes",
    icon: "🚜",
    title: "PM-KISAN Scheme",
    desc: "Eligibility, benefits, and how to apply.",
    prompt: "Explain the PM-KISAN scheme benefits, eligibility criteria, and how to apply."
  },
  {
    category: "Agri Business",
    icon: "💼",
    title: "Agri Business Ideas",
    desc: "Investment, expected profit & resources.",
    prompt: "Suggest high profit agriculture business ideas with low investment."
  },
  {
    category: "General Knowledge",
    icon: "💡",
    title: "General Knowledge",
    desc: "Math, Science, Coding, or History questions.",
    prompt: "Explain how photosynthesis works in plants in simple terms."
  }
];

export default function ChatbotTab({ 
  userProfile, 
  isEasyMode, 
  isOffline, 
  onSaveItem,
  onLogActivity
}: ChatbotTabProps) {
  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(isEasyMode);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [savedSuccessId, setSavedSuccessId] = useState<string | null>(null);

  // ChatGPT/Claude style properties
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [feedbackState, setFeedbackState] = useState<Record<string, 'like' | 'dislike' | null>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>('current-session');
  
  // File uploads
  const [attachedFiles, setAttachedFiles] = useState<{ 
    name: string; 
    type: 'image' | 'pdf' | 'doc'; 
    base64?: string; 
    mimeType?: string; 
  }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Scroll to bottom on new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle Easy Mode automatic setting change
  useEffect(() => {
    setAutoSpeak(isEasyMode);
  }, [isEasyMode]);

  // Load welcome message
  useEffect(() => {
    const welcomeText = isEasyMode
      ? `Hello ${userProfile.name || 'friend'}. I am AgriVerse AI, India's most intelligent Agriculture Assistant. Touch the big green microphone button at the bottom and speak your question. I will read the answer out loud to you!`
      : `Hello ${userProfile.name || 'Farmer'}! I am AgriVerse AI (AgriGPT), your smart farming companion. How can I assist you today? Feel free to ask about crop choices, soil diagnosis, weather parameters, natural pesticides, or click "Get Crop" to let me run an in-depth profile search!`;
    
    const initialMsgs = [
      {
        id: 'welcome-msg',
        sender: 'ai' as const,
        text: welcomeText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ];
    setMessages(initialMsgs);

    // Initial session setup
    setSessions([
      {
        id: 'current-session',
        title: 'New Agriculture Consultation',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        messages: initialMsgs
      }
    ]);

    if (isEasyMode) {
      voiceController.speak(welcomeText, userProfile.preferredLanguage);
    }

    return () => {
      voiceController.stop();
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Voice speech playback states
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSpeechPaused, setIsSpeechPaused] = useState(false);
  const [speakingText, setSpeakingText] = useState('');

  // Translation dropdown state per message
  const [translatingMsgId, setTranslatingMsgId] = useState<string | null>(null);
  const [openTranslateMenuId, setOpenTranslateMenuId] = useState<string | null>(null);

  // Set up speech recognition with interruption support
  const startSpeechRecognition = () => {
    // Interruption support: if AI is currently speaking, immediately stop voice TTS and start microphone listening
    if (window.speechSynthesis.speaking) {
      voiceController.stop();
      setIsSpeaking(false);
      setIsSpeechPaused(false);
    }

    if (isRecording) {
      stopSpeechRecognition();
      return;
    }

    voiceController.stop(); // Stop any reading aloud
    
    const recognition = voiceController.getSpeechRecognition(
      (transcript) => {
        setInputText(transcript);
        handleSendMessage(transcript);
      },
      () => {
        setIsRecording(false);
      },
      (error) => {
        console.error('Speech recognition error:', error);
        setIsRecording(false);
      }
    );

    if (recognition) {
      recognition.lang = LANGUAGE_CODES[userProfile.preferredLanguage] || 'en-IN';
      recognitionRef.current = recognition;
      setIsRecording(true);
      recognition.start();
    } else {
      alert('Speech-to-text is not supported on this browser context. Please type your query.');
    }
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  // Voice playback controls: Speak, Pause, Resume, Stop
  const speakTextWithControls = (text: string, msgId?: string) => {
    voiceController.stop();
    voiceController.speak(text, userProfile.preferredLanguage);
    setIsSpeaking(true);
    setIsSpeechPaused(false);
    setSpeakingText(text);
    if (msgId) setSpeakingMsgId(msgId);

    const checkInterval = setInterval(() => {
      if (!window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        setIsSpeaking(false);
        setIsSpeechPaused(false);
        setSpeakingMsgId(null);
        clearInterval(checkInterval);
      }
    }, 500);
  };

  const handlePauseVoice = () => {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setIsSpeechPaused(true);
    }
  };

  const handleResumeVoice = () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsSpeechPaused(false);
    }
  };

  const handleStopVoice = () => {
    voiceController.stop();
    setIsSpeaking(false);
    setIsSpeechPaused(false);
    setSpeakingMsgId(null);
  };

  // Speak specific message text
  const handleToggleSpeakMessage = (msgId: string, text: string) => {
    if (speakingMsgId === msgId && isSpeaking) {
      handleStopVoice();
    } else {
      speakTextWithControls(text, msgId);
    }
  };

  // Translate specific message into target language
  const handleTranslateMessage = async (msgId: string, targetLanguage: string) => {
    setTranslatingMsgId(msgId);
    setOpenTranslateMenuId(null);

    const targetMsg = messages.find(m => m.id === msgId);
    if (!targetMsg) {
      setTranslatingMsgId(null);
      return;
    }

    const textToTranslate = targetMsg.originalText || targetMsg.text;

    try {
      const response = await fetch('/api/gemini/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToTranslate,
          targetLanguage
        })
      });

      if (!response.ok) throw new Error('Translation failed');
      const data = await response.json();

      setMessages(prev => prev.map(m => {
        if (m.id === msgId) {
          return {
            ...m,
            originalText: m.originalText || m.text,
            text: data.translatedText || textToTranslate,
            translatedLang: targetLanguage,
            isTranslating: false
          };
        }
        return m;
      }));
    } catch (e) {
      console.error('Translation error:', e);
    } finally {
      setTranslatingMsgId(null);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query && attachedFiles.length === 0) return;

    // Reset input and clear files
    setInputText('');
    const filesToUpload = [...attachedFiles];
    setAttachedFiles([]);
    stopSpeechRecognition();

    // Create prompt representation including files
    let queryWithFiles = query;
    if (filesToUpload.length > 0) {
      const fileNames = filesToUpload.map(f => `${f.type === 'image' ? '🖼️' : '📎'} ${f.name}`).join(', ');
      queryWithFiles = `${query} [Attached: ${fileNames}]`;
    }

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      text: queryWithFiles,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Update state synchronously
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);

    if (onLogActivity) {
      onLogActivity({
        id: `act-${Date.now()}`,
        title: `AI Chat: "${query.slice(0, 28)}${query.length > 28 ? '...' : ''}"`,
        subtitle: `Gemini Agriculture Assistant`,
        type: 'advisory',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tabTarget: 'chat'
      });
    }

    // Update session title dynamically if it's the first real question
    if (sessions.length > 0) {
      setSessions(prev => prev.map(s => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            title: s.title === 'New Agriculture Consultation' ? query.substring(0, 30) + '...' : s.title,
            messages: updatedMessages
          };
        }
        return s;
      }));
    }

    if (isOffline) {
      setIsLoading(true);
      setTimeout(() => {
        const offlineReply = `I am currently in Offline Mode because you have simulated No Internet. 
You can read your saved guides, templates, and lessons. To consult with me using live AI, please toggle "Simulated Offline" to "Connected" at the top of your dashboard.`;
        
        const aiMsg: ChatMessage = {
          id: `msg-${Date.now()}-ai`,
          sender: 'ai',
          text: offlineReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(prev => [...prev, aiMsg]);
        setIsLoading(false);

        if (autoSpeak) {
          voiceController.speak(offlineReply, userProfile.preferredLanguage);
        }
      }, 800);
      return;
    }

    setIsLoading(true);
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: abortControllerRef.current.signal,
        body: JSON.stringify({
          messages: updatedMessages,
          userProfile,
          attachments: filesToUpload
        }),
      });

      if (!response.ok) {
        throw new Error('Could not get response from AgriVerse AI. Please check your network or API key configuration.');
      }

      const data = await response.json();
      
      const aiMsg: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        sender: 'ai',
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        followUpQuestions: data.followUpQuestions || []
      };

      setMessages(prev => {
        const nextMsgs = [...prev, aiMsg];
        // Save back to sessions
        setSessions(sPrev => sPrev.map(s => s.id === activeSessionId ? { ...s, messages: nextMsgs } : s));
        return nextMsgs;
      });

      if (autoSpeak) {
        speakTextWithControls(data.text, aiMsg.id);
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        const stoppedMsg: ChatMessage = {
          id: `msg-${Date.now()}-aborted`,
          sender: 'ai',
          text: `🛑 Response generation stopped by user.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(prev => [...prev, stoppedMsg]);
      } else {
        const errMsg: ChatMessage = {
          id: `msg-${Date.now()}-error`,
          sender: 'ai',
          text: `⚠️ Error: ${error.message || 'Server connection failed.'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(prev => [...prev, errMsg]);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
    }
  };

  const handleRegenerateResponse = async () => {
    if (messages.length < 2 || isLoading) return;
    
    // Find last user message
    const lastUserMessageIdx = [...messages].reverse().findIndex(m => m.sender === 'user');
    if (lastUserMessageIdx === -1) return;

    const actualIdx = messages.length - 1 - lastUserMessageIdx;
    const cleanHistory = messages.slice(0, actualIdx + 1);

    setMessages(cleanHistory);
    setIsLoading(true);
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: abortControllerRef.current.signal,
        body: JSON.stringify({
          messages: cleanHistory,
          userProfile
        }),
      });

      if (!response.ok) {
        throw new Error('Could not get response from AgriVerse AI.');
      }

      const data = await response.json();
      
      const aiMsg: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        sender: 'ai',
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => {
        const nextMsgs = [...prev, aiMsg];
        setSessions(sPrev => sPrev.map(s => s.id === activeSessionId ? { ...s, messages: nextMsgs } : s));
        return nextMsgs;
      });

      if (autoSpeak) {
        voiceController.speak(data.text, userProfile.preferredLanguage);
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        const errMsg: ChatMessage = {
          id: `msg-${Date.now()}-error`,
          sender: 'ai',
          text: `⚠️ Error: ${error.message || 'Server connection failed.'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(prev => [...prev, errMsg]);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleCreateNewSession = () => {
    voiceController.stop();
    const newSessionId = `session-${Date.now()}`;
    const welcomeText = isEasyMode
      ? `Hello ${userProfile.name || 'friend'}. I am AgriVerse AI. Tap the big mic to ask me a question.`
      : `Hello ${userProfile.name || 'Farmer'}! This is a new consultation session. How can AgriVerse AI (AgriGPT) assist you now?`;

    const initialMsgs = [
      {
        id: `welcome-${Date.now()}`,
        sender: 'ai' as const,
        text: welcomeText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ];

    const newSession: ChatSession = {
      id: newSessionId,
      title: 'New Agriculture Consultation',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      messages: initialMsgs
    };

    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSessionId);
    setMessages(initialMsgs);
  };

  const handleSelectSession = (sid: string) => {
    voiceController.stop();
    const selected = sessions.find(s => s.id === sid);
    if (selected) {
      setActiveSessionId(sid);
      setMessages(selected.messages);
    }
  };

  const handleClearChat = () => {
    if (confirm('Do you want to clear your conversation history?')) {
      const welcomeText = isEasyMode
        ? `Hello ${userProfile.name || 'friend'}. I am AgriVerse AI. Touch the mic and ask me anything!`
        : `Hello ${userProfile.name || 'Farmer'}! I am AgriVerse AI (AgriGPT). Ask me about crops, plant diseases, soil quality, fertilizers, or schemes.`;
      
      const resetMsgs = [
        {
          id: 'welcome-msg',
          sender: 'ai' as const,
          text: welcomeText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ];

      setMessages(resetMsgs);
      setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, messages: resetMsgs } : s));
      voiceController.stop();
    }
  };

  const handleSaveMessageOffline = (msg: ChatMessage) => {
    onSaveItem({
      type: 'chat',
      title: `Saved Advice: ${msg.text.substring(0, 35)}...`,
      data: { messages: [msg] }
    });
    setSavedSuccessId(msg.id);
    voiceController.speakInstruction('save_success', userProfile.preferredLanguage);
    setTimeout(() => setSavedSuccessId(null), 2500);
  };

  const handleCopyToClipboard = (msg: ChatMessage) => {
    navigator.clipboard.writeText(msg.text).then(() => {
      setCopiedMsgId(msg.id);
      setTimeout(() => setCopiedMsgId(null), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  const handleShareMessage = (msg: ChatMessage) => {
    if (navigator.share) {
      navigator.share({
        title: 'AgriVerse AI Expert Advice',
        text: msg.text,
      }).catch(err => console.log(err));
    } else {
      alert('Sharing is not supported on this device. Copied to clipboard instead!');
      handleCopyToClipboard(msg);
    }
  };

  const handleLikeDislike = (msgId: string, status: 'like' | 'dislike') => {
    setFeedbackState(prev => ({
      ...prev,
      [msgId]: prev[msgId] === status ? null : status
    }));
  };

  // Mock File Upload Triggers
  const triggerDocUpload = () => {
    fileInputRef.current?.click();
  };

  const triggerImageUpload = () => {
    imageInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'pdf') => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const commaIdx = result.indexOf(',');
        const base64 = commaIdx > -1 ? result.substring(commaIdx + 1) : result;
        const mimeType = file.type || (type === 'image' ? 'image/jpeg' : 'application/pdf');

        const newFile = {
          name: file.name,
          type: type === 'image' ? ('image' as const) : ('pdf' as const),
          base64,
          mimeType
        };
        setAttachedFiles(prev => [...prev, newFile]);
      };
      reader.readAsDataURL(file);
    }
  };

  // Custom visual markdown-like text processor supporting multi-step emoji prefixes and cards
  const renderMessageContent = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];

    const parseInlineStyles = (txt: string) => {
      const parts = txt.split(/(\*\*.*?\*\*)/g);
      return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={index} className={`font-extrabold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });
    };

    lines.forEach((line, idx) => {
      const trimmed = line.trim();

      if (trimmed === '') {
        elements.push(<div key={`space-${idx}`} className="h-3" />);
        return;
      }

      // Large custom sections (🌱 Answer, 📖 Explanation, etc.)
      if (trimmed.startsWith('🌱 ') || trimmed.startsWith('🌱Answer')) {
        elements.push(
          <div key={`ans-${idx}`} className={`p-4 rounded-xl border-l-4 border-emerald-500 my-3 font-semibold ${isDarkMode ? 'bg-emerald-950/20 text-emerald-100' : 'bg-emerald-50/40 text-emerald-900'}`}>
            <span className="text-base font-black flex items-center gap-1.5 mb-1">🌱 Answer</span>
            <div className="text-sm font-medium">{parseInlineStyles(trimmed.replace(/^🌱\s*(Answer)?\s*/, ''))}</div>
          </div>
        );
        return;
      }

      if (trimmed.startsWith('📖 ') || trimmed.startsWith('📖Explanation')) {
        elements.push(
          <div key={`exp-${idx}`} className={`p-4 rounded-xl border-l-4 border-blue-500 my-3 font-semibold ${isDarkMode ? 'bg-blue-950/20 text-blue-100' : 'bg-blue-50/40 text-blue-900'}`}>
            <span className="text-base font-black flex items-center gap-1.5 mb-1">📖 Explanation</span>
            <div className="text-sm font-medium">{parseInlineStyles(trimmed.replace(/^📖\s*(Explanation)?\s*/, ''))}</div>
          </div>
        );
        return;
      }

      if (trimmed.startsWith('✅ ') || trimmed.startsWith('✅Steps')) {
        elements.push(
          <div key={`step-${idx}`} className="mt-4 mb-1">
            <span className="text-base font-black text-emerald-600 flex items-center gap-1.5">✅ Steps to Follow</span>
            <p className="text-xs text-gray-400 mt-0.5">{parseInlineStyles(trimmed.replace(/^✅\s*(Steps to Follow)?\s*/, ''))}</p>
          </div>
        );
        return;
      }

      if (trimmed.startsWith('⚠️ ') || trimmed.startsWith('⚠️Precautions')) {
        elements.push(
          <div key={`prec-${idx}`} className={`p-4 rounded-xl border-l-4 border-amber-500 my-3 font-semibold ${isDarkMode ? 'bg-amber-950/20 text-amber-100' : 'bg-amber-50/40 text-amber-900'}`}>
            <span className="text-sm font-black flex items-center gap-1.5 mb-1 text-amber-600">⚠️ Precautions</span>
            <div className="text-sm font-medium">{parseInlineStyles(trimmed.replace(/^⚠️\s*(Precautions)?\s*/, ''))}</div>
          </div>
        );
        return;
      }

      if (trimmed.startsWith('💡 ') || trimmed.startsWith('💡Additional Tips') || trimmed.startsWith('💡Tips')) {
        elements.push(
          <div key={`tips-${idx}`} className={`p-4 rounded-xl border-l-4 border-purple-500 my-3 font-semibold ${isDarkMode ? 'bg-purple-950/20 text-purple-100' : 'bg-purple-50/40 text-purple-900'}`}>
            <span className="text-sm font-black flex items-center gap-1.5 mb-1 text-purple-600">💡 Additional Tips</span>
            <div className="text-sm font-medium">{parseInlineStyles(trimmed.replace(/^💡\s*(Additional Tips|Tips)?\s*/, ''))}</div>
          </div>
        );
        return;
      }

      // Check markdown headings
      if (trimmed.startsWith('### ')) {
        elements.push(<h4 key={`h3-${idx}`} className={`text-sm font-extrabold mt-4 mb-1.5 tracking-tight ${isDarkMode ? 'text-emerald-300' : 'text-emerald-900'}`}>{parseInlineStyles(trimmed.slice(4))}</h4>);
        return;
      }
      if (trimmed.startsWith('## ')) {
        elements.push(<h3 key={`h2-${idx}`} className={`text-base font-black mt-5 mb-2 tracking-tight ${isDarkMode ? 'text-emerald-100' : 'text-emerald-950'}`}>{parseInlineStyles(trimmed.slice(3))}</h3>);
        return;
      }
      if (trimmed.startsWith('# ')) {
        elements.push(<h2 key={`h1-${idx}`} className={`text-lg font-black mt-6 mb-2.5 border-b pb-1 tracking-tight ${isDarkMode ? 'text-white border-emerald-900' : 'text-emerald-950 border-emerald-100'}`}>{parseInlineStyles(trimmed.slice(2))}</h2>);
        return;
      }

      // Bullet and standard lists
      if (trimmed.startsWith('• ') || trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        elements.push(
          <div key={`bullet-${idx}`} className="flex items-start gap-2 ml-2 my-1">
            <span className="text-emerald-500 text-xs shrink-0 mt-1.5">•</span>
            <span className={`text-sm leading-relaxed font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{parseInlineStyles(trimmed.substring(2))}</span>
          </div>
        );
        return;
      }

      // Numbered list items
      const numberedMatch = trimmed.match(/^(\d+)\.\s(.*)/);
      if (numberedMatch) {
        elements.push(
          <div key={`num-${idx}`} className="flex items-start gap-2.5 ml-2 my-1.5">
            <span className={`rounded-md w-5 h-5 flex items-center justify-center font-black text-[10px] shrink-0 mt-0.5 border ${
              isDarkMode 
                ? 'bg-emerald-950/50 text-emerald-300 border-emerald-800/40' 
                : 'bg-emerald-50 text-emerald-800 border-emerald-100/40'
            }`}>
              {numberedMatch[1]}
            </span>
            <span className={`text-sm leading-relaxed font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{parseInlineStyles(numberedMatch[2])}</span>
          </div>
        );
        return;
      }

      // Simple paragraphs
      elements.push(
        <p key={`p-${idx}`} className={`text-sm leading-relaxed font-medium my-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {parseInlineStyles(line)}
        </p>
      );
    });

    return <div className="space-y-1">{elements}</div>;
  };

  // Filter sessions by search term
  const filteredSessions = sessions.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.messages.some(m => m.text.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div id="agrigpt-tab" className={`flex h-[720px] rounded-2xl border overflow-hidden shadow-md transition-all duration-300 ${
      isDarkMode ? 'bg-[#0f172a] border-[#1e293b]' : 'bg-[#fcfdfc] border-gray-100'
    }`}>
      
      {/* 1. COLLAPSIBLE CHAT HISTORY SIDEBAR (ChatGPT style) */}
      {isSidebarOpen && (
        <div className={`w-80 flex flex-col shrink-0 border-r transition-all duration-300 ${
          isDarkMode ? 'bg-[#0b0f19] border-[#1e293b]' : 'bg-gray-50/70 border-gray-100'
        }`}>
          
          {/* New Chat Button */}
          <div className="p-4 border-b border-transparent flex gap-2">
            <button
              id="new-chat-btn"
              onClick={handleCreateNewSession}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-xs transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" /> New Consultation
            </button>
            <button
              id="sidebar-toggle-btn"
              onClick={() => setIsSidebarOpen(false)}
              className={`p-2.5 rounded-xl border transition-all ${
                isDarkMode ? 'border-[#334155] hover:bg-[#1e293b] text-gray-400' : 'border-gray-200 hover:bg-white text-gray-500'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search sessions */}
          <div className="px-4 pb-3">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-gray-400 absolute left-3" />
              <input
                id="session-search-input"
                type="text"
                placeholder="Search consults..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full text-xs rounded-xl pl-9 pr-4 py-2.5 outline-none font-bold transition-all ${
                  isDarkMode 
                    ? 'bg-[#1e293b] text-white placeholder-gray-500 focus:bg-[#334155]' 
                    : 'bg-white text-gray-800 placeholder-gray-400 border border-gray-100 focus:border-emerald-300'
                }`}
              />
            </div>
          </div>

          {/* Session List */}
          <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1 scrollbar-thin">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider px-3 py-1.5 block">Recent Queries</span>
            {filteredSessions.length === 0 ? (
              <div className="text-center py-6 text-xs text-gray-400">No matching consults.</div>
            ) : (
              filteredSessions.map((s) => (
                <button
                  id={`session-item-${s.id}`}
                  key={s.id}
                  onClick={() => handleSelectSession(s.id)}
                  className={`w-full text-left px-3 py-3 rounded-xl flex items-center justify-between transition-all group ${
                    activeSessionId === s.id
                      ? isDarkMode 
                        ? 'bg-emerald-950/30 text-emerald-300 border-l-4 border-emerald-500 font-bold' 
                        : 'bg-emerald-50 text-emerald-900 border-l-4 border-emerald-600 font-bold'
                      : isDarkMode
                        ? 'hover:bg-[#1e293b]/50 text-gray-400'
                        : 'hover:bg-white text-gray-600'
                  }`}
                >
                  <div className="truncate pr-2">
                    <span className="text-xs block truncate font-bold">{s.title}</span>
                    <span className="text-[10px] text-gray-400 block mt-0.5">{s.timestamp}</span>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isDarkMode ? 'bg-[#1e293b] text-gray-500' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {s.messages.length}
                  </span>
                </button>
              ))
            )}
          </div>
          
          {/* Version footer */}
          <div className={`p-4 border-t text-center text-[10px] font-bold text-gray-400 ${
            isDarkMode ? 'border-[#1e293b]' : 'border-gray-100'
          }`}>
            AgriGPT Engine • v1.5 Premium
          </div>
        </div>
      )}

      {/* 2. MAIN CONVERSATION WORKSPACE */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Workspace Premium Header */}
        <div className={`border-b px-4 py-3.5 flex items-center justify-between shadow-3xs ${
          isDarkMode ? 'bg-[#0f172a] border-[#1e293b]' : 'bg-white border-gray-100'
        }`}>
          <div className="flex items-center gap-3">
            {/* Show sidebar btn if hidden */}
            {!isSidebarOpen && (
              <button
                id="open-sidebar-btn"
                onClick={() => setIsSidebarOpen(true)}
                className={`p-2 rounded-xl border transition-all ${
                  isDarkMode ? 'border-[#334155] hover:bg-[#1e293b] text-gray-400' : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <Menu className="w-4 h-4" />
              </button>
            )}
            
            <div className="bg-emerald-600 w-9 h-9 rounded-xl text-white flex items-center justify-center shadow-xs">
              <Bot className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className={`font-black text-sm tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  AgriGPT
                </h3>
                <span className="text-[9px] bg-emerald-600 text-white font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-widest">
                  Assistant
                </span>
              </div>
              <p className="text-[10px] text-gray-400 font-bold flex items-center gap-1 mt-0.5">
                <span className={`inline-block w-1.5 h-1.5 rounded-full ${isOffline ? 'bg-amber-400' : 'bg-green-500'}`} />
                {isOffline ? 'Static Local Model Active' : `Connected — ${userProfile.preferredLanguage}`}
              </p>
            </div>
          </div>

          {/* Chat Toolbar Controls */}
          <div className="flex items-center gap-2">
            
            {/* Dark mode Toggle */}
            <button
              id="theme-toggle-btn"
              onClick={() => setIsDarkMode(prev => !prev)}
              className={`p-2 rounded-xl border transition-all ${
                isDarkMode 
                  ? 'bg-amber-950/20 border-amber-800 text-amber-400' 
                  : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
              }`}
              title="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Read Aloud Toggle */}
            <button
              id="autospeak-toggle-btn"
              onClick={() => {
                const speakNew = !autoSpeak;
                setAutoSpeak(speakNew);
                if (speakNew) {
                  voiceController.speak('Audio readout activated.', userProfile.preferredLanguage);
                } else {
                  voiceController.stop();
                }
              }}
              className={`p-2 rounded-xl transition-all border flex items-center gap-1 text-xs font-black ${
                autoSpeak 
                  ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
                  : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
              }`}
              title="Toggle Voice Read Aloud"
            >
              {autoSpeak ? <Volume2 className="w-4 h-4 text-emerald-700" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline text-[10px]">{autoSpeak ? 'Mute' : 'Speak'}</span>
            </button>

            {/* Clear history */}
            <button
              id="clear-chat-btn"
              onClick={handleClearChat}
              className="p-2 rounded-xl border border-gray-200 bg-white text-gray-400 hover:bg-red-50 hover:text-red-600 transition-all"
              title="Clear Session"
            >
              <Trash2 className="w-4 h-4" />
            </button>

          </div>
        </div>

        {/* Messages feed area */}
        <div className={`flex-1 overflow-y-auto scrollbar-thin ${
          isDarkMode ? 'bg-[#0f172a]' : 'bg-[#FAFBF9]'
        }`}>
          <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
            
            {messages.map((msg) => (
              <div
                id={`chat-msg-${msg.id}`}
                key={msg.id}
                className={`flex gap-4 items-start ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                {/* Left side Avatar for AI */}
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shrink-0 shadow-3xs mt-1">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}

                {/* Message block content container */}
                <div className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  
                  {/* Bubble body */}
                  <div
                    className={`rounded-2xl px-5 py-4 shadow-3xs ${
                      msg.sender === 'user'
                        ? 'bg-emerald-600 text-white rounded-tr-none font-medium'
                        : isDarkMode
                          ? 'bg-[#1e293b] text-gray-100 border border-[#334155] rounded-tl-none font-normal'
                          : 'bg-white text-gray-800 border border-gray-100/80 rounded-tl-none font-normal'
                    }`}
                  >
                    {msg.sender === 'user' ? (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap font-semibold">{msg.text}</p>
                    ) : (
                      <div className={isEasyMode ? 'text-base font-bold' : ''}>
                        {renderMessageContent(msg.text)}
                      </div>
                    )}

                    <div className={`mt-2.5 text-[9px] ${msg.sender === 'user' ? 'text-emerald-100 text-right' : 'text-gray-400'} font-semibold`}>
                      {msg.timestamp}
                    </div>
                  </div>

                  {/* Claude/ChatGPT inline toolbar feedback under AI messages */}
                  {msg.sender === 'ai' && msg.id !== 'welcome-msg' && (
                    <div className="flex flex-wrap items-center gap-2 mt-2 ml-1 text-gray-400">
                      
                      {/* Copy */}
                      <button
                        id={`copy-btn-${msg.id}`}
                        onClick={() => handleCopyToClipboard(msg)}
                        className="flex items-center gap-1 text-[11px] font-bold hover:text-emerald-700 transition-colors p-1"
                        title="Copy Response"
                      >
                        {copiedMsgId === msg.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-green-600" />
                            <span className="text-green-600 text-[10px]">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>

                      {/* TTS Speak */}
                      <button
                        id={`speak-msg-btn-${msg.id}`}
                        onClick={() => handleToggleSpeakMessage(msg.id, msg.text)}
                        className={`flex items-center gap-1 text-[11px] font-bold transition-colors p-1 ${
                          speakingMsgId === msg.id ? 'text-emerald-700 animate-pulse' : 'hover:text-emerald-700'
                        }`}
                        title="Read out loud"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{speakingMsgId === msg.id ? 'Stop' : 'Read'}</span>
                      </button>

                      {/* Multi-language Translation Dropdown */}
                      <div className="relative">
                        <button
                          id={`translate-btn-${msg.id}`}
                          onClick={() => setOpenTranslateMenuId(openTranslateMenuId === msg.id ? null : msg.id)}
                          className="flex items-center gap-1 text-[11px] font-bold hover:text-emerald-700 transition-colors p-1"
                          title="Translate Response"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          <span>{msg.translatedLang ? `Lang: ${msg.translatedLang}` : 'Translate'}</span>
                        </button>

                        {openTranslateMenuId === msg.id && (
                          <div className="absolute left-0 top-7 z-20 bg-white border border-gray-200 rounded-xl shadow-lg p-2 flex flex-col gap-1 min-w-[140px] animate-fade-in text-xs font-bold text-gray-700">
                            <span className="text-[10px] uppercase text-gray-400 px-2 py-0.5">Select Language</span>
                            {['English', 'Tamil', 'Hindi', 'Telugu', 'Kannada', 'Malayalam'].map((lang) => (
                              <button
                                key={lang}
                                onClick={() => handleTranslateMessage(msg.id, lang)}
                                className="text-left px-2 py-1.5 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                              >
                                {lang}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Save Offline */}
                      <button
                        id={`save-offline-btn-${msg.id}`}
                        onClick={() => handleSaveMessageOffline(msg)}
                        className={`flex items-center gap-1 text-[11px] font-bold transition-colors p-1 ${
                          savedSuccessId === msg.id ? 'text-green-600' : 'hover:text-emerald-700'
                        }`}
                        title="Save offline"
                      >
                        {savedSuccessId === msg.id ? (
                          <>
                            <BookmarkCheck className="w-3.5 h-3.5 text-green-600 animate-bounce" />
                            <span className="text-green-600 text-[10px]">Saved</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-3.5 h-3.5" />
                            <span>Save</span>
                          </>
                        )}
                      </button>

                      {/* Share */}
                      <button
                        id={`share-btn-${msg.id}`}
                        onClick={() => handleShareMessage(msg)}
                        className="flex items-center gap-1 text-[11px] font-bold hover:text-emerald-700 transition-colors p-1"
                        title="Share Advice"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Share</span>
                      </button>

                      <div className="h-3 w-px bg-gray-200 mx-1" />

                      {/* Thumbs up / Thumbs down feedback */}
                      <button
                        id={`like-btn-${msg.id}`}
                        onClick={() => handleLikeDislike(msg.id, 'like')}
                        className={`p-1 transition-colors ${
                          feedbackState[msg.id] === 'like' ? 'text-emerald-600' : 'hover:text-emerald-700'
                        }`}
                        title="Helpful response"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </button>

                      <button
                        id={`dislike-btn-${msg.id}`}
                        onClick={() => handleLikeDislike(msg.id, 'dislike')}
                        className={`p-1 transition-colors ${
                          feedbackState[msg.id] === 'dislike' ? 'text-red-600' : 'hover:text-red-600'
                        }`}
                        title="Incorrect or unhelpful"
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </button>

                    </div>
                  )}

                  {/* Render Follow-Up Smart Suggestions below latest AI message */}
                  {msg.sender === 'ai' && msg.followUpQuestions && msg.followUpQuestions.length > 0 && (
                    <div className="mt-3.5 space-y-2 animate-fade-in">
                      <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider block">
                        💡 Smart Follow-up Questions
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {msg.followUpQuestions.map((q, qIdx) => (
                          <button
                            key={qIdx}
                            onClick={() => {
                              setInputText(q);
                              handleSendMessage(q);
                            }}
                            className="text-xs bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-emerald-900 font-extrabold px-3 py-1.5 rounded-xl transition-all shadow-3xs flex items-center gap-1 text-left"
                          >
                            <span>{q}</span>
                            <ArrowRight className="w-3 h-3 text-emerald-600 shrink-0" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

                {/* Right side avatar for User */}
                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shrink-0 shadow-3xs mt-1">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}

            {/* Quick starter options */}
            {messages.length <= 1 && (
              <div className="pt-4 space-y-4">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block text-center">
                  🌾 Tap an option to prompt AgriGPT
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {SUGGESTED_PROMPTS.map((item, idx) => (
                    <button
                      id={`starter-card-btn-${idx}`}
                      key={idx}
                      onClick={() => {
                        setInputText(item.prompt);
                        handleSendMessage(item.prompt);
                      }}
                      className={`p-4 rounded-xl text-left transition-all hover:shadow-xs group cursor-pointer border ${
                        isDarkMode 
                          ? 'bg-[#1e293b]/50 hover:bg-[#334155]/20 border-[#334155] hover:border-emerald-700' 
                          : 'bg-white hover:bg-emerald-50/30 border-gray-100 hover:border-emerald-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <span className="text-base">{item.icon}</span>
                        <span className="text-xs font-black text-emerald-600 uppercase tracking-wider">
                          {item.category}
                        </span>
                      </div>
                      <h5 className={`text-xs font-black mb-0.5 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{item.title}</h5>
                      <p className="text-[11px] text-gray-400 group-hover:text-gray-500 font-semibold leading-relaxed">
                        {item.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Model Loading State with dynamic cancel button */}
            {isLoading && (
              <div className="flex gap-4 items-start justify-start animate-pulse">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-white animate-bounce" />
                </div>
                <div className={`rounded-2xl rounded-tl-none px-5 py-4 shadow-3xs flex flex-col sm:flex-row sm:items-center gap-4 border ${
                  isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-gray-100'
                }`}>
                  <div className="flex items-center gap-3">
                    <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
                    <span className="text-xs font-bold text-gray-500">AgriGPT is reasoning agricultural data...</span>
                  </div>
                  
                  {/* Cancel generating button */}
                  <button
                    id="stop-generation-btn"
                    onClick={handleStopGeneration}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 rounded-lg text-[11px] font-black transition-all border border-red-200"
                  >
                    <StopCircle className="w-3.5 h-3.5" /> Stop Generation
                  </button>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* ChatGPT style Input Deck */}
        <div className={`border-t px-4 py-5 shadow-sm shrink-0 ${
          isDarkMode ? 'bg-[#0f172a] border-[#1e293b]' : 'bg-white border-gray-100'
        }`}>
          <div className="max-w-3xl mx-auto space-y-3">
            
            {/* AI Voice Playback Control Banner when TTS is active */}
            {isSpeaking && (
              <div className="flex items-center justify-between bg-emerald-50 text-emerald-900 border border-emerald-200 px-4 py-2.5 rounded-2xl animate-fade-in shadow-xs">
                <div className="flex items-center gap-2.5">
                  <Volume2 className="w-4 h-4 text-emerald-600 animate-pulse" />
                  <span className="text-xs font-extrabold uppercase tracking-wide">
                    {isSpeechPaused ? 'AgriGPT Speech Paused' : 'AgriGPT is speaking...'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {isSpeechPaused ? (
                    <button
                      onClick={handleResumeVoice}
                      className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-xs font-extrabold hover:bg-emerald-700"
                    >
                      Resume
                    </button>
                  ) : (
                    <button
                      onClick={handlePauseVoice}
                      className="px-2.5 py-1 bg-amber-500 text-white rounded-lg text-xs font-extrabold hover:bg-amber-600"
                    >
                      Pause
                    </button>
                  )}
                  <button
                    onClick={handleStopVoice}
                    className="px-2.5 py-1 bg-red-500 text-white rounded-lg text-xs font-extrabold hover:bg-red-600"
                  >
                    Stop
                  </button>
                </div>
              </div>
            )}

            {/* Animated Listening Waveform Banner when mic is active */}
            {isRecording && (
              <div className="flex items-center justify-between bg-red-500/10 text-red-600 border border-red-200 px-4 py-2.5 rounded-2xl animate-fade-in">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-red-600 animate-ping" />
                  <span className="text-xs font-extrabold uppercase tracking-wide">Listening... Speak clearly now</span>
                </div>
                <div className="flex items-end gap-1 h-5">
                  <span className="w-1 bg-red-500 rounded-full h-3 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1 bg-red-600 rounded-full h-5 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1 bg-red-500 rounded-full h-2 animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="w-1 bg-red-600 rounded-full h-4.5 animate-bounce" style={{ animationDelay: '450ms' }} />
                  <span className="w-1 bg-red-500 rounded-full h-3 animate-bounce" style={{ animationDelay: '200ms' }} />
                </div>
              </div>
            )}

            {/* File attachments display row */}
            {attachedFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 pb-2">
                {attachedFiles.map((f, idx) => (
                  <span key={idx} className="bg-emerald-50 text-emerald-800 border border-emerald-100 text-[11px] font-extrabold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-3xs animate-fade-in">
                    {f.type === 'image' ? <Image className="w-3.5 h-3.5 text-emerald-600" /> : <FileText className="w-3.5 h-3.5 text-emerald-600" />}
                    <span>{f.name}</span>
                    <button 
                      onClick={() => setAttachedFiles(prev => prev.filter((_, i) => i !== idx))}
                      className="p-0.5 rounded-full hover:bg-emerald-200 text-emerald-600 ml-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Input & Microphone Core row */}
            <div className="flex items-center gap-3 relative">
              
              {/* LARGE VOICE MIC CAPTURE BUTTON */}
              <button
                id="mic-record-btn"
                onClick={startSpeechRecognition}
                className={`shrink-0 flex items-center justify-center rounded-2xl transition-all shadow-xs ${
                  isRecording 
                    ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse w-14 h-14' 
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white w-14 h-14'
                }`}
                title={isRecording ? 'Listening... click to stop' : 'Click to Speak (Speech-to-Text)'}
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                {isRecording && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-[8px] text-white rounded-full px-1.5 py-0.5 font-bold border-2 border-white">
                    REC
                  </span>
                )}
              </button>

              {/* Input Element & Submit Icon wrapper */}
              <div className="flex-1 relative flex items-center">
                
                {/* Simulated file triggers on left inside input */}
                <div className="absolute left-3.5 flex items-center gap-1.5 z-10">
                  <button
                    onClick={triggerImageUpload}
                    className="p-1 text-gray-400 hover:text-emerald-600 transition-colors"
                    title="Attach Plant Image"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                  <button
                    onClick={triggerDocUpload}
                    className="p-1 text-gray-400 hover:text-emerald-600 transition-colors"
                    title="Attach Soil PDF/DOC"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>
                </div>

                {/* Hidden input tags */}
                <input
                  type="file"
                  ref={imageInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, 'image')}
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".pdf,.docx,.doc"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, 'pdf')}
                />

                <input
                  id="chat-text-input"
                  type="text"
                  placeholder={
                    isRecording 
                      ? 'Listening... Speak clearly now' 
                      : isEasyMode 
                      ? 'Type your question here, or speak to me...' 
                      : 'Ask AgriGPT about crop health, diseases, soil pH...'
                  }
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendMessage();
                  }}
                  className={`w-full text-sm rounded-2xl pl-20 pr-14 py-4.5 outline-none font-bold transition-all ${
                    isDarkMode 
                      ? 'bg-[#1e293b] hover:bg-[#334155] border-[#334155] focus:border-emerald-500 focus:bg-[#0f172a] text-white placeholder-gray-500' 
                      : 'bg-gray-50/80 hover:bg-gray-50/100 border border-gray-100 focus:border-emerald-400 focus:bg-white text-gray-800 placeholder-gray-400'
                  }`}
                />

                {/* Submit / Send button on right side */}
                <button
                  id="send-chat-msg-btn"
                  onClick={() => handleSendMessage()}
                  disabled={(!inputText.trim() && attachedFiles.length === 0) || isRecording}
                  className={`absolute right-3 p-2.5 rounded-xl transition-all ${
                    (!inputText.trim() && attachedFiles.length === 0) || isRecording
                      ? 'text-gray-300 bg-transparent'
                      : 'text-white bg-emerald-600 hover:bg-emerald-700 shadow-3xs hover:scale-105 active:scale-95'
                  }`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* Quick action buttons row (Regenerate & Get Crop recommendation) */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-1.5">
                {messages.length > 1 && (
                  <button
                    id="regenerate-btn"
                    onClick={handleRegenerateResponse}
                    disabled={isLoading}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-black transition-all border ${
                      isDarkMode
                        ? 'border-[#334155] text-gray-300 hover:bg-[#1e293b]'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Regenerate Response
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold select-none">
                <Info className="w-3.5 h-3.5 text-gray-300" />
                <span>Verify specific chemical and fertilizer dosages with local agricultural offices.</span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
