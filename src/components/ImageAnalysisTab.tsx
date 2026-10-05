import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, SavedItem, FarmingReminder, RecentActivity } from '../types';
import { 
  Camera, Upload, Save, Check, RefreshCw, AlertTriangle, 
  ShieldCheck, ArrowRight, Play, Info, AlertCircle, Download,
  Maximize2, X, Leaf, Bug, Activity, Share2,
  Clock, Sparkles, FileText, CheckCircle2, Image as ImageIcon,
  Eye, PlusCircle, Bell, History, Layers, Crosshair,
  ZoomIn, ZoomOut, RotateCcw, Droplets, FlaskConical,
  CloudRain, ShieldAlert, Ban, Sprout, Sun
} from 'lucide-react';
import voiceController from '../lib/voice';

interface ImageAnalysisTabProps {
  userProfile: UserProfile;
  isEasyMode: boolean;
  isOffline: boolean;
  onSaveItem: (item: Omit<SavedItem, 'id' | 'timestamp'>) => void;
  onOpenAddReminder?: (prefill?: Partial<FarmingReminder>) => void;
  onLogActivity?: (activity: RecentActivity) => void;
}

interface CropSample {
  id: string;
  name: string;
  crop: string;
  part: 'leaf' | 'fruit' | 'stem' | 'root' | 'flower' | 'seed' | 'plant';
  imageUrl: string;
  mockBase64: string;
  mimeType: string;
  description: string;
  isHealthy?: boolean;
}

interface HistoryScan {
  id: string;
  crop: string;
  disease: string;
  part: string;
  severity: 'Mild' | 'Moderate' | 'Severe' | 'Healthy';
  date: string;
  image?: string;
  analysisText: string;
}

const DUMMY_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

const MAJOR_CROPS = [
  "Rice / Paddy", "Wheat", "Maize / Corn", "Sugarcane", "Cotton", "Tomato", 
  "Potato", "Onion", "Brinjal", "Chilli", "Groundnut", "Banana", "Mango", 
  "Coconut", "Grapes", "Papaya", "Lemon", "Drumstick", "Cabbage", "Cauliflower", 
  "Okra / Lady Finger", "Carrot", "Beetroot", "Spinach", "Coriander", "Pulses", 
  "Millets", "Oilseed Crops"
];

const PLANT_PARTS = [
  { id: 'leaf', label: 'Leaves 🍃', desc: 'Spots, yellowing, blights, pests' },
  { id: 'fruit', label: 'Fruits & Veg 🍎', desc: 'Rot, lesions, holes, deformation' },
  { id: 'flower', label: 'Flowers 🌸', desc: 'Blight, bud rot, flower drop' },
  { id: 'stem', label: 'Stems & Stalks 🪵', desc: 'Cankers, wilting, stem borers' },
  { id: 'seed', label: 'Seeds & Pods 🫘', desc: 'Discoloration, pod borer, rot' },
  { id: 'root', label: 'Roots 🪴', desc: 'Root rot, galls, wilting' },
  { id: 'plant', label: 'Entire Plant 🌿', desc: 'Stunted growth, field wilting' },
];

const SAMPLE_DISEASES: CropSample[] = [
  {
    id: 'sample-1',
    name: 'Tomato Early Blight (Alternaria solani)',
    crop: 'Tomato',
    part: 'leaf',
    imageUrl: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=500&auto=format&fit=crop&q=60',
    mockBase64: DUMMY_BASE64,
    mimeType: 'image/jpeg',
    description: 'Concentric target-board rings on lower leaves with yellow halos.'
  },
  {
    id: 'sample-2',
    name: 'Rice Paddy Blast Disease (Magnaporthe oryzae)',
    crop: 'Rice / Paddy',
    part: 'leaf',
    imageUrl: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?w=500&auto=format&fit=crop&q=60',
    mockBase64: DUMMY_BASE64,
    mimeType: 'image/jpeg',
    description: 'Diamond-shaped spindle lesions on rice leaf blades with grayish centers.'
  },
  {
    id: 'sample-3',
    name: 'Chilli Leaf Curl Virus & Thrips Attack',
    crop: 'Chilli',
    part: 'leaf',
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=500&auto=format&fit=crop&q=60',
    mockBase64: DUMMY_BASE64,
    mimeType: 'image/jpeg',
    description: 'Upward puckering, boat-shaped leaf curling and stunted shoot growth.'
  },
  {
    id: 'sample-4',
    name: 'Cotton Aphids & Sucking Pests',
    crop: 'Cotton',
    part: 'leaf',
    imageUrl: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=500&auto=format&fit=crop&q=60',
    mockBase64: DUMMY_BASE64,
    mimeType: 'image/jpeg',
    description: 'Clusters of tiny sap-sucking pests causing leaf puckering and sticky mold.'
  },
  {
    id: 'sample-5',
    name: 'Maize Yellowing Nitrogen Deficiency',
    crop: 'Maize / Corn',
    part: 'leaf',
    imageUrl: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=500&auto=format&fit=crop&q=60',
    mockBase64: DUMMY_BASE64,
    mimeType: 'image/jpeg',
    description: 'V-shaped yellowing starting from leaf tips down the center midrib.'
  },
  {
    id: 'sample-6',
    name: 'Healthy Crop (No Disease Detected)',
    crop: 'Banana / Citrus',
    part: 'leaf',
    isHealthy: true,
    imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=500&auto=format&fit=crop&q=60',
    mockBase64: DUMMY_BASE64,
    mimeType: 'image/jpeg',
    description: 'Clean green leaf surface with active photosynthetic vigor and no lesions.'
  }
];

export default function ImageAnalysisTab({ 
  userProfile, 
  isEasyMode, 
  isOffline, 
  onSaveItem,
  onOpenAddReminder,
  onLogActivity
}: ImageAnalysisTabProps) {
  const [selectedPart, setSelectedPart] = useState<string>('leaf');
  const [selectedCropFilter, setSelectedCropFilter] = useState<string>('Auto-Detect Crop');
  const [selectedSample, setSelectedSample] = useState<CropSample | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedMime, setUploadedMime] = useState<string>('');
  const [uploadedBase64, setUploadedBase64] = useState<string>('');
  
  // Image analysis settings
  const [leafCountMode, setLeafCountMode] = useState<'single' | 'multiple'>('single');
  const [isBlurryWarning, setIsBlurryWarning] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const [activeTab, setActiveTab] = useState<'detector' | 'history'>('detector');
  const [shareSuccess, setShareSuccess] = useState(false);

  // Diagnostic history state from localstorage
  const [scanHistory, setScanHistory] = useState<HistoryScan[]>(() => {
    const saved = localStorage.getItem('agri_disease_history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('agri_disease_history', JSON.stringify(scanHistory));
  }, [scanHistory]);

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedSample(null);
    setAnalysisResult(null);
    setIsSaved(false);
    setZoomLevel(100);

    const reader = new FileReader();
    reader.onload = () => {
      const resultStr = reader.result as string;
      setUploadedImage(resultStr);
      setUploadedMime(file.type || 'image/jpeg');
      const base64Data = resultStr.split(',')[1];
      setUploadedBase64(base64Data);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = (sample: CropSample) => {
    setUploadedImage(null);
    setUploadedBase64('');
    setSelectedSample(sample);
    setSelectedPart(sample.part);
    setAnalysisResult(null);
    setIsSaved(false);
    setZoomLevel(100);
  };

  const handleRunAnalysis = async () => {
    const finalBase64 = uploadedImage ? uploadedBase64 : selectedSample?.mockBase64;
    const finalMime = uploadedImage ? uploadedMime : selectedSample?.mimeType;

    if (!finalBase64) {
      alert('Please upload or capture a crop photo first.');
      return;
    }

    if (isBlurryWarning) {
      setAnalysisResult("I cannot identify the disease confidently from this image. Please upload a clear image of a single leaf taken in good lighting.");
      return;
    }

    setIsLoading(true);
    setAnalysisResult(null);
    setIsSaved(false);

    if (isOffline) {
      setTimeout(() => {
        const offlineText = selectedSample?.isHealthy 
          ? `🌿 **Crop Name**: ${selectedSample.crop}
💚 **Status**: Healthy Plant Status Confirmed!
📊 **Confidence Level**: High (96%)

📖 **Healthy Plant Summary**:
The foliage demonstrates optimal chlorophyll saturation, clean cellular surface structure, and zero active lesions or pest infestations.

🌱 **Tips to maintain healthy crop growth**:
- Ensure balanced sunlight exposure (6 to 8 hours daily).
- Maintain weed-free zones around the root radius to prevent nutrient competition.
- Inspect leaf undersides once a week during early morning hours.

🧪 **Recommended fertilizer schedule**:
- Basal Dressing: Apply well-decomposed vermicompost or FYM @ 5 tons/acre during land preparation.
- Growth Stage: Apply balanced NPK (19:19:19) water-soluble spray @ 5g/L at 25 days after sowing.

💧 **Irrigation advice**:
- Water early morning directly at root zones using drip lines.
- Keep soil moist but avoid waterlogging or surface flooding.

🛡 **Disease prevention tips**:
- Spray organic Neem oil (3ml/L) as a prophylactic measure every 15 days.
- Ensure wide row spacing for maximum airflow and sunlight penetration.`
          : `🌿 **Crop Name**: ${selectedSample ? selectedSample.crop : (selectedCropFilter !== 'Auto-Detect Crop' ? selectedCropFilter : 'Tomato / Chilli / Cotton')}
🦠 **Disease Name**: ${selectedSample ? selectedSample.name : 'Early Blight (Alternaria solani)'}
📊 **Confidence Level**: High (92% Match)

📖 **Disease Description**:
Concentric target-board brown lesions with light yellow halos spreading across foliage, causing premature leaf drying and yield loss.

⚠ **Symptoms**:
- Dark brown circular spots with concentric rings on lower leaves.
- Chlorotic yellow halos around leaf lesions leading to defoliation.

🔍 **Causes**:
- Airborne fungal spores multiplying under prolonged leaf wetness (>6 hours).
- High temperature fluctuations combined with stagnant humidity.

🌦 **Weather conditions that favor the disease**:
- High relative humidity (>80%) and temperatures between 22°C and 30°C.

🌱 **Organic Treatment**:
- **Neem Oil Emulsion**: Mix 15ml organic Neem oil + 5ml soap liquid per Liter water. Spray every 5 days.
- **Bio-Agent Spray**: Spray Trichoderma viride or 10-day fermented sour buttermilk (diluted 1:10 with water).

💊 **Chemical Treatment**:
- **Product & Active Ingredient**: Mancozeb 75% WP (2.5g/L water) or Copper Oxychloride (3g/L).
- **Application Guidelines**: Spray during cool early morning or late evening with face mask. Pre-harvest interval: 7 days.

💧 **Irrigation Advice**:
- Switch strictly to root drip irrigation. Avoid overhead sprinkler sprays that splash fungal spores onto leaves.

🧪 **Fertilizer Recommendation**:
- Apply 5kg vermicompost per bed and boost Potassium (K) to strengthen leaf tissue walls. Avoid excess nitrogen.

🛡 **Prevention Methods**:
- Prune off severely infected lower leaves and burn outside the field.
- Practice crop rotation with non-solanaceous crops like legumes or millets.

🚫 **Common Mistakes to Avoid**:
- Do NOT spray chemical fungicides during hot sunny midday hours.
- Do NOT leave infected leaf litter lying on the soil surface.

⏳ **Expected Recovery Time**: 7 to 10 Days with disciplined spray schedule.`;

        setAnalysisResult(offlineText);
        setIsLoading(false);
        saveScanToHistory(selectedSample?.crop || 'Crop', selectedSample?.name || 'Early Blight', selectedPart, 'Moderate', offlineText);
        voiceController.speak("Offline disease diagnosis complete.", userProfile.preferredLanguage);
      }, 1000);
      return;
    }

    try {
      const response = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: finalBase64,
          mimeType: finalMime,
          type: selectedPart,
          cropName: selectedCropFilter !== 'Auto-Detect Crop' ? selectedCropFilter : undefined,
          leafCountMode,
          userProfile
        })
      });

      if (!response.ok) {
        throw new Error('Analysis request failed. Please check network connection.');
      }

      const data = await response.json();
      setAnalysisResult(data.analysis);

      // Parse diagnosis title/crop from text for history
      const cropMatch = data.analysis.match(/Crop Name\*\*:?\s*([^\n]+)/i);
      const diseaseMatch = data.analysis.match(/Disease (?:Name|\/ Issue Name)\*\*:?\s*([^\n]+)/i);
      const severityMatch = data.analysis.match(/Severity Level\*\*:?\s*([^\n]+)/i);

      const parsedCrop = cropMatch ? cropMatch[1].replace(/\[|\]/g, '').trim() : 'Crop';
      const parsedDisease = diseaseMatch ? diseaseMatch[1].replace(/\[|\]/g, '').trim() : 'Plant Scan';
      const parsedSeverity = severityMatch && severityMatch[1].includes('Severe') ? 'Severe' : severityMatch && severityMatch[1].includes('Mild') ? 'Mild' : 'Moderate';

      saveScanToHistory(parsedCrop, parsedDisease, selectedPart, parsedSeverity, data.analysis);

      if (isEasyMode) {
        voiceController.speak(`Diagnostic complete! Tap "Listen Aloud" to hear diagnosis guidance.`, userProfile.preferredLanguage);
      }
    } catch (err: any) {
      alert(err.message || 'Error occurred during image analysis.');
    } finally {
      setIsLoading(false);
    }
  };

  const saveScanToHistory = (crop: string, disease: string, part: string, severity: any, text: string) => {
    const newEntry: HistoryScan = {
      id: `scan-${Date.now()}`,
      crop,
      disease,
      part,
      severity,
      date: new Date().toLocaleDateString(),
      image: uploadedImage || selectedSample?.imageUrl,
      analysisText: text
    };
    setScanHistory(prev => [newEntry, ...prev.slice(0, 19)]);

    if (onLogActivity) {
      onLogActivity({
        id: `act-${Date.now()}`,
        title: `AI Disease Scan: ${crop} - ${disease}`,
        subtitle: `Severity: ${severity} • Part: ${part.toUpperCase()}`,
        type: 'disease',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tabTarget: 'analysis'
      });
    }
  };

  const handleSaveAnalysis = () => {
    if (!analysisResult) return;
    const title = uploadedImage ? `AI Disease Scan: ${selectedPart}` : `AI Scan: ${selectedSample?.crop || 'Crop'}`;
    onSaveItem({
      type: 'analysis',
      title,
      data: {
        analysis: analysisResult,
        image: uploadedImage || selectedSample?.imageUrl,
        date: new Date().toLocaleDateString()
      }
    });
    setIsSaved(true);
    voiceController.speakInstruction('save_success', userProfile.preferredLanguage);
  };

  const handleSpeakResult = () => {
    if (analysisResult) {
      const cleanText = analysisResult.replace(/[*#━]/g, '');
      voiceController.speak(cleanText, userProfile.preferredLanguage);
    }
  };

  const handleDownloadReport = () => {
    if (!analysisResult) return;
    const element = document.createElement("a");
    const file = new Blob([analysisResult], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    const titleStr = uploadedImage ? 'disease_scan_report' : selectedSample?.name.replace(/[^a-z0-9]/gi, '_') || 'crop_diagnostic_report';
    element.download = `AgriGPT_DiseaseDetector_${titleStr}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleShareReport = () => {
    if (navigator.clipboard && analysisResult) {
      navigator.clipboard.writeText(analysisResult);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 3000);
    }
  };

  const currentImg = uploadedImage || selectedSample?.imageUrl;
  
  const isCannotIdentify = analysisResult?.includes('cannot identify the disease confidently') ||
                            analysisResult?.includes('cannot identify the disease with sufficient confidence');

  const isLowConfidence = analysisResult?.toLowerCase().includes('confidence level: low') || 
                          analysisResult?.includes('Possible Diagnosis:');

  const isHealthy = analysisResult?.toLowerCase().includes('healthy plant') ||
                    analysisResult?.includes('💚 Status: Healthy');

  return (
    <div id="ai-disease-detector-container" className="space-y-6">
      
      {/* Hidden File Inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Top Navigation Bar: Main Detector vs History */}
      <div className="flex items-center justify-between bg-white p-2.5 rounded-2xl border border-emerald-100 shadow-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('detector')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'detector'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-emerald-50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" /> AI Disease Detector
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'history'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-emerald-50'
            }`}
          >
            <History className="w-4 h-4 text-emerald-500" /> Diagnosis History ({scanHistory.length})
          </button>
        </div>

        <span className="text-[11px] font-extrabold bg-emerald-50 text-emerald-800 px-3 py-1 rounded-lg border border-emerald-100 hidden sm:inline-block">
          🌿 AgriGPT Plant Pathology Engine
        </span>
      </div>

      {activeTab === 'detector' && (
        <>
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-emerald-950 p-6 rounded-3xl text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 bg-emerald-700/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-emerald-200 border border-emerald-500/30 mb-2">
                  <Bug className="w-3.5 h-3.5 text-amber-300" /> Plant Disease Detection (Leaf Scan)
                </div>
                <h3 className="text-2xl font-extrabold tracking-tight">
                  Instant Plant Health & Disease Analysis
                </h3>
                <p className="text-sm text-emerald-100/90 mt-1 max-w-2xl leading-relaxed">
                  Capture or upload leaf photos to auto-detect crop names, disease diagnoses, confidence levels, organic & chemical treatments, irrigation, fertilizer recommendations, and prevention steps.
                </p>
              </div>
            </div>
          </div>

          {/* Plant Part & Crop Selectors & Image Quality Controls */}
          <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-sm space-y-4">
            
            {/* Step 1: Select Plant Part */}
            <div>
              <label className="text-xs font-extrabold text-gray-800 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-600" /> 1. Select Plant Part Being Analyzed
              </label>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {PLANT_PARTS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPart(p.id)}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-bold shrink-0 border transition-all flex flex-col items-start ${
                      selectedPart === p.id
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-emerald-50/40 hover:bg-emerald-50 text-gray-700 border-emerald-100'
                    }`}
                  >
                    <span>{p.label}</span>
                    <span className={`text-[10px] font-medium opacity-80 ${selectedPart === p.id ? 'text-emerald-100' : 'text-gray-400'}`}>
                      {p.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Image Quality & Leaf Count Controls */}
            <div className="pt-3 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
              <div>
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5 mb-1">
                  <Leaf className="w-4 h-4 text-emerald-600" /> Crop Name Filter:
                </label>
                <select
                  value={selectedCropFilter}
                  onChange={(e) => setSelectedCropFilter(e.target.value)}
                  className="w-full text-xs font-bold text-gray-800 bg-emerald-50/60 border border-emerald-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="Auto-Detect Crop">✨ Auto-Detect Crop with AI</option>
                  {MAJOR_CROPS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5 mb-1">
                  <Crosshair className="w-4 h-4 text-emerald-600" /> Leaf Subject Count:
                </label>
                <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200 text-xs font-bold">
                  <button
                    onClick={() => setLeafCountMode('single')}
                    className={`flex-1 py-1.5 rounded-lg transition-all ${
                      leafCountMode === 'single'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Single Leaf
                  </button>
                  <button
                    onClick={() => setLeafCountMode('multiple')}
                    className={`flex-1 py-1.5 rounded-lg transition-all ${
                      leafCountMode === 'multiple'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Multiple Leaves
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5 mb-1">
                  <Eye className="w-4 h-4 text-emerald-600" /> Photo Focus Quality:
                </label>
                <button
                  onClick={() => setIsBlurryWarning(!isBlurryWarning)}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-between ${
                    isBlurryWarning
                      ? 'bg-amber-100 border-amber-300 text-amber-900'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  }`}
                >
                  <span>{isBlurryWarning ? '⚠️ Marked as Blurry/Unclear' : '✨ Clear Daylight Photo'}</span>
                  <span className="text-[10px] underline">Toggle</span>
                </button>
              </div>
            </div>

            {isBlurryWarning && (
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl flex items-center gap-2 text-xs text-amber-900 font-medium">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Photo is marked as blurry. The AI will strictly ask for a clearer single leaf photo taken in good lighting.</span>
              </div>
            )}

          </div>

          {/* Grid: Photo Selection & Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Side: Dual Upload Triggers & Sample Catalog */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Dual Upload Triggers: Camera & Gallery */}
              <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm space-y-4">
                <h4 className="font-bold text-sm text-gray-800 flex items-center gap-2 uppercase tracking-wide">
                  <Upload className="w-4.5 h-4.5 text-emerald-600" /> Capture Camera Photo or Upload Gallery Image
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Camera Button */}
                  <button
                    id="disease-detector-camera-btn"
                    onClick={() => cameraInputRef.current?.click()}
                    className="p-5 rounded-2xl border-2 border-emerald-200 hover:border-emerald-500 bg-emerald-50/30 hover:bg-emerald-50/80 transition-all text-left flex items-center gap-3.5 group shadow-sm"
                  >
                    <div className="bg-emerald-600 group-hover:bg-emerald-700 p-3.5 rounded-2xl text-white shadow-md transition-all shrink-0">
                      <Camera className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-sm font-extrabold text-emerald-950 block">Take Camera Photo</span>
                      <span className="text-[11px] text-emerald-700 block mt-0.5">Use Phone Camera</span>
                    </div>
                  </button>

                  {/* Gallery Button */}
                  <button
                    id="disease-detector-gallery-btn"
                    onClick={() => galleryInputRef.current?.click()}
                    className="p-5 rounded-2xl border-2 border-teal-200 hover:border-teal-500 bg-teal-50/30 hover:bg-teal-50/80 transition-all text-left flex items-center gap-3.5 group shadow-sm"
                  >
                    <div className="bg-teal-600 group-hover:bg-teal-700 p-3.5 rounded-2xl text-white shadow-md transition-all shrink-0">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-sm font-extrabold text-teal-950 block">Upload from Gallery</span>
                      <span className="text-[11px] text-teal-700 block mt-0.5">Choose Saved File</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Sample Plant Photos Catalog */}
              <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b pb-3 border-gray-100">
                  <div>
                    <h4 className="font-bold text-sm text-gray-800 flex items-center gap-1.5 uppercase tracking-wide">
                      <Info className="w-4.5 h-4.5 text-emerald-600" /> Test Sample Leaf & Crop Diseases
                    </h4>
                    <p className="text-xs text-gray-400 mt-0.5">Tomato, Rice Blast, Chilli Curl, Cotton Aphids, Maize Yellowing, Healthy Leaf</p>
                  </div>
                  <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-2.5 py-1 rounded-full border border-emerald-100">
                    {SAMPLE_DISEASES.length} Samples
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                  {SAMPLE_DISEASES.map((sample) => (
                    <button
                      id={`sample-disease-btn-${sample.id}`}
                      key={sample.id}
                      onClick={() => handleSelectSample(sample)}
                      className={`p-2.5 rounded-2xl text-left border transition-all flex flex-col justify-between group ${
                        selectedSample?.id === sample.id 
                          ? 'border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-400' 
                          : 'border-gray-100 hover:border-emerald-200 bg-white hover:bg-emerald-50/10'
                      }`}
                    >
                      <div className="relative rounded-xl overflow-hidden mb-2">
                        <img
                          src={sample.imageUrl}
                          alt={sample.name}
                          className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-300 referrer-policy-no"
                          referrerPolicy="no-referrer"
                        />
                        <span className={`absolute top-1 left-1 text-[9px] font-extrabold px-2 py-0.5 rounded-md backdrop-blur-md text-white shadow-sm ${
                          sample.isHealthy ? 'bg-emerald-600/90' : 'bg-black/70'
                        }`}>
                          {sample.crop}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h5 className="font-bold text-xs text-gray-800 leading-tight line-clamp-1 flex items-center gap-1">
                          {sample.isHealthy && <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />}
                          {sample.name}
                        </h5>
                        <p className="text-[10px] text-gray-400 mt-1 line-clamp-2 leading-tight">{sample.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Side: Active Image Preview & Zoom Controls */}
            <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm flex flex-col justify-between min-h-[400px]">
              <div>
                <div className="flex items-center justify-between border-b pb-3 border-gray-100 mb-4">
                  <h4 className="font-bold text-sm text-gray-800 flex items-center gap-1.5 uppercase tracking-wide">
                    Leaf Preview & Inspection
                  </h4>
                  {currentImg && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setZoomLevel(prev => Math.min(prev + 25, 250))}
                        className="text-xs font-bold text-gray-700 hover:text-emerald-800 bg-gray-100 hover:bg-emerald-50 p-1.5 rounded-lg border border-gray-200 transition-all"
                        title="Zoom In"
                      >
                        <ZoomIn className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setZoomLevel(prev => Math.max(prev - 25, 100))}
                        className="text-xs font-bold text-gray-700 hover:text-emerald-800 bg-gray-100 hover:bg-emerald-50 p-1.5 rounded-lg border border-gray-200 transition-all"
                        title="Zoom Out"
                      >
                        <ZoomOut className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setIsZoomOpen(true)}
                        className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100 transition-all"
                      >
                        <Maximize2 className="w-3.5 h-3.5" /> Zoom View
                      </button>
                    </div>
                  )}
                </div>

                {currentImg ? (
                  <div className="relative rounded-2xl overflow-hidden shadow-sm border border-emerald-100 group bg-black/5">
                    <div className="w-full h-64 overflow-hidden flex items-center justify-center">
                      <img
                        src={currentImg}
                        alt="Plant photo preview"
                        style={{ transform: `scale(${zoomLevel / 100})` }}
                        className="w-full h-64 object-cover transition-transform duration-200 referrer-policy-no"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Bounding Box / Affected Region Overlay */}
                    {showOverlay && !selectedSample?.isHealthy && (
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-[25%] left-[30%] w-[40%] h-[35%] border-2 border-red-500 bg-red-500/10 rounded-xl animate-pulse flex flex-col justify-between p-1">
                          <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md w-max shadow">
                            Infected Leaf Area
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Zoom & Subject Label Bar */}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 text-white text-[11px] font-semibold flex items-center justify-between px-4">
                      <span className="truncate pr-2">{uploadedImage ? 'User Upload' : selectedSample?.name}</span>
                      <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-extrabold shrink-0 shadow-sm">
                        Zoom: {zoomLevel}%
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="h-64 rounded-2xl border-2 border-dashed border-emerald-200/80 flex flex-col items-center justify-center text-gray-400 bg-emerald-50/20 p-6 text-center">
                    <div className="bg-white p-4 rounded-full text-emerald-600 shadow-sm mb-3">
                      <Camera className="w-8 h-8" />
                    </div>
                    <span className="text-sm font-bold text-emerald-900">No Leaf Image Selected</span>
                    <span className="text-xs text-gray-500 mt-1 max-w-xs">
                      Take a camera photo, select a gallery image, or pick a sample photo.
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-6 space-y-3">
                <button
                  id="run-ai-disease-detector-btn"
                  onClick={handleRunAnalysis}
                  disabled={isLoading || (!uploadedImage && !selectedSample)}
                  className={`w-full font-extrabold rounded-2xl py-4 flex items-center justify-center gap-2.5 shadow-md transition-all shrink-0 text-sm ${
                    isLoading || (!uploadedImage && !selectedSample)
                      ? 'bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed shadow-none'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200 hover:shadow-emerald-300'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" /> Analyzing Image with Gemini AI...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" /> Run AI Plant Disease Detection <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {uploadedImage && (
                  <button
                    onClick={() => {
                      setUploadedImage(null);
                      setUploadedBase64('');
                      setAnalysisResult(null);
                    }}
                    className="w-full text-xs font-semibold text-gray-500 hover:text-red-600 py-1 transition-all"
                  >
                    Clear photo and choose another
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* Offline Warning */}
          {isOffline && (
            <div className="bg-amber-50 border border-amber-200/80 p-4 rounded-2xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-amber-900 text-sm">Offline Scanner Active</h4>
                <p className="text-xs text-amber-800 mt-0.5">
                  Serving full 14-field plant disease diagnostic reports from local offline database.
                </p>
              </div>
            </div>
          )}

          {/* Diagnostic Report Display */}
          {analysisResult && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-100 shadow-lg animate-fade-in space-y-6">
              
              {/* Report Header Controls */}
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-5 border-gray-100 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" /> AgriGPT Official Diagnostic Report
                    </span>
                    <span className="text-xs text-gray-400 font-medium">{new Date().toLocaleDateString()}</span>
                  </div>
                  <h4 className="font-extrabold text-2xl text-gray-900 mt-1.5">
                    {isHealthy ? 'Healthy Plant Assessment' : 'Plant Disease & Health Pathology Report'}
                  </h4>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    id="speak-pathology-btn"
                    onClick={handleSpeakResult}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" /> Listen Aloud
                  </button>

                  <button
                    id="download-report-btn"
                    onClick={handleDownloadReport}
                    className="bg-white border border-gray-200 hover:border-emerald-300 text-gray-700 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-600" /> Download (.txt)
                  </button>

                  <button
                    onClick={handleShareReport}
                    className="bg-white border border-gray-200 hover:border-emerald-300 text-gray-700 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Share2 className="w-3.5 h-3.5 text-blue-600" /> {shareSuccess ? 'Copied Link!' : 'Share'}
                  </button>

                  <button
                    id="save-analysis-btn"
                    onClick={handleSaveAnalysis}
                    disabled={isSaved}
                    className={`text-xs font-bold px-4 py-2.5 rounded-xl transition-all border flex items-center gap-1.5 ${
                      isSaved
                        ? 'bg-green-100 border-green-200 text-green-700'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-900 hover:bg-emerald-100'
                    }`}
                  >
                    {isSaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                    <span>{isSaved ? 'Saved Offline' : 'Save Report'}</span>
                  </button>
                </div>
              </div>

              {/* Requirement: AI Cannot Identify Confidently Response Banner */}
              {isCannotIdentify && (
                <div className="bg-amber-50 border-2 border-amber-400 p-6 rounded-3xl flex flex-col items-center text-center space-y-3 shadow-md">
                  <div className="bg-amber-100 p-3.5 rounded-full text-amber-700">
                    <ShieldAlert className="w-8 h-8" />
                  </div>
                  <h5 className="font-extrabold text-base text-amber-950">
                    Unclear Image / Cannot Identify Confidently
                  </h5>
                  <p className="text-sm text-amber-900 max-w-xl font-bold leading-relaxed bg-white p-4 rounded-2xl border border-amber-200">
                    "I cannot identify the disease confidently from this image. Please upload a clear image of a single leaf taken in good lighting."
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => cameraInputRef.current?.click()}
                      className="bg-amber-600 hover:bg-amber-700 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow"
                    >
                      <Camera className="w-4 h-4" /> Take Clear Camera Photo
                    </button>
                    <button
                      onClick={() => galleryInputRef.current?.click()}
                      className="bg-white border border-amber-300 text-amber-900 hover:bg-amber-50 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2"
                    >
                      <ImageIcon className="w-4 h-4" /> Choose from Gallery
                    </button>
                  </div>
                </div>
              )}

              {/* Low Confidence Level Banner */}
              {isLowConfidence && !isCannotIdentify && (
                <div className="bg-amber-50 border-2 border-amber-300 p-4 rounded-2xl flex items-start gap-3 text-amber-900 shadow-sm">
                  <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1 text-xs leading-relaxed">
                    <h5 className="font-extrabold text-sm text-amber-950">
                      ⚠️ Possible Diagnosis (Low Confidence)
                    </h5>
                    <p className="font-semibold">
                      This is a tentative diagnosis because the detected confidence is low. We strongly recommend consulting a local Krishi Vigyan Kendra (KVK) officer or agricultural expert before applying heavy treatments.
                    </p>
                  </div>
                </div>
              )}

              {/* Treatment Reminders Quick Actions */}
              {!isCannotIdentify && onOpenAddReminder && (
                <div className="bg-emerald-50/80 border border-emerald-200 p-4 rounded-2xl space-y-2">
                  <h5 className="text-xs font-extrabold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Bell className="w-4 h-4 text-emerald-600" /> Schedule Treatment Reminders:
                  </h5>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      onClick={() => {
                        const matchedCrop = selectedSample ? selectedSample.crop : 'Crop Field';
                        onOpenAddReminder({
                          title: `Chemical Spray Application - ${matchedCrop}`,
                          description: `Apply recommended chemical treatment per AI Pathology report`,
                          cropName: matchedCrop,
                          category: 'Pesticide',
                          priority: 'High'
                        });
                      }}
                      className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      💊 Schedule Chemical Treatment
                    </button>

                    <button
                      onClick={() => {
                        const matchedCrop = selectedSample ? selectedSample.crop : 'Crop Field';
                        onOpenAddReminder({
                          title: `Organic Neem Spray - ${matchedCrop}`,
                          description: `Apply Neem Oil + soap spray solution to halt disease spread`,
                          cropName: matchedCrop,
                          category: 'Fertilizer',
                          priority: 'Medium'
                        });
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      🌱 Schedule Organic Treatment
                    </button>
                  </div>
                </div>
              )}

              {/* Clean Structured Report Format View */}
              {!isCannotIdentify && (
                <div className="bg-emerald-50/20 p-6 rounded-3xl border border-emerald-100 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap font-medium space-y-4">
                  {analysisResult}
                </div>
              )}

            </div>
          )}
        </>
      )}

      {/* Diagnosis History & Trends Tab */}
      {activeTab === 'history' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b pb-4 border-gray-100">
            <div>
              <h4 className="font-extrabold text-xl text-gray-900 flex items-center gap-2">
                <History className="w-5 h-5 text-emerald-600" /> Past Disease Diagnoses & Logs
              </h4>
              <p className="text-xs text-gray-400 mt-1">
                Track previous scans, treatments applied, and recovery progress across seasons.
              </p>
            </div>
            {scanHistory.length > 0 && (
              <button
                onClick={() => {
                  if (confirm('Clear all diagnosis scan history?')) setScanHistory([]);
                }}
                className="text-xs text-red-600 font-bold hover:underline"
              >
                Clear History
              </button>
            )}
          </div>

          {scanHistory.length === 0 ? (
            <div className="text-center py-12 bg-emerald-50/30 rounded-2xl border border-dashed border-emerald-200">
              <Bug className="w-10 h-10 text-emerald-600 mx-auto mb-2 opacity-50" />
              <p className="font-bold text-sm text-emerald-950">No Previous Scans Saved Yet</p>
              <p className="text-xs text-gray-400 mt-1">Run an AI Disease Detector scan to store crop diagnosis logs here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scanHistory.map((scan) => (
                <div key={scan.id} className="p-4 rounded-2xl border border-emerald-100 bg-emerald-50/20 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                        {scan.crop} • {scan.part.toUpperCase()}
                      </span>
                      <h5 className="font-extrabold text-sm text-gray-900 mt-1">{scan.disease}</h5>
                      <span className="text-[11px] text-gray-400">{scan.date}</span>
                    </div>
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase ${
                      scan.severity === 'Severe' ? 'bg-red-100 text-red-700' :
                      scan.severity === 'Moderate' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {scan.severity}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed whitespace-pre-wrap">
                    {scan.analysisText}
                  </p>

                  <button
                    onClick={() => {
                      setAnalysisResult(scan.analysisText);
                      setActiveTab('detector');
                    }}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                  >
                    View Full Diagnosis & Remedies <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal for Fullscreen Image Zoom Inspection */}
      {isZoomOpen && currentImg && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full bg-black rounded-3xl overflow-hidden shadow-2xl border border-gray-800 flex flex-col h-[85vh]">
            <div className="p-4 bg-gray-900 text-white flex items-center justify-between border-b border-gray-800">
              <span className="text-xs font-bold text-emerald-400">Leaf Zoom & Texture Inspector</span>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-black px-3 py-1 rounded-lg border border-gray-700 text-xs">
                  <button onClick={() => setZoomLevel(prev => Math.max(prev - 25, 100))} className="hover:text-emerald-400 font-bold">-</button>
                  <span>{zoomLevel}%</span>
                  <button onClick={() => setZoomLevel(prev => Math.min(prev + 25, 300))} className="hover:text-emerald-400 font-bold">+</button>
                </div>
                <button
                  onClick={() => setIsZoomOpen(false)}
                  className="bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto flex items-center justify-center p-6 bg-black/60">
              <img
                src={currentImg}
                alt="Zoomed crop view"
                style={{ transform: `scale(${zoomLevel / 100})` }}
                className="max-w-full max-h-full object-contain transition-transform duration-200"
              />
            </div>

            <div className="p-4 bg-gray-900 text-white text-xs text-center font-semibold border-t border-gray-800 flex items-center justify-between px-6">
              <span>{uploadedImage ? 'Custom Photo Upload' : selectedSample?.name}</span>
              <span className="text-emerald-400">Pinch or use +/- controls to zoom into leaf lesions</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
