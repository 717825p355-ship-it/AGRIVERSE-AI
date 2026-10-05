import React, { useState, useEffect } from 'react';
import { UserProfile, FarmingReminder } from '../types';
import { 
  Bell, Plus, Calendar, Clock, CheckCircle2, Trash2, Edit3, 
  AlertCircle, Tag, Filter, Check, X, ShieldAlert, Sparkles, 
  RotateCcw, ChevronRight, Play, Volume2
} from 'lucide-react';
import voiceController from '../lib/voice';
import { t, LanguageCode } from '../lib/translations';

interface RemindersTabProps {
  userProfile?: UserProfile;
  reminders: FarmingReminder[];
  onAddReminder: (reminder: Omit<FarmingReminder, 'id' | 'dateCreated'>) => void;
  onUpdateReminder: (id: string, updated: Partial<FarmingReminder>) => void;
  onDeleteReminder: (id: string) => void;
  onToggleComplete: (id: string) => void;
  initialPreFill?: Partial<FarmingReminder> | null;
  onClearPreFill?: () => void;
  prefillData?: Partial<FarmingReminder> | null;
  onClearPrefill?: () => void;
}

export default function RemindersTab({
  userProfile,
  reminders,
  onAddReminder,
  onUpdateReminder,
  onDeleteReminder,
  onToggleComplete,
  initialPreFill,
  onClearPreFill,
  prefillData,
  onClearPrefill
}: RemindersTabProps) {
  const effectivePrefill = prefillData || initialPreFill;
  const effectiveClearPrefill = onClearPrefill || onClearPreFill;
  const [filterTab, setFilterTab] = useState<'upcoming' | 'completed' | 'all' | 'high'>('upcoming');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cropName, setCropName] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('08:00');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('High');
  const [category, setCategory] = useState<FarmingReminder['category']>('Irrigation');
  const [repeat, setRepeat] = useState<FarmingReminder['repeat']>('None');

  // Open modal prefilled if initialPreFill changes
  useEffect(() => {
    if (initialPreFill) {
      setTitle(initialPreFill.title || '');
      setDescription(initialPreFill.description || '');
      setCropName(initialPreFill.cropName || '');
      setDate(initialPreFill.date || new Date().toISOString().split('T')[0]);
      setTime(initialPreFill.time || '08:00');
      setPriority(initialPreFill.priority || 'High');
      setCategory(initialPreFill.category || 'Irrigation');
      setRepeat(initialPreFill.repeat || 'None');
      setEditingId(null);
      setIsModalOpen(true);
    }
  }, [initialPreFill]);

  const handleOpenAddModal = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setCropName('');
    setDate(new Date().toISOString().split('T')[0]);
    setTime('08:00');
    setPriority('High');
    setCategory('Irrigation');
    setRepeat('None');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (rem: FarmingReminder) => {
    setEditingId(rem.id);
    setTitle(rem.title);
    setDescription(rem.description);
    setCropName(rem.cropName);
    setDate(rem.date);
    setTime(rem.time);
    setPriority(rem.priority);
    setCategory(rem.category);
    setRepeat(rem.repeat);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingId) {
      onUpdateReminder(editingId, {
        title,
        description,
        cropName,
        date,
        time,
        priority,
        category,
        repeat
      });
      voiceController.speak(`Reminder updated for ${title}`, userProfile.preferredLanguage);
    } else {
      onAddReminder({
        title,
        description,
        cropName,
        date,
        time,
        priority,
        category,
        repeat,
        completed: false
      });
      voiceController.speak(`New reminder set: ${title} on ${date}`, userProfile.preferredLanguage);
    }

    setIsModalOpen(false);
    if (onClearPreFill) onClearPreFill();
  };

  // Helper calculation for countdown timer
  const getCountdownText = (remDate: string, remTime: string) => {
    const target = new Date(`${remDate}T${remTime}:00`);
    const now = new Date();
    const diffMs = target.getTime() - now.getTime();

    if (diffMs < 0) {
      const pastDays = Math.floor(Math.abs(diffMs) / (1000 * 60 * 60 * 24));
      return pastDays === 0 ? 'Due earlier today' : `Overdue by ${pastDays} day${pastDays > 1 ? 's' : ''}`;
    }

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `In ${days} day${days > 1 ? 's' : ''} ${hours % 24} hrs`;
    if (hours > 0) return `In ${hours} hr${hours > 1 ? 's' : ''} ${mins} mins`;
    return `In ${mins} minutes`;
  };

  // Filtering
  const filteredReminders = reminders.filter(rem => {
    if (filterTab === 'upcoming' && rem.completed) return false;
    if (filterTab === 'completed' && !rem.completed) return false;
    if (filterTab === 'high' && rem.priority !== 'High') return false;
    if (categoryFilter !== 'All' && rem.category !== categoryFilter) return false;
    return true;
  });

  const categoryOptions = ['Irrigation', 'Fertilizer', 'Pesticide', 'Harvest', 'Weeding', 'Market Visit', 'Government Scheme', 'Custom'];

  return (
    <div id="reminders-container" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
              <Bell className="w-3.5 h-3.5 text-emerald-600 animate-bounce" /> Smart Alarm Engine
            </span>
            <span className="bg-amber-50 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-full">
              {reminders.filter(r => !r.completed).length} Active Reminders
            </span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            {t('reminders', userProfile?.preferredLanguage as LanguageCode || 'English')}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Set irrigation schedules, fertilizer dates, and pesticide alerts. Get timely notifications on your phone.
          </p>
        </div>

        <button
          id="add-reminder-btn"
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-sm font-bold shadow-md transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Add New Reminder
        </button>
      </div>

      {/* Filter Tabs & Category Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-emerald-100 shadow-3xs">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'upcoming', label: '⏳ Upcoming Tasks' },
            { id: 'completed', label: '✅ Completed' },
            { id: 'high', label: '🔥 High Priority' },
            { id: 'all', label: '📋 All Reminders' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-lg text-xs font-extrabold whitespace-nowrap transition-all ${
                filterTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-3xs'
                  : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs font-bold text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="All">All Categories</option>
            {categoryOptions.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Reminders Grid or Empty State */}
      {filteredReminders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReminders.map(rem => {
            const isOverdue = new Date(`${rem.date}T${rem.time}:00`).getTime() < new Date().getTime() && !rem.completed;

            return (
              <div
                key={rem.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between relative group ${
                  rem.completed 
                    ? 'bg-gray-50/70 border-gray-200 opacity-75' 
                    : isOverdue 
                    ? 'bg-red-50/30 border-red-200' 
                    : 'bg-white border-emerald-100 hover:border-emerald-300 shadow-3xs hover:shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                      rem.category === 'Irrigation' ? 'bg-blue-100 text-blue-800' :
                      rem.category === 'Fertilizer' ? 'bg-amber-100 text-amber-800' :
                      rem.category === 'Pesticide' ? 'bg-red-100 text-red-800' :
                      rem.category === 'Harvest' ? 'bg-green-100 text-green-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {rem.category}
                    </span>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      rem.priority === 'High' ? 'bg-red-100 text-red-700' :
                      rem.priority === 'Medium' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {rem.priority} Priority
                    </span>
                  </div>

                  <h3 className={`text-base font-bold mb-1 ${rem.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                    {rem.title}
                  </h3>

                  {rem.description && (
                    <p className="text-xs text-gray-500 mb-3 line-clamp-2 leading-relaxed">
                      {rem.description}
                    </p>
                  )}

                  <div className="space-y-1 text-xs text-gray-600 font-medium">
                    {rem.cropName && (
                      <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                        <span>🌱 Crop: {rem.cropName}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span>{rem.date} at {rem.time}</span>
                    </div>
                    {rem.repeat !== 'None' && (
                      <div className="flex items-center gap-1.5 text-indigo-600 text-[11px] font-semibold">
                        <RotateCcw className="w-3 h-3" />
                        <span>Repeats: {rem.repeat}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  {!rem.completed ? (
                    <span className={`text-xs font-bold flex items-center gap-1 ${isOverdue ? 'text-red-600 font-black' : 'text-emerald-700'}`}>
                      <Clock className="w-3.5 h-3.5" />
                      {getCountdownText(rem.date, rem.time)}
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> Done
                    </span>
                  )}

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onToggleComplete(rem.id)}
                      className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                        rem.completed
                          ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      }`}
                      title={rem.completed ? 'Mark incomplete' : 'Mark complete'}
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenEditModal(rem)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-700 hover:bg-gray-100 transition-all"
                      title="Edit reminder"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteReminder(rem.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                      title="Delete reminder"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center space-y-3">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
            <Bell className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">No Reminders Found</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            {filterTab === 'upcoming' 
              ? 'You have no upcoming farming reminders. Create one now for irrigation, spraying, or harvesting!'
              : 'No reminders match your selected filter. Click below to add a reminder.'}
          </p>
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" /> Create Reminder
          </button>
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-emerald-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Bell className="w-5 h-5 text-emerald-600" />
                {editingId ? 'Edit Farming Reminder' : 'Set New Farming Reminder'}
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  if (onClearPreFill) onClearPreFill();
                }}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Reminder Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Irrigate Tomato Field or Apply Potash"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Description / Instructions
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Run drip pump for 30 minutes before 10 AM..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Crop Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Tomato, Rice"
                    value={cropName}
                    onChange={(e) => setCropName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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
                    {categoryOptions.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Repeat Schedule
                  </label>
                  <select
                    value={repeat}
                    onChange={(e) => setRepeat(e.target.value as any)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                  >
                    <option value="None">Does not repeat</option>
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    if (onClearPreFill) onClearPreFill();
                  }}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                >
                  {editingId ? 'Save Changes' : 'Create Reminder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
