import React, { useState } from 'react';
import { UserProfile, CropRecommendation, SavedItem, RecentActivity } from '../types';
import { 
  X, MapPin, Sprout, ArrowRight, ArrowLeft, Check, Sparkles, 
  RefreshCw, Droplets, Wallet, Calendar, ShieldAlert, Award, 
  ChevronRight, Bookmark, BookmarkCheck, Volume2, HardDrive
} from 'lucide-react';
import voiceController from '../lib/voice';

interface GetCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  isEasyMode: boolean;
  isOffline: boolean;
  onSaveItem: (item: Omit<SavedItem, 'id' | 'timestamp'>) => void;
  onLogActivity?: (activity: RecentActivity) => void;
}

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

const SOIL_TYPES = [
  'Alluvial / Riverbed Soil',
  'Clayey Soil',
  'Sandy Loam Soil',
  'Black Cotton Soil',
  'Red Soil',
  'Laterite Soil',
  'Silty Soil'
];

const SEASONS = [
  'Kharif (Monsoon - Jun to Oct)',
  'Rabi (Winter - Nov to Feb)',
  'Zaid (Summer - Mar to May)'
];

const LAND_SIZES = [
  'Less than 1 Acre',
  '1 - 2 Acres',
  '3 - 5 Acres',
  'More than 5 Acres'
];

const WATER_AVAILABILITIES = [
  'Borewell / Groundwater',
  'Canal Irrigation',
  'Rainfed Only',
  'Drip System Installed',
  'Pond / Tank Storage'
];

const BUDGETS = [
  'Low Budget (< ₹10,000)',
  'Medium Budget (₹10,000 - ₹25,000)',
  'High Budget (> ₹25,000)'
];

const LOADING_TIPS = [
  "Analyzing local soil parameters & pH values...",
  "Querying regional precipitation forecasts & historical charts...",
  "Evaluating seed germination rates and growth durations...",
  "Cross-referencing wholesale crop market price trends...",
  "Calculating expected profit margins and cultivation costs..."
];

export default function GetCropModal({
  isOpen,
  onClose,
  userProfile,
  isEasyMode,
  isOffline,
  onSaveItem,
  onLogActivity
}: GetCropModalProps) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTipIndex, setLoadingTipIndex] = useState(0);

  // Form states
  const [country, setCountry] = useState('India');
  const [state, setState] = useState(userProfile.state || 'Tamil Nadu');
  const [district, setDistrict] = useState(userProfile.district || 'Thanjavur');
  const [soilType, setSoilType] = useState('Alluvial / Riverbed Soil');
  const [season, setSeason] = useState('Kharif (Monsoon - Jun to Oct)');
  
  // Land size numeric & unit selector
  const [landSizeValue, setLandSizeValue] = useState<string>('2');
  const [landSizeUnit, setLandSizeUnit] = useState<string>('Acres');
  const [landSizeError, setLandSizeError] = useState<string | null>(null);

  const [waterAvailability, setWaterAvailability] = useState('Borewell / Groundwater');
  
  // Farming budget numeric input
  const [budgetValue, setBudgetValue] = useState<string>('50000');
  const [budgetError, setBudgetError] = useState<string | null>(null);

  // Results states
  const [results, setResults] = useState<CropRecommendation[] | null>(null);
  const [activeCropIndex, setActiveCropIndex] = useState(0);
  const [savedStatus, setSavedStatus] = useState<Record<number, boolean>>({});

  if (!isOpen) return null;

  // Rotate loading tips during API call
  const startLoadingTips = () => {
    setLoadingTipIndex(0);
    const interval = setInterval(() => {
      setLoadingTipIndex(prev => (prev + 1) % LOADING_TIPS.length);
    }, 2000);
    return interval;
  };

  const handleNext = () => {
    if (step === 2) {
      if (!landSizeValue || landSizeValue.trim() === '') {
        setLandSizeError('Please enter your land size');
        return;
      }
      const num = parseFloat(landSizeValue);
      if (isNaN(num) || num <= 0) {
        setLandSizeError('Land size must be a positive number greater than 0');
        return;
      }
      setLandSizeError(null);
    }

    if (isEasyMode) {
      voiceController.speak(`Next step`, userProfile.preferredLanguage);
    }
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (isEasyMode) {
      voiceController.speak(`Previous step`, userProfile.preferredLanguage);
    }
    setStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!budgetValue || budgetValue.trim() === '') {
      setBudgetError('Please enter your farming budget');
      return;
    }
    const numBudget = parseFloat(budgetValue);
    if (isNaN(numBudget) || numBudget < 0) {
      setBudgetError('Budget cannot be a negative number');
      return;
    }
    setBudgetError(null);

    setIsLoading(true);
    setResults(null);
    setSavedStatus({});
    setActiveCropIndex(0);

    const intervalId = startLoadingTips();
    const formattedLandSize = `${landSizeValue} ${landSizeUnit}`;
    const formattedBudget = `₹ ${budgetValue}`;

    try {
      if (isOffline) {
        // Fallback simulated local response
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Get the relevant fallback from season mapping
        const normSeason = season.toLowerCase();
        let querySeason = "summer";
        if (normSeason.includes("rabi") || normSeason.includes("winter")) {
          querySeason = "rabi";
        } else if (normSeason.includes("kharif") || normSeason.includes("monsoon")) {
          querySeason = "kharif";
        }

        const response = await fetch(`/api/gemini/crop`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            soilType,
            landSize: formattedLandSize,
            waterAvailability,
            budget: formattedBudget,
            season: querySeason,
            state,
            district,
            userProfile
          })
        });

        if (!response.ok) {
          throw new Error("Could not retrieve offline recommendations.");
        }

        const data = await response.json();
        setResults(data);

        if (isEasyMode) {
          voiceController.speak(
            `Generated 5 crop plans for you in offline mode. The best recommended crop is ${data[0]?.cropName}. Click speak to hear details!`,
            userProfile.preferredLanguage
          );
        }
      } else {
        const response = await fetch('/api/gemini/crop', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            soilType,
            landSize: formattedLandSize,
            waterAvailability,
            budget: formattedBudget,
            season,
            state,
            district,
            userProfile
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to get crop recommendations from AI model.');
        }

        const data = await response.json();
        setResults(data);

        if (isEasyMode) {
          voiceController.speak(
            `I found 5 crop plans for your fields. The top recommendation is ${data[0]?.cropName} with suitability score ${data[0]?.suitabilityScore || 'high'}.`,
            userProfile.preferredLanguage
          );
        }
      }
      setStep(4); // Switch to results view step
      if (onLogActivity) {
        onLogActivity({
          id: `act-${Date.now()}`,
          title: `Crop Advisory Wizard: ${district} (${soilType})`,
          subtitle: `Recommended for ${season} • Land: ${formattedLandSize}`,
          type: 'advisory',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          tabTarget: 'crop'
        });
      }
    } catch (err: any) {
      alert(err.message || 'Error occurred while loading crop plans.');
    } finally {
      clearInterval(intervalId);
      setIsLoading(false);
    }
  };

  const handleSaveCrop = (crop: CropRecommendation, index: number) => {
    onSaveItem({
      type: 'crop',
      title: `Plan: ${crop.cropName} (${crop.suitabilityScore || 'Recommended'})`,
      data: crop
    });
    setSavedStatus(prev => ({ ...prev, [index]: true }));
    voiceController.speakInstruction('save_success', userProfile.preferredLanguage);
  };

  const handleSpeakCrop = (crop: CropRecommendation) => {
    const text = `${crop.cropName}. ${crop.description}. Expected Yield: ${crop.expectedYield}. Sowing Season: ${crop.idealSowingSeason || 'N/A'}. Growth Duration: ${crop.expectedGrowthDuration || 'N/A'}. Estimated Cost: ${crop.estimatedCultivationCost || 'N/A'}. Expected Profit: ${crop.expectedProfit || 'N/A'}.`;
    voiceController.speak(text, userProfile.preferredLanguage);
  };

  const activeCrop = results ? results[activeCropIndex] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className={`bg-white w-full ${step === 4 ? 'max-w-6xl h-[90vh]' : 'max-w-xl'} rounded-2xl shadow-2xl border border-emerald-100 flex flex-col overflow-hidden transition-all duration-300`}>
        
        {/* Modal Header */}
        <div className="bg-emerald-50 border-b border-emerald-100 p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-emerald-600 p-2 rounded-xl text-white">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-gray-800 text-lg">
                {step === 4 ? 'Smart Crop Recommendations' : 'Get Crop Recommendations'}
              </h3>
              <p className="text-xs text-gray-500">
                {step === 4 
                  ? 'AI-analyzed optimal choices for your precise land profile' 
                  : `Step ${step} of 3: ${step === 1 ? 'Location Settings' : step === 2 ? 'Land & Soil Profile' : 'Environmental & Financial Parameters'}`
                }
              </p>
            </div>
          </div>
          <button 
            id="getcrop-close-btn"
            onClick={() => {
              voiceController.stop();
              onClose();
            }}
            className="p-1.5 rounded-xl text-gray-400 hover:bg-emerald-100/50 hover:text-gray-700 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Loading State Overlay */}
        {isLoading && (
          <div className="flex-1 p-8 flex flex-col items-center justify-center min-h-[350px] space-y-6">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
              <Sparkles className="w-6 h-6 text-emerald-600 animate-pulse absolute top-5 left-5" />
            </div>
            <div className="text-center max-w-sm space-y-2">
              <h4 className="font-bold text-gray-800 text-base">Generating Crop Matches</h4>
              <p className="text-xs text-gray-500 animate-pulse min-h-[32px]">
                {LOADING_TIPS[loadingTipIndex]}
              </p>
            </div>
          </div>
        )}

        {/* Form Steps */}
        {!isLoading && step < 4 && (
          <div className="p-6 flex-1 space-y-6 max-h-[70vh] overflow-y-auto">
            
            {/* Step 1: Location */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="flex gap-2.5 items-center text-emerald-800 font-bold text-sm bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/50 mb-2">
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span>Specify your location settings to match regional weather & MSP.</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 block">Country</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full text-sm bg-gray-50/50 border border-gray-200 focus:border-emerald-500 rounded-xl p-3 outline-none font-medium"
                    placeholder="e.g. India"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 block">State</label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full text-sm bg-gray-50/50 border border-gray-200 focus:border-emerald-500 rounded-xl p-3 outline-none font-medium"
                    >
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 block">District</label>
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full text-sm bg-gray-50/50 border border-gray-200 focus:border-emerald-500 rounded-xl p-3 outline-none font-medium"
                      placeholder="e.g. Thanjavur"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Land & Soil */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 block">Soil Type</label>
                  <p className="text-[11px] text-gray-400 -mt-1 block">Choose the dominant soil texture in your field</p>
                  <select
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value)}
                    className="w-full text-sm bg-gray-50/50 border border-gray-200 focus:border-emerald-500 rounded-xl p-3 outline-none font-bold text-gray-700"
                  >
                    {SOIL_TYPES.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700 block">Enter your land size (How much land you want)</label>
                  <p className="text-[11px] text-gray-400 -mt-1 block">Enter any size you want (e.g. 0.25, 0.5, 1, 2.5, 5, 10, 50, 100)</p>
                  <div className="flex items-center gap-2">
                    <input
                      id="land-size-input"
                      type="number"
                      step="any"
                      min="0"
                      placeholder="e.g. 2.5"
                      value={landSizeValue}
                      onChange={(e) => {
                        setLandSizeValue(e.target.value);
                        if (landSizeError) setLandSizeError(null);
                      }}
                      className={`w-full text-sm bg-gray-50/50 border ${landSizeError ? 'border-red-500' : 'border-gray-200'} focus:border-emerald-500 rounded-xl p-3 outline-none font-bold text-gray-800`}
                    />
                    <select
                      value={landSizeUnit}
                      onChange={(e) => setLandSizeUnit(e.target.value)}
                      className="text-xs font-bold bg-gray-100 border border-gray-200 rounded-xl p-3 outline-none text-gray-800 shrink-0"
                    >
                      <option value="Acres">Acres</option>
                      <option value="Hectares">Hectares</option>
                      <option value="Cents">Cents</option>
                      <option value="Bigha">Bigha</option>
                      <option value="Gunta">Gunta</option>
                      <option value="Kanal">Kanal</option>
                      <option value="Marla">Marla</option>
                      <option value="Grounds">Grounds</option>
                      <option value="Sq Feet">Sq Feet</option>
                      <option value="Sq Meters">Sq Meters</option>
                    </select>
                  </div>
                  {landSizeError && (
                    <p className="text-xs text-red-600 font-bold">{landSizeError}</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Financial & Environment */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 block">Farming Season</label>
                  <select
                    value={season}
                    onChange={(e) => setSeason(e.target.value)}
                    className="w-full text-sm bg-gray-50/50 border border-gray-200 focus:border-emerald-500 rounded-xl p-3 outline-none font-bold text-gray-700"
                  >
                    {SEASONS.map((se) => (
                      <option key={se} value={se}>{se}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 block">Water Source & Availability</label>
                  <select
                    value={waterAvailability}
                    onChange={(e) => setWaterAvailability(e.target.value)}
                    className="w-full text-sm bg-gray-50/50 border border-gray-200 focus:border-emerald-500 rounded-xl p-3 outline-none font-bold text-gray-700"
                  >
                    {WATER_AVAILABILITIES.map((wa) => (
                      <option key={wa} value={wa}>{wa}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 block">Enter Your Farming Budget</label>
                  <p className="text-[11px] text-gray-400 -mt-1 block">Numeric input only (e.g. 10000, 25000, 50000, 100000)</p>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3.5 text-gray-500 font-bold text-sm">₹</span>
                    <input
                      id="budget-input"
                      type="number"
                      min="0"
                      placeholder="50000"
                      value={budgetValue}
                      onChange={(e) => {
                        setBudgetValue(e.target.value);
                        if (budgetError) setBudgetError(null);
                      }}
                      className={`w-full pl-8 text-sm bg-gray-50/50 border ${budgetError ? 'border-red-500' : 'border-gray-200'} focus:border-emerald-500 rounded-xl p-3 outline-none font-bold text-gray-800`}
                    />
                  </div>
                  {budgetError && (
                    <p className="text-xs text-red-600 font-bold">{budgetError}</p>
                  )}
                </div>
              </div>
            )}

            {/* Stepper Dots Indicator */}
            <div className="flex items-center justify-center gap-1.5 pt-4">
              <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${step >= 1 ? 'bg-emerald-600' : 'bg-gray-200'}`} />
              <div className="w-8 h-0.5 bg-gray-100" />
              <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${step >= 2 ? 'bg-emerald-600' : 'bg-gray-200'}`} />
              <div className="w-8 h-0.5 bg-gray-100" />
              <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${step >= 3 ? 'bg-emerald-600' : 'bg-gray-200'}`} />
            </div>

          </div>
        )}

        {/* Wizard Footer Controls */}
        {!isLoading && step < 4 && (
          <div className="bg-gray-50 border-t border-gray-100 p-4 flex items-center justify-between">
            {step > 1 ? (
              <button
                id="getcrop-back-btn"
                onClick={handleBack}
                className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-extrabold text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                id="getcrop-next-btn"
                onClick={handleNext}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                id="getcrop-submit-btn"
                onClick={handleSubmit}
                className="flex items-center gap-1.5 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all animate-pulse"
              >
                Generate Top 5 Crops <Sparkles className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Step 4: Split Layout Results (Sidebar + Detailed View) */}
        {!isLoading && step === 4 && results && (
          <div className="flex-1 flex overflow-hidden h-[calc(90vh-130px)]">
            
            {/* Left Sidebar List */}
            <div className="w-72 border-r border-gray-100 bg-gray-50/50 overflow-y-auto flex flex-col">
              <div className="p-4 border-b border-gray-100 bg-white">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Matching Results</span>
                <h4 className="font-extrabold text-sm text-gray-800">5 Optimal Matches</h4>
              </div>
              <div className="flex-1 py-2 space-y-1">
                {results.map((crop, idx) => (
                  <button
                    id={`sidebar-crop-btn-${idx}`}
                    key={idx}
                    onClick={() => {
                      setActiveCropIndex(idx);
                      if (isEasyMode) {
                        voiceController.speak(crop.cropName, userProfile.preferredLanguage);
                      }
                    }}
                    className={`w-full text-left px-4 py-3.5 flex items-center justify-between transition-all border-y border-transparent ${
                      activeCropIndex === idx 
                        ? 'bg-white border-gray-100 border-l-4 border-l-emerald-600 shadow-xs' 
                        : 'hover:bg-white/50 text-gray-600'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <span className={`text-xs block font-bold ${activeCropIndex === idx ? 'text-emerald-700' : 'text-gray-700'}`}>
                        {crop.cropName}
                      </span>
                      <span className="text-[10px] text-gray-400 block font-medium mt-0.5">
                        Yield: {crop.expectedYield}
                      </span>
                    </div>
                    {crop.suitabilityScore && (
                      <span className={`text-[10px] px-2 py-0.5 font-bold rounded-full ${
                        activeCropIndex === idx 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {crop.suitabilityScore}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Detailed View */}
            {activeCrop && (
              <div className="flex-1 flex flex-col bg-white overflow-hidden">
                
                {/* Hero Banner Area */}
                <div className="relative h-44 shrink-0 bg-emerald-50">
                  <img
                    src={
                      activeCrop.imageUrl && activeCrop.imageUrl.startsWith('http')
                        ? activeCrop.imageUrl
                        : `https://images.unsplash.com/featured/600x250/?farming,${encodeURIComponent(activeCrop.imageUrl || activeCrop.cropName)}`
                    }
                    alt={activeCrop.cropName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6 text-white">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] bg-emerald-600 text-white font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Match Score {activeCrop.suitabilityScore || 'High'}
                      </span>
                      {activeCrop.idealSowingSeason && (
                        <span className="text-[10px] bg-blue-600/80 text-white font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {activeCrop.idealSowingSeason}
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl font-extrabold tracking-tight">{activeCrop.cropName}</h2>
                  </div>

                  {/* Speak Floating Button */}
                  <div className="absolute top-4 right-4">
                    <button
                      id="details-speak-btn"
                      onClick={() => handleSpeakCrop(activeCrop)}
                      className="p-2.5 bg-black/60 hover:bg-black/80 text-white rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold backdrop-blur-sm"
                    >
                      <Volume2 className="w-4 h-4" /> Listen
                    </button>
                  </div>
                </div>

                {/* Report Content Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
                  
                  {/* Suitability Statement */}
                  <div className="border-l-4 border-emerald-500 pl-4 py-1">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Why this matches your land:</span>
                    <p className="text-xs text-gray-600 font-medium leading-relaxed mt-1">
                      {activeCrop.description}
                    </p>
                  </div>

                  {/* Commercial Varieties */}
                  {activeCrop.varieties && activeCrop.varieties.length > 0 && (
                    <div className="bg-emerald-50/40 border border-emerald-100/50 p-4 rounded-xl">
                      <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block mb-2">Recommended Hybrid Seeds & Varieties</span>
                      <div className="flex flex-wrap gap-2">
                        {activeCrop.varieties.map((vari, idx) => (
                          <span key={idx} className="bg-white text-emerald-700 border border-emerald-100 px-3 py-1 rounded-xl text-xs font-extrabold shadow-2xs">
                            {vari}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Detailed Metrics Grid */}
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-3">Target Metrics</span>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      
                      <div className="bg-gray-50/50 border border-gray-100 p-3 rounded-xl flex flex-col justify-between">
                        <span className="text-gray-400 text-[10px] font-semibold block">Expected Yield</span>
                        <span className="text-sm font-extrabold text-gray-800 mt-1">{activeCrop.expectedYield}</span>
                      </div>

                      <div className="bg-gray-50/50 border border-gray-100 p-3 rounded-xl flex flex-col justify-between">
                        <span className="text-gray-400 text-[10px] font-semibold block">Sowing Season</span>
                        <span className="text-sm font-extrabold text-gray-800 mt-1">{activeCrop.idealSowingSeason || 'Kharif/Rabi'}</span>
                      </div>

                      <div className="bg-gray-50/50 border border-gray-100 p-3 rounded-xl flex flex-col justify-between">
                        <span className="text-gray-400 text-[10px] font-semibold block">Growth Duration</span>
                        <span className="text-sm font-extrabold text-gray-800 mt-1">{activeCrop.expectedGrowthDuration || '110-120 Days'}</span>
                      </div>

                      <div className="bg-gray-50/50 border border-gray-100 p-3 rounded-xl flex flex-col justify-between">
                        <span className="text-gray-400 text-[10px] font-semibold block">Seed Quantity</span>
                        <span className="text-sm font-extrabold text-gray-800 mt-1">{activeCrop.seedQuantityRequired || '4-5 kg/acre'}</span>
                      </div>

                      <div className="bg-gray-50/50 border border-gray-100 p-3 rounded-xl flex flex-col justify-between">
                        <span className="text-gray-400 text-[10px] font-semibold block">Estimated Cost</span>
                        <span className="text-sm font-extrabold text-red-600 mt-1">{activeCrop.estimatedCultivationCost || '₹12,000 / Acre'}</span>
                      </div>

                      <div className="bg-gray-50/50 border border-gray-100 p-3 rounded-xl flex flex-col justify-between">
                        <span className="text-gray-400 text-[10px] font-semibold block">Expected Profit</span>
                        <span className="text-sm font-extrabold text-emerald-600 mt-1">{activeCrop.expectedProfit || '₹35,000 / Acre'}</span>
                      </div>

                      <div className="bg-gray-50/50 border border-gray-100 p-3 rounded-xl flex flex-col justify-between">
                        <span className="text-gray-400 text-[10px] font-semibold block">Market Value</span>
                        <span className="text-sm font-extrabold text-gray-800 mt-1">{activeCrop.marketValue || '₹2,200/quintal'}</span>
                      </div>

                      <div className="bg-gray-50/50 border border-gray-100 p-3 rounded-xl flex flex-col justify-between">
                        <span className="text-gray-400 text-[10px] font-semibold block">Market Demand</span>
                        <span className="text-sm font-extrabold text-gray-800 mt-1">{activeCrop.marketDemand || 'Very High'}</span>
                      </div>

                    </div>
                  </div>

                  {/* Timeline Schedules Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    
                    {/* Fertilizer schedule */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                        <Sprout className="w-4 h-4 text-emerald-600" />
                        <h5 className="font-extrabold text-xs text-gray-700 uppercase tracking-wider">Fertilization Timeline</h5>
                      </div>
                      <ul className="space-y-2">
                        {activeCrop.fertilizerSchedule?.map((sched, sidx) => (
                          <li key={sidx} className="flex items-start gap-2 text-xs text-gray-600">
                            <span className="bg-emerald-100 text-emerald-800 rounded-full w-5 h-5 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">{sidx + 1}</span>
                            <span className="leading-relaxed">{sched}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Irrigation schedule */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                        <Droplets className="w-4 h-4 text-blue-500" />
                        <h5 className="font-extrabold text-xs text-gray-700 uppercase tracking-wider">Water & Irrigation Schedule</h5>
                      </div>
                      <ul className="space-y-2">
                        {activeCrop.irrigationSchedule?.map((sched, sidx) => (
                          <li key={sidx} className="flex items-start gap-2 text-xs text-gray-600">
                            <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">{sidx + 1}</span>
                            <span className="leading-relaxed">{sched}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>

                  {/* Diseases and Prevention */}
                  {activeCrop.possibleDiseases && activeCrop.possibleDiseases.length > 0 && (
                    <div className="bg-red-50/30 border border-red-100/50 p-4 rounded-xl space-y-2.5">
                      <div className="flex items-center gap-2 text-red-800 font-extrabold text-xs uppercase tracking-wider">
                        <ShieldAlert className="w-4 h-4 text-red-600" />
                        <span>Pests & Plant Disease Shield</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {activeCrop.possibleDiseases.map((dis, idx) => (
                          <div key={idx} className="bg-white border border-red-50 p-3 rounded-lg text-xs space-y-1 shadow-2xs">
                            <strong className="text-gray-800 font-bold block">{dis.name}</strong>
                            <p className="text-gray-500 text-[11px] leading-relaxed">{dis.prevention}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Government Subsidies */}
                  {activeCrop.governmentSubsidies && (
                    <div className="bg-amber-50/30 border border-amber-100/50 p-4 rounded-xl space-y-1.5">
                      <div className="flex items-center gap-2 text-amber-800 font-extrabold text-xs uppercase tracking-wider">
                        <Award className="w-4 h-4 text-amber-600" />
                        <span>Government Schemes & Financial Subsidies</span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed font-medium">
                        {activeCrop.governmentSubsidies}
                      </p>
                    </div>
                  )}

                </div>

                {/* Footer Actions (Save Offline) */}
                <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between shrink-0">
                  <span className="text-[11px] text-gray-400 font-medium">Harvest expected by: <strong className="text-gray-700 font-bold">{activeCrop.harvestTime}</strong></span>
                  <button
                    id={`details-save-btn-${activeCropIndex}`}
                    onClick={() => handleSaveCrop(activeCrop, activeCropIndex)}
                    disabled={savedStatus[activeCropIndex]}
                    className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all border flex items-center gap-1.5 ${
                      savedStatus[activeCropIndex]
                        ? 'bg-green-100 border-green-200 text-green-700'
                        : 'bg-emerald-600 hover:bg-emerald-700 border-emerald-700 text-white shadow-xs'
                    }`}
                  >
                    {savedStatus[activeCropIndex] ? (
                      <>
                        <BookmarkCheck className="w-4 h-4" /> Saved Offline
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-4 h-4" /> Save Plan Offline
                      </>
                    )}
                  </button>
                </div>

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
