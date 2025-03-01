import React from 'react';
import { HourMarker } from './types';

interface TimeColumnProps {
  hourMarkers: HourMarker[];
}

/**
 * Component for displaying the time column with hour labels on the left side
 */
export function TimeColumn({ hourMarkers }: TimeColumnProps) {
  return (
    <div className="relative top-0 left-0 bottom-0 w-16 shadow-md z-30 border-r border-gray-200 dark:border-[hsl(var(--border))] bg-gradient-to-b from-blue-50 to-white dark:from-[hsl(var(--secondary))] dark:to-[hsl(var(--background))]">
      {hourMarkers.map(({ hour, label }) => (
        <React.Fragment key={hour}>
          {/* Hour time label - centered with the line - hide 00:00 and 24:00 */}
          {hour !== 0 && hour !== 24 && (
            <div 
              className="absolute w-full text-xs font-bold text-blue-600 dark:text-[hsl(var(--primary))] text-right pr-2 flex items-center justify-end h-6"
              style={{ top: `${hour * 60 - 15 + 3}px` }}
            >
              {label}
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
} 