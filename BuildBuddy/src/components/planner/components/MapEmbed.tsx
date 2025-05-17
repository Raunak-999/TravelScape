import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, MapPin } from 'lucide-react';
import { locationCoords } from '../utils/mockData';

interface MapEmbedProps {
  location: string;
  isExpanded: boolean;
  onToggle: () => void;
}

const MapEmbed: React.FC<MapEmbedProps> = ({ location, isExpanded, onToggle }) => {
  const coords = locationCoords[location];
  
  if (!coords) return null;

  return (
    <div className="mt-2">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-2.5 py-1.5 rounded-lg"
      >
        <Map className="w-4 h-4" />
        <span>{isExpanded ? 'Hide Map' : 'Show on Map'}</span>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-2 overflow-hidden rounded-lg border border-white/10"
          >
            <div className="h-[150px] bg-gradient-to-br from-slate-800 to-slate-900 relative p-3">
              {/* Mock Map Content */}
              <div className="absolute inset-0 opacity-30">
                <div className="w-full h-full grid grid-cols-4 grid-rows-4">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} className="border border-white/10" />
                  ))}
                </div>
              </div>
              
              {/* Location Pin */}
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <MapPin className="w-6 h-6 text-pink-500" />
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full mt-1">
                    <div className="bg-white/10 backdrop-blur-sm px-2 py-1 rounded text-xs text-white/90 whitespace-nowrap">
                      {location}
                    </div>
                  </div>
                </div>
              </div>

              {/* Coordinates */}
              <div className="absolute bottom-2 left-2 text-xs text-white/50">
                {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MapEmbed; 