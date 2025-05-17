import * as React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Edit3, Trash2, Clock, MapPin, GripVertical, Cloud } from 'lucide-react';
import type { Activity, ActivityCardProps } from '@/components/planner/types';
import { getTypeIcon } from '@/components/planner/utils';
import { mockWeather } from '../utils/mockData';
import MapEmbed from './MapEmbed';
import ActivityChecklist from './ActivityChecklist';

const ActivityCard: React.FC<ActivityCardProps> = ({ 
  activity, 
  index, 
  getPrimaryColor,
  onEdit,
  onDelete 
}: ActivityCardProps) => {
  const weatherInfo = activity.location ? mockWeather[activity.location] : null;
  const [isMapExpanded, setIsMapExpanded] = React.useState(false);

  const handleChecklistUpdate = (updatedChecklist: Activity['checklist']) => {
    if (onEdit) {
      onEdit({
        ...activity,
        checklist: updatedChecklist
      });
    }
  };

  return (
    <Draggable draggableId={activity.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`p-4 rounded-lg backdrop-blur-sm border border-white/10 
            ${snapshot.isDragging 
              ? 'shadow-2xl bg-white/15 ring-2 ring-white/20 scale-[1.02] rotate-[1deg] z-50' 
              : 'shadow-md bg-white/10 hover:bg-white/15'
            } transition-all duration-200 cursor-grab active:cursor-grabbing`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1 -ml-2">
                <GripVertical className="w-4 h-4 text-white/50" />
              </div>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center
                bg-${getPrimaryColor()}-500/30 text-${getPrimaryColor()}-300
                shadow-sm ${snapshot.isDragging ? 'scale-110' : ''} transition-transform duration-200`}>
                {getTypeIcon(activity.type)}
              </div>
              <h3 className="font-medium text-base font-sans">{activity.title}</h3>
            </div>
            <div className="flex gap-1.5">
              {onEdit && (
                <button
                  className="text-white/60 hover:text-white p-1.5 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
                  onClick={() => onEdit(activity)}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              )}
              {onDelete && (
                <button
                  className="text-white/60 hover:text-red-400 p-1.5 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
                  onClick={() => onDelete(activity.id)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="mt-3 space-y-2">
            {(activity.timeStart || activity.timeEnd) && (
              <div className="flex items-center gap-2 text-sm text-white/80">
                <Clock className="w-3.5 h-3.5 text-cyan-300" />
                {activity.timeStart && activity.timeEnd 
                  ? `${activity.timeStart} - ${activity.timeEnd}`
                  : activity.timeStart || activity.timeEnd
                }
              </div>
            )}
            
            {activity.location && (
              <>
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <MapPin className="w-3.5 h-3.5 text-pink-300" />
                  {activity.location}
                </div>
                <MapEmbed
                  location={activity.location}
                  isExpanded={isMapExpanded}
                  onToggle={() => setIsMapExpanded(!isMapExpanded)}
                />
              </>
            )}

            {weatherInfo && (
              <div className="flex items-center gap-2 text-sm text-white/80">
                <Cloud className="w-3.5 h-3.5 text-sky-300" />
                <span>{weatherInfo.temp} · {weatherInfo.condition}</span>
                <span className="text-base">{weatherInfo.icon}</span>
              </div>
            )}
            
            {activity.notes && (
              <p className="text-sm text-white/70 bg-white/5 p-2 rounded-md">
                {activity.notes}
              </p>
            )}
            
            <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-white/10">
              {activity.tags.map((tag: string, idx: number) => (
                <span 
                  key={idx} 
                  className={`bg-white/10 text-white/80 text-xs px-2.5 py-0.5 rounded-full
                    ${snapshot.isDragging ? 'scale-105' : ''} transition-transform duration-200`}
                >
                  {tag}
                </span>
              ))}
            </div>

            <ActivityChecklist
              items={activity.checklist}
              onUpdate={handleChecklistUpdate}
            />
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default ActivityCard; 