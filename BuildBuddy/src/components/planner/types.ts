import type { DraggableProvided, DroppableProvided, DropResult } from 'react-beautiful-dnd';
import type { Mood } from './components/MoodSelector';

export type ActivityType = 'food' | 'travel' | 'explore' | 'accommodation' | 'activity';

export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

export interface Activity {
  id: string;
  title: string;
  timeStart: string;
  timeEnd: string;
  location?: string;
  notes?: string;
  tags: string[];
  type: ActivityType;
  checklist: ChecklistItem[];
}

export interface Day {
  id: string;
  title: string;
  activities: Activity[];
  mood?: Mood;
}

export type TagType = 'planned' | 'booked' | 'must-do' | ActivityType;

export interface DayColumnProps {
  day: Day;
  getGradient: () => string;
  getPrimaryColor: () => string;
  updateDayTitle: (dayId: string, newTitle: string) => void;
  addActivity: (dayId: string) => void;
  onEditActivity?: (dayId: string, activity: Activity) => void;
  onDeleteActivity?: (dayId: string, activityId: string) => void;
  onMoodSelect?: (dayId: string, mood: Mood) => void;
}

export interface ActivityCardProps {
  activity: Activity;
  index: number;
  getPrimaryColor: () => string;
  onEdit?: (activity: Activity) => void;
  onDelete?: (activityId: string) => void;
}

export interface DragDropContextProps {
  onDragEnd: (result: DropResult) => void;
} 