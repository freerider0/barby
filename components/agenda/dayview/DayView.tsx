import React from 'react';
import { format } from 'date-fns';
import { DayViewProps } from './types';
import { useCurrentTime, useHourMarkers, useFilteredEvents } from './hooks';
import { TimeColumn } from './TimeColumn';
import { HourGrid } from './HourGrid';
import { CurrentTimeIndicator } from './CurrentTimeIndicator';
import { EventsDisplay } from './EventsDisplay';

/**
 * DayView component for displaying a single day with events in an agenda
 */
export function DayView({ selectedDate, events, onEventUpdate, onDayClick }: DayViewProps) {
  // Get current time for the time indicator
  const currentTime = useCurrentTime();
  
  // Generate hour markers
  const hourMarkers = useHourMarkers();
  
  // Filter events for the selected day
  const filteredEvents = useFilteredEvents(events, selectedDate);

  // Handle click on day grid to create a new event
  const handleDayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onDayClick) return;
    
    // Get the clicked position
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    
    // Calculate time based on position (60px per hour)
    const hourDecimal = y / 60;
    const hours = Math.floor(hourDecimal);
    const minutes = Math.floor((hourDecimal - hours) * 60);
    
    // Create date at the clicked time
    const clickedTime = new Date(selectedDate);
    clickedTime.setHours(hours);
    clickedTime.setMinutes(minutes);
    clickedTime.setSeconds(0);
    clickedTime.setMilliseconds(0);
    
    // Call the handler with the clicked time
    onDayClick(clickedTime);
  };

  // This function prevents event propagation so clicks on events don't create new events
  const preventPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div data-component="day-view" className="flex flex-col h-full bg-white dark:bg-[hsl(var(--background))] rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center p-3 border-b bg-gradient-to-r from-blue-50 to-white dark:from-[hsl(var(--secondary))] dark:to-[hsl(var(--background))] dark:border-[hsl(var(--border))]">
        <h3 className="text-lg font-semibold text-blue-800 dark:text-[hsl(var(--primary))]">
          {format(selectedDate, 'EEEE, MMMM d, yyyy')}
        </h3>
        <div className="text-sm text-blue-600 dark:text-[hsl(var(--muted-foreground))] font-medium">
          {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'}
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div 
          data-component="day-view-content"
          className="relative border-l dark:border-[hsl(var(--border))]  min-h-[1440px] flex w-full"
          onClick={handleDayClick}
        >

          {/* Time column on the left */}
          <TimeColumn data-component="time-column" hourMarkers={hourMarkers} />
          <div data-component="day-view-content" className="flex-1 min-h-[1440px]">
            <div className="relative w-full">
            {/* Hour grid lines */}
            <HourGrid data-component="hour-grid" />
            
            {/* Current time indicator */}
            <CurrentTimeIndicator data-component="current-time-indicator" currentTime={currentTime} selectedDate={selectedDate} />
            
            {/* Events */}
            <EventsDisplay data-component="events-display" events={filteredEvents} onEventUpdate={onEventUpdate} />
            </div>
          </div>

   
        </div>
      </div>
    </div>
  );
} 