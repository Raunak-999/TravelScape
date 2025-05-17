import React from 'react';
import { 
  Utensils, Map, Plane, Bed, Sun, Calendar
} from 'lucide-react';
import type { ActivityType } from './types';

export const getTypeIcon = (type: ActivityType): React.ReactNode => {
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