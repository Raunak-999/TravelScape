import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smile } from 'lucide-react';

export interface Mood {
  emoji: string;
  label: string;
  gradient: string;
}

export const MOODS: Mood[] = [
  { emoji: '🧘', label: 'Chill', gradient: 'from-blue-500/20 to-blue-600/20' },
  { emoji: '🥾', label: 'Adventurous', gradient: 'from-green-500/20 to-green-600/20' },
  { emoji: '🏖️', label: 'Relaxing', gradient: 'from-yellow-500/20 to-yellow-600/20' },
  { emoji: '🛍️', label: 'Fun & Shopping', gradient: 'from-pink-500/20 to-pink-600/20' },
  { emoji: '📸', label: 'Sightseeing', gradient: 'from-indigo-500/20 to-indigo-600/20' },
  { emoji: '🍽️', label: 'Foodie', gradient: 'from-red-500/20 to-orange-500/20' }
];

interface MoodSelectorProps {
  selectedMood?: Mood;
  onSelect: (mood: Mood) => void;
}

const MoodSelector: React.FC<MoodSelectorProps> = ({ selectedMood, onSelect }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 rounded-full hover:bg-white/10 transition-colors relative group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="text-lg">{selectedMood?.emoji || '😊'}</span>
        <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Mood Popup */}
            <motion.div
              className="absolute right-0 mt-2 p-3 bg-gray-800/95 backdrop-blur-lg rounded-xl border border-white/10 shadow-xl z-50
                grid grid-cols-3 gap-2 min-w-[240px]"
              initial={{ opacity: 0, scale: 0.9, y: -5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -5 }}
              transition={{ type: "spring", duration: 0.2 }}
            >
              {MOODS.map((mood) => (
                <motion.button
                  key={mood.label}
                  className={`p-2 rounded-lg flex flex-col items-center gap-1.5 transition-colors
                    ${selectedMood?.label === mood.label 
                      ? 'bg-gradient-to-br ' + mood.gradient + ' ring-2 ring-white/20' 
                      : 'hover:bg-white/10'}`}
                  onClick={() => {
                    onSelect(mood);
                    setIsOpen(false);
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-2xl">{mood.emoji}</span>
                  <span className="text-xs font-medium text-white/80">{mood.label}</span>
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MoodSelector; 