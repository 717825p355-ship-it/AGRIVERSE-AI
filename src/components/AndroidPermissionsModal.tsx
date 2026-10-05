import React, { useState, useEffect } from 'react';
import { 
  Camera, MapPin, Mic, HardDrive, Wifi, Bell, 
  Check, X, AlertCircle, Shield, Smartphone, RefreshCw, Sparkles 
} from 'lucide-react';

interface AndroidPermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PermissionItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  status: 'granted' | 'prompt' | 'denied';
  apiName?: string;
}

export default function AndroidPermissionsModal({ isOpen, onClose }: AndroidPermissionsModalProps) {
  const [permissions, setPermissions] = useState<PermissionItem[]>([
    {
      id: 'camera',
      name: 'Camera',
      icon: <Camera className="w-5 h-5 text-emerald-600" />,
      description: 'Used for AI Leaf Disease Detection & Pest Scanning',
      status: 'granted',
      apiName: 'camera'
    },
    {
      id: 'location',
      name: 'GPS Location',
      icon: <MapPin className="w-5 h-5 text-teal-600" />,
      description: 'Provides local Mandi crop prices & Agromet weather warnings',
      status: 'granted',
      apiName: 'geolocation'
    },
    {
      id: 'microphone',
      name: 'Microphone',
      icon: <Mic className="w-5 h-5 text-indigo-600" />,
      description: 'Enables voice input assistant in English & regional Indian languages',
      status: 'granted',
      apiName: 'microphone'
    },
    {
      id: 'storage',
      name: 'Storage & Gallery',
      icon: <HardDrive className="w-5 h-5 text-amber-600" />,
      description: 'Allows uploading leaf photos and saving offline disease reports',
      status: 'granted'
    },
    {
      id: 'internet',
      name: 'Internet & Cloud Sync',
      icon: <Wifi className="w-5 h-5 text-blue-600" />,
      description: 'Syncs live Gemini 3.6-Flash recommendations and offline cache',
      status: 'granted'
    },
    {
      id: 'notifications',
      name: 'Push Notifications',
      icon: <Bell className="w-5 h-5 text-purple-600" />,
      description: 'Sends crop advisory reminders, spray schedules, and Mandi price alerts',
      status: 'granted',
      apiName: 'notifications'
    }
  ]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Check real browser permission states when opened
  useEffect(() => {
    if (!isOpen) return;

    if ('permissions' in navigator) {
      // Check geolocation
      navigator.permissions.query({ name: 'geolocation' as any }).then(res => {
        updateStatus('location', res.state === 'granted' ? 'granted' : res.state === 'denied' ? 'denied' : 'prompt');
      }).catch(() => {});

      // Check camera if supported
      navigator.permissions.query({ name: 'camera' as any }).then(res => {
        updateStatus('camera', res.state === 'granted' ? 'granted' : res.state === 'denied' ? 'denied' : 'prompt');
      }).catch(() => {});

      // Check microphone if supported
      navigator.permissions.query({ name: 'microphone' as any }).then(res => {
        updateStatus('microphone', res.state === 'granted' ? 'granted' : res.state === 'denied' ? 'denied' : 'prompt');
      }).catch(() => {});
    }
  }, [isOpen]);

  const updateStatus = (id: string, status: 'granted' | 'prompt' | 'denied') => {
    setPermissions(prev => prev.map(p => p.id === id ? { ...p, status } : p));
  };

  const handleRequestPermission = async (item: PermissionItem) => {
    if (item.id === 'camera' || item.id === 'microphone') {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: item.id === 'camera', 
          audio: item.id === 'microphone' 
        });
        stream.getTracks().forEach(track => track.stop());
        updateStatus(item.id, 'granted');
        showToast(`${item.name} permission granted on Android device!`);
      } catch (err) {
        updateStatus(item.id, 'denied');
        showToast(`Could not obtain ${item.name} permission.`);
      }
    } else if (item.id === 'location') {
      navigator.geolocation.getCurrentPosition(
        () => {
          updateStatus('location', 'granted');
          showToast('GPS Location permission active!');
        },
        () => {
          updateStatus('location', 'denied');
          showToast('Location permission denied.');
        }
      );
    } else if (item.id === 'notifications') {
      if ('Notification' in window) {
        const res = await Notification.requestPermission();
        updateStatus('notifications', res === 'granted' ? 'granted' : 'denied');
        showToast(res === 'granted' ? 'Push Notifications enabled!' : 'Notifications blocked.');
      } else {
        updateStatus('notifications', 'granted');
        showToast('Notifications active!');
      }
    } else {
      // Toggle for storage/internet
      const nextStatus = item.status === 'granted' ? 'denied' : 'granted';
      updateStatus(item.id, nextStatus);
      showToast(`${item.name} permission set to ${nextStatus.toUpperCase()}`);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl border border-emerald-100 overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-emerald-900 text-white p-5 flex items-center justify-between relative">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-800 rounded-2xl border border-emerald-700/50">
              <Shield className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-base text-white">Android System Permissions</h2>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Android 10+
                </span>
              </div>
              <p className="text-xs text-emerald-200/80">Manage hardware & sensors for AgriGPT</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white bg-white/10 p-2 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toast Notification */}
        {toastMessage && (
          <div className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 text-center animate-bounce-subtle flex items-center justify-center gap-2">
            <Check className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Permissions List */}
        <div className="p-5 overflow-y-auto space-y-3 divide-y divide-gray-100">
          {permissions.map((item) => (
            <div key={item.id} className="pt-3 first:pt-0 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-gray-50 rounded-2xl border border-gray-100 shrink-0 mt-0.5">
                  {item.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-gray-900">{item.name}</span>
                    {item.status === 'granted' && (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-600" /> Granted
                      </span>
                    )}
                    {item.status === 'prompt' && (
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                        Ask on Use
                      </span>
                    )}
                    {item.status === 'denied' && (
                      <span className="bg-red-100 text-red-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                        Denied
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-normal">{item.description}</p>
                </div>
              </div>

              <button
                onClick={() => handleRequestPermission(item)}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all shrink-0 mt-1 ${
                  item.status === 'granted'
                    ? 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200'
                    : 'bg-emerald-600 border-emerald-700 text-white hover:bg-emerald-700 shadow-sm'
                }`}
              >
                {item.status === 'granted' ? 'Manage' : 'Grant'}
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-gray-500">
            <Smartphone className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold text-[11px]">Portrait Mode Native Controls</span>
          </div>
          <button
            onClick={onClose}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-2 rounded-xl transition-all shadow-sm"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
