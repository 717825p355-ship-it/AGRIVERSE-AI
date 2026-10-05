import React, { useState, useRef } from 'react';
import { UserProfile, FarmerNote } from '../types';
import { 
  FileText, Plus, Pin, Trash2, Edit3, Search, Filter, 
  Image as ImageIcon, Mic, MicOff, X, Check, Calendar, 
  Sparkles, Tag, Volume2, Upload, Eye
} from 'lucide-react';
import voiceController from '../lib/voice';

interface NotesTabProps {
  userProfile?: UserProfile;
  notes: FarmerNote[];
  onAddNote: (note: Omit<FarmerNote, 'id' | 'dateCreated' | 'updatedAt'>) => void;
  onUpdateNote: (id: string, updated: Partial<FarmerNote>) => void;
  onDeleteNote: (id: string) => void;
  onTogglePin: (id: string) => void;
}

export default function NotesTab({
  userProfile,
  notes,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  onTogglePin
}: NotesTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<FarmerNote['category']>('General');
  const [attachedImage, setAttachedImage] = useState<string | undefined>(undefined);
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenAdd = () => {
    setEditingNoteId(null);
    setTitle('');
    setContent('');
    setCategory('General');
    setAttachedImage(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (note: FarmerNote) => {
    setEditingNoteId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setCategory(note.category);
    setAttachedImage(note.attachedImage);
    setIsModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setAttachedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleToggleVoiceDictation = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser. Please type your notes.');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = userProfile.preferredLanguage === 'Hindi' ? 'hi-IN' :
                         userProfile.preferredLanguage === 'Tamil' ? 'ta-IN' :
                         userProfile.preferredLanguage === 'Telugu' ? 'te-IN' :
                         userProfile.preferredLanguage === 'Kannada' ? 'kn-IN' : 'en-US';

      setIsRecording(true);

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setContent(prev => prev + ' ' + transcript);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } catch (e) {
      setIsRecording(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) return;

    if (editingNoteId) {
      onUpdateNote(editingNoteId, {
        title: title || 'Untitled Note',
        content,
        category,
        attachedImage
      });
      voiceController.speak('Note updated successfully', userProfile.preferredLanguage);
    } else {
      onAddNote({
        title: title || 'Untitled Note',
        content,
        category,
        isPinned: false,
        attachedImage
      });
      voiceController.speak('Note saved to personal diary', userProfile.preferredLanguage);
    }

    setIsModalOpen(false);
  };

  const categories = ['General', 'Crops', 'Fertilizer', 'Equipment', 'Market', 'Finance'];

  // Filtering
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || note.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

  return (
    <div id="notes-container" className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-emerald-600" /> Digital Farm Diary
            </span>
            <span className="bg-amber-50 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-full">
              {notes.length} Saved Notes
            </span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Personal Farming Notes</h2>
          <p className="text-gray-500 text-sm mt-1">
            Record seed varieties, fertilizer dosages, expenses, market observations, and crop photos.
          </p>
        </div>

        <button
          id="add-note-btn"
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-sm font-bold shadow-md transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Create New Note
        </button>
      </div>

      {/* Search & Category bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-emerald-100 shadow-3xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search notes by keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 text-xs rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'All' ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            All Notes
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Notes Grid */}
      {filteredNotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map(note => (
            <div
              key={note.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between relative group ${
                note.isPinned 
                  ? 'bg-amber-50/20 border-amber-200 shadow-3xs' 
                  : 'bg-white border-emerald-100 hover:border-emerald-300 hover:shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {note.category}
                  </span>

                  <button
                    onClick={() => onTogglePin(note.id)}
                    className={`p-1 rounded-lg transition-all ${
                      note.isPinned ? 'text-amber-600 fill-amber-500' : 'text-gray-300 hover:text-amber-500'
                    }`}
                    title={note.isPinned ? 'Unpin note' : 'Pin note to top'}
                  >
                    <Pin className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-base font-bold text-gray-800 mb-1">
                  {note.title}
                </h3>

                <p className="text-xs text-gray-600 whitespace-pre-wrap line-clamp-4 leading-relaxed mb-3">
                  {note.content}
                </p>

                {note.attachedImage && (
                  <div className="mb-3 rounded-xl overflow-hidden max-h-40 border border-gray-100">
                    <img src={note.attachedImage} alt="Attached" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                <span className="flex items-center gap-1 font-medium">
                  <Calendar className="w-3 h-3" /> {note.dateCreated}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => voiceController.speak(`${note.title}. ${note.content}`, userProfile.preferredLanguage)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 transition-all"
                    title="Read note aloud"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(note)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-700 hover:bg-gray-100 transition-all"
                    title="Edit note"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteNote(note.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                    title="Delete note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center space-y-3">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">No Notes Found</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Start logging your farm records, seed purchases, fertilizer recipes, or field observations!
          </p>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" /> Create First Note
          </button>
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-emerald-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                {editingNoteId ? 'Edit Personal Note' : 'Create Personal Note'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Note Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Urea Application on Paddy Plot 2"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Content / Observations
                  </label>
                  <button
                    type="button"
                    onClick={handleToggleVoiceDictation}
                    className={`text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all ${
                      isRecording ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}
                  >
                    {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                    <span>{isRecording ? 'Listening... Click to stop' : 'Voice Dictate'}</span>
                  </button>
                </div>
                <textarea
                  rows={5}
                  placeholder="Type or voice dictate your farm note..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Attach Photo (Optional)
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                {attachedImage ? (
                  <div className="relative rounded-xl overflow-hidden max-h-40 border border-gray-200 group">
                    <img src={attachedImage} alt="Upload preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setAttachedImage(undefined)}
                      className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-md"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-3 border-2 border-dashed border-gray-200 hover:border-emerald-500 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-gray-500 hover:text-emerald-700 transition-all bg-gray-50/50"
                  >
                    <Upload className="w-4 h-4" /> Upload Crop or Field Photo
                  </button>
                )}
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                >
                  {editingNoteId ? 'Save Changes' : 'Save Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
