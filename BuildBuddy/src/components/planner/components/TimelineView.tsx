import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import type { Day, Activity } from '@/components/planner/types';
import { getTypeIcon } from '@/components/planner/utils';
import ActivityChecklist from './ActivityChecklist';

interface TimelineViewProps {
  days: Day[];
  getPrimaryColor: () => string;
  getGradient: () => string;
  onEditActivity?: (dayId: string, activity: Activity) => void;
  onDeleteActivity?: (dayId: string, activityId: string) => void;
}

const TimelineView: React.FC<TimelineViewProps> = ({
  days,
  getPrimaryColor,
  getGradient,
  onEditActivity,
  onDeleteActivity
}: TimelineViewProps) => {
  const [expandedActivities, setExpandedActivities] = React.useState<string[]>([]);

  const toggleActivity = (activityId: string): void => {
    setExpandedActivities(prev => 
      prev.includes(activityId) 
        ? prev.filter(id => id !== activityId)
        : [...prev, activityId]
    );
  };

  const handleChecklistUpdate = (dayId: string, activity: Activity, updatedChecklist: Activity['checklist']) => {
    if (onEditActivity) {
      onEditActivity(dayId, {
        ...activity,
        checklist: updatedChecklist
      });
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {days.map((day: Day) => (
        <div key={day.id} className="mb-12 last:mb-0">
          {/* Day Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl bg-gradient-to-r ${getGradient()} bg-opacity-40 mb-8`}
          >
            <h3 className="text-2xl font-bold text-white">{day.title}</h3>
          </motion.div>
          
          {/* Timeline */}
          <div className="relative">
            {/* Center Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/10 transform -translate-x-1/2" />
            
            {day.activities.map((activity: Activity, index: number) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative flex items-center mb-8 last:mb-0 ${
                  index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2">
                  <div className={`w-4 h-4 rounded-full bg-${getPrimaryColor()}-500 ring-4 ring-${getPrimaryColor()}-500/20`} />
                </div>
                
                {/* Time Stamp */}
                <div className={`w-1/2 ${index % 2 === 0 ? 'pr-12 text-right' : 'pl-12'}`}>
                  <div className="text-white/70 text-sm">
                    {activity.timeStart} - {activity.timeEnd}
                  </div>
                </div>
                
                {/* Activity Card */}
                <div className={`w-1/2 ${index % 2 === 0 ? 'pl-12' : 'pr-12'}`}>
                  <motion.div
                    className="bg-white/5 rounded-xl border border-white/10 overflow-hidden hover:bg-white/10 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div 
                      className="p-4 cursor-pointer"
                      onClick={() => toggleActivity(activity.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center
                            bg-${getPrimaryColor()}-500/30 text-${getPrimaryColor()}-300`}>
                            {getTypeIcon(activity.type)}
                          </div>
                          <div>
                            <h4 className="font-medium text-lg">{activity.title}</h4>
                            {activity.location && (
                              <div className="flex items-center gap-1.5 text-sm text-white/70 mt-1">
                                <MapPin className="w-3.5 h-3.5 text-pink-400" />
                                <span>{activity.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        {(activity.notes || activity.tags.length > 0) && (
                          <button className="text-white/60 hover:text-white">
                            {expandedActivities.includes(activity.id) ? (
                              <ChevronUp className="w-5 h-5" />
                            ) : (
                              <ChevronDown className="w-5 h-5" />
                            )}
                          </button>
                        )}
                      </div>
                      
                      <AnimatePresence>
                        {expandedActivities.includes(activity.id) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mt-4 space-y-3"
                          >
                            {activity.notes && (
                              <div className="text-sm text-white/70 bg-white/5 p-3 rounded-lg">
                                {activity.notes}
                              </div>
                            )}
                            
                            {activity.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {activity.tags.map((tag: string, idx: number) => (
                                  <span
                                    key={idx}
                                    className="bg-white/10 text-white/80 text-xs px-2.5 py-1 rounded-full"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Add the checklist component */}
                            <ActivityChecklist
                              items={activity.checklist}
                              onUpdate={(updatedChecklist) => handleChecklistUpdate(day.id, activity, updatedChecklist)}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TimelineView; 