// Multi-lingual UI Translation Dictionary for AgriVerse AI
// Supports: English, Tamil, Hindi, Telugu, Kannada, Malayalam, Marathi, Bengali, Gujarati, Punjabi

export type LanguageCode = 
  | 'English' 
  | 'Tamil' 
  | 'Hindi' 
  | 'Telugu' 
  | 'Kannada' 
  | 'Malayalam' 
  | 'Marathi' 
  | 'Bengali' 
  | 'Gujarati' 
  | 'Punjabi';

export interface Translations {
  // Navigation & Tabs
  dashboard: string;
  reminders: string;
  notes: string;
  chat: string;
  cropAdvice: string;
  business: string;
  diseaseDetector: string;
  subsidies: string;
  study: string;
  offlineFile: string;
  androidApk: string;

  // Header & Status
  appTitle: string;
  subTitle: string;
  signOut: string;
  voiceGuidance: string;
  transferToMobile: string;
  permissions: string;
  theme: string;
  assistantModules: string;
  language: string;

  // Dashboard Section Headings & Buttons
  welcome: string;
  farmer: string;
  mandiPrices: string;
  weatherAlerts: string;
  getAdviceBtn: string;
  quickActions: string;
  recentActivity: string;
  quickAddReminder: string;
  quickScanLeaf: string;
  quickAddNote: string;
  quickCalculateProfit: string;
  location: string;
  changeLocation: string;
  district: string;
  state: string;

  // Common Controls
  save: string;
  cancel: string;
  delete: string;
  back: string;
  search: string;
  viewDetails: string;
  loading: string;
  enabled: string;
  disabled: string;
  clear: string;
  filter: string;
  all: string;
  today: string;

  // Specific Feature Headings
  smartRemindersTitle: string;
  farmDiaryTitle: string;
  aiChatTitle: string;
  cropRecTitle: string;
  businessFinanceTitle: string;
  leafScanTitle: string;
  schemesTitle: string;
  studyCenterTitle: string;
  offlineCabinetTitle: string;
  mobileApkTitle: string;
}

export const TRANSLATIONS: Record<LanguageCode, Translations> = {
  English: {
    dashboard: 'Dashboard',
    reminders: 'Reminders',
    notes: 'Farm Diary',
    chat: 'AI Assistant',
    cropAdvice: 'Crop Advice',
    business: 'Agri Business',
    diseaseDetector: 'Disease Scan',
    subsidies: 'Govt Schemes',
    study: 'Study Center',
    offlineFile: 'Offline Cabinet',
    androidApk: 'Android App',

    appTitle: 'AgriVerse AI',
    subTitle: "India's Intelligent Production AI Crop Advisory Assistant",
    signOut: 'Sign Out',
    voiceGuidance: 'Voice Guidance',
    transferToMobile: 'Transfer to Mobile',
    permissions: 'Permissions',
    theme: 'Theme',
    assistantModules: 'Assistant Modules',
    language: 'Language',

    welcome: 'Welcome',
    farmer: 'Farmer',
    mandiPrices: 'Live Mandi Commodity Prices',
    weatherAlerts: 'Weather & Agricultural Advisory',
    getAdviceBtn: 'Get AI Crop Advice Now',
    quickActions: 'Quick Farmer Actions',
    recentActivity: 'Recent Farm Activity History',
    quickAddReminder: '+ Add New Reminder',
    quickScanLeaf: '📷 Scan Crop Leaf Disease',
    quickAddNote: '📝 Write Farm Diary Note',
    quickCalculateProfit: '📈 Calculate Profit & Yield',
    location: 'Location',
    changeLocation: 'Change Location',
    district: 'District',
    state: 'State',

    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    back: 'Back',
    search: 'Search...',
    viewDetails: 'View Details',
    loading: 'Loading...',
    enabled: 'Enabled',
    disabled: 'Disabled',
    clear: 'Clear All',
    filter: 'Filter',
    all: 'All',
    today: 'Today',

    smartRemindersTitle: 'Smart Farming Reminders',
    farmDiaryTitle: 'Digital Farm Diary & Field Notes',
    aiChatTitle: 'AgriGPT Multilingual Voice Chatbot',
    cropRecTitle: 'Smart Crop Recommendation Engine',
    businessFinanceTitle: 'Agri Business & Market Intelligence',
    leafScanTitle: 'AI Crop Leaf Disease & Pest Scanner',
    schemesTitle: 'Government Schemes & Subsidies',
    studyCenterTitle: 'Farmer Learning & Training Hub',
    offlineCabinetTitle: 'Offline Saved Documents & Reports',
    mobileApkTitle: 'AgriVerse Android APK & Mobile Transfer',
  },

  Tamil: {
    dashboard: 'முகப்பு',
    reminders: 'நினைவூட்டல்',
    notes: 'பண்ணை குறிப்பேடு',
    chat: 'AI உதவியாளர்',
    cropAdvice: 'பயிர் ஆலோசனைகள்',
    business: 'வேளாண் வணிகம்',
    diseaseDetector: 'நோய் கண்டறிதல்',
    subsidies: 'அரசு மானியங்கள்',
    study: 'பயிற்சி மையம்',
    offlineFile: 'ஆஃப்லைன் கோப்புகள்',
    androidApk: 'ஆண்ட்ராய்டு செயலி',

    appTitle: 'அக்ரிவெர்ஸ் AI',
    subTitle: 'இந்தியாவின் முன்னணி செயற்கை நுண்ணறிவு விவசாய வழிகாட்டி',
    signOut: 'வெளியேறு',
    voiceGuidance: 'குரல் வழிகாட்டல்',
    transferToMobile: 'மொபைலுக்கு அனுப்பு',
    permissions: 'அனுமதிகள்',
    theme: 'தீம்',
    assistantModules: 'செயலி பிரிவுகள்',
    language: 'மொழி',

    welcome: 'வணக்கம்',
    farmer: 'விவசாயி',
    mandiPrices: 'நேரலை சந்தை விளைபொருள் விலைகள்',
    weatherAlerts: 'வானிலை & வேளாண் எச்சரிக்கைகள்',
    getAdviceBtn: 'AI பயிர் ஆலோசனை பெறுக',
    quickActions: 'விரைவு சேவைகள்',
    recentActivity: 'சமீபத்திய நடவடிக்கை வரலாறு',
    quickAddReminder: '+ புதிய நினைவூட்டல்',
    quickScanLeaf: '📷 இலை நோய் ஸ்கேன் செய்',
    quickAddNote: '📝 பண்ணை குறிப்பு எழுது',
    quickCalculateProfit: '📈 லாபக் கணக்கீடு செய்',
    location: 'இருப்பிடம்',
    changeLocation: 'இருப்பிடம் மாற்று',
    district: 'மாவட்டம்',
    state: 'மாநிலம்',

    save: 'சேமி',
    cancel: 'ரத்து செய்',
    delete: 'நீக்கு',
    back: 'பின்செல்',
    search: 'தேடுக...',
    viewDetails: 'விவரங்களைக் காண்',
    loading: 'காத்திருக்கவும்...',
    enabled: 'செயலில்',
    disabled: 'செயலிழந்தது',
    clear: 'அனைத்தையும் நீக்கு',
    filter: 'வடிகட்டு',
    all: 'அனைத்தும்',
    today: 'இன்று',

    smartRemindersTitle: 'ஸ்மார்ட் விவசாய நினைவூட்டல்கள்',
    farmDiaryTitle: 'டிஜிட்டல் பண்ணை குறிப்பேடு',
    aiChatTitle: 'அக்ரிஜிபிடி பலமொழி குரல் உரையாடல்',
    cropRecTitle: 'ஸ்மார்ட் பயிர் தேர்வு மற்றும் ஆலோசனை',
    businessFinanceTitle: 'வேளாண் வணிகம் & சந்தை நிலவரம்',
    leafScanTitle: 'AI பயிர் இலை நோய் கண்டறிதல்',
    schemesTitle: 'அரசு விவசாய நலத் திட்டங்கள் & மானியங்கள்',
    studyCenterTitle: 'விவசாயி பயிற்சி & கற்றல் மையம்',
    offlineCabinetTitle: 'ஆஃப்லைன் சேமிக்கப்பட்ட ஆவணங்கள்',
    mobileApkTitle: 'அக்ரிவெர்ஸ் ஆண்ட்ராய்டு செயலி மையம்',
  },

  Hindi: {
    dashboard: 'डैशबोर्ड',
    reminders: 'स्मरणपत्र',
    notes: 'खेत डायरी',
    chat: 'एआई सहायक',
    cropAdvice: 'फसल सलाह',
    business: 'कृषि व्यवसाय',
    diseaseDetector: 'रोग पहचान',
    subsidies: 'सरकारी योजनाएं',
    study: 'अध्ययन केंद्र',
    offlineFile: 'ऑफलाइन तिजोरी',
    androidApk: 'एंड्रॉइड ऐप',

    appTitle: 'एग्रीवर्स एआई',
    subTitle: 'भारत का बुद्धिमत्तापूर्ण कृषि फसल सलाहकार',
    signOut: 'साइन आउट',
    voiceGuidance: 'वॉयस सहायता',
    transferToMobile: 'मोबाइल पर भेजें',
    permissions: 'अनुमतियां',
    theme: 'थीम',
    assistantModules: 'सहायक मॉड्यूल',
    language: 'भाषा',

    welcome: 'स्वागत है',
    farmer: 'किसान',
    mandiPrices: 'लाइव मंडी भाव',
    weatherAlerts: 'मौसम एवं कृषि परामर्श',
    getAdviceBtn: 'अभी फसल सलाह प्राप्त करें',
    quickActions: 'त्वरित किसान सेवाएं',
    recentActivity: 'हाल की गतिविधि इतिहास',
    quickAddReminder: '+ नया रिमाइंडर जोड़ें',
    quickScanLeaf: '📷 पत्ती रोग की जांच करें',
    quickAddNote: '📝 खेत डायरी लिखें',
    quickCalculateProfit: '📈 लाभ और उपज का अनुमान लगाएं',
    location: 'स्थान',
    changeLocation: 'स्थान बदलें',
    district: 'जिला',
    state: 'राज्य',

    save: 'सहेजें',
    cancel: 'रद्द करें',
    delete: 'हटाएं',
    back: 'पीछे जाएं',
    search: 'खोजें...',
    viewDetails: 'विवरण देखें',
    loading: 'लोड हो रहा है...',
    enabled: 'सक्षम',
    disabled: 'अक्षम',
    clear: 'सभी साफ करें',
    filter: 'फ़िल्टर',
    all: 'सभी',
    today: 'आज',

    smartRemindersTitle: 'स्मार्ट कृषि रिमाइंडर',
    farmDiaryTitle: 'डिजिटल खेत डायरी',
    aiChatTitle: 'एग्रीजीपीटी बहुभाषी वॉयस चैट',
    cropRecTitle: 'स्मार्ट फसल सिफारिश इंजन',
    businessFinanceTitle: 'कृषि व्यवसाय और बाजार खुफिया',
    leafScanTitle: 'एआई फसल पत्ती रोग स्कैनर',
    schemesTitle: 'सरकारी योजनाएं और सब्सिडी',
    studyCenterTitle: 'किसान शिक्षण एवं प्रशिक्षण केंद्र',
    offlineCabinetTitle: 'ऑफलाइन सुरक्षित दस्तावेज',
    mobileApkTitle: 'एग्रीवर्स एंड्रॉइड ऐप और मोबाइल ट्रांसफर',
  },

  Telugu: {
    dashboard: 'డాష్‌బోర్డ్',
    reminders: 'జ్ఞాపికలు',
    notes: 'ఫార్మ్ నోట్స్',
    chat: 'AI అసిస్టెంట్',
    cropAdvice: 'పంట సిఫార్సులు',
    business: 'వ్యవసాయ వ్యాపారం',
    diseaseDetector: 'తెగులు గుర్తింపు',
    subsidies: 'ప్రభుత్వ పథకాలు',
    study: 'రైతు శిక్షణ',
    offlineFile: 'ఆఫ్‌లైన్ ఫైళ్ళు',
    androidApk: 'ఆండ్రాయిడ్ యాప్',

    appTitle: 'అగ్రివర్స్ AI',
    subTitle: 'భారతదేశపు ప్రతిభావంతమైన వ్యవసాయ సహాయకుడు',
    signOut: 'సైన్ అవుట్',
    voiceGuidance: 'వాయిస్ గైడెన్స్',
    transferToMobile: 'మొబైల్‌కి బదిలీ',
    permissions: 'అనుమతులు',
    theme: 'థీమ్',
    assistantModules: 'అసిస్టెంట్ మోడ్యూల్స్',
    language: 'భాష',

    welcome: 'స్వాగతం',
    farmer: 'రైతు',
    mandiPrices: 'లైవ్ మార్కెట్ ధరలు',
    weatherAlerts: 'వాతావరణం & వ్యవసాయ సలహాలు',
    getAdviceBtn: 'AI పంట సలహా పొందండి',
    quickActions: 'త్వరిత సేవలు',
    recentActivity: 'ఇటీవలి కార్యకలాపాలు',
    quickAddReminder: '+ కొత్త రిమైండర్',
    quickScanLeaf: '📷 తెగులు స్క్యాన్ చేయండి',
    quickAddNote: '📝 నోట్ రాయండి',
    quickCalculateProfit: '📈 లాభం లెక్కించండి',
    location: 'ప్రాంతం',
    changeLocation: 'ప్రాంతం మార్చండి',
    district: 'జిల్లా',
    state: 'రాష్ట్రం',

    save: 'సేవ్ చేయండి',
    cancel: 'రద్దు చేయండి',
    delete: 'తొలగించండి',
    back: 'వెనుకకు',
    search: 'శోధించండి...',
    viewDetails: 'వివరాలు చూడండి',
    loading: 'లోడ్ అవుతోంది...',
    enabled: 'యాక్టివ్',
    disabled: 'అసమర్థం',
    clear: 'అన్నీ క్లియర్ చేయి',
    filter: 'ఫిల్టర్',
    all: 'అన్నీ',
    today: 'ఈ రోజు',

    smartRemindersTitle: 'స్మార్ట్ వ్యవసాయ రిమైండర్లు',
    farmDiaryTitle: 'డిజిటల్ ఫార్మ్ డైరీ',
    aiChatTitle: 'అగ్రిజిపిటి వాయిస్ చాట్‌బాట్',
    cropRecTitle: 'పంట సిఫార్సుల ఇంజిన్',
    businessFinanceTitle: 'వ్యవసాయ వ్యాపారం & మార్కెట్',
    leafScanTitle: 'AI పంట తెగుళ్ళ స్కానర్',
    schemesTitle: 'ప్రభుత్వ పథకాలు & సబ్సిడీలు',
    studyCenterTitle: 'రైతు అధ్యయన కేంద్రం',
    offlineCabinetTitle: 'ఆఫ్‌లైన్ భద్రపరిచిన పత్రాలు',
    mobileApkTitle: 'ఆండ్రాయిడ్ యాప్ బదిలీ కేంద్రం',
  },

  Kannada: {
    dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    reminders: 'ಜ್ಞಾಪನೆಗಳು',
    notes: 'ಫಾರ್ಮ್ ಟಿಪ್ಪಣಿ',
    chat: 'AI ಸಹಾಯಕ',
    cropAdvice: 'ಬೆಳೆ ಸಲಹೆ',
    business: 'ಕೃಷಿ ಉದ್ಯಮ',
    diseaseDetector: 'ರೋಗ ಪತ್ತೆ',
    subsidies: 'ಸರ್ಕಾರಿ ಯೋಜನೆ',
    study: 'ಕಲಿಕಾ ಕೇಂದ್ರ',
    offlineFile: 'ಆಫ್‌ಲೈನ್ ಫೈಲ್',
    androidApk: 'ಆಂಡ್ರಾಯಿಡ್ ಆ್ಯಪ್',

    appTitle: 'ಅಗ್ರಿವರ್ಸ್ AI',
    subTitle: 'ಭಾರತದ ಶ್ರೇಷ್ಠ ಕೃಷಿ ಸಲಹೆಗಾರ',
    signOut: 'ಸೈನ್ ಔಟ್',
    voiceGuidance: 'ಧ್ವನಿ ಮಾರ್ಗದರ್ಶನ',
    transferToMobile: 'ಮೊಬೈಲ್‌ಗೆ ಕಳುಹಿಸಿ',
    permissions: 'ಅನುಮತಿಗಳು',
    theme: 'ಥೀಮ್',
    assistantModules: 'ಸಹಾಯಕ ವಿಭಾಗಗಳು',
    language: 'ಭಾಷೆ',

    welcome: 'ಸ್ವಾಗತ',
    farmer: 'ರೈತ',
    mandiPrices: 'ಸಂತೆಯ ಸದ್ಯದ ಬೆಲೆಗಳು',
    weatherAlerts: 'ಹವಾಮಾನ ಮತ್ತು ಕೃಷಿ ಸಲಹೆ',
    getAdviceBtn: 'ಬೆಳೆ ಸಲಹೆ ಪಡೆಯಿರಿ',
    quickActions: 'ತ್ವರಿತ ಸೇವೆಗಳು',
    recentActivity: 'ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆಗಳು',
    quickAddReminder: '+ ಹೊಸ ಜ್ಞಾಪನೆ',
    quickScanLeaf: '📷 ಎಲೆ ರೋಗ ಪರೀಕ್ಷಿಸಿ',
    quickAddNote: '📝 ಟಿಪ್ಪಣಿ ಬರೆಯಿರಿ',
    quickCalculateProfit: '📈 ಲಾಭ ಲೆಕ್ಕಹಾಕಿ',
    location: 'ಸ್ಥಳ',
    changeLocation: 'ಸ್ಥಳ ಬದಲಾಯಿಸಿ',
    district: 'ಜಿಲ್ಲೆ',
    state: 'ರಾಜ್ಯ',

    save: 'ಉಳಿಸಿ',
    cancel: 'ರದ್ದುಮಾಡಿ',
    delete: 'ಅಳಿಸಿ',
    back: 'ಹಿಂತಿರುಗಿ',
    search: 'ಹುಡುಕಿ...',
    viewDetails: 'ವಿವರ ನೋಡಿ',
    loading: 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
    enabled: 'ಸಕ್ರಿಯ',
    disabled: 'ನಿಷ್ಕ್ರಿಯ',
    clear: 'ಎಲ್ಲವನ್ನೂ ಅಳಿಸಿ',
    filter: 'ಫಿಲ್ಟರ್',
    all: 'ಎಲ್ಲವೂ',
    today: 'ಇಂದು',

    smartRemindersTitle: 'ಸ್ಮಾರ್ಟ್ ಕೃಷಿ ಜ್ಞಾಪನೆಗಳು',
    farmDiaryTitle: 'ಡಿಜಿಟಲ್ ಕೃಷಿ ಡೈರಿ',
    aiChatTitle: 'ಅಗ್ರಿಜಿಪಿಟಿ ಧ್ವನಿ ಸಹಾಯಕ',
    cropRecTitle: 'ಬೆಳೆ ಆಯ್ಕೆ ಸಲಹೆಗಳು',
    businessFinanceTitle: 'ಕೃಷಿ ವ್ಯಾಪಾರ ಮತ್ತು ಆದಾಯ',
    leafScanTitle: 'AI ಸಸ್ಯ ರೋಗ ಪತ್ತೆದಾರ',
    schemesTitle: 'ಸರ್ಕಾರದ ಯೋಜನೆಗಳು & ಸಬ್ಸಿಡಿ',
    studyCenterTitle: 'ರೈತರ ಕಲಿಕಾ ಕೇಂದ್ರ',
    offlineCabinetTitle: 'ಆಫ್‌ಲೈನ್ ದಾಖಲೆಗಳು',
    mobileApkTitle: 'ಆಂಡ್ರಾಯಿಡ್ ಆ್ಯಪ್ ವರ್ಗಾವಣೆ',
  },

  Malayalam: {
    dashboard: 'ഡാഷ്‌ബോർഡ്',
    reminders: 'ഓർമ്മപ്പെടുത്തൽ',
    notes: 'ഫാം ഡയറി',
    chat: 'AI അസിസ്റ്റന്റ്',
    cropAdvice: 'വിള ഉപദേശം',
    business: 'കാർഷിക ബിസിനസ്സ്',
    diseaseDetector: 'രോഗ നിർണ്ണയം',
    subsidies: 'സർക്കാർ പദ്ധതികൾ',
    study: 'പഠന കേന്ദ്രം',
    offlineFile: 'ഓഫ്‌ലൈൻ ഫയലുകൾ',
    androidApk: 'ആൻഡ്രോയിഡ് ആപ്പ്',

    appTitle: 'അഗ്രിവേഴ്സ് AI',
    subTitle: 'ഇന്ത്യയിലെ പ്രമുഖ കാർഷിക ഗൈഡ്',
    signOut: 'സൈൻ ഔട്ട്',
    voiceGuidance: 'വോയ്സ് ഗൈഡൻസ്',
    transferToMobile: 'മൊബൈലിലേക്ക് അയക്കുക',
    permissions: 'അനുമതികൾ',
    theme: 'തീം',
    assistantModules: 'മോഡ്യൂളുകൾ',
    language: 'ഭാഷ',

    welcome: 'സ്വാഗതം',
    farmer: 'കർഷകൻ',
    mandiPrices: 'വിപണി വിലകൾ',
    weatherAlerts: 'കാലാവസ്ഥ നിർദ്ദേശങ്ങൾ',
    getAdviceBtn: 'വിള ഉപദേശം നേടുക',
    quickActions: 'ദ്രുത സേവനങ്ങൾ',
    recentActivity: 'സമീപകാല പ്രവർത്തനങ്ങൾ',
    quickAddReminder: '+ പുതിയ ഓർമ്മപ്പെടുത്തൽ',
    quickScanLeaf: '📷 ഇല രോഗം സ്കാൻ ചെയ്യുക',
    quickAddNote: '📝 കുറിപ്പ് എഴുതുക',
    quickCalculateProfit: '📈 ലാഭം കണക്കാക്കുക',
    location: 'സ്ഥലം',
    changeLocation: 'സ്ഥലം മാറ്റുക',
    district: 'ജില്ല',
    state: 'സംസ്ഥാനം',

    save: 'സേവ് ചെയ്യുക',
    cancel: 'റദ്ദാക്കുക',
    delete: 'മായ്ക്കുക',
    back: 'തിരികെ',
    search: 'തിരയുക...',
    viewDetails: 'വിശദാംശങ്ങൾ',
    loading: 'ലോഡ് ചെയ്യുന്നു...',
    enabled: 'സജീവം',
    disabled: 'നിഷ്ക്രിയം',
    clear: 'എല്ലാം നീക്കുക',
    filter: 'ഫിൽട്ടർ',
    all: 'എല്ലാം',
    today: 'ഇന്ന്',

    smartRemindersTitle: 'സ്മാർട്ട് കാർഷിക ഓർമ്മപ്പെടുത്തലുകൾ',
    farmDiaryTitle: 'ഡിജിറ്റൽ ഫാം ഡയറി',
    aiChatTitle: 'അഗ്രിജിപിറ്റി വോയ്സ് ചാറ്റ്',
    cropRecTitle: 'വിള തിരഞ്ഞെടുപ്പ് ഉപദേശം',
    businessFinanceTitle: 'കാർഷിക ബിസിനസ്സ് & വിപണി',
    leafScanTitle: 'AI ഇല രോഗ സ്കാനർ',
    schemesTitle: 'സർക്കാർ പദ്ധതികൾ & സബ്സിഡി',
    studyCenterTitle: 'കർഷക പഠന കേന്ദ്രം',
    offlineCabinetTitle: 'ഓഫ്‌ലൈൻ രേഖകൾ',
    mobileApkTitle: 'ആൻഡ്രോയിഡ് ആപ്പ് സെന്റർ',
  },

  Marathi: {
    dashboard: 'डॅशबोर्ड',
    reminders: 'आठवणी',
    notes: 'शेती नोंदवही',
    chat: 'एआय चॅट',
    cropAdvice: 'पिक सल्ला',
    business: 'कृषी व्यवसाय',
    diseaseDetector: 'रोग ओळख',
    subsidies: 'शासकीय योजना',
    study: 'अभ्यास केंद्र',
    offlineFile: 'ऑफलाइन फाइल्स',
    androidApk: 'अँड्रॉइड ॲप',

    appTitle: 'ॲग्रीव्हर्स एआय',
    subTitle: 'भारतातील सर्वोत्तम कृषी सल्लागार',
    signOut: 'साइन आउट',
    voiceGuidance: 'व्हॉइस मार्गदर्शक',
    transferToMobile: 'मोबाईलवर पाठवा',
    permissions: 'परवानग्या',
    theme: 'थीम',
    assistantModules: 'सहाय्यक विभाग',
    language: 'भाषा',

    welcome: 'सुस्वागतम',
    farmer: 'शेतकरी',
    mandiPrices: 'थेट बाजार भाव',
    weatherAlerts: 'हवामान सल्ला',
    getAdviceBtn: 'पिक सल्ला घ्या',
    quickActions: 'जलद सेवा',
    recentActivity: 'अलीकडील उपक्रम',
    quickAddReminder: '+ नवीन रिमाइंडर',
    quickScanLeaf: '📷 पानावरील रोग तपासा',
    quickAddNote: '📝 नोंद लिहा',
    quickCalculateProfit: '📈 नफा मोजा',
    location: 'स्थान',
    changeLocation: 'स्थान बदला',
    district: 'जिल्हा',
    state: 'राज्य',

    save: 'जतन करा',
    cancel: 'रद्द करा',
    delete: 'काढून टाका',
    back: 'मागे',
    search: 'शोधा...',
    viewDetails: 'तपशील पहा',
    loading: 'लोड होत आहे...',
    enabled: 'सक्रिय',
    disabled: 'अक्षम',
    clear: 'सर्व साफ करा',
    filter: 'फिल्टर',
    all: 'सर्व',
    today: 'आज',

    smartRemindersTitle: 'स्मार्ट शेती आठवणी',
    farmDiaryTitle: 'डिजिटल शेती नोंदवही',
    aiChatTitle: 'ॲग्रीजीपीटी व्हॉइस चॅट',
    cropRecTitle: 'पिक निवड व सल्ला',
    businessFinanceTitle: 'कृषी व्यवसाय आणि उत्पन्न',
    leafScanTitle: 'एआय रोग तपासणी',
    schemesTitle: 'शासकीय योजना व अनुदाने',
    studyCenterTitle: 'शेतकरी अभ्यास केंद्र',
    offlineCabinetTitle: 'ऑफलाइन साठवलेली कागदपत्रे',
    mobileApkTitle: 'अँड्रॉइड ॲप सेंटर',
  },

  Bengali: {
    dashboard: 'ড্যাশবোর্ড',
    reminders: 'রিমাইন্ডার',
    notes: 'ফার্ম নোট',
    chat: 'এআই চ্যাট',
    cropAdvice: 'ফসল পরামর্শ',
    business: 'কৃষি ব্যবসা',
    diseaseDetector: 'রোগ সনাক্তকরণ',
    subsidies: 'সরকারি প্রকল্প',
    study: 'শিক্ষা কেন্দ্র',
    offlineFile: 'অফলাইন ফাইল',
    androidApk: 'অ্যান্ড্রয়েড অ্যাপ',

    appTitle: 'এগ্রিভার্স এআই',
    subTitle: 'ভারতের বুদ্ধিমান কৃষি পরামর্শদাতা',
    signOut: 'সাইন আউট',
    voiceGuidance: 'ভয়েস সহায়তা',
    transferToMobile: 'মোবাইলে স্থানান্তর',
    permissions: 'অনুমতি',
    theme: 'থিম',
    assistantModules: 'সহায়ক মডিউল',
    language: 'ভাষা',

    welcome: 'স্বাগতম',
    farmer: 'কৃষক',
    mandiPrices: 'লাইভ বাজার দর',
    weatherAlerts: 'আবহাওয়া ও কৃষি পরামর্শ',
    getAdviceBtn: 'ফসল পরামর্শ নিন',
    quickActions: 'দ্রুত সেবা',
    recentActivity: 'সাম্প্রতিক কার্যক্রম',
    quickAddReminder: '+ নতুন রিমাইন্ডার',
    quickScanLeaf: '📷 পাতার রোগ স্ক্যান',
    quickAddNote: '📝 নোট লিখুন',
    quickCalculateProfit: '📈 লাভ হিসাব করুন',
    location: 'অবস্থান',
    changeLocation: 'অবস্থান পরিবর্তন',
    district: 'জেলা',
    state: 'রাজ্য',

    save: 'সংরক্ষণ',
    cancel: 'বাতিল',
    delete: 'মুছে ফেলুন',
    back: 'ফিরে যান',
    search: 'সন্ধান করুন...',
    viewDetails: 'বিস্তারিত দেখুন',
    loading: 'লোড হচ্ছে...',
    enabled: 'সক্রিয়',
    disabled: 'নিষ্ক্রিয়',
    clear: 'সব মুছুন',
    filter: 'ফিল্টার',
    all: 'সব',
    today: 'আজ',

    smartRemindersTitle: 'স্মার্ট কৃষি রিমাইন্ডার',
    farmDiaryTitle: 'ডিজিটাল ফার্ম ডায়েরি',
    aiChatTitle: 'এগ্রিজিপিটি ভয়েস চ্যাট',
    cropRecTitle: 'ফসল নির্বাচন পরামর্শ',
    businessFinanceTitle: 'কৃষি ব্যবসা ও বাজার দর',
    leafScanTitle: 'এআই পাতার রোগ স্ক্যানার',
    schemesTitle: 'সরকারি প্রকল্প ও ভতুর্কি',
    studyCenterTitle: 'কৃষক শিক্ষা কেন্দ্র',
    offlineCabinetTitle: 'অফলাইন সংরক্ষিত ফাইল',
    mobileApkTitle: 'অ্যান্ড্রয়েড অ্যাপ সেন্টার',
  },

  Gujarati: {
    dashboard: 'ડેશબોર્ડ',
    reminders: 'યાદ અપાવનારા',
    notes: 'ખેતર ડાયરી',
    chat: 'એઆઈ ચેટ',
    cropAdvice: 'પાક ભલામણ',
    business: 'કૃષિ વ્યવસાય',
    diseaseDetector: 'રોગ નિદાન',
    subsidies: 'સરકારી યોજનાઓ',
    study: 'અભ્યાસ કેન્દ્ર',
    offlineFile: 'ઓફલાઇન કેબિનેટ',
    androidApk: 'એન્ડ્રોઇડ એપ',

    appTitle: 'એગ્રીવર્સ એઆઈ',
    subTitle: 'ભારતનું બુદ્ધિશાળી કૃષિ માર્ગદર્શક',
    signOut: 'સાઇન આઉટ',
    voiceGuidance: 'વોઇસ માર્ગદર્શન',
    transferToMobile: 'મોબાઇલમાં ટ્રાન્સફર',
    permissions: 'પરવાનગીઓ',
    theme: 'થીમ',
    assistantModules: 'સહાયક મોડ્યુલ્સ',
    language: 'ભાષા',

    welcome: 'સ્વાગત છે',
    farmer: 'ખેડૂત',
    mandiPrices: 'લાઇવ માર્કેટ ભાવ',
    weatherAlerts: 'હવામાન અને સલાહ',
    getAdviceBtn: 'પાક સલાહ મેળવો',
    quickActions: 'ઝડપી સેવાઓ',
    recentActivity: 'તાજેતરની પ્રવૃત્તિઓ',
    quickAddReminder: '+ નવું રીમાઇન્ડર',
    quickScanLeaf: '📷 પાંદડાના રોગ સ્કેન',
    quickAddNote: '📝 નોંધ લખો',
    quickCalculateProfit: '📈 નફો ગણો',
    location: 'સ્થળ',
    changeLocation: 'સ્થળ બદલો',
    district: 'જિલ્લો',
    state: 'રાજ્ય',

    save: 'સાચવો',
    cancel: 'રદ કરો',
    delete: 'કાઢી નાખો',
    back: 'પાછા જાઓ',
    search: 'શોધો...',
    viewDetails: 'વિગતો જુઓ',
    loading: 'લોડ થઈ રહ્યું છે...',
    enabled: 'સક્રિય',
    disabled: 'અક્ષમ',
    clear: 'બધું સાફ કરો',
    filter: 'ફિલ્ટર',
    all: 'બધા',
    today: 'આજે',

    smartRemindersTitle: 'સ્માર્ટ ખેતી રીમાઇન્ડર્સ',
    farmDiaryTitle: 'ડિજિટલ ખેતર ડાયરી',
    aiChatTitle: 'એગ્રીજીપીટી વોઇસ ચેટ',
    cropRecTitle: 'પાક પસંદગી માર્ગદર્શન',
    businessFinanceTitle: 'કૃષિ વ્યવસાય અને બજાર ભાવ',
    leafScanTitle: 'એઆઈ રોગ સ્કેનર',
    schemesTitle: 'સરકારી યોજનાઓ અને સબસિડી',
    studyCenterTitle: 'ખેડૂત તાલીમ કેન્દ્ર',
    offlineCabinetTitle: 'ઓફલાઇન દસ્તાવેજો',
    mobileApkTitle: 'એન્ડ્રોઇડ એપ સેન્ટર',
  },

  Punjabi: {
    dashboard: 'ਡੈਸ਼ਬੋਰਡ',
    reminders: 'ਯਾਦ-ਦਹਾਨੀਆਂ',
    notes: 'ਖੇਤ ਨੋਟਸ',
    chat: 'ਏਆਈ ਚੈਟ',
    cropAdvice: 'ਫਸਲ ਸਲਾਹ',
    business: 'ਖੇਤੀਬਾੜੀ ਵਪਾਰ',
    diseaseDetector: 'ਬੀਮਾਰੀ ਦੀ ਜਾਂਚ',
    subsidies: 'ਸਰਕਾਰੀ ਸਕੀਮਾਂ',
    study: 'ਸਿੱਖਿਆ ਕੇਂਦਰ',
    offlineFile: 'ਔਫਲਾਈਨ ਕੈਬਨਿਟ',
    androidApk: 'ਐਂਡਰੌਇਡ ਐਪ',

    appTitle: 'ਐਗਰੀਵਰਸ ਏਆਈ',
    subTitle: 'ਭਾਰਤ ਦਾ ਬੁੱਧੀਮਾਨ ਖੇਤੀਬਾੜੀ ਸਲਾਹਕਾਰ',
    signOut: 'ਸਾਈਨ ਆਊਟ',
    voiceGuidance: 'ਆਵਾਜ਼ ਮਾਰਗਦਰਸ਼ਨ',
    transferToMobile: 'ਮੋਬਾਈਲ ਤੇ ਟ੍ਰਾਂਸਫਰ',
    permissions: 'ਮਨਜ਼ੂਰੀਆਂ',
    theme: 'ਥੀਮ',
    assistantModules: 'ਸਹਾਇਕ ਮੋਡਿਊਲ',
    language: 'ਭਾਸ਼ਾ',

    welcome: 'ਜੀ ਆਇਆਂ ਨੂੰ',
    farmer: 'ਕਿਸਾਨ',
    mandiPrices: 'ਲਾਇਵ ਮੰਡੀ ਭਾਅ',
    weatherAlerts: 'ਮੌਸਮ ਅਤੇ ਖੇਤੀ ਸਲਾਹ',
    getAdviceBtn: 'ਫਸਲ ਸਲਾਹ ਲਵੋ',
    quickActions: 'ਤੇਜ਼ ਸੇਵਾਵਾਂ',
    recentActivity: 'ਤਾਜ਼ਾ ਗਤੀਵਿਧੀਆਂ',
    quickAddReminder: '+ ਨਵਾਂ ਯਾਦ-ਦਹਾਨੀ',
    quickScanLeaf: '📷 ਪੱਤੇ ਦੀ ਬੀਮਾਰੀ ਸਕੈਨ',
    quickAddNote: '📝 ਨੋਟ ਲਿਖੋ',
    quickCalculateProfit: '📈 ਮੁਨਾਫਾ ਗਿਣੋ',
    location: 'ਸਥਾਨ',
    changeLocation: 'ਸਥਾਨ ਬਦਲੋ',
    district: 'ਜ਼ਿਲ੍ਹਾ',
    state: 'ਰਾਜ',

    save: 'ਸੰਭਾਲੋ',
    cancel: 'ਰੱਦ ਕਰੋ',
    delete: 'ਹਟਾਓ',
    back: 'ਵਾਪਸ',
    search: 'ਖੋਜੋ...',
    viewDetails: 'ਵੇਰਵੇ ਵੇਖੋ',
    loading: 'ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...',
    enabled: 'ਚਾਲੂ',
    disabled: 'ਬੰਦ',
    clear: 'ਸਭ ਹਟਾਓ',
    filter: 'ਫਿਲਟਰ',
    all: 'ਸਭ',
    today: 'ਅੱਜ',

    smartRemindersTitle: 'ਸਮਾਰਟ ਖੇਤੀ ਯਾਦ-ਦਹਾਨੀਆਂ',
    farmDiaryTitle: 'ਡਿਜੀਟਲ ਖੇਤ ਡਾਇਰੀ',
    aiChatTitle: 'ਐਗਰੀਜੀਪੀਟੀ ਆਵਾਜ਼ ਚੈਟ',
    cropRecTitle: 'ਫਸਲ ਚੋਣ ਸਲਾਹਕਾਰ',
    businessFinanceTitle: 'ਖੇਤੀਬਾੜੀ ਵਪਾਰ ਅਤੇ ਮੰਡੀ ਭਾਅ',
    leafScanTitle: 'ਏਆਈ ਪੱਤੇ ਦੀ ਬੀਮਾਰੀ ਸਕੈਨਰ',
    schemesTitle: 'ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਅਤੇ ਸਬਸਿਡੀ',
    studyCenterTitle: 'ਕਿਸਾਨ ਸਿੱਖਿਆ ਕੇਂਦਰ',
    offlineCabinetTitle: 'ਔਫਲਾਈਨ ਸੰਭਾਲੇ ਦਸਤਾਵੇਜ਼',
    mobileApkTitle: 'ਐਂਡਰੌਇਡ ਐਪ ਕੇਂਦਰ',
  }
};

export function t(key: keyof Translations, lang: LanguageCode = 'English'): string {
  const langDict = TRANSLATIONS[lang] || TRANSLATIONS['English'];
  return langDict[key] || TRANSLATIONS['English'][key] || key;
}
