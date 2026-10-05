import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  Pin, 
  useMap 
} from '@vis.gl/react-google-maps';
import { 
  MapPin, 
  Navigation, 
  Layers, 
  Search, 
  Save, 
  Check, 
  Compass, 
  LocateFixed, 
  Globe, 
  Building2, 
  Sparkles,
  Info
} from 'lucide-react';
import { DISTRICT_COORDINATES, getNearestDistrict } from '../data/districtCoordinates';

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';

const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

export interface FarmLocation {
  lat: number;
  lng: number;
  address?: string;
  village?: string;
  taluk?: string;
  district: string;
  state: string;
  country: string;
}

interface FarmMapPickerProps {
  currentLocation: FarmLocation;
  onLocationSelect: (location: FarmLocation, autoTriggerRecommendation?: boolean) => void;
  isEasyMode?: boolean;
}

// Controller component to re-center map when location updates
function MapRecenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    if (map) {
      map.panTo({ lat, lng });
    }
  }, [map, lat, lng]);
  return null;
}

export default function FarmMapPicker({ 
  currentLocation, 
  onLocationSelect, 
  isEasyMode 
}: FarmMapPickerProps) {
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'terrain' | 'hybrid'>('satellite');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [locatingStatus, setLocatingStatus] = useState<string | null>(null);

  // Local interactive coordinates
  const [pinPosition, setPinPosition] = useState<{ lat: number; lng: number }>({
    lat: currentLocation.lat || 11.0168,
    lng: currentLocation.lng || 76.9558,
  });

  // Keep pinPosition in sync if props change
  useEffect(() => {
    if (currentLocation.lat && currentLocation.lng) {
      setPinPosition({ lat: currentLocation.lat, lng: currentLocation.lng });
    }
  }, [currentLocation.lat, currentLocation.lng]);

  // Handle GPS location request
  const handleLocateUser = useCallback(() => {
    setIsLocating(true);
    setLocatingStatus("Requesting GPS Permission...");

    if (!navigator.geolocation) {
      setLocatingStatus("Geolocation is not supported by your browser");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setPinPosition({ lat, lng });
        setLocatingStatus("Detecting District & Village...");

        // Try reverse geocoding
        let detectedDistrict = currentLocation.district || 'Coimbatore';
        let detectedState = currentLocation.state || 'Tamil Nadu';
        let detectedVillage = currentLocation.village || 'Farm Village';
        let detectedTaluk = currentLocation.taluk || 'Local Block';

        // Use nearest district mapping
        const nearest = getNearestDistrict(lat, lng);
        if (nearest && nearest.distKm < 200) {
          detectedDistrict = nearest.districtName;
        }

        // Check Google Geocoding if key is available
        if (hasValidKey && (window as any).google?.maps?.Geocoder) {
          try {
            const geocoder = new (window as any).google.maps.Geocoder();
            const res = await geocoder.geocode({ location: { lat, lng } });
            if (res.results && res.results[0]) {
              const comp = res.results[0].address_components;
              for (const c of comp) {
                if (c.types.includes('administrative_area_level_2')) {
                  detectedDistrict = c.long_name.replace(' District', '');
                }
                if (c.types.includes('administrative_area_level_1')) {
                  detectedState = c.long_name;
                }
                if (c.types.includes('sublocality') || c.types.includes('locality') || c.types.includes('neighborhood')) {
                  detectedVillage = c.long_name;
                }
                if (c.types.includes('administrative_area_level_3')) {
                  detectedTaluk = c.long_name;
                }
              }
            }
          } catch (e) {
            console.log('Geocoding fallback');
          }
        }

        const newLoc: FarmLocation = {
          lat,
          lng,
          village: detectedVillage,
          taluk: detectedTaluk,
          district: detectedDistrict,
          state: detectedState,
          country: 'India',
          address: `${detectedVillage}, ${detectedDistrict}, ${detectedState}, India`
        };

        onLocationSelect(newLoc, true);
        setIsLocating(false);
        setLocatingStatus(null);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
      },
      (err) => {
        console.warn('GPS location error:', err);
        setLocatingStatus("GPS access denied or unavailable. Using selected district center.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [currentLocation, onLocationSelect]);

  // Handle Search Location
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Search against district coordinates database
    const q = searchQuery.toLowerCase().trim();
    const matchedDist = Object.keys(DISTRICT_COORDINATES).find(d => d.toLowerCase().includes(q));

    if (matchedDist) {
      const coord = DISTRICT_COORDINATES[matchedDist];
      const newLoc: FarmLocation = {
        lat: coord.lat,
        lng: coord.lng,
        district: matchedDist,
        state: currentLocation.state,
        country: 'India',
        village: 'Central Farm',
        address: `${matchedDist}, India`
      };
      setPinPosition({ lat: coord.lat, lng: coord.lng });
      onLocationSelect(newLoc, true);
    } else {
      alert(`Location search for "${searchQuery}" - Center set to ${currentLocation.district}.`);
    }
  };

  // Handle Map Drag / Click
  const handleMapClick = (lat: number, lng: number) => {
    setPinPosition({ lat, lng });
    const nearest = getNearestDistrict(lat, lng);
    const updatedLoc: FarmLocation = {
      ...currentLocation,
      lat,
      lng,
      district: nearest.districtName || currentLocation.district,
    };
    onLocationSelect(updatedLoc, false);
  };

  const handleSaveFarm = () => {
    const nearest = getNearestDistrict(pinPosition.lat, pinPosition.lng);
    const updatedLoc: FarmLocation = {
      ...currentLocation,
      lat: pinPosition.lat,
      lng: pinPosition.lng,
      district: nearest.districtName || currentLocation.district
    };
    onLocationSelect(updatedLoc, true);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-emerald-100 overflow-hidden space-y-0 relative">
      {/* Top Header Bar */}
      <div className="p-4 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-700/60 rounded-xl border border-emerald-500/30">
            <MapPin className="w-5 h-5 text-emerald-300 animate-bounce" />
          </div>
          <div>
            <h3 className="font-bold text-base flex items-center space-x-2">
              <span>📍 GPS Farm Location & Interactive Map</span>
            </h3>
            <p className="text-xs text-emerald-200">
              Tap map or drag marker to set your exact farm coordinates
            </p>
          </div>
        </div>

        {/* Floating / Direct GPS Locate Button */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleLocateUser}
            disabled={isLocating}
            className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs py-2 px-3.5 rounded-xl shadow-sm transition-all flex items-center space-x-1.5 active:scale-95 disabled:opacity-50"
          >
            <LocateFixed className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Locating GPS...' : 'Detect GPS Location'}</span>
          </button>

          <button
            onClick={handleSaveFarm}
            className="bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs py-2 px-3.5 rounded-xl transition-all flex items-center space-x-1.5"
          >
            {isSaved ? <Check className="w-4 h-4 text-green-300" /> : <Save className="w-4 h-4" />}
            <span>{isSaved ? 'Farm Saved!' : 'Save Farm Position'}</span>
          </button>
        </div>
      </div>

      {/* Search & Map View Mode Controls */}
      <div className="p-3 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
        <form onSubmit={handleSearch} className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search District or Town (e.g. Coimbatore, Nashik, Ludhiana)..."
            className="w-full bg-white border border-gray-300 rounded-xl pl-9 pr-3 py-1.5 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </form>

        <div className="flex items-center space-x-1 bg-white p-1 rounded-xl border border-gray-200 text-xs">
          <span className="text-gray-500 px-2 text-[11px] font-semibold flex items-center space-x-1">
            <Layers className="w-3.5 h-3.5" />
            <span>View:</span>
          </span>
          <button
            onClick={() => setMapType('satellite')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${mapType === 'satellite' ? 'bg-emerald-700 text-white shadow-2xs' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Satellite
          </button>
          <button
            onClick={() => setMapType('roadmap')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${mapType === 'roadmap' ? 'bg-emerald-700 text-white shadow-2xs' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Map
          </button>
          <button
            onClick={() => setMapType('terrain')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${mapType === 'terrain' ? 'bg-emerald-700 text-white shadow-2xs' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Terrain
          </button>
        </div>
      </div>

      {locatingStatus && (
        <div className="bg-amber-50 px-4 py-2 text-xs text-amber-800 border-b border-amber-200 flex items-center space-x-2">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{locatingStatus}</span>
        </div>
      )}

      {/* MAP CANVAS CONTAINER */}
      <div className="relative w-full h-[380px] bg-slate-900 overflow-hidden">
        {hasValidKey ? (
          <APIProvider apiKey={API_KEY} version="weekly">
            <Map
              defaultCenter={pinPosition}
              center={pinPosition}
              defaultZoom={13}
              mapTypeId={mapType}
              mapId="AGRICULTURE_FARM_MAP"
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
              onClick={(e) => {
                if (e.detail?.latLng) {
                  handleMapClick(e.detail.latLng.lat, e.detail.latLng.lng);
                }
              }}
              style={{ width: '100%', height: '100%' }}
            >
              <MapRecenter lat={pinPosition.lat} lng={pinPosition.lng} />
              <AdvancedMarker 
                position={pinPosition} 
                draggable={true}
                onDragEnd={(e) => {
                  if (e.latLng) {
                    handleMapClick(e.latLng.lat(), e.latLng.lng());
                  }
                }}
              >
                <Pin background="#059669" glyphColor="#ffffff" borderColor="#047857" scale={1.2} />
              </AdvancedMarker>
            </Map>
          </APIProvider>
        ) : (
          /* Interactive High-Precision Farm Canvas Map Fallback */
          <div 
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              // Map x/y relative click to lat/lng offset
              const dLat = (y / rect.height - 0.5) * -0.05;
              const dLng = (x / rect.width - 0.5) * 0.05;
              handleMapClick(pinPosition.lat + dLat, pinPosition.lng + dLng);
            }}
            className="w-full h-full relative cursor-crosshair select-none bg-cover bg-center"
            style={{
              backgroundImage: mapType === 'satellite' 
                ? 'radial-gradient(circle at 50% 50%, #064e3b 0%, #022c22 100%), linear-gradient(135deg, #14532d 0%, #052e16 100%)'
                : mapType === 'terrain'
                ? 'linear-gradient(135deg, #78350f 0%, #451a03 100%)'
                : 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
            }}
          >
            {/* Grid Lines simulation for agricultural plots */}
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]" />
            
            {/* Compass Rose */}
            <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md p-2 rounded-xl text-white text-[10px] flex items-center space-x-1 border border-slate-700/60 shadow-md">
              <Compass className="w-4 h-4 text-emerald-400 animate-spin-slow" />
              <span className="font-mono">N {pinPosition.lat.toFixed(4)}° | E {pinPosition.lng.toFixed(4)}°</span>
            </div>

            {/* Farm Pin Marker */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full transform transition-all duration-300 pointer-events-none flex flex-col items-center group">
              <div className="bg-emerald-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-lg border border-emerald-300 flex items-center space-x-1.5 whitespace-nowrap mb-1 animate-pulse">
                <MapPin className="w-3.5 h-3.5 text-emerald-200" />
                <span>My Farm Location</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-4 ring-emerald-300/50 shadow-2xl">
                📍
              </div>
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping mt-1" />
            </div>

            {/* Tap instruction */}
            <div className="absolute bottom-3 left-3 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-xl text-slate-200 text-xs border border-slate-700 flex items-center space-x-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tap anywhere on the map to set your farm boundary & update crop plan</span>
            </div>
          </div>
        )}

        {/* Floating Quick GPS Button in bottom right corner */}
        <button
          onClick={handleLocateUser}
          title="Center on my GPS location"
          className="absolute bottom-4 right-4 z-10 bg-emerald-600 hover:bg-emerald-500 text-white p-3 rounded-full shadow-2xl border-2 border-white transition-all transform hover:scale-105 active:scale-95"
        >
          <LocateFixed className="w-5 h-5" />
        </button>
      </div>

      {/* Location Readout Summary Card */}
      <div className="p-4 bg-emerald-50/70 border-t border-emerald-100 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
        <div className="bg-white p-2.5 rounded-xl border border-emerald-100 shadow-2xs">
          <span className="text-gray-500 text-[10px] block font-semibold uppercase">Country</span>
          <span className="font-bold text-gray-900">{currentLocation.country || 'India'}</span>
        </div>

        <div className="bg-white p-2.5 rounded-xl border border-emerald-100 shadow-2xs">
          <span className="text-gray-500 text-[10px] block font-semibold uppercase">State</span>
          <span className="font-bold text-emerald-950">{currentLocation.state}</span>
        </div>

        <div className="bg-white p-2.5 rounded-xl border border-emerald-100 shadow-2xs">
          <span className="text-gray-500 text-[10px] block font-semibold uppercase">District</span>
          <span className="font-bold text-emerald-800">{currentLocation.district}</span>
        </div>

        <div className="bg-white p-2.5 rounded-xl border border-emerald-100 shadow-2xs">
          <span className="text-gray-500 text-[10px] block font-semibold uppercase">Taluk / Block</span>
          <span className="font-semibold text-gray-800">{currentLocation.taluk || 'Local Block'}</span>
        </div>

        <div className="bg-white p-2.5 rounded-xl border border-emerald-100 shadow-2xs">
          <span className="text-gray-500 text-[10px] block font-semibold uppercase">Village</span>
          <span className="font-semibold text-gray-800">{currentLocation.village || 'Farm Area'}</span>
        </div>

        <div className="bg-emerald-100/80 p-2.5 rounded-xl border border-emerald-200 shadow-2xs">
          <span className="text-emerald-800 text-[10px] block font-bold uppercase">GPS Coordinates</span>
          <span className="font-mono text-[11px] font-bold text-emerald-950">
            {pinPosition.lat.toFixed(4)}°, {pinPosition.lng.toFixed(4)}°
          </span>
        </div>
      </div>
    </div>
  );
}
