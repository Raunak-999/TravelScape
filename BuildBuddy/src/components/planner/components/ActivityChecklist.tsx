import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import type { ChecklistItem } from '@/components/planner/types';

interface ActivityChecklistProps {
  items: ChecklistItem[];
  onUpdate: (items: ChecklistItem[]) => void;
}

const ActivityChecklist: React.FC<ActivityChecklistProps> = ({ items, onUpdate }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [newItemText, setNewItemText] = React.useState('');
  
  const addItem = () => {
    if (newItemText.trim() === '') return;
    
    const newItem: ChecklistItem = {
      id: `checklist-${Math.random().toString(36).substr(2, 9)}`,
      text: newItemText.trim(),
      checked: false
    };
    
    onUpdate([...items, newItem]);
    setNewItemText('');
  };
  
  const toggleItem = (itemId: string) => {
    const updatedItems = items.map(item =>
      item.id === itemId ? { ...item, checked: !item.checked } : item
    );
    onUpdate(updatedItems);
  };
  
  const deleteItem = (itemId: string) => {
    const updatedItems = items.filter(item => item.id !== itemId);
    onUpdate(updatedItems);
  };
  
  const completedCount = items.filter(item => item.checked).length;
  const progress = items.length > 0 ? (completedCount / items.length) * 100 : 0;
  
  return (
    <div className="mt-4 border-t border-white/10 pt-4">
      {/* Header with progress */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between group"
      >
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-medium text-white/80">Checklist</h4>
          {items.length > 0 && (
            <span className="text-xs text-white/60">
              {completedCount}/{items.length}
            </span>
          )}
        </div>
        {items.length > 0 && (
          <div className="flex items-center gap-2">
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-white/60" />
            ) : (
              <ChevronDown className="w-4 h-4 text-white/60" />
            )}
          </div>
        )}
      </button>

      {/* Progress bar */}
      {items.length > 0 && (
        <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      )}

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-3 space-y-2 overflow-hidden"
          >
            {/* Checklist items */}
            <div className="space-y-2">
              {items.map(item => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-2 group"
                >
                  <button
                    onClick={() => toggleItem(item.id)}
                    className={`w-5 h-5 rounded border ${
                      item.checked
                        ? 'bg-emerald-500 border-emerald-600'
                        : 'border-white/20 hover:border-white/40'
                    } flex items-center justify-center transition-colors`}
                  >
                    {item.checked && <Check className="w-3 h-3 text-white" />}
                  </button>
                  <span className={`flex-1 text-sm ${item.checked ? 'line-through text-white/40' : 'text-white/80'}`}>
                    {item.text}
                  </span>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="opacity-0 group-hover:opacity-100 text-white/40 hover:text-white/60 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Add new item */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addItem()}
                placeholder="Add new item..."
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/20"
              />
              <motion.button
                onClick={addItem}
                disabled={newItemText.trim() === ''}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:hover:bg-white/10 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ActivityChecklist; 