import React, { useState } from 'react';
import { SavedItem, ChatMessage, CropRecommendation, CareerGuidance } from '../types';
import { 
  FolderLock, Archive, Trash2, Calendar, FileText, 
  Sprout, Briefcase, Camera, MessageSquare, Play, Info, BookOpen 
} from 'lucide-react';
import voiceController from '../lib/voice';

interface OfflineCabinetTabProps {
  savedItems: SavedItem[];
  onDeleteItem: (id: string) => void;
  preferredLanguage: string;
}

export default function OfflineCabinetTab({ 
  savedItems, 
  onDeleteItem, 
  preferredLanguage 
}: OfflineCabinetTabProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'chat' | 'crop' | 'career' | 'analysis'>('all');
  const [selectedItem, setSelectedItem] = useState<SavedItem | null>(null);

  const filteredItems = savedItems.filter(
    item => activeFilter === 'all' || item.type === activeFilter
  );

  const handleSpeakItem = (item: SavedItem) => {
    let speakText = `Saved offline folder: ${item.title}. `;
    if (item.type === 'crop') {
      const data = item.data as CropRecommendation;
      speakText += `Crop Details: ${data.cropName}. Expected yield: ${data.expectedYield}. Fertilizer step: ${data.fertilizerSchedule[0]}.`;
    } else if (item.type === 'career') {
      const data = item.data as CareerGuidance;
      speakText += `Career blueprint: ${data.title}. Description: ${data.description}. Initial capital needed: ${data.estimatedInvestment}.`;
    } else if (item.type === 'analysis') {
      speakText += `Pathology report is as follows: ${item.data.analysis}`;
    } else if (item.type === 'chat') {
      const chat = item.data.messages as ChatMessage[];
      speakText += `Chat history with ${chat.length} messages. Last advice: ${chat[chat.length - 1]?.text}`;
    }
    voiceController.speak(speakText, preferredLanguage);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'crop': return <Sprout className="w-5.5 h-5.5 text-emerald-600" />;
      case 'career': return <Briefcase className="w-5.5 h-5.5 text-teal-600" />;
      case 'chat': return <MessageSquare className="w-5.5 h-5.5 text-blue-600" />;
      case 'analysis': return <Camera className="w-5.5 h-5.5 text-purple-600" />;
      default: return <FileText className="w-5.5 h-5.5 text-gray-600" />;
    }
  };

  return (
    <div id="offline-cabinet-container" className="space-y-6">
      
      {/* Tab Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <FolderLock className="w-5.5 h-5.5 text-emerald-600" /> Offline Database Cabinet
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Review, read, and listen to all your saved crop recommendations, chatbot answers, business plans, and crop health scans completely offline, even with no cellular internet.
        </p>
      </div>

      {/* Grid view: Filters and Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Index list */}
        <div className="lg:col-span-5 space-y-4">
          {/* Filters pills */}
          <div className="flex flex-wrap gap-1.5 bg-emerald-50/40 p-2 rounded-2xl border border-emerald-50">
            {(['all', 'crop', 'career', 'chat', 'analysis'] as const).map((filter) => (
              <button
                id={`cabinet-filter-${filter}`}
                key={filter}
                onClick={() => {
                  setActiveFilter(filter);
                  setSelectedItem(null);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  activeFilter === filter
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-emerald-800 hover:bg-emerald-50'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* List items */}
          <div className="space-y-2.5 max-h-[450px] overflow-y-auto scrollbar-thin pr-1">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <div
                  id={`cabinet-item-card-${item.id}`}
                  key={item.id}
                  className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 ${
                    selectedItem?.id === item.id
                      ? 'border-emerald-500 bg-emerald-50/30'
                      : 'border-emerald-50 bg-white hover:border-emerald-200 hover:bg-emerald-50/5'
                  }`}
                >
                  <button
                    id={`select-cabinet-item-btn-${item.id}`}
                    onClick={() => setSelectedItem(item)}
                    className="flex items-center gap-3 text-left flex-1"
                  >
                    <div className="bg-gray-50 p-2 rounded-xl shrink-0">
                      {getIcon(item.type)}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm text-gray-800 truncate leading-snug">{item.title}</h4>
                      <span className="text-[10px] text-gray-400 font-semibold block mt-1 flex items-center gap-1 uppercase tracking-wide">
                        <Calendar className="w-3 h-3" /> Saved on {item.timestamp}
                      </span>
                    </div>
                  </button>

                  <button
                    id={`delete-cabinet-item-btn-${item.id}`}
                    onClick={() => {
                      if (confirm(`Do you want to delete "${item.title}" from your offline database?`)) {
                        onDeleteItem(item.id);
                        if (selectedItem?.id === item.id) setSelectedItem(null);
                      }
                    }}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all border border-red-50 shrink-0"
                    title="Delete item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-8 text-center text-gray-400">
                <Archive className="w-10 h-10 stroke-1 mx-auto mb-2 text-gray-300 animate-pulse" />
                <span className="text-xs font-semibold block text-gray-500">Your offline database is empty</span>
                <span className="text-[10px] text-gray-400 block mt-1">Click "Save Offline" on chat logs, crop guides, or diagnostics to fill your cabinet.</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Render Expanded Item Detail */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm min-h-[400px] flex flex-col justify-between">
          {selectedItem ? (
            <div className="space-y-4 flex-1 flex flex-col justify-between">
              <div>
                {/* Header detail */}
                <div className="flex items-center justify-between border-b pb-3 border-gray-100 mb-4 gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="bg-emerald-50 p-2 rounded-xl shrink-0">
                      {getIcon(selectedItem.type)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-extrabold text-base text-gray-800 truncate leading-snug">{selectedItem.title}</h3>
                      <span className="text-[10px] text-emerald-800 uppercase tracking-wider font-bold">Category: {selectedItem.type}</span>
                    </div>
                  </div>

                  <button
                    id="speak-cabinet-item-btn"
                    onClick={() => handleSpeakItem(selectedItem)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-sm transition-all shrink-0"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" /> Read Out Loud
                  </button>
                </div>

                {/* Core expanded layouts based on type */}
                <div className="text-sm text-gray-700 space-y-4">
                  
                  {/* A. RENDER SAVED CROP GUIDE */}
                  {selectedItem.type === 'crop' && (
                    <div className="space-y-4 animate-fade-in text-xs">
                      <p className="italic text-gray-500 pl-2 border-l-2 border-emerald-300">
                        {selectedItem.data.description}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-3 border-y py-3 my-2 border-gray-100 text-xs">
                        <div>
                          <span className="text-gray-400 block font-semibold uppercase tracking-wide text-[10px]">Expected Yield:</span>
                          <strong className="text-gray-800 text-sm font-bold">{selectedItem.data.expectedYield}</strong>
                        </div>
                        <div>
                          <span className="text-gray-400 block font-semibold uppercase tracking-wide text-[10px]">Market Selling Price:</span>
                          <strong className="text-emerald-700 text-sm font-bold">{selectedItem.data.marketValue}</strong>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="font-bold text-emerald-900 block text-[11px] uppercase tracking-wide">📅 Fertilizer Timeline:</span>
                        <ul className="space-y-1 bg-emerald-50/20 p-3 rounded-xl border border-emerald-50/50 pl-6 list-disc">
                          {selectedItem.data.fertilizerSchedule.map((fs: string, i: number) => (
                            <li key={i}>{fs}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <span className="font-bold text-emerald-900 block text-[11px] uppercase tracking-wide">💧 Watering Schedule:</span>
                        <ul className="space-y-1 bg-emerald-50/20 p-3 rounded-xl border border-emerald-50/50 pl-6 list-disc">
                          {selectedItem.data.irrigationSchedule.map((is: string, i: number) => (
                            <li key={i}>{is}</li>
                          ))}
                        </ul>
                      </div>

                      {selectedItem.data.possibleDiseases && selectedItem.data.possibleDiseases.length > 0 && (
                        <div className="space-y-2">
                          <span className="font-bold text-red-900 block text-[11px] uppercase tracking-wide">🦠 Disease Preventions:</span>
                          <div className="space-y-2 bg-red-50/10 p-3 rounded-xl border border-red-50/40">
                            {selectedItem.data.possibleDiseases.map((dis: any, i: number) => (
                              <div key={i}>
                                <strong className="text-gray-800 block text-xs">{dis.name}</strong>
                                <span className="text-gray-500 block mt-0.5">{dis.prevention}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* B. RENDER SAVED CAREER BLUEPRINT */}
                  {selectedItem.type === 'career' && (
                    <div className="space-y-4 animate-fade-in text-xs">
                      <p className="text-gray-500 border-l-2 border-emerald-300 pl-2 italic">
                        {selectedItem.data.description}
                      </p>

                      <div className="grid grid-cols-2 gap-3 border-y py-3 my-2 border-gray-100">
                        <div>
                          <span className="text-gray-400 block font-semibold uppercase tracking-wide text-[10px]">Estimated Budget:</span>
                          <strong className="text-emerald-800 text-sm font-bold">{selectedItem.data.estimatedInvestment}</strong>
                        </div>
                        <div>
                          <span className="text-gray-400 block font-semibold uppercase tracking-wide text-[10px]">Expected Income:</span>
                          <strong className="text-emerald-800 text-sm font-bold">{selectedItem.data.expectedIncome}</strong>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <strong className="text-gray-800 block uppercase tracking-wide text-[10px]">Skills Required:</strong>
                        <div className="flex flex-wrap gap-1">
                          {selectedItem.data.requiredSkills.map((sk: string, i: number) => (
                            <span key={i} className="bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full font-bold border border-emerald-100">
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <strong className="text-gray-800 block uppercase tracking-wide text-[10px]">Required Education:</strong>
                        <p className="text-gray-600 mt-1 pl-1 leading-relaxed border-l-2 border-gray-200">{selectedItem.data.educationRequired}</p>
                      </div>

                      <div>
                        <strong className="text-gray-800 block uppercase tracking-wide text-[10px]">Government Subsidy & Support:</strong>
                        <p className="text-gray-600 mt-1 pl-1 leading-relaxed border-l-2 border-gray-200">{selectedItem.data.governmentSupport}</p>
                      </div>

                      <div>
                        <strong className="text-gray-800 block uppercase tracking-wide text-[10px]">Learning centers / study centers:</strong>
                        <ul className="space-y-1 mt-1 pl-5 list-disc text-gray-500 font-semibold">
                          {selectedItem.data.learningResources.map((res: string, i: number) => (
                            <li key={i}>{res}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* C. RENDER SAVED CROP PATHOLOGY DIAGNOSTIC */}
                  {selectedItem.type === 'analysis' && (
                    <div className="space-y-4 animate-fade-in">
                      {selectedItem.data.image && (
                        <img
                          src={selectedItem.data.image}
                          alt="Diagnosis Crop"
                          className="w-full h-40 object-cover rounded-xl border"
                        />
                      )}
                      
                      <div className="bg-emerald-50/20 p-4 rounded-xl border border-emerald-50/50">
                        <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wide block mb-2">Completed Pathology Report:</span>
                        <div className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap font-medium">
                          {selectedItem.data.analysis}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* D. RENDER SAVED CHAT LOGS */}
                  {selectedItem.type === 'chat' && (
                    <div className="space-y-3 max-h-[350px] overflow-y-auto scrollbar-thin p-1 bg-gray-50 rounded-xl border">
                      {selectedItem.data.messages.map((msg: any) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[85%] p-3 rounded-xl text-xs ${
                            msg.sender === 'user' 
                              ? 'bg-emerald-600 text-white rounded-tr-none' 
                              : 'bg-white border text-gray-800 rounded-tl-none'
                          }`}>
                            <p>{msg.text}</p>
                            <span className="text-[9px] opacity-60 block text-right mt-1.5">{msg.timestamp}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              </div>

              <div className="text-center text-[11px] text-gray-400 font-semibold border-t pt-3 mt-4 flex items-center justify-between">
                <span>Cabinet secure offline synchronization</span>
                <span>File size: ~2.4KB</span>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <FolderLock className="w-12 h-12 stroke-1 mb-2 text-emerald-600 animate-bounce" />
              <span className="text-xs font-semibold text-gray-500">Select an offline file from the catalog index</span>
              <span className="text-[10px] text-gray-400 mt-1">Read summaries, schedules, and hear full advice read aloud without cell reception.</span>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
