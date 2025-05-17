import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation, HTMLMotionProps } from 'framer-motion';
import { DragDropContext, Droppable, Draggable, DropResult, DraggableProvided, DraggableStateSnapshot, DroppableProvided, DroppableStateSnapshot } from 'react-beautiful-dnd';
import { useInView } from 'react-intersection-observer';
import { useTheme } from '../../context/ThemeContext';
import { 
  Plus, X, Share2, Filter, Save, Download, MapPin, Coffee, 
  Utensils, Map, Plane, Bed, Camera, Sun, Sunrise, Sunset,
  Star, Tag, Clock, Calendar, Edit3, MoreHorizontal, Trash2,
  ChevronDown, Check, LayoutGrid, GanttChart, Cloud, Sparkles,
  ArrowLeft
} from 'lucide-react';
import toast, { Toast } from 'react-hot-toast';
import DayColumn from './components/DayColumn';
import TimelineView from './components/TimelineView';
import ProgressTracker from './components/ProgressTracker';
import { Day, Activity } from './types';
import { mockWeather } from './utils/mockData';
import type { Mood } from './components/MoodSelector';
import { Link } from 'react-router-dom';

const ItineraryPlanner = () => {
  const { currentTheme, themeColors } = useTheme();
  const [viewMode, setViewMode] = useState<'cards' | 'timeline'>('cards');
  const [days, setDays] = useState<Day[]>([
    {
      id: 'day-1',
      title: 'Day 1',
      activities: [
        {
          id: 'activity-1',
          title: 'Breakfast at Mountain View',
          timeStart: '08:00',
          timeEnd: '09:30',
          location: 'Mountain View Restaurant',
          notes: 'Try their famous pancakes!',
          tags: ['food', 'booked'],
          type: 'food',
          checklist: []
        },
        {
          id: 'activity-2',
          title: 'Hiking Trail Adventure',
          timeStart: '10:00',
          timeEnd: '14:00',
          location: 'Eagle Peak Trail',
          notes: 'Bring water and hiking boots',
          tags: ['explore', 'must-do'],
          type: 'activity',
          checklist: []
        }
      ]
    },
    {
      id: 'day-2',
      title: 'Day 2',
      activities: [
        {
          id: 'activity-3',
          title: 'Flight to Beach Resort',
          timeStart: '09:00',
          timeEnd: '12:00',
          location: 'Local Airport → Beach City',
          notes: 'Confirmation #A123456',
          tags: ['travel', 'booked'],
          type: 'travel',
          checklist: []
        }
      ]
    }
  ]);
  
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [isAddingActivity, setIsAddingActivity] = useState(false);
  const [targetDayId, setTargetDayId] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isTagManagerOpen, setIsTagManagerOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [lastDeletedActivity, setLastDeletedActivity] = useState<{dayId: string; activity: Activity} | null>(null);
  
  // Filter activities based on selected tags
  const getFilteredActivities = (activities: Activity[]) => {
    if (selectedTags.length === 0) return activities;
    return activities.filter(activity => 
      selectedTags.some(tag => 
        activity.tags.includes(tag) || activity.type === tag
      )
    );
  };
  
  // Add weather info helper function
  const getWeatherInfo = (location: string | undefined) => {
    if (!location) return null;
    return mockWeather[location];
  };
  
  // Get theme colors
  const getPrimaryColor = () => {
    switch(currentTheme) {
      case 'mountains':
        return 'indigo';
      case 'beaches':
        return 'sky';
      case 'cities':
        return 'violet';
      default:
        return 'indigo';
    }
  };
  
  const getGradient = () => {
    switch(currentTheme) {
      case 'mountains':
        return 'from-indigo-500 to-purple-600';
      case 'beaches':
        return 'from-sky-400 to-teal-500';
      case 'cities':
        return 'from-violet-500 to-fuchsia-500';
      default:
        return 'from-indigo-500 to-purple-600';
    }
  };
  
  const getTagColor = (tag: string) => {
    switch(tag) {
      case 'food':
        return 'bg-amber-100 text-amber-800';
      case 'travel':
        return 'bg-sky-100 text-sky-800';
      case 'explore':
        return 'bg-emerald-100 text-emerald-800';
      case 'accommodation':
        return 'bg-indigo-100 text-indigo-800';
      case 'activity':
        return 'bg-rose-100 text-rose-800';
      case 'must-do':
        return 'bg-red-100 text-red-800';
      case 'booked':
        return 'bg-green-100 text-green-800';
      case 'planned':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'food':
        return <Utensils className="w-4 h-4" />;
      case 'travel':
        return <Plane className="w-4 h-4" />;
      case 'explore':
        return <Map className="w-4 h-4" />;
      case 'accommodation':
        return <Bed className="w-4 h-4" />;
      case 'activity':
        return <Sun className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  // Fixed drag and drop handling
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    
    // If no destination or dropped in same place, return early
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;
    
    // Find source and destination day
    const sourceDay = days.find(day => day.id === source.droppableId);
    const destDay = days.find(day => day.id === destination.droppableId);
    
    if (!sourceDay || !destDay) return;
    
    // Create new array of days
    const newDays = [...days];
    const sourceDayIndex = days.findIndex(day => day.id === source.droppableId);
    const destDayIndex = days.findIndex(day => day.id === destination.droppableId);

    // If moving within the same day
    if (source.droppableId === destination.droppableId) {
      const newActivities = Array.from(sourceDay.activities);
      const [movedActivity] = newActivities.splice(source.index, 1);
      newActivities.splice(destination.index, 0, movedActivity);

      newDays[sourceDayIndex] = {
        ...sourceDay,
        activities: newActivities
      };
    } else {
      // Moving between different days
      const sourceActivities = Array.from(sourceDay.activities);
      const destActivities = Array.from(destDay.activities);
      
      const [movedActivity] = sourceActivities.splice(source.index, 1);
      destActivities.splice(destination.index, 0, movedActivity);

      newDays[sourceDayIndex] = {
        ...sourceDay,
        activities: sourceActivities
      };
      
      newDays[destDayIndex] = {
        ...destDay,
        activities: destActivities
      };
    }
    
    setDays(newDays);

    // Show success toast
    toast.success(
      source.droppableId === destination.droppableId
        ? 'Activity reordered'
        : `Activity moved to ${destDay.title}`,
      {
        style: {
          background: '#1f2937',
          color: '#fff',
          borderRadius: '0.5rem',
          border: '1px solid rgba(255,255,255,0.1)',
        },
        duration: 2000,
      }
    );
  };
  
  // Add a new day
  const addDay = () => {
    const newDayId = `day-${days.length + 1}`;
    const newDay: Day = {
      id: newDayId,
      title: `Day ${days.length + 1}`,
      activities: []
    };
    
    setDays([...days, newDay]);
  };
  
  // Edit day title
  const updateDayTitle = (dayId: string, newTitle: string) => {
    const newDays = days.map(day => 
      day.id === dayId ? { ...day, title: newTitle } : day
    );
    setDays(newDays);
  };
  
  // Add a new activity
  const addActivity = (dayId: string) => {
    setTargetDayId(dayId);
    setIsAddingActivity(true);
    setEditingActivity({
      id: `activity-${Math.random().toString(36).substr(2, 9)}`,
      title: '',
      timeStart: '',
      timeEnd: '',
      location: '',
      notes: '',
      tags: [],
      type: 'activity',
      checklist: []
    });
  };
  
  // Save activity
  const saveActivity = () => {
    if (!editingActivity || !targetDayId) return;
    
    const dayIndex = days.findIndex(day => day.id === targetDayId);
    if (dayIndex === -1) return;
    
    const existingActivityIndex = days[dayIndex].activities.findIndex(
      act => act.id === editingActivity.id
    );
    
    const newDays = [...days];
    
    if (existingActivityIndex !== -1) {
      // Update existing activity
      newDays[dayIndex].activities[existingActivityIndex] = editingActivity;
    } else {
      // Add new activity
      newDays[dayIndex].activities.push(editingActivity);
    }
    
    setDays(newDays);
    setEditingActivity(null);
    setIsAddingActivity(false);
    setTargetDayId(null);
  };
  
  // Enhanced delete with undo functionality
  const handleDeleteActivity = (dayId: string, activityId: string) => {
    const dayIndex = days.findIndex(day => day.id === dayId);
    if (dayIndex === -1) return;
    
    const activity = days[dayIndex].activities.find(act => act.id === activityId);
    if (!activity) return;
    
    const newDays = [...days];
    newDays[dayIndex].activities = newDays[dayIndex].activities.filter(
      act => act.id !== activityId
    );
    
    setDays(newDays);
    setLastDeletedActivity({ dayId, activity });

    toast.custom((t: Toast) => (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-gray-800 text-white px-6 py-4 rounded-lg shadow-xl border border-white/10 flex items-center gap-4"
      >
        <span>Activity deleted</span>
        <button
          onClick={() => {
            const dayIndex = days.findIndex(day => day.id === dayId);
            if (dayIndex !== -1) {
              const newDays = [...days];
              newDays[dayIndex].activities.push(activity);
              setDays(newDays);
              setLastDeletedActivity(null);
              toast.dismiss(t.id);
            }
          }}
          className="text-cyan-400 hover:text-cyan-300 font-medium"
        >
          Undo
        </button>
      </motion.div>
    ), { duration: 4000 });
  };
  
  // Edit activity
  const editActivity = (dayId: string, activity: Activity) => {
    const dayIndex = days.findIndex(day => day.id === dayId);
    if (dayIndex === -1) return;

    const activityIndex = days[dayIndex].activities.findIndex(act => act.id === activity.id);
    if (activityIndex === -1) return;

    const newDays = [...days];
    newDays[dayIndex].activities[activityIndex] = activity;
    setDays(newDays);

    // Only open the edit modal if we're not just updating the checklist
    if (!activity.checklist || activity.checklist.length === 0) {
    setTargetDayId(dayId);
    setEditingActivity(activity);
    setIsAddingActivity(true);
    }
  };
  
  // Share itinerary
  const shareItinerary = () => {
    alert('Sharing link copied to clipboard!');
    // In a real app, this would generate a shareable link or prompt a share dialog
  };
  
  // Mock save functionality
  const handleSave = () => {
    toast.success('Plan saved successfully!', {
      style: {
        background: '#1f2937',
        color: '#fff',
        borderRadius: '0.5rem',
        border: '1px solid rgba(255,255,255,0.1)',
      },
    });
  };

  // Mock export functionality
  const handleExport = () => {
    const data = JSON.stringify(days, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'itinerary.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Itinerary exported!', {
      style: {
        background: '#1f2937',
        color: '#fff',
        borderRadius: '0.5rem',
        border: '1px solid rgba(255,255,255,0.1)',
      },
    });
  };

  // Handle mood selection
  const handleMoodSelect = (dayId: string, mood: Mood) => {
    const newDays = days.map(day =>
      day.id === dayId ? { ...day, mood } : day
    );
    setDays(newDays);

    // Save to localStorage
    try {
      localStorage.setItem('itinerary-moods', JSON.stringify(
        newDays.reduce((acc, day) => ({
          ...acc,
          [day.id]: day.mood
        }), {})
      ));
    } catch (error) {
      console.error('Failed to save moods to localStorage:', error);
    }
  };

  // Load saved moods on mount
  useEffect(() => {
    try {
      const savedMoods = localStorage.getItem('itinerary-moods');
      if (savedMoods) {
        const moodData = JSON.parse(savedMoods);
        setDays(days.map(day => ({
          ...day,
          mood: moodData[day.id]
        })));
      }
    } catch (error) {
      console.error('Failed to load moods from localStorage:', error);
    }
  }, []);
  
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/40 via-gray-900 to-black text-white font-sans relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated gradient orbs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-violet-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-fuchsia-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      </div>

      {/* Fixed Header Section */}
      <div className="fixed top-0 left-0 right-0 z-50">
        {/* Main Heading */}
        <div className="bg-gray-900/95 backdrop-blur-xl border-b border-white/10 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <motion.div 
              className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {/* Back Button and Title Group */}
              <div className="flex items-center gap-4">
                <Link to="/">
                  <motion.button
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                    whileHover={{ scale: 1.02, x: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ArrowLeft className="w-4 h-4 text-violet-400" />
                    <span className="text-sm font-medium">Back</span>
                  </motion.button>
                </Link>

                {/* Existing Title Group */}
                <div className="flex items-center gap-4">
                  <motion.div
                    className="relative group cursor-pointer"
                    initial={{ rotate: -10, scale: 0.9 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    whileHover={{ scale: 1.1, rotate: -5 }}
                  >
                    <span role="img" aria-label="travel" className="text-3xl md:text-4xl filter drop-shadow-lg">✈️</span>
                    <div className="absolute inset-0 bg-white/20 rounded-full filter blur-xl opacity-0 group-hover:opacity-75 transition-opacity" />
                  </motion.div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold font-space-grotesk tracking-tight">
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-500 to-purple-600">
                        Itinerary Planner
                      </span>
                    </h1>
                    <p className="text-sm md:text-base text-white/70 mt-1">Plan your perfect journey — one moment at a time ✨</p>
                  </div>
                </div>
              </div>

              {/* Share Plan Button - Enhanced */}
              <motion.button
                className="hidden md:flex h-10 bg-gradient-to-r from-violet-500 to-fuchsia-500 px-6 rounded-full items-center gap-2 text-white font-medium shadow-lg hover:shadow-violet-500/25 transition-all"
                onClick={shareItinerary}
                whileHover={{ scale: 1.02, boxShadow: '0 8px 20px rgba(139, 92, 246, 0.3)' }}
                whileTap={{ scale: 0.98 }}
              >
                <Share2 className="w-4 h-4" />
                <span>Share Journey</span>
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Progress Tracker */}
        <ProgressTracker days={days} getGradient={getGradient} />

        {/* Control Bar - Enhanced */}
        <div className="bg-black/90 backdrop-blur-xl border-b border-white/10 shadow-lg">
          <div className="max-w-7xl mx-auto px-4">
            <div className="py-3 flex items-center justify-between gap-4">
              {/* Control Buttons Group */}
              <div className="flex items-center gap-2 sm:gap-3">
                <motion.button
                  className="h-9 bg-white/10 hover:bg-white/20 rounded-full px-3 sm:px-4 flex items-center gap-2 text-sm font-medium transition-all border border-white/5 shadow-sm hover:shadow-md"
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.15)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsFilterOpen(true)}
                >
                  <Filter className="w-4 h-4 text-violet-400" />
                  <span className="hidden sm:inline">Filter</span>
                </motion.button>

                <motion.button
                  className="h-9 bg-white/10 hover:bg-white/20 rounded-full px-3 sm:px-4 flex items-center gap-2 text-sm font-medium transition-all border border-white/5 shadow-sm hover:shadow-md"
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.15)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsTagManagerOpen(true)}
                >
                  <Tag className="w-4 h-4 text-violet-400" />
                  <span className="hidden sm:inline">Tags</span>
                </motion.button>

                <motion.button
                  className="h-9 bg-white/10 hover:bg-white/20 rounded-full px-3 sm:px-4 flex items-center gap-2 text-sm font-medium transition-all border border-white/5 shadow-sm hover:shadow-md"
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.15)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                >
                  <Save className="w-4 h-4 text-violet-400" />
                  <span className="hidden sm:inline">Save</span>
                </motion.button>

                <motion.button
                  className="h-9 bg-white/10 hover:bg-white/20 rounded-full px-3 sm:px-4 flex items-center gap-2 text-sm font-medium transition-all border border-white/5 shadow-sm hover:shadow-md"
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.15)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleExport}
                >
                  <Download className="w-4 h-4 text-violet-400" />
                  <span className="hidden sm:inline">Export</span>
                </motion.button>
          </div>
          
              {/* Share Button - Mobile Only */}
              <motion.button
                className="md:hidden h-9 bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 rounded-full flex items-center gap-2 text-white font-medium shadow-md hover:shadow-lg transition-all"
            onClick={shareItinerary}
                whileHover={{ scale: 1.02, boxShadow: '0 8px 20px rgba(139, 92, 246, 0.3)' }}
                whileTap={{ scale: 0.98 }}
          >
            <Share2 className="w-4 h-4" />
                <span className="text-sm">Share</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="pt-[200px] pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            className="mb-8 flex items-center justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <h2 className="text-2xl font-semibold text-white/90">Your Journey</h2>
              <p className="text-white/60 text-sm mt-1">Drag and drop activities to organize your perfect day</p>
            </div>
          </motion.div>

          {/* Main Content Views */}
          <AnimatePresence mode="wait">
            {viewMode === 'cards' ? (
                  <motion.div
                key="card-view"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory custom-scrollbar"
              >
                <DragDropContext onDragEnd={handleDragEnd}>
                  {days.map((day) => (
                    <DayColumn
                      key={day.id}
                      day={day}
                      getGradient={getGradient}
                      getPrimaryColor={getPrimaryColor}
                      updateDayTitle={updateDayTitle}
                      addActivity={addActivity}
                      onEditActivity={editActivity}
                      onDeleteActivity={handleDeleteActivity}
                      onMoodSelect={handleMoodSelect}
                    />
                  ))}
                </DragDropContext>

                {/* Add Day Button */}
                        <motion.button
                  onClick={addDay}
                  className="flex-shrink-0 w-[320px] h-[65vh] rounded-xl border-2 border-dashed border-white/20
                    hover:border-white/40 transition-colors flex flex-col items-center justify-center gap-3
                    text-white/60 hover:text-white/80 bg-white/5 hover:bg-white/10 backdrop-blur-sm"
                  whileHover={{ scale: 1.02, boxShadow: '0 8px 20px rgba(139, 92, 246, 0.1)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    whileHover={{ rotate: 90 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Plus className="w-8 h-8" />
                  </motion.div>
                  <span className="text-lg font-medium">Add Day</span>
                  <p className="text-sm text-white/40 max-w-[200px] text-center">
                    Start planning your next adventure
                  </p>
                        </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="timeline-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="min-h-[65vh]"
              >
                <TimelineView
                  days={days}
                  getPrimaryColor={getPrimaryColor}
                  getGradient={getGradient}
                  onEditActivity={editActivity}
                  onDeleteActivity={handleDeleteActivity}
                />
              </motion.div>
            )}
          </AnimatePresence>
                      </div>
                    </div>
                    
      {/* Floating View Toggle Button */}
      <motion.button
        onClick={() => setViewMode(viewMode === 'cards' ? 'timeline' : 'cards')}
        className="fixed bottom-6 right-6 px-4 py-3 rounded-full bg-gray-800/95 backdrop-blur-sm
          border border-white/10 shadow-lg hover:shadow-xl transition-all
          flex items-center gap-2 text-sm font-medium z-40
          hover:bg-gray-700/95"
        whileHover={{ scale: 1.05, boxShadow: '0 8px 20px rgba(139, 92, 246, 0.2)' }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
                            >
        {viewMode === 'cards' ? (
          <>
            <GanttChart className="w-4 h-4 text-cyan-400" />
            <span>Timeline View</span>
          </>
        ) : (
          <>
            <LayoutGrid className="w-4 h-4 text-cyan-400" />
            <span>Card View</span>
          </>
        )}
      </motion.button>

      {/* Filter Modal */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsFilterOpen(false)}
          >
            <motion.div
              className="bg-gray-800/95 rounded-xl p-6 w-full max-w-md shadow-2xl border border-white/10"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
                                  >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Filter Activities</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-white/60 hover:text-white"
                  onClick={() => setIsFilterOpen(false)}
                                  >
                  <X className="w-5 h-5" />
                </motion.button>
                              </div>
                              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Activity Types</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['food', 'travel', 'explore', 'accommodation', 'activity'].map(type => (
                      <motion.button
                        key={type}
                        className={`p-2 rounded-lg flex items-center gap-2 text-sm font-medium
                                  ${selectedTags.includes(type)
                                    ? 'bg-white/20 text-white'
                                    : 'bg-white/10 text-white/60 hover:bg-white/15'
                                  }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setSelectedTags(prev =>
                            prev.includes(type)
                              ? prev.filter(t => t !== type)
                              : [...prev, type]
                          );
                        }}
                      >
                        {getTypeIcon(type)}
                        <span className="capitalize">{type}</span>
                      </motion.button>
                    ))}
                                  </div>
                                  </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {['planned', 'booked', 'must-do'].map(tag => (
                      <motion.button
                        key={tag}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium
                                  ${selectedTags.includes(tag)
                                    ? getTagColor(tag)
                                    : 'bg-white/10 text-white/60 hover:bg-white/15'
                                  }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setSelectedTags(prev =>
                            prev.includes(tag)
                              ? prev.filter(t => t !== tag)
                              : [...prev, tag]
                          );
                        }}
                                      >
                                        {tag}
                      </motion.button>
                                    ))}
                                  </div>
                              </div>
                            </div>

              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-white/10">
                <motion.button
                  className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedTags([]);
                    setIsFilterOpen(false);
                  }}
                      >
                  Clear All
                </motion.button>
                <motion.button
                  className={`px-4 py-2 rounded-lg bg-gradient-to-r ${getGradient()} text-white font-medium`}
                  whileHover={{ scale: 1.02, boxShadow: '0 5px 15px rgba(0,0,0,0.2)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsFilterOpen(false)}
                >
                  Apply Filters
                </motion.button>
                    </div>
            </motion.div>
                  </motion.div>
                )}
      </AnimatePresence>
            
      {/* Tag Manager Modal */}
      <AnimatePresence>
        {isTagManagerOpen && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsTagManagerOpen(false)}
            >
            <motion.div
              className="bg-gray-800/95 rounded-xl p-6 w-full max-w-md shadow-2xl border border-white/10"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Manage Tags</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-white/60 hover:text-white"
                  onClick={() => setIsTagManagerOpen(false)}
                >
                  <X className="w-5 h-5" />
                </motion.button>
            </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Available Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {['planned', 'booked', 'must-do'].map(tag => (
                      <div
                        key={tag}
                        className={`px-3 py-1.5 rounded-full ${getTagColor(tag)} flex items-center gap-2`}
                      >
                        <span className="capitalize">{tag}</span>
          </div>
                    ))}
                  </div>
      </div>
      
                <div className="mt-6 p-4 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-sm text-white/60">
                    Custom tag management coming soon! You'll be able to create and manage your own tags.
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end mt-8 pt-4 border-t border-white/10">
                <motion.button
                  className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsTagManagerOpen(false)}
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Activity Editor Modal with improved styling */}
      <AnimatePresence>
        {isAddingActivity && editingActivity && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsAddingActivity(false)}
          >
            <motion.div
              className="bg-gray-800/95 rounded-xl p-6 w-full max-w-lg shadow-2xl border border-white/10"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold font-sans">
                  {editingActivity.id.includes('activity-') ? 'Add Activity' : 'Edit Activity'}
                </h2>
                <button
                  className="bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
                  onClick={() => setIsAddingActivity(false)}
                >
                  <X className="w-5 h-5 text-white/90" />
                </button>
              </div>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Activity Type</label>
                  <div className="relative">
                    <select
                      className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white shadow-inner appearance-none pl-10 [&>option]:bg-gray-800 [&>option]:text-white"
                      value={editingActivity.type}
                      onChange={(e) => setEditingActivity({
                        ...editingActivity,
                        type: e.target.value as any
                      })}
                    >
                      <option value="activity">Activity</option>
                      <option value="food">Food</option>
                      <option value="travel">Travel</option>
                      <option value="accommodation">Accommodation</option>
                      <option value="explore">Explore</option>
                    </select>
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      {getTypeIcon(editingActivity.type)}
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <ChevronDown className="w-4 h-4 text-white/50" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Title</label>
                  <input
                    className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white shadow-inner"
                    value={editingActivity.title}
                    onChange={(e) => setEditingActivity({
                      ...editingActivity,
                      title: e.target.value
                    })}
                    placeholder="Activity title"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Start Time</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-300 w-4 h-4" />
                      <input
                        type="time"
                        className="w-full p-3 pl-10 rounded-lg bg-white/10 border border-white/20 text-white shadow-inner"
                        value={editingActivity.timeStart}
                        onChange={(e) => setEditingActivity({
                          ...editingActivity,
                          timeStart: e.target.value
                        })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">End Time</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-300 w-4 h-4" />
                      <input
                        type="time"
                        className="w-full p-3 pl-10 rounded-lg bg-white/10 border border-white/20 text-white shadow-inner"
                        value={editingActivity.timeEnd}
                        onChange={(e) => setEditingActivity({
                          ...editingActivity,
                          timeEnd: e.target.value
                        })}
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-300 w-4 h-4" />
                    <input
                      className="w-full p-3 pl-10 rounded-lg bg-white/10 border border-white/20 text-white shadow-inner"
                      value={editingActivity.location}
                      onChange={(e) => setEditingActivity({
                        ...editingActivity,
                        location: e.target.value
                      })}
                      placeholder="Where is this happening?"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Notes</label>
                  <textarea
                    className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white shadow-inner h-24 resize-none"
                    value={editingActivity.notes}
                    onChange={(e) => setEditingActivity({
                      ...editingActivity,
                      notes: e.target.value
                    })}
                    placeholder="Additional details..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {['planned', 'booked', 'must-do'].map(tag => (
                      <motion.div
                        key={tag}
                        className={`
                          rounded-full px-4 py-2 text-sm flex items-center gap-2 cursor-pointer transition-all
                          ${editingActivity.tags.includes(tag) 
                            ? getTagColor(tag) + ' shadow-md' 
                            : 'bg-white/10 text-white/60 hover:bg-white/15'}
                        `}
                        whileHover={{ scale: 1.05, y: -1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          const currentTags = [...editingActivity.tags];
                          const tagIndex = currentTags.indexOf(tag);
                          if (tagIndex > -1) {
                            currentTags.splice(tagIndex, 1);
                          } else {
                            currentTags.push(tag);
                          }
                          setEditingActivity({
                            ...editingActivity,
                            tags: currentTags
                          });
                        }}
                      >
                        <motion.div
                          animate={{ scale: editingActivity.tags.includes(tag) ? 1 : 0.8 }}
                          transition={{ duration: 0.2 }}
                        >
                          {editingActivity.tags.includes(tag) ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Plus className="w-4 h-4" />
                          )}
                        </motion.div>
                        {tag}
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end gap-4 pt-4 border-t border-white/10 mt-8">
                  <motion.button
                    className="px-5 py-2.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                    whileHover={{ scale: 1.02, x: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsAddingActivity(false)}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    className={`px-5 py-2.5 rounded-lg bg-gradient-to-r ${getGradient()} text-white font-medium`}
                    whileHover={{ scale: 1.02, x: 2, boxShadow: '0 5px 15px rgba(255,255,255,0.2)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={saveActivity}
                  >
                    Save Activity
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 8px;
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.5);
        }
      `}</style>

      {/* Add keyframe animations */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default ItineraryPlanner; 