import { useState, useEffect, useMemo } from 'react';
import { isSameDay } from 'date-fns';
import { TimeState, HourMarker } from './types';
import { AgendaEvent } from '../Agenda';

/**
 * Hook to track the current time, updating every minute
 */
export function useCurrentTime(): TimeState | null {
  const [currentTime, setCurrentTime] = useState<TimeState | null>(null);
  
  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      setCurrentTime({
        hours: now.getHours(),
        minutes: now.getMinutes()
      });
    };
    
    // Initial update
    updateCurrentTime();
    
    // Set up interval
    const interval = setInterval(updateCurrentTime, 60000); // every minute
    
    return () => clearInterval(interval);
  }, []);

  return currentTime;
}

/**
 * Hook to generate hour markers for the day view
 */
export function useHourMarkers(): HourMarker[] {
  return useMemo(() => {
    const markers = [];
    for (let i = 0; i <= 24; i++) {
      markers.push({
        hour: i,
        label: `${i.toString().padStart(2, '0')}:00`
      });
    }
    return markers;
  }, []);
}

/**
 * Hook to filter events for the selected day
 */
export function useFilteredEvents(events: AgendaEvent[], selectedDate: Date): AgendaEvent[] {
  return useMemo(() => 
    events.filter(event => isSameDay(event.start, selectedDate)),
    [events, selectedDate]
  );
} 