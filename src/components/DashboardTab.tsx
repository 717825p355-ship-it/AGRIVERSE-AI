import React, { useState, useEffect } from 'react';
import { UserProfile, FarmingReminder, RecentActivity, MarketPrice } from '../types';
import { INITIAL_MARKET_PRICES } from '../data/lessons';
import { fetchRealTimeWeather, WeatherData } from '../lib/weather';
import { 
  Sun, CloudRain, Cloud, AlertTriangle, Play, HelpCircle, 
  MapPin, CheckCircle2, TrendingUp, TrendingDown, BookOpen, 
  Wifi, WifiOff, FileText, User, Sparkles, Sprout, Clock,
  Droplets, Wind, Eye, Compass, Thermometer, ShieldAlert,
  Calendar, Bell, Plus, ArrowRight, Activity, Zap, RefreshCw,
  Umbrella, Check, AlertCircle, HeartHandshake, Award
} from 'lucide-react';
import voiceController from '../lib/voice';
import { t, LanguageCode } from '../lib/translations';

interface DashboardTabProps {
  userProfile: UserProfile;
  isEasyMode: boolean;
  isOffline: boolean;
  setIsOffline: (offline: boolean) => void;
  setActiveTab: (tab: string) => void;
  onGetCropClick: () => void;
  reminders: FarmingReminder[];
  onToggleReminderComplete: (id: string) => void;
  onOpenAddReminder: () => void;
  recentActivities: RecentActivity[];
  onSelectActivity: (activity: RecentActivity) => void;
  onClearActivities?: () => void;
  onUpdateDistrict: (district: string, state: string) => void;
}

export default function DashboardTab({ 
  userProfile, 
  isEasyMode, 
  isOffline, 
  setIsOffline, 
  setActiveTab,
  onGetCropClick,
  reminders,
  onToggleReminderComplete,
  onOpenAddReminder,
  recentActivities,
  onSelectActivity,
  onClearActivities,
  onUpdateDistrict
}: DashboardTabProps) {
  // Live clock state
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weatherData, setWeatherData] = useState<WeatherData>(() => 
    fetchRealTimeWeather(userProfile.district || 'Thanjavur', userProfile.state || 'Tamil Nadu', 'Paddy')
  );

  const [selectedEmergency, setSelectedEmergency] = useState<string | null>(null);
  const [districtSearch, setDistrictSearch] = useState('');
  const [marketPrices] = useState<MarketPrice[]>(INITIAL_MARKET_PRICES);
  const [forecastView, setForecastView] = useState<'hourly' | 'daily' | 'rain'>('hourly');

  // Location selector inline
  const [isChangingLocation, setIsChangingLocation] = useState(false);
  const [tempDistrict, setTempDistrict] = useState(userProfile.district || 'Thanjavur');
  const [tempState, setTempState] = useState(userProfile.state || 'Tamil Nadu');

  // Update live clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Refresh weather when location changes
  useEffect(() => {
    const fresh = fetchRealTimeWeather(userProfile.district || 'Thanjavur', userProfile.state || 'Tamil Nadu', 'Paddy');
    setWeatherData(fresh);
  }, [userProfile.district, userProfile.state]);

  const handleSaveLocationChange = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateDistrict(tempDistrict, tempState);
    setIsChangingLocation(false);
    voiceController.speak(`Updated weather location to ${tempDistrict}, ${tempState}`, userProfile.preferredLanguage);
  };

  const handleSpeakWeatherSummary = () => {
    const text = `Real time weather for ${weatherData.locationName}: Current temperature is ${weatherData.temperature} degrees Celsius, feels like ${weatherData.feelsLike} degrees. Humidity is ${weatherData.humidity} percent. ${weatherData.dailyTip.content}`;
    voiceController.speak(text, userProfile.preferredLanguage);
  };

  const emergencies = [
    {
      id: 'pest',
      title: 'Sudden Bug / Pest Outbreak',
      description: 'Spray neem oil mixed with soap water immediately. Keep healthy plants separated if possible.',
      remedies: [
        'Mix 15 ml neem oil in 1 liter warm water with 5 drops of dish soap.',
        'Spray early in the morning or late evening to avoid burning leaves.',
        'Remove heavily infected leaves and bury them in the ground.'
      ]
    },
    {
      id: 'flood',
      title: 'Heavy Rainfall / Flood Damage',
      description: 'Clear water channels instantly. Create shallow ditches to divert water from crop roots.',
      remedies: [
        'Dig trenches around the crop field to let excess water escape.',
        'Do not add heavy nitrogen fertilizers right after flooding; let the roots dry first.',
        'Support collapsed tall plants using bamboo sticks.'
      ]
    },
    {
      id: 'drought',
      title: 'Severe Dryness / Drought Advice',
      description: 'Cover soil with dry grass or leaves (mulch). This holds moisture in the ground twice as long.',
      remedies: [
        'Spread straw, dry leaves, or coconut coir around plant bases.',
        'Water only at the plant base (roots) using a bottle drip rather than spraying.',
        'Prune unnecessary side leaves to reduce water consumption.'
      ]
    },
    {
      id: 'animal',
      title: 'Cattle or Poultry Sickness',
      description: 'Isolate sick livestock from the rest of the herd. Provide fresh clean drinking water immediately.',
      remedies: [
        'Isolate the sick animal in a dry, ventilated shed.',
        'Clean all drinking troughs with fresh water and salt.',
        'Contact the nearest block veterinary officer or milk cooperative supervisor.'
      ]
    }
  ];

  const filteredPrices = marketPrices.filter(price => 
    !districtSearch || price.district.toLowerCase().includes(districtSearch.toLowerCase()) ||
    price.cropName.toLowerCase().includes(districtSearch.toLowerCase())
  );

  return (
    <div id="dashboard-container" className="space-y-6">
      
      {/* Dynamic Header & Live Clock Bar */}
      <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" /> Live Smart Dashboard
              </span>
              {isEasyMode && (
                <span className="bg-orange-100 text-orange-800 text-xs font-bold px-2.5 py-1 rounded-full">
                  🔊 Voice Guide Active
                </span>
              )}
              <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-600" />
                {currentTime.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} • {currentTime.toLocaleTimeString()}
              </span>
            </div>

            <h2 className="text-2xl font-bold text-gray-800">
              {t('welcome', userProfile.preferredLanguage as LanguageCode)}, {userProfile.name || t('farmer', userProfile.preferredLanguage as LanguageCode)}!
            </h2>

            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                {t('location', userProfile.preferredLanguage as LanguageCode)}: <strong className="text-gray-800">{weatherData.locationName}</strong>
              </span>
              <button
                onClick={() => setIsChangingLocation(!isChangingLocation)}
                className="text-emerald-700 font-bold underline hover:text-emerald-800 ml-1"
              >
                {isChangingLocation ? t('cancel', userProfile.preferredLanguage as LanguageCode) : t('changeLocation', userProfile.preferredLanguage as LanguageCode)}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="get-crop-home-btn"
              onClick={onGetCropClick}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-sm transition-all uppercase tracking-wider"
            >
              <Sprout className="w-4 h-4 text-emerald-100" />
              <span>{t('getAdviceBtn', userProfile.preferredLanguage as LanguageCode)}</span>
            </button>

            <button
              onClick={() => {
                setIsOffline(!isOffline);
                voiceController.speak(isOffline ? "Switched to Online Mode" : "Switched to Offline Mode", userProfile.preferredLanguage);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                isOffline ? 'bg-amber-100 text-amber-900 border-amber-200' : 'bg-emerald-50 text-emerald-800 border-emerald-100'
              }`}
            >
              {isOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5 animate-pulse text-emerald-600" />}
              <span>{isOffline ? 'Offline Mode' : 'Online Mode'}</span>
            </button>
          </div>
        </div>

        {/* Change Location Inline Form */}
        {isChangingLocation && (
          <form onSubmit={handleSaveLocationChange} className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 flex flex-wrap items-center gap-3 animate-fade-in">
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-gray-700">District:</label>
              <input
                type="text"
                required
                value={tempDistrict}
                onChange={(e) => setTempDistrict(e.target.value)}
                placeholder="e.g. Ludhiana, Thanjavur, Nashik"
                className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-gray-700">State:</label>
              <input
                type="text"
                required
                value={tempState}
                onChange={(e) => setTempState(e.target.value)}
                placeholder="e.g. Punjab, Tamil Nadu"
                className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 shadow-3xs"
            >
              Update Weather
            </button>
          </form>
        )}
      </div>

      {/* Weather Alerts Banner (if any) */}
      {weatherData.alerts.length > 0 && (
        <div className="space-y-2">
          {weatherData.alerts.map(alert => (
            <div
              key={alert.id}
              className={`p-4 rounded-2xl border flex items-start gap-3 ${
                alert.type === 'danger' ? 'bg-red-50 border-red-200 text-red-900' :
                alert.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-blue-50 border-blue-200 text-blue-900'
              }`}
            >
              <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-bold text-sm">{alert.title}</h4>
                <p className="text-xs mt-0.5 opacity-90">{alert.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Real-time Comprehensive Weather Card */}
      <div className="bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-800 p-6 rounded-2xl text-white shadow-md space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/20 pb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center p-3 backdrop-blur-xs">
              {weatherData.icon === 'rain' ? <CloudRain className="w-10 h-10 text-blue-200" /> :
               weatherData.icon === 'cloud' ? <Cloud className="w-10 h-10 text-emerald-100" /> : <Sun className="w-10 h-10 text-amber-300 animate-spin-slow" />}
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black tracking-tight">{weatherData.temperature}°C</span>
                <span className="text-emerald-200 text-sm font-semibold">Feels like {weatherData.feelsLike}°C</span>
              </div>
              <p className="text-sm font-bold text-emerald-100">{weatherData.condition}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSpeakWeatherSummary}
              className="bg-white/20 hover:bg-white/30 text-white rounded-xl px-3.5 py-2 transition-all flex items-center gap-1.5 text-xs font-bold"
            >
              <Play className="w-3.5 h-3.5 fill-current" /> Speak Weather
            </button>
            <span className="text-[11px] font-semibold text-emerald-200 bg-black/20 px-3 py-1.5 rounded-lg">
              Updated: {weatherData.lastUpdated}
            </span>
          </div>
        </div>

        {/* 14 Key Weather Parameters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-xs">
          <div className="bg-white/10 p-3 rounded-xl border border-white/10">
            <span className="text-emerald-200 block text-[10px] uppercase font-bold">Min / Max Temp</span>
            <span className="text-sm font-black mt-0.5 block">{weatherData.tempMin}° / {weatherData.tempMax}°C</span>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/10">
            <span className="text-emerald-200 block text-[10px] uppercase font-bold">Humidity</span>
            <span className="text-sm font-black mt-0.5 block">{weatherData.humidity}%</span>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/10">
            <span className="text-emerald-200 block text-[10px] uppercase font-bold">Wind Speed</span>
            <span className="text-sm font-black mt-0.5 block">{weatherData.windSpeed} km/h</span>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/10">
            <span className="text-emerald-200 block text-[10px] uppercase font-bold">Rain Chance</span>
            <span className="text-sm font-black mt-0.5 block">{weatherData.rainProbability}%</span>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/10">
            <span className="text-emerald-200 block text-[10px] uppercase font-bold">UV Index</span>
            <span className="text-sm font-black mt-0.5 block">{weatherData.uvIndex} / 12</span>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/10">
            <span className="text-emerald-200 block text-[10px] uppercase font-bold">Air Quality (AQI)</span>
            <span className="text-sm font-black mt-0.5 block">{weatherData.aqi} ({weatherData.aqiStatus})</span>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/10 col-span-2 sm:col-span-1">
            <span className="text-emerald-200 block text-[10px] uppercase font-bold">Soil Moisture</span>
            <span className="text-sm font-black mt-0.5 block text-amber-200">{weatherData.soilMoisture}%</span>
          </div>
        </div>

        {/* Extended Parameters: Sunrise, Sunset, Pressure, Visibility */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2 border-t border-white/10">
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-300" />
            <div>
              <span className="text-emerald-200 block text-[10px]">Sunrise</span>
              <span className="font-bold">{weatherData.sunrise}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-orange-400" />
            <div>
              <span className="text-emerald-200 block text-[10px]">Sunset</span>
              <span className="font-bold">{weatherData.sunset}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-blue-200" />
            <div>
              <span className="text-emerald-200 block text-[10px]">Pressure & Wind Dir</span>
              <span className="font-bold">{weatherData.pressure} hPa ({weatherData.windDirection})</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-emerald-200" />
            <div>
              <span className="text-emerald-200 block text-[10px]">Visibility</span>
              <span className="font-bold">{weatherData.visibility} km</span>
            </div>
          </div>
        </div>
      </div>

      {/* WEATHER FORECAST MODULE & FARMING SUITABILITY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Forecast Selector & Carousel */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" /> Weather Forecast
            </h3>

            <div className="flex items-center bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setForecastView('hourly')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  forecastView === 'hourly' ? 'bg-emerald-600 text-white shadow-3xs' : 'text-gray-600'
                }`}
              >
                24H Hourly
              </button>
              <button
                onClick={() => setForecastView('daily')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  forecastView === 'daily' ? 'bg-emerald-600 text-white shadow-3xs' : 'text-gray-600'
                }`}
              >
                7-Day Forecast
              </button>
              <button
                onClick={() => setForecastView('rain')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  forecastView === 'rain' ? 'bg-emerald-600 text-white shadow-3xs' : 'text-gray-600'
                }`}
              >
                Rainfall mm
              </button>
            </div>
          </div>

          {forecastView === 'hourly' && (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
              {weatherData.hourlyForecast.map((item, idx) => (
                <div key={idx} className="flex-shrink-0 bg-emerald-50/40 p-3 rounded-xl border border-emerald-100 text-center w-20">
                  <span className="text-[11px] font-bold text-gray-500 block">{item.time}</span>
                  <div className="my-1.5 flex justify-center">
                    {item.icon === 'rain' ? <CloudRain className="w-5 h-5 text-blue-500" /> :
                     item.icon === 'cloud' ? <Cloud className="w-5 h-5 text-gray-500" /> : <Sun className="w-5 h-5 text-amber-500" />}
                  </div>
                  <span className="text-xs font-black text-gray-800 block">{item.temp}°C</span>
                  <span className="text-[10px] font-semibold text-blue-600 block mt-0.5">🌧 {item.rainProb}%</span>
                </div>
              ))}
            </div>
          )}

          {forecastView === 'daily' && (
            <div className="space-y-2">
              {weatherData.dailyForecast.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-xs">
                  <div className="w-24 font-bold text-gray-800">
                    <span>{item.day}</span>
                    <span className="text-[10px] text-gray-400 block">{item.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.icon === 'rain' ? <CloudRain className="w-4 h-4 text-blue-500" /> :
                     item.icon === 'cloud' ? <Cloud className="w-4 h-4 text-gray-500" /> : <Sun className="w-4 h-4 text-amber-500" />}
                    <span className="font-semibold text-gray-700">{item.condition}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-gray-900">{item.tempMax}° / {item.tempMin}°C</span>
                    <span className="text-[10px] font-bold text-blue-600 block">Rain {item.rainProb}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {forecastView === 'rain' && (
            <div className="grid grid-cols-7 gap-2 text-center pt-2">
              {weatherData.weeklyRainPrediction.map((item, idx) => (
                <div key={idx} className="bg-blue-50/50 p-3 rounded-xl border border-blue-100 flex flex-col justify-between h-28">
                  <span className="text-xs font-bold text-gray-600">{item.day}</span>
                  <div className="my-auto">
                    <CloudRain className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                    <span className="text-sm font-black text-blue-900">{item.rainMm} mm</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Farming Suitability Indicators */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-amber-500" /> Farming Suitability
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-start gap-2.5">
                <div className={`mt-0.5 p-1 rounded-full ${weatherData.farmingSuitability.irrigation.suitable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {weatherData.farmingSuitability.irrigation.suitable ? <Check className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Irrigation</h4>
                  <p className="text-gray-600 mt-0.5">{weatherData.farmingSuitability.irrigation.reason}</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-start gap-2.5">
                <div className={`mt-0.5 p-1 rounded-full ${weatherData.farmingSuitability.spraying.suitable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {weatherData.farmingSuitability.spraying.suitable ? <Check className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Pesticide Spraying</h4>
                  <p className="text-gray-600 mt-0.5">{weatherData.farmingSuitability.spraying.reason}</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-start gap-2.5">
                <div className={`mt-0.5 p-1 rounded-full ${weatherData.farmingSuitability.fertilizer.suitable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {weatherData.farmingSuitability.fertilizer.suitable ? <Check className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Fertilizer Application</h4>
                  <p className="text-gray-600 mt-0.5">{weatherData.farmingSuitability.fertilizer.reason}</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-start gap-2.5">
                <div className={`mt-0.5 p-1 rounded-full ${weatherData.farmingSuitability.harvesting.suitable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {weatherData.farmingSuitability.harvesting.suitable ? <Check className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Harvesting</h4>
                  <p className="text-gray-600 mt-0.5">{weatherData.farmingSuitability.harvesting.reason}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TODAY'S FARMING ACTIONS & RECENT ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Today's AI Farming Actions */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Today's Farming Actions
          </h3>

          <ul className="space-y-3">
            {weatherData.aiFarmingActions.map((act, idx) => (
              <li key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50/30 border border-emerald-100">
                <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2 py-0.5 rounded uppercase mt-0.5 shrink-0">
                  {act.category}
                </span>
                <div>
                  <h4 className="font-bold text-sm text-gray-800">{act.title}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{act.subtitle}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Dashboard Activity History */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-600" /> Recent Activity History
              </h3>
              {recentActivities.length > 0 && onClearActivities && (
                <button
                  onClick={onClearActivities}
                  className="text-[11px] font-medium text-gray-400 hover:text-rose-600 transition-colors"
                  title="Clear history"
                >
                  Clear
                </button>
              )}
            </div>

            {recentActivities.length > 0 ? (
              <div className="space-y-2">
                {recentActivities.slice(0, 5).map((act) => {
                  let IconComponent = Activity;
                  let iconBg = 'bg-gray-100 text-gray-600';
                  
                  if (act.type === 'disease') {
                    IconComponent = ShieldAlert;
                    iconBg = 'bg-rose-100 text-rose-700';
                  } else if (act.type === 'scheme') {
                    IconComponent = Award;
                    iconBg = 'bg-purple-100 text-purple-700';
                  } else if (act.type === 'advisory') {
                    IconComponent = Sprout;
                    iconBg = 'bg-emerald-100 text-emerald-700';
                  } else if (act.type === 'mandi') {
                    IconComponent = TrendingUp;
                    iconBg = 'bg-blue-100 text-blue-700';
                  } else if (act.type === 'learning') {
                    IconComponent = BookOpen;
                    iconBg = 'bg-indigo-100 text-indigo-700';
                  } else if (act.type === 'reminder') {
                    IconComponent = Bell;
                    iconBg = 'bg-amber-100 text-amber-700';
                  } else if (act.type === 'note') {
                    IconComponent = FileText;
                    iconBg = 'bg-teal-100 text-teal-700';
                  }

                  return (
                    <button
                      key={act.id}
                      onClick={() => onSelectActivity(act)}
                      className="w-full text-left p-2.5 rounded-xl bg-gray-50 hover:bg-emerald-50/80 border border-gray-100 hover:border-emerald-200 transition-all flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`p-2 rounded-lg shrink-0 ${iconBg}`}>
                          <IconComponent className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-gray-800 group-hover:text-emerald-900 truncate">
                            {act.title}
                          </h4>
                          <p className="text-[10px] text-gray-500 truncate">{act.subtitle}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        <span className="text-[9px] font-medium text-gray-400 bg-white px-1.5 py-0.5 rounded border border-gray-100">
                          {act.timestamp}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-emerald-600 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 px-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <Activity className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-xs font-medium text-gray-500">No activity logged yet</p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Your disease scans, government scheme checks, and crop advice will automatically appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FARMER'S SMART REMINDERS DASHBOARD WIDGET */}
      <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
          <div>
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Bell className="w-5 h-5 text-emerald-600" /> Your Farming Reminders
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Only reminders created by you are displayed below.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('reminders')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              View All Reminders ({reminders.length}) <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onOpenAddReminder}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> Add Reminder
            </button>
          </div>
        </div>

        {/* User Reminders Grid */}
        {reminders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {reminders.slice(0, 3).map((rem) => (
              <div
                key={rem.id}
                className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                  rem.completed 
                    ? 'bg-gray-50/70 border-gray-200 opacity-75' 
                    : 'bg-emerald-50/30 border-emerald-100 hover:border-emerald-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {rem.category}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400">⏰ {rem.date} {rem.time}</span>
                  </div>
                  <h4 className={`text-xs font-bold ${rem.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                    {rem.title}
                  </h4>
                  <p className="text-[11px] text-gray-500 mt-1 leading-relaxed line-clamp-2">{rem.description}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between">
                  <button
                    onClick={() => onToggleReminderComplete(rem.id)}
                    className="text-[11px] font-black text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                  >
                    <CheckCircle2 className={`w-3.5 h-3.5 ${rem.completed ? 'text-green-600 fill-green-100' : 'text-emerald-600'}`} />
                    <span>{rem.completed ? 'Completed' : 'Mark Done'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 bg-gray-50 rounded-xl text-center space-y-2">
            <p className="text-xs text-gray-500 font-medium">No active reminders created yet.</p>
            <button
              onClick={onOpenAddReminder}
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline"
            >
              <Plus className="w-3.5 h-3.5" /> Set your first reminder (e.g. Irrigation or Fertilizer)
            </button>
          </div>
        )}
      </div>

      {/* EMERGENCY FARMING HELP */}
      <div className="bg-red-50/30 border border-red-100 p-6 rounded-2xl shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-red-900 flex items-center gap-2">
              <AlertTriangle className="w-5.5 h-5.5 text-red-600 animate-bounce" /> Emergency Farming Help
            </h3>
            <p className="text-xs text-red-700 mt-1">
              Select any crop issue below for instant step-by-step remedies.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {emergencies.map((em) => (
            <button
              key={em.id}
              onClick={() => setSelectedEmergency(selectedEmergency === em.id ? null : em.id)}
              className={`p-4 rounded-xl text-left border transition-all ${
                selectedEmergency === em.id 
                  ? 'bg-red-600 border-red-700 text-white shadow-sm' 
                  : 'bg-white border-red-100 hover:border-red-300 text-gray-800'
              }`}
            >
              <h4 className="font-bold text-sm leading-tight">{em.title}</h4>
              <p className={`text-xs mt-1 line-clamp-2 ${selectedEmergency === em.id ? 'text-red-100' : 'text-gray-500'}`}>
                {em.description}
              </p>
            </button>
          ))}
        </div>

        {selectedEmergency && (
          <div className="p-5 bg-white rounded-xl border border-red-100 shadow-inner animate-fade-in">
            {emergencies.filter(em => em.id === selectedEmergency).map(em => (
              <div key={em.id}>
                <h4 className="font-bold text-red-900 text-base mb-2">{em.title}</h4>
                <p className="text-sm text-gray-700 font-semibold mb-3">{em.description}</p>
                <div className="bg-red-50/20 p-3 rounded-lg">
                  <h5 className="text-xs font-bold text-red-800 uppercase tracking-wide mb-2">Step-By-Step Actions:</h5>
                  <ul className="space-y-2">
                    {em.remedies.map((rem, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                        <span className="bg-red-100 text-red-800 font-bold text-xs rounded-full w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">{i+1}</span>
                        <span>{rem}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DISTRICT MARKET MANDI PRICES */}
      <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" /> Market Mandi Prices
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">Live crop price ranges in nearby mandis.</p>
          </div>
          
          <input
            type="text"
            placeholder="Search crop or district..."
            value={districtSearch}
            onChange={(e) => setDistrictSearch(e.target.value)}
            className="bg-emerald-50/50 border border-emerald-100 text-sm rounded-xl px-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800 placeholder-gray-400"
          />
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-emerald-50/40">
              <tr>
                <th scope="col" className="px-6 py-3">Crop Name</th>
                <th scope="col" className="px-6 py-3">District</th>
                <th scope="col" className="px-6 py-3">Price Range (Quintal)</th>
                <th scope="col" className="px-6 py-3 text-center">Trend</th>
              </tr>
            </thead>
            <tbody>
              {filteredPrices.length > 0 ? (
                filteredPrices.map((price, idx) => (
                  <tr key={idx} className="bg-white border-b border-gray-100 hover:bg-emerald-50/10">
                    <th scope="row" className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap">
                      {price.cropName}
                    </th>
                    <td className="px-6 py-4 text-gray-700">{price.district}</td>
                    <td className="px-6 py-4 font-semibold text-emerald-800">{price.priceRange}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                        price.trend === 'up' ? 'bg-emerald-50 text-emerald-700' :
                        price.trend === 'down' ? 'bg-red-50 text-red-700' : 'bg-gray-50 text-gray-700'
                      }`}>
                        {price.trend === 'up' && <TrendingUp className="w-3.5 h-3.5" />}
                        {price.trend === 'down' && <TrendingDown className="w-3.5 h-3.5" />}
                        {price.trend.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                    No mandi prices found for "{districtSearch}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
