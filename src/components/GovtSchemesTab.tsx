import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { 
  CENTRAL_SCHEMES, 
  STATE_SCHEMES_MAP, 
  GovernmentScheme, 
  NEARBY_OFFICES, 
  AgricultureOffice
} from '../data/govtSchemesData';
import { 
  Award, Search, CheckCircle, Info, ExternalLink, HelpCircle, 
  FileText, Upload, Volume2, MapPin, Phone, ShieldCheck, 
  Zap, Droplets, Sun, Coins, Building2, Truck, Sparkles, Sprout, 
  CreditCard, Apple, Milk, Bug, AlertCircle, Calendar, Bell, 
  ChevronRight, X, RefreshCw, Filter, ShieldAlert, Check, 
  Smartphone, Download, User
} from 'lucide-react';
import voiceController from '../lib/voice';
import { FarmingReminder, RecentActivity } from '../types';

interface GovtSchemesTabProps {
  userProfile: UserProfile;
  setUserProfile?: React.Dispatch<React.SetStateAction<UserProfile>>;
  isEasyMode: boolean;
  onOpenAddReminder?: (prefill?: Partial<FarmingReminder>) => void;
  onLogActivity?: (activity: RecentActivity) => void;
}

// Map icon strings to Lucide components
const renderSchemeIcon = (iconName: string) => {
  switch (iconName) {
    case 'Coins': return <Coins className="w-5 h-5 text-emerald-600" />;
    case 'ShieldAlert': return <ShieldAlert className="w-5 h-5 text-emerald-600" />;
    case 'Droplets': return <Droplets className="w-5 h-5 text-blue-600" />;
    case 'Sparkles': return <Sparkles className="w-5 h-5 text-amber-500" />;
    case 'Building2': return <Building2 className="w-5 h-5 text-indigo-600" />;
    case 'Sun': return <Sun className="w-5 h-5 text-amber-600" />;
    case 'Leaf': return <Sprout className="w-5 h-5 text-emerald-600" />;
    case 'Award': return <Award className="w-5 h-5 text-purple-600" />;
    case 'Truck': return <Truck className="w-5 h-5 text-orange-600" />;
    case 'Apple': return <Apple className="w-5 h-5 text-rose-600" />;
    case 'Bug': return <Bug className="w-5 h-5 text-yellow-600" />;
    case 'Milk': return <Milk className="w-5 h-5 text-blue-500" />;
    case 'CreditCard': return <CreditCard className="w-5 h-5 text-emerald-700" />;
    case 'Smartphone': return <Smartphone className="w-5 h-5 text-teal-600" />;
    case 'Zap': return <Zap className="w-5 h-5 text-amber-500" />;
    default: return <Sprout className="w-5 h-5 text-emerald-600" />;
  }
};

export default function GovtSchemesTab({ 
  userProfile, 
  setUserProfile, 
  isEasyMode,
  onOpenAddReminder,
  onLogActivity
}: GovtSchemesTabProps) {
  // Active Section Views: 'schemes' | 'profile' | 'map' | 'notifications'
  const [activeSubTab, setActiveSubTab] = useState<'schemes' | 'profile' | 'map' | 'notifications'>('schemes');
  
  // Scheme Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'central' | 'state' | 'recommended'>('recommended');
  const [subsidyTypeFilter, setSubsidyTypeFilter] = useState<string>('All');
  const [selectedSchemeForApply, setSelectedSchemeForApply] = useState<GovernmentScheme | null>(null);
  const [selectedSchemeForDetails, setSelectedSchemeForDetails] = useState<GovernmentScheme | null>(null);

  const handleSelectSchemeDetails = (scheme: GovernmentScheme) => {
    setSelectedSchemeForDetails(scheme);
    if (onLogActivity) {
      onLogActivity({
        id: `act-${Date.now()}`,
        title: `Govt Scheme: ${scheme.name}`,
        subtitle: `${scheme.badge} • ${scheme.benefits.slice(0, 35)}...`,
        type: 'scheme',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tabTarget: 'schemes'
      });
    }
  };

  const handleSelectSchemeApply = (scheme: GovernmentScheme) => {
    setSelectedSchemeForApply(scheme);
    if (onLogActivity) {
      onLogActivity({
        id: `act-${Date.now()}`,
        title: `Applied Govt Scheme: ${scheme.name}`,
        subtitle: `Helpline: ${scheme.helpline}`,
        type: 'scheme',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tabTarget: 'schemes'
      });
    }
  };

  // Profile Form Edit State
  const [profileForm, setProfileForm] = useState<UserProfile>(userProfile);
  const [isProfileEditing, setIsProfileEditing] = useState(false);

  // Language state
  const [selectedLang, setSelectedLang] = useState<string>(userProfile.preferredLanguage || 'English');

  // Keep local profile form synced with userProfile
  useEffect(() => {
    setProfileForm(userProfile);
  }, [userProfile]);

  // Combine Central & State Schemes
  const userState = profileForm.state || 'Tamil Nadu';
  const stateSchemes = STATE_SCHEMES_MAP[userState] || STATE_SCHEMES_MAP['Tamil Nadu'];
  const allSchemes: GovernmentScheme[] = [...CENTRAL_SCHEMES, ...stateSchemes];

  // AI Eligibility Scoring Algorithm
  const calculateEligibility = (scheme: GovernmentScheme) => {
    let score = 85; // Base eligibility score

    // Land size check
    if (scheme.eligibilityCriteria.landSizeMax && profileForm.landSize) {
      const landNum = parseFloat(profileForm.landSize) || 2;
      if (landNum <= scheme.eligibilityCriteria.landSizeMax) {
        score += 5;
      }
    }

    // Farming practice check
    if (scheme.eligibilityCriteria.farmingType && profileForm.farmingPractice) {
      const practice = profileForm.farmingPractice.toLowerCase();
      if (scheme.eligibilityCriteria.farmingType.includes(practice as any) || scheme.eligibilityCriteria.farmingType.includes('both')) {
        score += 5;
      }
    }

    // Crop match check
    if (scheme.eligibilityCriteria.crops && profileForm.cropType) {
      const userCrop = profileForm.cropType.toLowerCase();
      const match = scheme.eligibilityCriteria.crops.some(c => c.toLowerCase().includes(userCrop) || userCrop.includes(c.toLowerCase()));
      if (match) score += 5;
    }

    // Category match
    if (profileForm.category && (profileForm.category.includes('Small') || profileForm.category.includes('SC/ST'))) {
      score += 5;
    }

    // State specific match
    if (scheme.category === 'state' && scheme.targetStates?.includes(userState)) {
      score += 5;
    }

    return Math.min(score, 99);
  };

  // Filter schemes
  const filteredSchemes = allSchemes.filter(scheme => {
    const matchesSearch = 
      scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.benefits.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.subsidiesType.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = 
      categoryFilter === 'all' || 
      (categoryFilter === 'central' && scheme.category === 'central') ||
      (categoryFilter === 'state' && scheme.category === 'state') ||
      (categoryFilter === 'recommended' && calculateEligibility(scheme) >= 90);

    const matchesSubsidyType = 
      subsidyTypeFilter === 'All' || 
      scheme.subsidiesType.some(st => st.toLowerCase().includes(subsidyTypeFilter.toLowerCase()));

    return matchesSearch && matchesCategory && matchesSubsidyType;
  });

  // Calculate total recommended financial benefits
  const recommendedSchemes = allSchemes.filter(s => calculateEligibility(s) >= 90);
  const totalEstimatedBenefit = recommendedSchemes.reduce((acc, s) => acc + s.maxFinancialValue, 0);

  // Save profile updates
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (setUserProfile) {
      setUserProfile(profileForm);
    }
    localStorage.setItem('agri_user_profile', JSON.stringify(profileForm));
    setIsProfileEditing(false);
    voiceController.speak(`Farmer profile updated successfully for ${profileForm.name}. AI scheme eligibility recalculated.`, selectedLang);
  };

  // Voice Assistant Handler
  const handleSpeakText = (text: string) => {
    voiceController.speak(text, selectedLang);
  };

  // Google Maps link generator for offices
  const getGoogleMapsUrl = (office: AgricultureOffice) => {
    const query = encodeURIComponent(`${office.name}, ${office.district}, ${office.state}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  return (
    <div id="govt-schemes-main-container" className="space-y-6 pb-12">
      
      {/* HEADER HERO BANNER - Material 3 Govt Design */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-cyan-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-6">
          <Building2 className="w-80 h-80 text-white" />
        </div>

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-md">
              <ShieldCheck className="w-4 h-4 text-emerald-300" /> Official Govt Agriculture Schemes Portal
            </span>
            <span className="bg-amber-400/20 text-amber-200 border border-amber-400/30 text-xs font-bold px-3 py-1 rounded-full">
              State: {userState}
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-3">
              <Award className="w-8 h-8 text-amber-400 shrink-0" /> AI Government Schemes & Subsidies Module
            </h2>
            <p className="text-emerald-100 text-sm md:text-base max-w-2xl leading-relaxed">
              Automated central & state subsidy recommendations customized for <strong>{profileForm.name || 'Farmer'}</strong> ({profileForm.district}, {userState}). Direct application links, helpline contacts, and map navigation.
            </p>
          </div>

          {/* TOTAL ESTIMATED BENEFIT BANNER */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-extrabold text-xl shrink-0 shadow-md">
                ₹
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-emerald-200 font-bold block">AI Calculated Annual Financial Support</span>
                <div className="text-2xl font-black text-amber-300">
                  ₹{totalEstimatedBenefit.toLocaleString('en-IN')} <span className="text-xs text-emerald-200 font-medium">/ year across {recommendedSchemes.length} matched schemes</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="listen-hero-guide-btn"
                onClick={() => handleSpeakText(`AI Agriculture Schemes Portal. You have ${recommendedSchemes.length} recommended schemes with estimated total benefits of rupees ${totalEstimatedBenefit} per year.`)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
              >
                <Volume2 className="w-4 h-4" /> Listen Audio Guide
              </button>
              <button
                id="edit-profile-hero-btn"
                onClick={() => setActiveSubTab('profile')}
                className="bg-white text-emerald-900 hover:bg-emerald-50 px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-md"
              >
                <User className="w-4 h-4" /> Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* LANGUAGE SELECTOR BAR & SUB-NAVIGATION */}
      <div className="bg-white rounded-2xl p-3 border border-emerald-100 shadow-sm flex flex-wrap items-center justify-between gap-3">
        {/* Sub-tab buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            id="subtab-schemes-btn"
            onClick={() => setActiveSubTab('schemes')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
              activeSubTab === 'schemes'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            <Award className="w-4 h-4" /> All Schemes ({allSchemes.length})
          </button>

          <button
            id="subtab-profile-btn"
            onClick={() => setActiveSubTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
              activeSubTab === 'profile'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            <User className="w-4 h-4" /> Farmer Profile
          </button>

          <button
            id="subtab-map-btn"
            onClick={() => setActiveSubTab('map')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
              activeSubTab === 'map'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            <MapPin className="w-4 h-4" /> Nearby Offices & KVKs
          </button>

          <button
            id="subtab-notifications-btn"
            onClick={() => setActiveSubTab('notifications')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all relative ${
              activeSubTab === 'notifications'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            <Bell className="w-4 h-4" /> Notifications
            <span className="w-2 h-2 rounded-full bg-red-500 absolute top-1 right-1 animate-pulse"></span>
          </button>
        </div>

        {/* Multi-language Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
            🌐 Language:
          </span>
          <select
            id="scheme-language-select"
            value={selectedLang}
            onChange={(e) => {
              setSelectedLang(e.target.value);
              if (setUserProfile) {
                setUserProfile(prev => ({ ...prev, preferredLanguage: e.target.value as any }));
              }
            }}
            className="bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="English">English</option>
            <option value="Tamil">Tamil (தமிழ்)</option>
            <option value="Hindi">Hindi (हिंदी)</option>
            <option value="Telugu">Telugu (తెలుగు)</option>
            <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
            <option value="Malayalam">Malayalam (മലയാളം)</option>
            <option value="Marathi">Marathi (मराठी)</option>
            <option value="Gujarati">Gujarati (ગુજરાતી)</option>
            <option value="Punjabi">Punjabi (ਪੰਜਾਬੀ)</option>
            <option value="Bengali">Bengali (বাংলা)</option>
            <option value="Urdu">Urdu (اردو)</option>
            <option value="Odia">Odia (ଓଡ଼ିଆ)</option>
          </select>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SUB-TAB 1: SCHEMES EXPLORER & AI RECOMMENDATIONS */}
      {/* ========================================================= */}
      {activeSubTab === 'schemes' && (
        <div className="space-y-6 animate-fade-in">

          {/* SEARCH & CATEGORY FILTERING */}
          <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              {/* Category Chips */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  id="cat-recommended-btn"
                  onClick={() => setCategoryFilter('recommended')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    categoryFilter === 'recommended'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" /> ★★★ Recommended for You ({recommendedSchemes.length})
                </button>

                <button
                  id="cat-all-btn"
                  onClick={() => setCategoryFilter('all')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    categoryFilter === 'all'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                  }`}
                >
                  All Schemes ({allSchemes.length})
                </button>

                <button
                  id="cat-central-btn"
                  onClick={() => setCategoryFilter('central')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    categoryFilter === 'central'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                  }`}
                >
                  Central Govt ({CENTRAL_SCHEMES.length})
                </button>

                <button
                  id="cat-state-btn"
                  onClick={() => setCategoryFilter('state')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    categoryFilter === 'state'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                  }`}
                >
                  State Govt ({userState})
                </button>
              </div>

              {/* Search Box */}
              <div className="relative shrink-0 w-full md:w-72">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  id="scheme-search-field"
                  type="text"
                  placeholder="Search by name, crop, tractor..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-emerald-50/50 border border-emerald-200 text-xs rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800 placeholder-gray-400 font-medium"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

            </div>

            {/* Subsidy Type Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <span className="font-bold text-gray-500 whitespace-nowrap">Filter by Subsidy:</span>
              {[
                'All', 'Income Support', 'Crop Insurance', 'Drip Irrigation', 
                'Solar Pump', 'Farm Machinery', 'Organic Farming', 'Soil Testing', 
                'Livestock', 'Horticulture', 'Agriculture Loan'
              ].map((st) => (
                <button
                  id={`subsidy-filter-btn-${st}`}
                  key={st}
                  onClick={() => setSubsidyTypeFilter(st)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    subsidyTypeFilter === st
                      ? 'bg-emerald-800 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-emerald-50'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* SCHEME CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSchemes.length > 0 ? (
              filteredSchemes.map((scheme) => {
                const eligibilityPct = calculateEligibility(scheme);
                return (
                  <div
                    id={`scheme-card-${scheme.id}`}
                    key={scheme.id}
                    className="bg-white rounded-2xl border border-emerald-100 hover:border-emerald-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
                  >
                    <div>
                      {/* CARD BANNER IMAGE */}
                      <div className="relative h-36 w-full overflow-hidden bg-emerald-900">
                        <img 
                          src={scheme.bannerImage} 
                          alt={scheme.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
                          <span className="bg-emerald-600/90 text-white font-black text-[10px] px-2.5 py-1 rounded-md backdrop-blur-xs flex items-center gap-1 shadow-sm">
                            <CheckCircle className="w-3 h-3 text-emerald-300" /> {scheme.badge}
                          </span>
                          {scheme.category === 'state' && (
                            <span className="bg-amber-500/90 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-md">
                              {scheme.targetStates?.[0]} State
                            </span>
                          )}
                        </div>

                        {/* AI Eligibility Badge */}
                        <div className="absolute bottom-3 right-3 bg-white/95 text-emerald-950 px-2.5 py-1 rounded-xl shadow-md text-xs font-black flex items-center gap-1 border border-emerald-200">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          <span>{eligibilityPct}% Match</span>
                        </div>
                      </div>

                      {/* CARD CONTENT */}
                      <div className="p-5 space-y-3.5">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2.5">
                            <div className="p-2 bg-emerald-50 rounded-xl shrink-0 mt-0.5 border border-emerald-100">
                              {renderSchemeIcon(scheme.iconName)}
                            </div>
                            <div>
                              <h3 className="font-extrabold text-base text-gray-900 leading-snug">{scheme.name}</h3>
                              <span className="text-[10px] font-bold text-gray-400 block mt-0.5">{scheme.ministry}</span>
                            </div>
                          </div>
                        </div>

                        <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                          {scheme.description}
                        </p>

                        {/* Financial Benefit Box */}
                        <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-100/80">
                          <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider block mb-0.5">💰 Financial Benefits:</span>
                          <p className="text-xs font-bold text-emerald-950 leading-snug">
                            {scheme.benefits}
                          </p>
                        </div>

                        {/* Key Info Pills */}
                        <div className="space-y-1.5 text-[11px] text-gray-600">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span><strong>Deadline:</strong> {scheme.applicationDeadline}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span><strong>Helpline:</strong> {scheme.helpline}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* CARD FOOTER ACTIONS */}
                    <div className="px-5 pb-5 pt-2 border-t border-gray-100 flex items-center gap-2">
                      <button
                        id={`apply-now-btn-${scheme.id}`}
                        onClick={() => handleSelectSchemeApply(scheme)}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl py-2.5 text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
                      >
                        Apply Now <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        id={`speak-scheme-card-btn-${scheme.id}`}
                        onClick={() => handleSpeakText(`${scheme.name}. Benefits: ${scheme.benefits}. Deadline: ${scheme.applicationDeadline}.`)}
                        className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl transition-all"
                        title="Hear Audio Guide"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full bg-white p-12 text-center text-gray-400 border border-emerald-100 rounded-2xl shadow-xs">
                <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-base font-bold text-gray-700">No government schemes matched your search: "{searchQuery}".</p>
                <p className="text-xs text-gray-400 mt-1">Try clearing filters or searching "PM Kisan", "Solar Pump", "Drip", or "Machinery".</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-TAB 2: FARMER PROFILE FORM */}
      {/* ========================================================= */}
      {activeSubTab === 'profile' && (
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-emerald-100 shadow-sm space-y-6 animate-fade-in max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4 border-gray-100">
            <div>
              <h3 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                <User className="w-6 h-6 text-emerald-600" /> Farmer Profile for AI Eligibility Matching
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Fill in your farm details so the AI Scheme Engine can automatically match you with 100% accurate subsidies.
              </p>
            </div>

            <button
              id="voice-profile-guide-btn"
              onClick={() => handleSpeakText("Farmer profile settings. Update your land size, state, crop type, and livestock to get exact subsidy matches.")}
              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shrink-0"
            >
              <Volume2 className="w-4 h-4" /> Listen Audio Guide
            </button>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              
              {/* Farmer Name */}
              <div>
                <label className="block text-xs font-extrabold text-gray-700 mb-1">Farmer Full Name *</label>
                <input
                  id="profile-name-input"
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full bg-emerald-50/50 border border-emerald-200 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              {/* Aadhaar Number */}
              <div>
                <label className="block text-xs font-extrabold text-gray-700 mb-1">Aadhaar Number (Optional)</label>
                <input
                  id="profile-aadhaar-input"
                  type="text"
                  placeholder="12-digit Aadhaar Number"
                  value={profileForm.aadhaarNumber || ''}
                  onChange={(e) => setProfileForm({ ...profileForm, aadhaarNumber: e.target.value })}
                  className="w-full bg-emerald-50/50 border border-emerald-200 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              {/* State */}
              <div>
                <label className="block text-xs font-extrabold text-gray-700 mb-1">State *</label>
                <select
                  id="profile-state-select"
                  value={profileForm.state}
                  onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                  className="w-full bg-emerald-50/50 border border-emerald-200 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                >
                  {['Tamil Nadu', 'Punjab', 'Maharashtra', 'Uttar Pradesh', 'Karnataka', 'Andhra Pradesh', 'Telangana', 'Rajasthan', 'Gujarat', 'Kerala', 'West Bengal', 'Odisha', 'Haryana'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* District */}
              <div>
                <label className="block text-xs font-extrabold text-gray-700 mb-1">District *</label>
                <input
                  id="profile-district-input"
                  type="text"
                  required
                  value={profileForm.district}
                  onChange={(e) => setProfileForm({ ...profileForm, district: e.target.value })}
                  className="w-full bg-emerald-50/50 border border-emerald-200 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              {/* Village */}
              <div>
                <label className="block text-xs font-extrabold text-gray-700 mb-1">Village *</label>
                <input
                  id="profile-village-input"
                  type="text"
                  required
                  value={profileForm.village}
                  onChange={(e) => setProfileForm({ ...profileForm, village: e.target.value })}
                  className="w-full bg-emerald-50/50 border border-emerald-200 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              {/* Land Size */}
              <div>
                <label className="block text-xs font-extrabold text-gray-700 mb-1">Land Size (Acres) *</label>
                <input
                  id="profile-landsize-input"
                  type="text"
                  placeholder="e.g., 2.5 Acres"
                  value={profileForm.landSize || ''}
                  onChange={(e) => setProfileForm({ ...profileForm, landSize: e.target.value })}
                  className="w-full bg-emerald-50/50 border border-emerald-200 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              {/* Crop Type */}
              <div>
                <label className="block text-xs font-extrabold text-gray-700 mb-1">Primary Crop Grown *</label>
                <select
                  id="profile-croptype-select"
                  value={profileForm.cropType || 'Paddy'}
                  onChange={(e) => setProfileForm({ ...profileForm, cropType: e.target.value })}
                  className="w-full bg-emerald-50/50 border border-emerald-200 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                >
                  {['Paddy', 'Wheat', 'Cotton', 'Sugarcane', 'Vegetables', 'Fruits', 'Spices', 'Pulses', 'Oilseeds', 'Flowers'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Soil Type */}
              <div>
                <label className="block text-xs font-extrabold text-gray-700 mb-1">Soil Type</label>
                <select
                  id="profile-soiltype-select"
                  value={profileForm.soilType || 'Alluvial Soil'}
                  onChange={(e) => setProfileForm({ ...profileForm, soilType: e.target.value })}
                  className="w-full bg-emerald-50/50 border border-emerald-200 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                >
                  {['Alluvial Soil', 'Black Cotton Soil', 'Red Soil', 'Clay Soil', 'Sandy Loam', 'Laterite Soil'].map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              {/* Irrigation Availability */}
              <div>
                <label className="block text-xs font-extrabold text-gray-700 mb-1">Irrigation Source</label>
                <select
                  id="profile-irrigation-select"
                  value={profileForm.irrigationAvailability || 'Borewell'}
                  onChange={(e) => setProfileForm({ ...profileForm, irrigationAvailability: e.target.value })}
                  className="w-full bg-emerald-50/50 border border-emerald-200 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                >
                  {['Borewell / Groundwater', 'Canal Irrigation System', 'Rainfed Only (Monsoon Dependent)', 'Drip / Micro-Irrigation Setup', 'River / Lake Water Pump'].map(ir => (
                    <option key={ir} value={ir}>{ir}</option>
                  ))}
                </select>
              </div>

              {/* Annual Income */}
              <div>
                <label className="block text-xs font-extrabold text-gray-700 mb-1">Annual Household Income</label>
                <select
                  id="profile-income-select"
                  value={profileForm.annualIncome || '₹1,00,000 - ₹2,00,000'}
                  onChange={(e) => setProfileForm({ ...profileForm, annualIncome: e.target.value })}
                  className="w-full bg-emerald-50/50 border border-emerald-200 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                >
                  {['Below ₹1,00,000', '₹1,00,000 - ₹2,00,000', '₹2,00,000 - ₹5,00,000', 'Above ₹5,00,000'].map(inc => (
                    <option key={inc} value={inc}>{inc}</option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-extrabold text-gray-700 mb-1">Farmer Category</label>
                <select
                  id="profile-category-select"
                  value={profileForm.category || 'Small & Marginal Farmer (< 2 Hectares)'}
                  onChange={(e) => setProfileForm({ ...profileForm, category: e.target.value })}
                  className="w-full bg-emerald-50/50 border border-emerald-200 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                >
                  {['Small & Marginal Farmer (< 2 Hectares)', 'General Category Farmer', 'SC / ST Farmer', 'OBC Farmer', 'Woman Farmer / Widow'].map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Farming Practice */}
              <div>
                <label className="block text-xs font-extrabold text-gray-700 mb-1">Farming Practice Type</label>
                <select
                  id="profile-practice-select"
                  value={profileForm.farmingPractice || 'Conventional'}
                  onChange={(e) => setProfileForm({ ...profileForm, farmingPractice: e.target.value as any })}
                  className="w-full bg-emerald-50/50 border border-emerald-200 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                >
                  <option value="Conventional">Conventional Chemical Farming</option>
                  <option value="Organic">100% Organic Farming</option>
                  <option value="Both">Integrated / Both Organic & Chemical</option>
                </select>
              </div>

            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveSubTab('schemes')}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-5 py-2.5 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                id="save-profile-btn"
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-6 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" /> Save Profile & Recalculate AI Schemes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-TAB 4: NEARBY OFFICES MAP & LOCATIONS */}
      {/* ========================================================= */}
      {activeSubTab === 'map' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-emerald-600" /> Nearby Agriculture Offices, KVKs & Soil Labs
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Locate nearest Krishi Vigyan Kendras, Soil Testing Labs, Seed Outlets, CSC Seva Centers, and Agriculture Officers in {userState}.
              </p>
            </div>

            <button
              onClick={() => handleSpeakText(`Nearby Agriculture Offices in ${userState}. Tap map links to navigate using Google Maps.`)}
              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shrink-0"
            >
              <Volume2 className="w-4 h-4" /> Listen Audio Guide
            </button>
          </div>

          {/* SIMULATED MAP INTERFACE WITH GOOGLE MAPS LINK */}
          <div className="relative rounded-3xl overflow-hidden border border-emerald-200 shadow-md h-72 bg-emerald-950 flex flex-col justify-end p-6 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

            <div className="relative z-10 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-xs font-black uppercase text-emerald-300 tracking-wider">GPS Active Location: {profileForm.district}, {userState}</span>
              </div>
              <h3 className="text-lg font-black text-white">Showing 6 Nearby Government Agricultural Facilitation Centers</h3>
              <p className="text-xs text-emerald-100 max-w-xl">
                Get free seed distribution, soil health card testing, tractor subsidy verification, and expert advice at these local centers.
              </p>

              <a
                id="open-google-maps-full-link"
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Agriculture Office Krishi Vigyan Kendra Soil Testing ' + userState)}`}
                target="_blank"
                rel="noreferrer"
                className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black px-4 py-2 rounded-xl text-xs inline-flex items-center gap-1.5 shadow-lg transition-all mt-2"
              >
                <MapPin className="w-4 h-4" /> Open Full Map View on Google Maps <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* OFFICE CARDS LIST */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {NEARBY_OFFICES.map((office) => (
              <div
                id={`office-card-${office.id}`}
                key={office.id}
                className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="bg-emerald-100 text-emerald-900 font-bold text-[10px] px-2.5 py-1 rounded-lg">
                      {office.type}
                    </span>
                    <span className="text-xs font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                      📍 {office.distanceKm} km away
                    </span>
                  </div>

                  <h4 className="font-extrabold text-sm text-gray-900">{office.name}</h4>
                  <p className="text-xs text-gray-500">{office.address}, {office.district}, {office.state}</p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2 text-xs">
                  <a
                    href={`tel:${office.contactNumber.split('/')[0].trim()}`}
                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold px-3 py-2 rounded-xl flex items-center gap-1 text-xs"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call Office
                  </a>

                  <a
                    href={getGoogleMapsUrl(office)}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-3 py-2 rounded-xl flex items-center gap-1 text-xs"
                  >
                    <MapPin className="w-3.5 h-3.5" /> Navigate
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-TAB 5: SMART NOTIFICATIONS */}
      {/* ========================================================= */}
      {activeSubTab === 'notifications' && (
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-emerald-100 shadow-sm space-y-6 animate-fade-in max-w-4xl mx-auto">
          <div className="flex items-center justify-between border-b pb-4 border-gray-100">
            <div>
              <h3 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                <Bell className="w-6 h-6 text-emerald-600" /> AI Agricultural Scheme Notifications & Deadline Alerts
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Real-time updates regarding subsidy releases, PM-Kisan installment dates, and crop insurance claim deadlines.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              {
                id: 'notif-1',
                title: '💰 PM-KISAN 17th Installment Status Updated',
                message: 'Your ₹2,000 installment has been approved by Ministry of Agriculture for DBT transfer.',
                time: 'Today, 09:30 AM',
                tag: 'Payment Status',
                bg: 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
              },
              {
                id: 'notif-2',
                title: '⏳ PM Fasal Bima Kharif Insurance Deadline Approaching',
                message: 'Last date to submit Kharif Crop Insurance for Paddy is 31st July. Ensure Chitta copy is uploaded.',
                time: 'Yesterday',
                tag: 'Deadline Alert',
                bg: 'bg-amber-50/80 border-amber-200 text-amber-900'
              },
              {
                id: 'notif-3',
                title: '⚡ New Solar Pump 60% Subsidy Window Open',
                message: `PM-KUSUM Scheme open in ${userState} for 5 HP & 7.5 HP solar water pumps. Apply early.`,
                time: '2 days ago',
                tag: 'New Subsidy',
                bg: 'bg-blue-50/80 border-blue-200 text-blue-900'
              }
            ].map((n) => (
              <div key={n.id} className={`p-4 rounded-2xl border ${n.bg} flex items-start justify-between gap-4 shadow-2xs`}>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-white/80 rounded-md border border-black/5">
                      {n.tag}
                    </span>
                    <span className="text-[10px] text-gray-500 font-bold">{n.time}</span>
                  </div>
                  <h4 className="font-extrabold text-sm">{n.title}</h4>
                  <p className="text-xs leading-relaxed opacity-90">{n.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* DIRECT APPLY MODAL */}
      {/* ========================================================= */}
      {selectedSchemeForApply && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-5 border border-emerald-100 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            <button
              id="close-apply-modal-btn"
              onClick={() => setSelectedSchemeForApply(null)}
              className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-600 rounded-full bg-gray-100 hover:bg-gray-200 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-3 border-b pb-4 border-gray-100 pr-10">
              <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-800 shrink-0">
                {renderSchemeIcon(selectedSchemeForApply.iconName)}
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase text-emerald-700 tracking-wider">Apply for Government Subsidy</span>
                <h3 className="text-lg font-black text-gray-900 leading-snug">{selectedSchemeForApply.name}</h3>
                <span className="text-xs text-gray-500 font-medium">{selectedSchemeForApply.ministry}</span>
              </div>
            </div>

            {/* Scheme Summary */}
            <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100 space-y-2">
              <div className="text-xs">
                <strong className="text-emerald-950 block">Assisted Benefit:</strong>
                <p className="text-emerald-900 font-extrabold">{selectedSchemeForApply.benefits}</p>
              </div>
              <div className="text-xs">
                <strong className="text-emerald-950 block">Eligibility:</strong>
                <p className="text-gray-700">{selectedSchemeForApply.eligibilitySummary}</p>
              </div>
            </div>

            {/* Required Documents Checklist */}
            <div className="space-y-2">
              <h4 className="text-xs font-extrabold text-gray-800 uppercase tracking-wider">Required Documents Checklist</h4>
              <div className="space-y-1.5">
                {selectedSchemeForApply.requiredDocuments.map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-gray-50 p-2.5 rounded-xl text-xs font-medium text-gray-700 border border-gray-100">
                    <span className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" /> {doc}
                    </span>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">Ready</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Application Instructions */}
            <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1">
              <strong className="font-extrabold flex items-center gap-1">
                <Info className="w-4 h-4 text-amber-600" /> Application Process:
              </strong>
              <p className="leading-relaxed">{selectedSchemeForApply.howToApply}</p>
            </div>

            {/* Helpline & Action Buttons */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <a
                id="modal-official-portal-link"
                href={selectedSchemeForApply.officialWebsite}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl py-3 text-xs flex items-center justify-center gap-2 transition-all shadow-md"
              >
                Open Official Govt Registration Website <ExternalLink className="w-4 h-4" />
              </a>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`tel:${selectedSchemeForApply.helpline.split('/')[0].trim()}`}
                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-extrabold rounded-2xl py-2.5 text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <Phone className="w-4 h-4" /> Call Helpline
                </a>

                <button
                  onClick={() => {
                    alert(`📄 PDF Guidelines & Offline Form for ${selectedSchemeForApply.name} downloaded!`);
                  }}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-extrabold rounded-2xl py-2.5 text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <Download className="w-4 h-4" /> Download PDF Form
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
