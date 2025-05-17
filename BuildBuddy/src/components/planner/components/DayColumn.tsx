import * as React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { motion } from 'framer-motion';
import { Edit3, Plus, Calendar } from 'lucide-react';
import ActivityCard from './ActivityCard';
import MoodSelector, { Mood } from './MoodSelector';
import type { Activity, DayColumnProps } from '@/components/planner/types';

const DayColumn: React.FC<DayColumnProps> = ({ 
  day, 
  getGradient, 
  getPrimaryColor, 
  updateDayTitle, 
  addActivity,
  onEditActivity,
  onDeleteActivity,
  onMoodSelect
}: DayColumnProps) => {
  // Calculate progress based on whether activities are planned for each time slot
  const targetActivitiesPerDay = 8; // Expected number of activities per day
  const plannedActivities = day.activities.length;
  const progress = (plannedActivities / targetActivitiesPerDay) * 100;

  return (
    <Droppable droppableId={day.id}>
      {(provided, snapshot) => (
        <motion.div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`flex-shrink-0 w-[320px] min-h-[65vh] rounded-xl snap-start
            ${snapshot.isDraggingOver 
              ? 'bg-gray-700/50 backdrop-blur-xl ring-2 ring-white/20 shadow-lg scale-[1.02] border-white/30' 
              : 'bg-gray-800/30 backdrop-blur-lg'
            }
            border border-white/10 shadow-lg overflow-hidden flex flex-col
            hover:shadow-xl transition-all duration-300`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Day Header */}
          <div className={`p-4 border-b border-white/10 bg-gradient-to-r 
            ${day.mood ? day.mood.gradient : getGradient()} bg-opacity-40`}
          >
            <div className="flex justify-between items-start gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-white/70" />
                  <input
                    className="text-xl font-bold bg-transparent border-none outline-none w-full font-space-grotesk truncate mr-2
                      placeholder:text-white/40 focus:ring-0"
                    value={day.title}
                    onChange={(e) => updateDayTitle(day.id, e.target.value)}
                    placeholder="Day Title"
                  />
                </div>
                {day.mood && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-white/70 mt-1.5 flex items-center gap-1.5"
                  >
                    <span>{day.mood.emoji}</span>
                    <span>{day.mood.label}</span>
                  </motion.div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <MoodSelector
                  selectedMood={day.mood}
                  onSelect={(mood) => onMoodSelect?.(day.id, mood)}
                />
                <motion.button
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-white/70 hover:text-white transition-colors p-1.5 bg-white/5 rounded-full
                    hover:bg-white/10 hover:shadow-lg"
                >
                  <Edit3 className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-3 space-y-1">
              <div className="flex items-center justify-between text-xs text-white/60">
                <span>{plannedActivities} of {targetActivitiesPerDay} activities planned</span>
                <span>{Math.min(Math.round(progress), 100)}%</span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(progress, 100)}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>

          {/* Activities List */}
          <div 
            className="flex-grow p-4 space-y-4 overflow-y-auto max-h-[calc(65vh-100px)] custom-scrollbar"
            style={{ minHeight: '200px' }}
          >
            <div className="space-y-4">
              {day.activities.map((activity: Activity, index: number) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  index={index}
                  getPrimaryColor={getPrimaryColor}
                  onEdit={onEditActivity ? (activity) => onEditActivity(day.id, activity) : undefined}
                  onDelete={onDeleteActivity ? (activityId) => onDeleteActivity(day.id, activityId) : undefined}
                />
              ))}
              {provided.placeholder}
            </div>

            {/* Add Activity Button */}
            <motion.button
              className="w-full p-3 mt-1 rounded-lg border border-dashed border-white/30 text-white/70 
                flex items-center justify-center gap-2.5 hover:bg-white/10 transition-all
                hover:border-white/50 hover:text-white bg-white/5 backdrop-blur-sm"
              onClick={() => addActivity(day.id)}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="w-5 h-5" />
              <span className="text-sm font-medium">Add Activity</span>
            </motion.button>
          </div>
        </motion.div>
      )}
    </Droppable>
  );
};

export default DayColumn;