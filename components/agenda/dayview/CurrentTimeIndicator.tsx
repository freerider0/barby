import React from 'react';
import { isSameDay } from 'date-fns';
import { TimeState } from './types';

interface CurrentTimeIndicatorProps {
  currentTime: TimeState | null;
  selectedDate: Date;
}

/**
 * Component for displaying the current time indicator (red line)
 */
export function CurrentTimeIndicator({ currentTime, selectedDate }: CurrentTimeIndicatorProps) {
  if (!currentTime || !isSameDay(selectedDate, new Date())) {
    return null;
  }

  return (
    <div className="absolute left-0 right-0 z-20 pointer-events-none">
      <div 
        className="absolute left-0 right-0 flex items-center"
        style={{ 
          top: `${currentTime.hours * 60 + currentTime.minutes}px`,
          transform: 'translateY(-50%)'
        }}
      >
        <div className="w-4 h-4 rounded-full bg-white dark:bg-[hsl(var(--background))] border-2 border-red-600 -ml-2 flex items-center justify-center shadow-md">
          <div className="w-1 h-1 rounded-full bg-red-600"></div>
        </div>
        <div className="h-0.5 flex-1 bg-gradient-to-r from-red-500 to-red-400"></div>
        <div className="bg-white dark:bg-[hsl(var(--background))] text-red-600 text-xs px-1.5 py-0.5 rounded-md mr-2 border border-red-600 font-medium shadow-sm">
          {`${currentTime.hours.toString().padStart(2, '0')}:${currentTime.minutes.toString().padStart(2, '0')}`}
        </div>
      </div>
    </div>
  );
} 