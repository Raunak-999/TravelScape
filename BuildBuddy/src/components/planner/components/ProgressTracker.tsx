import * as React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import type { Day } from '@/components/planner/types';

interface ProgressTrackerProps {
  days: Day[];
  getGradient: () => string;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ days, getGradient }) => {
  const targetActivitiesPerDay = 8; // Expected activities per day
  const totalTargetActivities = days.length * targetActivitiesPerDay;
  const plannedActivities = days.reduce((acc, day) => acc + day.activities.length, 0);
  
  const progress = (plannedActivities / totalTargetActivities) * 100;
  const isComplete = progress >= 100;

  return (
    <div className="bg-gray-900/80 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white/80">Progress</span>
                <span className="text-sm text-white/60">
                  {plannedActivities} of {totalTargetActivities} activities planned
                </span>
              </div>
              <div className="relative w-[200px] h-2 mt-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-purple-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(progress, 100)}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              </div>
            </div>
          </div>

          {isComplete ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 text-sm font-medium text-emerald-400"
            >
              <Sparkles className="w-4 h-4" />
              <span>All activities planned! 🎉</span>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-white/60"
            >
              {progress < 50 ? "Keep going! 💪" : "Almost there! ✨"}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker; 