import React, { useState, useEffect } from 'react';
import { UserProfile, SavedItem, FarmingReminder, FarmerNote, RecentActivity } from './types';
import voiceController from './lib/voice';
import { t, LanguageCode } from './lib/translations';

// Sub-components
import DashboardTab from './components/DashboardTab';
import RemindersTab from './components/RemindersTab';
import NotesTab from './components/NotesTab';
import ChatbotTab from './components/ChatbotTab';
import CropRecommendationTab from './components/CropRecommendationTab';
import CareerGuidanceTab from './components/CareerGuidanceTab';
import ImageAnalysisTab from './components/ImageAnalysisTab';
import GovtSchemesTab from './components/GovtSchemesTab';
import LearningCenterTab from './components/LearningCenterTab';
import OfflineCabinetTab from './components/OfflineCabinetTab';
import GetCropModal from './components/GetCropModal';
import FlutterTab from './components/FlutterTab';
import AndroidSplashScreen from './components/AndroidSplashScreen';
import AndroidPermissionsModal from './components/AndroidPermissionsModal';
import NetworkStatusBanner from './components/NetworkStatusBanner';
import AndroidMobileNavBar from './components/AndroidMobileNavBar';
import MobileTransferModal from './components/MobileTransferModal';

// Icons
import { 
  Sprout, Briefcase, Camera, Award, BookOpen, MessageSquare, 
  User, Home, FolderLock, LogOut, Check, ChevronRight, 
  HelpCircle, Volume2, Sparkles, LogIn, Mail, Phone, Lock,
  Smartphone, Bell, FileText, Sun, Moon, Globe
} from 'lucide-react';

const DEFAULT_RECENT_ACTIVITIES: RecentActivity[] = [
  {
    id: 'act-init-1',
    title: 'AI Disease Detector: Tomato Early Blight',
    subtitle: 'Severity: Moderate • Part: LEAF',
    type: 'disease',
    timestamp: 'Today, 08:30 AM',
    tabTarget: 'analysis'
  },
  {
    id: 'act-init-2',
    title: 'Govt Scheme: PM-KISAN Samman Nidhi',
    subtitle: '₹6,000/Year Income Support • Direct Bank Transfer',
    type: 'scheme',
    timestamp: 'Today, 08:15 AM',
    tabTarget: 'schemes'
  },
  {
    id: 'act-init-3',
    title: 'Crop Advisory: Clay Soil & Paddy',
    subtitle: 'Recommended Crop: CO 51 Rice Variety',
    type: 'advisory',
    timestamp: 'Yesterday, 05:40 PM',
    tabTarget: 'crop'
  },
  {
    id: 'act-init-4',
    title: 'Mandi Market Check: Thanjavur Market',
    subtitle: 'Paddy (Common): ₹2,320 / Quintal',
    type: 'mandi',
    timestamp: 'Yesterday, 02:10 PM',
    tabTarget: 'dashboard'
  }
];

export default function App() {
  // Authentication & Profile States
  const [isRegistered, setIsRegistered] = useState<boolean>(() => {
    return localStorage.getItem('agri_profile_saved') === 'true';
  });
  const [authMethod, setAuthMethod] = useState<'none' | 'email' | 'phone' | 'google'>('none');
  const [phoneInput, setPhoneInput] = useState('');
  const [smsOtp, setSmsOtp] = useState('');
  const [smsSent, setSmsSent] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [emailOtp, setEmailOtp] = useState('');
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('123456');
  const [otpNotification, setOtpNotification] = useState<{ target: string; code: string; type: 'phone' | 'email' } | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('agri_user_profile');
    if (saved) return JSON.parse(saved);
    return {
      name: '',
      age: 35,
      gender: 'Male',
      preferredLanguage: 'English',
      state: 'Tamil Nadu',
      district: 'Thanjavur',
      village: 'Kovilkulam',
      educationLevel: 'Undergraduate',
      occupation: 'Farmer'
    };
  });

  // UI States
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isEasyMode, setIsEasyMode] = useState<boolean>(false);
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [isGetCropModalOpen, setIsGetCropModalOpen] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(() => localStorage.getItem('agri_dark_mode') === 'true');
  const [showSplashScreen, setShowSplashScreen] = useState<boolean>(true);
  const [showPermissionsModal, setShowPermissionsModal] = useState<boolean>(false);
  const [showTransferModal, setShowTransferModal] = useState<boolean>(false);

  const [savedItems, setSavedItems] = useState<SavedItem[]>(() => {
    const saved = localStorage.getItem('agri_offline_cabinet');
    return saved ? JSON.parse(saved) : [];
  });

  // Reminders state (ONLY user-created reminders!)
  const [reminders, setReminders] = useState<FarmingReminder[]>(() => {
    const saved = localStorage.getItem('agri_reminders');
    return saved ? JSON.parse(saved) : [];
  });

  // Notes state
  const [notes, setNotes] = useState<FarmerNote[]>(() => {
    const saved = localStorage.getItem('agri_notes');
    return saved ? JSON.parse(saved) : [];
  });

  // Recent Activities History state
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>(() => {
    const saved = localStorage.getItem('agri_recent_activities');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return DEFAULT_RECENT_ACTIVITIES;
  });

  const handleClearActivities = () => {
    setRecentActivities([]);
    localStorage.removeItem('agri_recent_activities');
  };

  // Prefill state for reminders modal
  const [prefillReminder, setPrefillReminder] = useState<Partial<FarmingReminder> | null>(null);

  useEffect(() => {
    localStorage.setItem('agri_reminders', JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem('agri_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('agri_recent_activities', JSON.stringify(recentActivities));
  }, [recentActivities]);

  useEffect(() => {
    localStorage.setItem('agri_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('agri_dark_mode', darkMode.toString());
  }, [darkMode]);

  // Reminder Handlers
  const handleAddReminder = (reminderData: Omit<FarmingReminder, 'id' | 'dateCreated'>) => {
    const newRem: FarmingReminder = {
      ...reminderData,
      id: `rem-${Date.now()}`,
      dateCreated: new Date().toLocaleDateString()
    };
    setReminders(prev => [newRem, ...prev]);
    handleLogActivity({
      id: `act-${Date.now()}`,
      title: `Added Reminder: ${newRem.title}`,
      subtitle: `${newRem.category} for ${newRem.cropName || 'Farm'} on ${newRem.date}`,
      type: 'reminder',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tabTarget: 'reminders'
    });
  };

  const handleUpdateReminder = (id: string, updated: Partial<FarmingReminder>) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, ...updated } : r));
  };

  const handleDeleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const handleToggleReminderComplete = (id: string) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, completed: !r.completed } : r));
  };

  const handleOpenAddReminderWithPrefill = (prefill?: Partial<FarmingReminder>) => {
    if (prefill) {
      setPrefillReminder(prefill);
    }
    setActiveTab('reminders');
  };

  // Notes Handlers
  const handleAddNote = (noteData: Omit<FarmerNote, 'id' | 'dateCreated' | 'updatedAt'>) => {
    const newNote: FarmerNote = {
      ...noteData,
      id: `note-${Date.now()}`,
      dateCreated: new Date().toLocaleDateString(),
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setNotes(prev => [newNote, ...prev]);
    handleLogActivity({
      id: `act-${Date.now()}`,
      title: `Saved Farm Note: ${newNote.title}`,
      subtitle: `Category: ${newNote.category}`,
      type: 'note',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tabTarget: 'notes'
    });
  };

  const handleUpdateNote = (id: string, updated: Partial<FarmerNote>) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updated, updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } : n));
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const handleToggleNotePin = (id: string) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, isPinned: !n.isPinned } : n));
  };

  // Recent Activity logger
  const handleLogActivity = (activity: RecentActivity) => {
    setRecentActivities(prev => {
      const filtered = prev.filter(a => a.title !== activity.title);
      return [activity, ...filtered].slice(0, 10);
    });
  };

  const handleSelectRecentActivity = (activity: RecentActivity) => {
    if (activity.tabTarget) {
      setActiveTab(activity.tabTarget);
    }
  };

  const handleUpdateDistrict = (district: string, state: string) => {
    setUserProfile(prev => ({
      ...prev,
      district,
      state
    }));
  };

  // Step wizard for profile
  const [profileStep, setProfileStep] = useState(1);

  // Automatic GPS Location Detection
  const handleDetectLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const detectedState = lat > 20 ? 'Punjab' : 'Tamil Nadu';
          const detectedDistrict = lat > 20 ? 'Ludhiana' : 'Thanjavur';
          const detectedVillage = lat > 20 ? 'Gill' : 'Kovilkulam';
          
          setUserProfile(prev => ({
            ...prev,
            country: 'India',
            state: detectedState,
            district: detectedDistrict,
            village: detectedVillage
          }));
          voiceController.speak(`GPS location auto-detected: ${detectedVillage}, ${detectedDistrict}, ${detectedState}`, userProfile.preferredLanguage);
          alert(`📍 GPS Location Auto-Detected:\nCountry: India\nState: ${detectedState}\nDistrict: ${detectedDistrict}\nVillage: ${detectedVillage}`);
        },
        (error) => {
          setUserProfile(prev => ({
            ...prev,
            country: 'India',
            state: prev.state || 'Tamil Nadu',
            district: prev.district || 'Thanjavur',
            village: prev.village || 'Kovilkulam'
          }));
        }
      );
    }
  };

  // Auto detect location on initial registration/load
  useEffect(() => {
    if (isRegistered && (!userProfile.country || !userProfile.district)) {
      handleDetectLocation();
    }
  }, [isRegistered]);

  useEffect(() => {
    localStorage.setItem('agri_offline_cabinet', JSON.stringify(savedItems));
  }, [savedItems]);

  // Adjust Easy Mode based on Education Level
  useEffect(() => {
    if (userProfile.educationLevel === 'No Education') {
      setIsEasyMode(true);
    } else {
      setIsEasyMode(false);
    }
  }, [userProfile.educationLevel]);

  // Welcome speech on registration complete or mode changes
  const handleCompleteRegistration = () => {
    setIsRegistered(true);
    voiceController.stop();
    
    if (userProfile.educationLevel === 'No Education') {
      setIsEasyMode(true);
      voiceController.speak(
        `Welcome to Agri A I Assistant, ${userProfile.name}. I have turned on Easy Mode with large buttons and voice guides. Let me help you farm.`,
        userProfile.preferredLanguage
      );
    } else {
      voiceController.speak(
        `Welcome ${userProfile.name}! Your agriculture career and farming assistant is ready. Explore our chatbot or crop guides.`,
        userProfile.preferredLanguage
      );
    }
  };

  // Speaks description of nav tabs for accessibility/uneducated users
  const handleNavHover = (tabName: string) => {
    if (!isEasyMode) return;
    let spokenText = '';
    switch (tabName) {
      case 'dashboard':
        spokenText = 'Home Dashboard. See weather, farming suggestions, and market prices.';
        break;
      case 'chat':
        spokenText = 'Agri A I Assistant Chatbot. Speak or type your questions here.';
        break;
      case 'crop':
        spokenText = 'Crop recommendations. Enter soil type and budget to get best crops.';
        break;
      case 'career':
        spokenText = 'Farming careers. Learn beekeeping, dairy, or mushroom businesses.';
        break;
      case 'analysis':
        spokenText = 'Crop Health Scan. Upload leaf photos to check plant diseases.';
        break;
      case 'schemes':
        spokenText = 'Government Subsidies and schemes. Read how to get money support.';
        break;
      case 'learning':
        spokenText = 'Learning center. Complete simple lessons and try quick quizzes.';
        break;
      case 'cabinet':
        spokenText = 'Saved Offline Files. Read and listen to advice without internet.';
        break;
      case 'flutter':
        spokenText = 'Flutter Mobile App. Open the mobile simulator and copy production-ready source code.';
        break;
    }
    voiceController.speak(spokenText, userProfile.preferredLanguage);
  };

  // Offline Database triggers
  const handleSaveItem = (item: Omit<SavedItem, 'id' | 'timestamp'>) => {
    const newItem: SavedItem = {
      ...item,
      id: `saved-${Date.now()}`,
      timestamp: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setSavedItems(prev => [newItem, ...prev]);
    handleLogActivity({
      id: `act-${Date.now()}`,
      title: `Saved Offline: ${item.title}`,
      subtitle: `Saved to Offline Cabinet`,
      type: item.type === 'analysis' ? 'disease' : 'advisory',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tabTarget: 'cabinet'
    });
  };

  const handleDeleteItem = (id: string) => {
    setSavedItems(prev => prev.filter(item => item.id !== id));
  };

  const handleLogout = () => {
    localStorage.removeItem('agri_profile_saved');
    localStorage.removeItem('agri_user_profile');
    setIsRegistered(false);
    setProfileStep(1);
    setAuthMethod('none');
    setSmsSent(false);
    setEmailOtpSent(false);
    setPhoneInput('');
    setEmailInput('');
    setPasswordInput('');
    setSmsOtp('');
    setEmailOtp('');
    setOtpNotification(null);
    setInputStates();
    voiceController.stop();
  };

  const handleLanguageChange = (newLang: LanguageCode) => {
    setUserProfile(prev => {
      const updated = { ...prev, preferredLanguage: newLang };
      localStorage.setItem('agri_user_profile', JSON.stringify(updated));
      return updated;
    });
    voiceController.speakInstruction('welcome', newLang);
  };

  const setInputStates = () => {
    setUserProfile({
      name: '',
      age: 35,
      gender: 'Male',
      preferredLanguage: 'English',
      state: 'Tamil Nadu',
      district: 'Thanjavur',
      village: 'Kovilkulam',
      educationLevel: 'Undergraduate',
      occupation: 'Farmer'
    });
  };

  // Login simulation handlers
  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput.trim()) return;
    setIsSigningIn(true);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setTimeout(() => {
      setSmsSent(true);
      setIsSigningIn(false);
      setSmsOtp(code);
      setOtpNotification({ target: phoneInput, code, type: 'phone' });
    }, 600);
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!smsOtp.trim()) return;
    setIsSigningIn(true);
    setTimeout(() => {
      setIsSigningIn(false);
      const phoneDigits = phoneInput.replace(/\D/g, '');
      const lastFour = phoneDigits.length >= 4 ? phoneDigits.slice(-4) : 'Mobile';
      setUserProfile(prev => ({
        ...prev,
        name: prev.name || `Farmer (${lastFour})`
      }));
      setAuthMethod('none');
      setProfileStep(1);
      setOtpNotification(null);
    }, 400);
  };

  const handleSendEmailOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setIsSigningIn(true);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setTimeout(() => {
      setEmailOtpSent(true);
      setIsSigningIn(false);
      setEmailOtp(code);
      setOtpNotification({ target: emailInput, code, type: 'email' });
    }, 600);
  };

  const handleVerifyEmailOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOtp.trim()) return;
    setIsSigningIn(true);
    setTimeout(() => {
      setIsSigningIn(false);
      const nameFromEmail = emailInput.split('@')[0];
      const formattedName = nameFromEmail ? nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1) : 'Farmer';
      setUserProfile(prev => ({
        ...prev,
        name: prev.name || formattedName
      }));
      setAuthMethod('none');
      setProfileStep(1);
      setOtpNotification(null);
    }, 400);
  };

  const handleGoogleLogin = () => {
    setIsSigningIn(true);
    setTimeout(() => {
      setIsSigningIn(false);
      setUserProfile(prev => ({
        ...prev,
        name: prev.name || 'Google Farmer'
      }));
      setAuthMethod('none');
      setProfileStep(1);
    }, 600);
  };

  return (
    <div id="agri-app-root" className={`min-h-screen flex flex-col font-sans transition-colors pb-16 md:pb-0 ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-gray-50 text-gray-800'}`}>
      
      {/* Android Splash Screen */}
      {showSplashScreen && (
        <AndroidSplashScreen onDismiss={() => setShowSplashScreen(false)} />
      )}

      {/* Network Connectivity Check Banner */}
      <NetworkStatusBanner />

      {/* Android System Permissions Sheet Modal */}
      <AndroidPermissionsModal
        isOpen={showPermissionsModal}
        onClose={() => setShowPermissionsModal(false)}
      />

      {/* Mobile USB & QR Code Transfer Modal */}
      <MobileTransferModal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
      />

      {/* Android Mobile Status & Bottom Navigation Bar */}
      {isRegistered && (
        <AndroidMobileNavBar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onOpenPermissions={() => setShowPermissionsModal(true)}
          onShowSplash={() => setShowSplashScreen(true)}
          onLogout={handleLogout}
          onOpenTransferModal={() => setShowTransferModal(true)}
          currentLanguage={userProfile.preferredLanguage as LanguageCode}
          onLanguageChange={handleLanguageChange}
        />
      )}
      
      {/* 1. AUTHENTICATION SELECTION & PROFILE SETUP WIZARD */}
      {!isRegistered && (
        <div className="flex-1 flex items-center justify-center p-4 py-12 md:p-12">
          
          {/* Card Frame */}
          <div className="bg-white max-w-xl w-full rounded-3xl border border-emerald-100 shadow-md p-6 md:p-8 space-y-6">
            
            <div className="text-center space-y-2">
              <div className="bg-emerald-100 text-emerald-800 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
                <Sprout className="w-8 h-8 text-emerald-600 animate-pulse" />
              </div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">AgriVerse AI</h1>
              <p className="text-xs text-gray-400 font-medium">India's most intelligent Agriculture Assistant</p>
            </div>

            {/* A. AUTH METHODS CHANNELS */}
            {authMethod === 'none' && profileStep === 1 && userProfile.name === '' && (
              <div className="space-y-4">
                <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-50 text-center text-xs text-emerald-800 font-semibold">
                  🌿 Login to access real-time mandi prices, disease scanner, and career advice.
                </div>

                <div className="space-y-2">
                  {/* Phone login channel */}
                  <button
                    id="auth-phone-btn"
                    onClick={() => {
                      setAuthMethod('phone');
                      setSmsSent(false);
                      setOtpNotification(null);
                    }}
                    className="w-full flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-emerald-300 hover:bg-emerald-50/10 transition-all font-bold text-sm"
                  >
                    <span className="flex items-center gap-3"><Phone className="w-5 h-5 text-emerald-600" /> Phone Number OTP Login (Mobile)</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>

                  {/* Google Login channel */}
                  <button
                    id="auth-google-btn"
                    onClick={handleGoogleLogin}
                    disabled={isSigningIn}
                    className="w-full flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-emerald-300 hover:bg-emerald-50/10 transition-all font-bold text-sm"
                  >
                    <span className="flex items-center gap-3">
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-.14 3-.98 4.05v3.36h6.5c3.81-3.5 6.03-8.66 6.03-14.26z"/>
                        <path fill="#34A853" d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-6.5-3.36c-1.8 1.2-4.1 1.9-6.46 1.9-4.96 0-9.16-3.3-10.67-7.79H.12v3.48C2.1 19.3 7.7 24 12 24z"/>
                        <path fill="#FBBC05" d="M1.33 11.84c-.39-1.21-.61-2.49-.61-3.84s.22-2.63.61-3.84V.68H.12C1.94 4.3 1.94 9.7.12 13.32l1.21-1.48z"/>
                        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.6 4.6 1.8l3.43-3.43C17.96 1.19 15.24 0 12 0 7.7 0 2.1 4.7.12 8.16l1.21 3.48c1.51-4.49 5.71-7.79 10.67-7.79z"/>
                      </svg>
                      Google Account Sign-In
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>

                  {/* Email Login channel */}
                  <button
                    id="auth-email-btn"
                    onClick={() => {
                      setAuthMethod('email');
                      setEmailOtpSent(false);
                      setOtpNotification(null);
                    }}
                    className="w-full flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-emerald-300 hover:bg-emerald-50/10 transition-all font-bold text-sm"
                  >
                    <span className="flex items-center gap-3"><Mail className="w-5 h-5 text-emerald-600" /> Email ID OTP Login</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>

                  {/* Guest Mode channel */}
                  <div className="pt-2 border-t border-gray-50 mt-4">
                    <button
                      id="auth-guest-btn"
                      onClick={() => {
                        setUserProfile(prev => ({ ...prev, name: 'Guest Farmer' }));
                        setAuthMethod('none');
                        setProfileStep(1);
                      }}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl py-4 shadow-sm transition-all text-sm shrink-0"
                    >
                      Instant Guest Mode (No Login)
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* B1. SIMULATED PHONE OTP VERIFICATION FORM */}
            {authMethod === 'phone' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between text-emerald-800 font-bold text-sm border-b pb-2 border-gray-50">
                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-emerald-600" /> Phone Number OTP Login
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-mono px-2 py-0.5 rounded-full uppercase">SMS OTP</span>
                </div>

                {!smsSent ? (
                  <form onSubmit={handleSendOTP} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-emerald-800 uppercase tracking-wide">Enter Mobile Phone Number</label>
                      <input
                        id="auth-phone-input"
                        type="tel"
                        required
                        placeholder="e.g. +91 9876543210"
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        className="w-full bg-emerald-50/30 border border-emerald-100 text-sm rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        id="auth-phone-back"
                        type="button"
                        onClick={() => setAuthMethod('none')}
                        className="flex-1 bg-gray-50 border hover:bg-gray-100 text-gray-700 font-bold py-3 text-xs rounded-xl"
                      >
                        Back
                      </button>
                      <button
                        id="auth-phone-submit"
                        type="submit"
                        disabled={isSigningIn}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 text-xs rounded-xl flex items-center justify-center gap-1 shrink-0 shadow-sm"
                      >
                        {isSigningIn ? 'Sending SMS OTP...' : 'Send OTP to Mobile'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOTP} className="space-y-4">
                    {/* OTP Sent Notification Banner */}
                    <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl space-y-1 text-xs">
                      <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                        <span>OTP Code Sent to Concern Mobile!</span>
                      </div>
                      <p className="text-emerald-800 text-[11px]">
                        Mobile: <strong className="font-mono text-emerald-950">{phoneInput}</strong>
                      </p>
                      <p className="text-emerald-900 font-bold bg-white p-2 rounded-lg border border-emerald-100 text-center text-sm tracking-wider">
                        Verification Code: <span className="font-mono text-emerald-700 text-base">{generatedOtp}</span>
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-emerald-800 uppercase tracking-wide">Enter 6-Digit Mobile Verification Code</label>
                      <input
                        id="auth-otp-input"
                        type="text"
                        maxLength={6}
                        required
                        placeholder="123456"
                        value={smsOtp}
                        onChange={(e) => setSmsOtp(e.target.value)}
                        className="w-full bg-emerald-50/30 border border-emerald-100 text-sm rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-center tracking-widest text-lg"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        id="auth-otp-back"
                        type="button"
                        onClick={() => setSmsSent(false)}
                        className="flex-1 bg-gray-50 border hover:bg-gray-100 text-gray-700 font-bold py-3 text-xs rounded-xl"
                      >
                        Change Number
                      </button>
                      <button
                        id="auth-otp-verify"
                        type="submit"
                        disabled={isSigningIn}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 text-xs rounded-xl shrink-0 shadow-sm"
                      >
                        {isSigningIn ? 'Verifying...' : 'Verify Mobile OTP & Login'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* B2. EMAIL OTP LOGIN & REGISTER FORM */}
            {authMethod === 'email' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between text-emerald-800 font-bold text-sm border-b pb-2 border-gray-50">
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-emerald-600" /> Email ID OTP Login
                  </div>
                  <span className="text-[10px] bg-teal-100 text-teal-800 font-mono px-2 py-0.5 rounded-full uppercase">Email OTP</span>
                </div>

                {!emailOtpSent ? (
                  <form onSubmit={handleSendEmailOTP} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-emerald-800 uppercase tracking-wide">Enter Email ID</label>
                      <input
                        id="auth-email-input"
                        type="email"
                        required
                        placeholder="farmer@village.com"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        className="w-full bg-emerald-50/30 border border-emerald-100 text-sm rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-emerald-800 uppercase tracking-wide">Password (Optional)</label>
                      <input
                        id="auth-pass-input"
                        type="password"
                        placeholder="••••••••"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        className="w-full bg-emerald-50/30 border border-emerald-100 text-sm rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                      />
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        id="auth-email-back"
                        type="button"
                        onClick={() => setAuthMethod('none')}
                        className="flex-1 bg-gray-50 border hover:bg-gray-100 text-gray-700 font-bold py-3 text-xs rounded-xl"
                      >
                        Back
                      </button>
                      <button
                        id="auth-email-submit"
                        type="submit"
                        disabled={isSigningIn}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 text-xs rounded-xl shrink-0 shadow-sm"
                      >
                        {isSigningIn ? 'Sending Email OTP...' : 'Send OTP to Email'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyEmailOTP} className="space-y-4">
                    {/* Email OTP Sent Notification Banner */}
                    <div className="bg-teal-50 border border-teal-200 p-3.5 rounded-xl space-y-1 text-xs">
                      <div className="font-bold text-teal-900 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping"></span>
                        <span>OTP Code Sent to Concern Email ID!</span>
                      </div>
                      <p className="text-teal-800 text-[11px]">
                        Email: <strong className="font-mono text-teal-950">{emailInput}</strong>
                      </p>
                      <p className="text-teal-900 font-bold bg-white p-2 rounded-lg border border-teal-100 text-center text-sm tracking-wider">
                        Verification Code: <span className="font-mono text-teal-700 text-base">{generatedOtp}</span>
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-emerald-800 uppercase tracking-wide">Enter 6-Digit Email Verification Code</label>
                      <input
                        id="auth-email-otp-input"
                        type="text"
                        maxLength={6}
                        required
                        placeholder="123456"
                        value={emailOtp}
                        onChange={(e) => setEmailOtp(e.target.value)}
                        className="w-full bg-emerald-50/30 border border-emerald-100 text-sm rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-center tracking-widest text-lg"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        id="auth-email-otp-back"
                        type="button"
                        onClick={() => setEmailOtpSent(false)}
                        className="flex-1 bg-gray-50 border hover:bg-gray-100 text-gray-700 font-bold py-3 text-xs rounded-xl"
                      >
                        Change Email
                      </button>
                      <button
                        id="auth-email-otp-verify"
                        type="submit"
                        disabled={isSigningIn}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 text-xs rounded-xl shrink-0 shadow-sm"
                      >
                        {isSigningIn ? 'Verifying...' : 'Verify Email OTP & Login'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* C. STEP COMPREHENSIVE PROFILE SETUP FORM (Only after credential login) */}
            {authMethod === 'none' && userProfile.name !== '' && (
              <div className="space-y-4 animate-fade-in">
                
                {/* Visual Step Indicator */}
                <div className="flex items-center justify-between border-b pb-3 border-gray-50">
                  <span className="font-bold text-emerald-900 text-sm">Fill Farming Profile</span>
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Wizard Step {profileStep} of 2
                  </span>
                </div>

                {/* Profile Step 1: Personal Coordinates */}
                {profileStep === 1 && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-emerald-800 uppercase tracking-wide">Your Full Name</label>
                      <input
                        id="profile-name-input"
                        type="text"
                        required
                        placeholder="Enter your name"
                        value={userProfile.name}
                        onChange={(e) => setUserProfile(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-emerald-50/30 border border-emerald-100 text-sm rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-emerald-800 uppercase tracking-wide">Age</label>
                        <input
                          id="profile-age-input"
                          type="number"
                          value={userProfile.age}
                          onChange={(e) => setUserProfile(prev => ({ ...prev, age: parseInt(e.target.value) || 30 }))}
                          className="w-full bg-emerald-50/30 border border-emerald-100 text-sm rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-emerald-800 uppercase tracking-wide">Gender</label>
                        <select
                          id="profile-gender-select"
                          value={userProfile.gender}
                          onChange={(e) => setUserProfile(prev => ({ ...prev, gender: e.target.value }))}
                          className="w-full bg-emerald-50/30 border border-emerald-100 text-sm rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                        >
                          <option>Male</option>
                          <option>Female</option>
                          <option>Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-emerald-800 uppercase tracking-wide">Preferred Language</label>
                      <select
                        id="profile-lang-select"
                        value={userProfile.preferredLanguage}
                        onChange={(e) => {
                          const lang = e.target.value as any;
                          setUserProfile(prev => ({ ...prev, preferredLanguage: lang }));
                          voiceController.speakInstruction('welcome', lang);
                        }}
                        className="w-full bg-emerald-50/30 border border-emerald-100 text-sm rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                      >
                        <option>English</option>
                        <option>Tamil</option>
                        <option>Hindi</option>
                        <option>Telugu</option>
                        <option>Kannada</option>
                        <option>Malayalam</option>
                      </select>
                    </div>

                    <button
                      id="profile-wizard-next-btn"
                      onClick={() => setProfileStep(2)}
                      disabled={!userProfile.name.trim()}
                      className={`w-full font-bold rounded-2xl py-4 flex items-center justify-center gap-1.5 shadow-sm transition-all text-sm shrink-0 ${
                        !userProfile.name.trim()
                          ? 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-none'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      Next Step (Location & Education) <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Profile Step 2: Location & Education */}
                {profileStep === 2 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-emerald-800 uppercase tracking-wide">State</label>
                        <input
                          id="profile-state-input"
                          type="text"
                          value={userProfile.state}
                          onChange={(e) => setUserProfile(prev => ({ ...prev, state: e.target.value }))}
                          className="w-full bg-emerald-50/30 border border-emerald-100 text-xs rounded-xl px-3 py-3 text-gray-800 font-semibold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-emerald-800 uppercase tracking-wide">District</label>
                        <input
                          id="profile-district-input"
                          type="text"
                          value={userProfile.district}
                          onChange={(e) => setUserProfile(prev => ({ ...prev, district: e.target.value }))}
                          className="w-full bg-emerald-50/30 border border-emerald-100 text-xs rounded-xl px-3 py-3 text-gray-800 font-semibold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-emerald-800 uppercase tracking-wide">Village</label>
                        <input
                          id="profile-village-input"
                          type="text"
                          value={userProfile.village}
                          onChange={(e) => setUserProfile(prev => ({ ...prev, village: e.target.value }))}
                          className="w-full bg-emerald-50/30 border border-emerald-100 text-xs rounded-xl px-3 py-3 text-gray-800 font-semibold"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-emerald-800 uppercase tracking-wide">Education Level (Mandatory)</label>
                      <select
                        id="profile-edu-select"
                        value={userProfile.educationLevel}
                        onChange={(e) => setUserProfile(prev => ({ ...prev, educationLevel: e.target.value as any }))}
                        className="w-full bg-emerald-50/30 border border-emerald-100 text-sm rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                      >
                        <option value="No Education">No Education (Triggers Easy Voice Mode)</option>
                        <option value="Primary School">Primary School</option>
                        <option value="High School">High School</option>
                        <option value="Diploma">Diploma</option>
                        <option value="Undergraduate">Undergraduate Degree</option>
                        <option value="Graduate">Postgraduate / Graduate</option>
                      </select>
                      <span className="text-[10px] text-orange-600 font-bold block mt-1">
                        Choosing "No Education" converts the layout to easy voice navigation automatically!
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-emerald-800 uppercase tracking-wide">Occupation</label>
                      <select
                        id="profile-occ-select"
                        value={userProfile.occupation}
                        onChange={(e) => setUserProfile(prev => ({ ...prev, occupation: e.target.value as any }))}
                        className="w-full bg-emerald-50/30 border border-emerald-100 text-sm rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                      >
                        <option>Farmer</option>
                        <option>Student</option>
                        <option>Agricultural Worker</option>
                        <option>Business Owner</option>
                        <option>Other</option>
                      </select>
                    </div>

                    <div className="flex gap-2">
                      <button
                        id="profile-wizard-back-btn"
                        onClick={() => setProfileStep(1)}
                        className="flex-1 bg-gray-50 border hover:bg-gray-100 text-gray-700 font-bold py-3.5 text-xs rounded-xl"
                      >
                        Back Step
                      </button>
                      <button
                        id="profile-wizard-complete-btn"
                        onClick={handleCompleteRegistration}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 text-xs rounded-xl shrink-0"
                      >
                        Complete Setup
                      </button>
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>
        </div>
      )}

      {/* 2. THE MAIN WORKING full-stack INTERFACE */}
      {isRegistered && (
        <>
          {/* Main Top Header Navigation */}
          <header className={`border-b sticky top-0 z-40 transition-colors ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-emerald-100 shadow-xs'}`}>
            <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex flex-wrap items-center justify-between gap-3">
              
              <div className="flex items-center gap-3">
                <div className="bg-emerald-600 text-white p-2.5 rounded-2xl shadow-sm">
                  <Sprout className="w-6 h-6" />
                </div>
                <div>
                  <h1 className={`text-xl font-black tracking-tight flex items-center gap-1.5 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {t('appTitle', userProfile.preferredLanguage as LanguageCode)} <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full uppercase border border-emerald-200">Full Stack</span>
                  </h1>
                  <span className={`text-xs font-medium block ${darkMode ? 'text-slate-400' : 'text-gray-400'}`}>
                    {t('subTitle', userProfile.preferredLanguage as LanguageCode)}
                  </span>
                </div>
              </div>

              {/* Top controls */}
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                
                {/* Global Regional Language Selector */}
                <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-emerald-50/60 border-emerald-100 text-emerald-900'}`}>
                  <Globe className="w-4 h-4 text-emerald-600 shrink-0" />
                  <select
                    id="global-language-selector"
                    value={userProfile.preferredLanguage}
                    onChange={(e) => handleLanguageChange(e.target.value as LanguageCode)}
                    className={`bg-transparent font-extrabold focus:outline-none cursor-pointer text-xs ${darkMode ? 'text-white bg-slate-800' : 'text-emerald-950 bg-emerald-50'}`}
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

                {/* Dark/Light Theme Toggle */}
                <button
                  id="theme-toggle-btn"
                  onClick={() => setDarkMode(!darkMode)}
                  className={`p-2 rounded-xl border transition-all ${darkMode ? 'bg-slate-800 border-slate-700 text-amber-400' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'}`}
                  title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                  {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>

                {/* Manual Easy Mode Switcher */}
                <div className={`flex items-center gap-2 p-1.5 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-emerald-50/60 border-emerald-100'}`}>
                  <span className="text-[10px] font-bold text-emerald-800 pl-1.5 hidden md:inline">🔊 {t('voiceGuidance', userProfile.preferredLanguage as LanguageCode)}:</span>
                  <button
                    id="manual-easymode-toggle"
                    onClick={() => {
                      const newMode = !isEasyMode;
                      setIsEasyMode(newMode);
                      if (newMode) {
                        voiceController.speak('Easy Mode active. Voice guidance enabled.', userProfile.preferredLanguage);
                      } else {
                        voiceController.stop();
                      }
                    }}
                    className={`text-[10px] font-extrabold px-2.5 py-1.5 rounded-lg uppercase tracking-wide transition-all ${
                      isEasyMode 
                        ? 'bg-emerald-600 text-white shadow-xs' 
                        : 'bg-white text-emerald-800 border'
                    }`}
                  >
                    {isEasyMode ? t('enabled', userProfile.preferredLanguage as LanguageCode) : t('disabled', userProfile.preferredLanguage as LanguageCode)}
                  </button>
                </div>

                <div className="hidden md:flex items-center gap-2 text-right text-xs pr-2 border-r border-gray-100">
                  <User className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className={`font-semibold ${darkMode ? 'text-slate-200' : 'text-gray-700'}`}>{userProfile.name}</span>
                </div>

                <button
                  id="profile-logout-btn"
                  onClick={handleLogout}
                  className="p-2 border border-red-50 bg-red-50/20 hover:bg-red-50 rounded-xl text-red-600 transition-all"
                  title={t('signOut', userProfile.preferredLanguage as LanguageCode)}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

            </div>
          </header>

          {/* Main Content Area */}
          <main className={`flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start ${darkMode ? 'bg-slate-950 text-slate-100' : ''}`}>
            
            {/* LEFT NAVIGATION */}
            <nav className={`lg:col-span-3 p-4 rounded-2xl border shadow-sm space-y-2 sticky top-[80px] z-30 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-emerald-100'}`}>
              
              <div className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-widest px-3 mb-2 hidden lg:block">
                {t('assistantModules', userProfile.preferredLanguage as LanguageCode)}
              </div>

              {/* Dynamic Tabs list */}
              <div className="grid grid-cols-4 lg:grid-cols-1 gap-1">
                
                {/* 1. Dashboard Tab Button */}
                <button
                  id="nav-tab-dashboard"
                  onClick={() => setActiveTab('dashboard')}
                  onMouseEnter={() => handleNavHover('dashboard')}
                  className={`flex flex-col lg:flex-row items-center gap-1.5 lg:gap-3 p-3 lg:p-3.5 rounded-xl text-xs font-bold transition-all text-center lg:text-left ${
                    activeTab === 'dashboard' 
                      ? 'bg-emerald-600 text-white shadow-xs' 
                      : darkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-gray-600 hover:bg-emerald-50/50 hover:text-emerald-800'
                  }`}
                >
                  <Home className="w-4.5 h-4.5" />
                  <span className={`${isEasyMode ? 'text-sm font-black' : ''} truncate block`}>{t('dashboard', userProfile.preferredLanguage as LanguageCode)}</span>
                </button>

                {/* 2. Smart Reminders Tab */}
                <button
                  id="nav-tab-reminders"
                  onClick={() => setActiveTab('reminders')}
                  onMouseEnter={() => handleNavHover('reminders')}
                  className={`flex flex-col lg:flex-row items-center gap-1.5 lg:gap-3 p-3 lg:p-3.5 rounded-xl text-xs font-bold transition-all text-center lg:text-left ${
                    activeTab === 'reminders' 
                      ? 'bg-emerald-600 text-white shadow-xs' 
                      : darkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-gray-600 hover:bg-emerald-50/50 hover:text-emerald-800'
                  }`}
                >
                  <Bell className="w-4.5 h-4.5 text-amber-500" />
                  <span className={`${isEasyMode ? 'text-sm font-black' : ''} truncate block`}>{t('reminders', userProfile.preferredLanguage as LanguageCode)}</span>
                </button>

                {/* 3. Farm Diary / Notes Tab */}
                <button
                  id="nav-tab-notes"
                  onClick={() => setActiveTab('notes')}
                  onMouseEnter={() => handleNavHover('notes')}
                  className={`flex flex-col lg:flex-row items-center gap-1.5 lg:gap-3 p-3 lg:p-3.5 rounded-xl text-xs font-bold transition-all text-center lg:text-left ${
                    activeTab === 'notes' 
                      ? 'bg-emerald-600 text-white shadow-xs' 
                      : darkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-gray-600 hover:bg-emerald-50/50 hover:text-emerald-800'
                  }`}
                >
                  <FileText className="w-4.5 h-4.5 text-blue-500" />
                  <span className={`${isEasyMode ? 'text-sm font-black' : ''} truncate block`}>{t('notes', userProfile.preferredLanguage as LanguageCode)}</span>
                </button>

                {/* 4. Chatbot Tab Button */}
                <button
                  id="nav-tab-chat"
                  onClick={() => setActiveTab('chat')}
                  onMouseEnter={() => handleNavHover('chat')}
                  className={`flex flex-col lg:flex-row items-center gap-1.5 lg:gap-3 p-3 lg:p-3.5 rounded-xl text-xs font-bold transition-all text-center lg:text-left ${
                    activeTab === 'chat' 
                      ? 'bg-emerald-600 text-white shadow-xs' 
                      : darkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-gray-600 hover:bg-emerald-50/50 hover:text-emerald-800'
                  }`}
                >
                  <MessageSquare className="w-4.5 h-4.5" />
                  <span className={`${isEasyMode ? 'text-sm font-black' : ''} truncate block`}>{t('chat', userProfile.preferredLanguage as LanguageCode)}</span>
                </button>

                {/* 5. Crop Recommendations Tab Button */}
                <button
                  id="nav-tab-crop"
                  onClick={() => setActiveTab('crop')}
                  onMouseEnter={() => handleNavHover('crop')}
                  className={`flex flex-col lg:flex-row items-center gap-1.5 lg:gap-3 p-3 lg:p-3.5 rounded-xl text-xs font-bold transition-all text-center lg:text-left ${
                    activeTab === 'crop' 
                      ? 'bg-emerald-600 text-white shadow-xs' 
                      : darkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-gray-600 hover:bg-emerald-50/50 hover:text-emerald-800'
                  }`}
                >
                  <Sprout className="w-4.5 h-4.5" />
                  <span className={`${isEasyMode ? 'text-sm font-black' : ''} truncate block`}>{t('cropAdvice', userProfile.preferredLanguage as LanguageCode)}</span>
                </button>

                {/* 6. Career Guidance Tab Button */}
                <button
                  id="nav-tab-career"
                  onClick={() => setActiveTab('career')}
                  onMouseEnter={() => handleNavHover('career')}
                  className={`flex flex-col lg:flex-row items-center gap-1.5 lg:gap-3 p-3 lg:p-3.5 rounded-xl text-xs font-bold transition-all text-center lg:text-left ${
                    activeTab === 'career' 
                      ? 'bg-emerald-600 text-white shadow-xs' 
                      : darkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-gray-600 hover:bg-emerald-50/50 hover:text-emerald-800'
                  }`}
                >
                  <Briefcase className="w-4.5 h-4.5" />
                  <span className={`${isEasyMode ? 'text-sm font-black' : ''} truncate block`}>{t('business', userProfile.preferredLanguage as LanguageCode)}</span>
                </button>

                {/* 7. AI Disease Detector Tab Button */}
                <button
                  id="nav-tab-analysis"
                  onClick={() => setActiveTab('analysis')}
                  onMouseEnter={() => handleNavHover('analysis')}
                  className={`flex flex-col lg:flex-row items-center gap-1.5 lg:gap-3 p-3 lg:p-3.5 rounded-xl text-xs font-bold transition-all text-center lg:text-left ${
                    activeTab === 'analysis' 
                      ? 'bg-emerald-600 text-white shadow-xs' 
                      : darkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-gray-600 hover:bg-emerald-50/50 hover:text-emerald-800'
                  }`}
                >
                  <Camera className="w-4.5 h-4.5" />
                  <span className={`${isEasyMode ? 'text-sm font-black' : ''} truncate block`}>{t('diseaseDetector', userProfile.preferredLanguage as LanguageCode)}</span>
                </button>

                {/* 8. Schemes Tab Button */}
                <button
                  id="nav-tab-schemes"
                  onClick={() => setActiveTab('schemes')}
                  onMouseEnter={() => handleNavHover('schemes')}
                  className={`flex flex-col lg:flex-row items-center gap-1.5 lg:gap-3 p-3 lg:p-3.5 rounded-xl text-xs font-bold transition-all text-center lg:text-left ${
                    activeTab === 'schemes' 
                      ? 'bg-emerald-600 text-white shadow-xs' 
                      : darkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-gray-600 hover:bg-emerald-50/50 hover:text-emerald-800'
                  }`}
                >
                  <Award className="w-4.5 h-4.5" />
                  <span className={`${isEasyMode ? 'text-sm font-black' : ''} truncate block`}>{t('subsidies', userProfile.preferredLanguage as LanguageCode)}</span>
                </button>

                {/* 9. Learning Center Tab Button */}
                <button
                  id="nav-tab-learning"
                  onClick={() => setActiveTab('learning')}
                  onMouseEnter={() => handleNavHover('learning')}
                  className={`flex flex-col lg:flex-row items-center gap-1.5 lg:gap-3 p-3 lg:p-3.5 rounded-xl text-xs font-bold transition-all text-center lg:text-left ${
                    activeTab === 'learning' 
                      ? 'bg-emerald-600 text-white shadow-xs' 
                      : darkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-gray-600 hover:bg-emerald-50/50 hover:text-emerald-800'
                  }`}
                >
                  <BookOpen className="w-4.5 h-4.5" />
                  <span className={`${isEasyMode ? 'text-sm font-black' : ''} truncate block`}>{t('study', userProfile.preferredLanguage as LanguageCode)}</span>
                </button>

                {/* 10. Saved Cabinet Tab Button */}
                <button
                  id="nav-tab-cabinet"
                  onClick={() => setActiveTab('cabinet')}
                  onMouseEnter={() => handleNavHover('cabinet')}
                  className={`flex flex-col lg:flex-row items-center gap-1.5 lg:gap-3 p-3 lg:p-3.5 rounded-xl text-xs font-bold transition-all text-center lg:text-left ${
                    activeTab === 'cabinet' 
                      ? 'bg-emerald-600 text-white shadow-xs' 
                      : darkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-gray-600 hover:bg-emerald-50/50 hover:text-emerald-800'
                  }`}
                >
                  <FolderLock className="w-4.5 h-4.5" />
                  <span className={`${isEasyMode ? 'text-sm font-black' : ''} truncate block`}>{t('offlineFile', userProfile.preferredLanguage as LanguageCode)}</span>
                </button>

                {/* 11. Mobile & Android APK Button */}
                <button
                  id="nav-tab-flutter"
                  onClick={() => setActiveTab('flutter')}
                  onMouseEnter={() => handleNavHover('flutter')}
                  className={`flex flex-col lg:flex-row items-center gap-1.5 lg:gap-3 p-3 lg:p-3.5 rounded-xl text-xs font-bold transition-all text-center lg:text-left ${
                    activeTab === 'flutter' 
                      ? 'bg-emerald-600 text-white shadow-xs' 
                      : darkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-gray-600 hover:bg-emerald-50/50 hover:text-emerald-800'
                  }`}
                >
                  <Smartphone className="w-4.5 h-4.5 text-emerald-500" />
                  <span className={`${isEasyMode ? 'text-sm font-black' : ''} truncate block`}>{t('androidApk', userProfile.preferredLanguage as LanguageCode)}</span>
                </button>

              </div>

            </nav>

            {/* RIGHT MAIN WORKING ROUTER PANEL */}
            <div className="lg:col-span-9 min-h-[500px]">
              
              {/* Dashboard Tab router */}
              {activeTab === 'dashboard' && (
                <DashboardTab
                  userProfile={userProfile}
                  isEasyMode={isEasyMode}
                  isOffline={isOffline}
                  setIsOffline={setIsOffline}
                  setActiveTab={setActiveTab}
                  onGetCropClick={() => setIsGetCropModalOpen(true)}
                  reminders={reminders}
                  onToggleReminderComplete={handleToggleReminderComplete}
                  onOpenAddReminder={handleOpenAddReminderWithPrefill}
                  recentActivities={recentActivities}
                  onSelectActivity={handleSelectRecentActivity}
                  onClearActivities={handleClearActivities}
                  onUpdateDistrict={handleUpdateDistrict}
                />
              )}

              {/* Reminders Tab router */}
              {activeTab === 'reminders' && (
                <RemindersTab
                  reminders={reminders}
                  onAddReminder={handleAddReminder}
                  onUpdateReminder={handleUpdateReminder}
                  onDeleteReminder={handleDeleteReminder}
                  onToggleComplete={handleToggleReminderComplete}
                  prefillData={prefillReminder}
                  onClearPrefill={() => setPrefillReminder(null)}
                />
              )}

              {/* Farm Diary / Notes Tab router */}
              {activeTab === 'notes' && (
                <NotesTab
                  notes={notes}
                  onAddNote={handleAddNote}
                  onUpdateNote={handleUpdateNote}
                  onDeleteNote={handleDeleteNote}
                  onTogglePin={handleToggleNotePin}
                />
              )}

              {/* Chatbot Tab router */}
              {activeTab === 'chat' && (
                <ChatbotTab
                  userProfile={userProfile}
                  isEasyMode={isEasyMode}
                  isOffline={isOffline}
                  onSaveItem={handleSaveItem}
                  onLogActivity={handleLogActivity}
                />
              )}

              {/* Crop Recommendations Tab router */}
              {activeTab === 'crop' && (
                <CropRecommendationTab
                  userProfile={userProfile}
                  isEasyMode={isEasyMode}
                  isOffline={isOffline}
                  onSaveItem={handleSaveItem}
                  onOpenAddReminder={handleOpenAddReminderWithPrefill}
                  onLogActivity={handleLogActivity}
                />
              )}

              {/* Career Guidance Tab router */}
              {activeTab === 'career' && (
                <CareerGuidanceTab
                  userProfile={userProfile}
                  isEasyMode={isEasyMode}
                  isOffline={isOffline}
                  onSaveItem={handleSaveItem}
                />
              )}

              {/* Image analysis scan Tab router */}
              {activeTab === 'analysis' && (
                <ImageAnalysisTab
                  userProfile={userProfile}
                  isEasyMode={isEasyMode}
                  isOffline={isOffline}
                  onSaveItem={handleSaveItem}
                  onOpenAddReminder={handleOpenAddReminderWithPrefill}
                  onLogActivity={handleLogActivity}
                />
              )}

              {/* Govt Schemes Tab router */}
              {activeTab === 'schemes' && (
                <GovtSchemesTab
                  userProfile={userProfile}
                  setUserProfile={setUserProfile}
                  isEasyMode={isEasyMode}
                  onOpenAddReminder={handleOpenAddReminderWithPrefill}
                  onLogActivity={handleLogActivity}
                />
              )}

              {/* Learning Center Tab router */}
              {activeTab === 'learning' && (
                <LearningCenterTab
                  userProfile={userProfile}
                  isEasyMode={isEasyMode}
                  onNavigateToChat={(initialMsg) => {
                    setActiveTab('chat');
                  }}
                  onLogActivity={handleLogActivity}
                />
              )}

              {/* Offline Cabinet Tab router */}
              {activeTab === 'cabinet' && (
                <OfflineCabinetTab
                  savedItems={savedItems}
                  onDeleteItem={handleDeleteItem}
                  preferredLanguage={userProfile.preferredLanguage}
                />
              )}

              {/* Android Flutter & APK Export Tab router */}
              {activeTab === 'flutter' && (
                <FlutterTab
                  userProfile={userProfile}
                  isEasyMode={isEasyMode}
                />
              )}

            </div>

          </main>
        </>
      )}

      {/* Footer footer */}
      <footer className="bg-white border-t border-emerald-50 py-6 mt-12 text-center text-xs text-gray-400 font-semibold">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <span>🌿 Designed for rural farmers, students, and uneducated youth completely offline.</span>
          <div className="flex items-center gap-4">
            <span>Powered by Gemini 3.6-flash</span>
            <span>© 2026 AgriAI Assistant</span>
          </div>
        </div>
      </footer>

      {/* Get Crop Step Wizard Modal */}
      <GetCropModal
        isOpen={isGetCropModalOpen}
        onClose={() => setIsGetCropModalOpen(false)}
        userProfile={userProfile}
        isEasyMode={isEasyMode}
        isOffline={isOffline}
        onSaveItem={handleSaveItem}
        onLogActivity={handleLogActivity}
      />

    </div>
  );
}
