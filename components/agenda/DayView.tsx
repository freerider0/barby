import React, { useState, useEffect } from 'react';
import { format, isSameDay } from 'date-fns';
import { AgendaEvent } from './Agenda';
import { EventItem } from './EventItem';

interface DayViewProps {
  selectedDate: Date;
  events: AgendaEvent[];
  onEventUpdate?: (event: AgendaEvent) => void;
  onEventCreate?: (event: Omit<AgendaEvent, "id">) => void; // New prop for event creation
}

export function DayView({ selectedDate, events, onEventUpdate, onEventCreate }: DayViewProps) {
  // State for current time (for the time indicator)
  const [currentTime, setCurrentTime] = useState<{ hours: number, minutes: number } | null>(null);
  
  // New state for event creation form
  const [newEventForm, setNewEventForm] = useState<{
    visible: boolean;
    top: number;
    time: Date | null;
  } | null>(null);
  const [newEventTitle, setNewEventTitle] = useState<string>("");
  const [newEventDuration, setNewEventDuration] = useState<number>(30); // Default 30 min
  
  // Update current time every minute
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

  // Generate hour markers (only full hours, not half hours)
  const hourMarkers = React.useMemo(() => {
    const markers = [];
    for (let i = 0; i <= 24; i++) {
      markers.push({
        hour: i,
        label: `${i.toString().padStart(2, '0')}:00`
      });
    }
    return markers;
  }, []);
  
  // Filter events for the selected day
  const filteredEvents = React.useMemo(() => 
    events.filter(event => isSameDay(event.start, selectedDate)),
    [events, selectedDate]
  );

  // Handle click on the timeline to create a new event
  const handleTimelineClick = (e: React.MouseEvent) => {
    // Ignore clicks on existing events
    if ((e.target as HTMLElement).closest('.event-item')) {
      return;
    }
    
    const timelineRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const y = e.clientY - timelineRect.top;
    
    // Calculate time (1 pixel = 1 minute)
    const minutes = y;
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    
    // Create date object for the selected time
    const selectedDateTime = new Date(selectedDate);
    selectedDateTime.setHours(hours, mins, 0, 0);
    
    // Don't allow events before 1:00 or after 23:00
    if (hours < 1 || hours >= 23) {
      return;
    }
    
    // Position the form near the click position
    setNewEventForm({
      visible: true,
      top: y,
      time: selectedDateTime
    });
    
    setNewEventTitle("");
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[hsl(var(--background))] rounded-lg shadow-sm">
      <div className="flex justify-between items-center p-3 border-b bg-gradient-to-r from-blue-50 to-white dark:from-[hsl(var(--secondary))] dark:to-[hsl(var(--background))] dark:border-[hsl(var(--border))]">
        <h3 className="text-lg font-semibold text-blue-800 dark:text-[hsl(var(--primary))]">
          {format(selectedDate, 'EEEE, MMMM d, yyyy')}
        </h3>
        <div className="text-sm text-blue-600 dark:text-[hsl(var(--muted-foreground))] font-medium">
          {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div 
          className="relative border-l dark:border-[hsl(var(--border))] ml-16 min-h-[1440px]" 
          onClick={handleTimelineClick}
        >
          {/* Fixed time column with white background - moved outside the relative container */}
          <div className="absolute top-0 left-0 bottom-0 w-16 shadow-md z-30 border-r border-gray-200 dark:border-[hsl(var(--border))] bg-gradient-to-b from-blue-50 to-white dark:from-[hsl(var(--secondary))] dark:to-[hsl(var(--background))]">
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

          {/* Hour markers using CSS background with gradient - dark mode */}
          <div 
            className="absolute inset-0 pointer-events-none h-[1440px] dark:block hidden"
            style={{
              backgroundImage: `linear-gradient(
                to bottom,
                rgba(156, 163, 175, 0.6) 0px,
                rgba(156, 163, 175, 0.6) 1px,
                transparent 1px
              )`,
              backgroundSize: '100% 60px',
              backgroundPosition: '0 0',
              backgroundRepeat: 'repeat-y'
            }}
          />
          
          {/* Hour markers using CSS background with gradient - light mode */}
          <div 
            className="absolute inset-0 pointer-events-none h-[1440px] block dark:hidden"
            style={{
              backgroundImage: `linear-gradient(
                to bottom,
                rgba(148, 163, 184, 0.7) 0px,
                rgba(148, 163, 184, 0.7) 1px,
                transparent 1px
              )`,
              backgroundSize: '100% 60px',
              backgroundPosition: '0 0',
              backgroundRepeat: 'repeat-y'
            }}
          />
          
          {/* Current time indicator - only shown if it's today and after client-side hydration */}
          {currentTime && isSameDay(selectedDate, new Date()) && (
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
          )}
          
          {/* Events */}
          <div className="absolute inset-0 pl-4 pr-2 z-10" style={{ marginTop: '-60px' }}>
            {filteredEvents.length === 0 ? (
              <div className="absolute top-1/3 left-0 right-0 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-[hsl(var(--secondary))] flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500 dark:text-[hsl(var(--primary))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-700 dark:text-[hsl(var(--primary))] mb-1">No events scheduled</h3>
                <p className="text-sm text-gray-500 dark:text-[hsl(var(--muted-foreground))]">There are no events scheduled for this day.</p>
              </div>
            ) : (
              filteredEvents.map(event => {
                // Skip events that are completely outside our visible range (before 1:00 or after 23:00)
                const startHour = event.start.getHours();
                const endHour = event.end.getHours();
                const endMinutes = event.end.getMinutes();
                
                // If event ends at exactly 00:00 of the next day, treat it as 23:59
                const effectiveEndHour = (endHour === 0 && endMinutes === 0) ? 23 : endHour;
                
         
                
                // For events that both start before our visible range AND extend beyond it
                if (startHour < 1 && effectiveEndHour >= 23) {
                  // Create a modified event that spans our entire visible range
                  const modifiedEvent = {
                    ...event,
                    start: new Date(event.start.getTime()),
                    end: new Date(event.end.getTime())
                  };
                  modifiedEvent.start.setHours(1, 0, 0, 0);
                  modifiedEvent.end.setHours(23, 0, 0, 0);
                  
                  return (
                    <div key={event.id} className="relative">
                      <div className="absolute top-0 left-0 right-0 bg-gray-200 dark:bg-[hsl(var(--secondary))] text-xs text-center py-0.5 z-20 rounded-t-md text-gray-700 dark:text-[hsl(var(--primary))]">
                        Starts earlier
                      </div>
                      <EventItem 
                        event={modifiedEvent}
                        onClick={() => onEventUpdate?.(event)}
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gray-200 dark:bg-[hsl(var(--secondary))] text-xs text-center py-0.5 z-20 rounded-b-md text-gray-700 dark:text-[hsl(var(--primary))]">
                        Continues later
                      </div>
                    </div>
                  );
                }
                
                // For events that start before our visible range but extend into it
                if (startHour < 1) {
                  // Create a modified event that starts at 1:00
                  const modifiedEvent = {
                    ...event,
                    start: new Date(event.start.getTime())
                  };
                  modifiedEvent.start.setHours(1, 0, 0, 0);
                  
                  return (
                    <div key={event.id} className="relative">
                      <div className="absolute top-0 left-0 right-0 bg-gray-200 dark:bg-[hsl(var(--secondary))] text-xs text-center py-0.5 z-20 rounded-t-md text-gray-700 dark:text-[hsl(var(--primary))]">
                        Starts earlier
                      </div>
                      <EventItem 
                        event={modifiedEvent}
                        onClick={() => onEventUpdate?.(event)}
                      />
                    </div>
                  );
                }
                
                // For events that extend beyond our visible range
                if (effectiveEndHour >= 23) {
                  // Create a modified event that ends at 23:00
                  const modifiedEvent = {
                    ...event,
                    end: new Date(event.end.getTime())
                  };
                  modifiedEvent.end.setHours(23, 0, 0, 0);
                  
                  return (
                    <div key={event.id} className="relative">
                      <EventItem 
                        event={modifiedEvent}
                        onClick={() => onEventUpdate?.(event)}
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gray-200 dark:bg-[hsl(var(--secondary))] text-xs text-center py-0.5 z-20 rounded-b-md text-gray-700 dark:text-[hsl(var(--primary))]">
                        Continues later
                      </div>
                    </div>
                  );
                }
                
                return (
                  <EventItem 
                    key={event.id} 
                    event={event}
                    onClick={() => onEventUpdate?.(event)}
                  />
                );
              })
            )}
          </div>
          
          {/* New Event Creation Form */}
          {newEventForm && newEventForm.visible && (
            <div 
              className="absolute left-16 right-8 z-40 bg-white dark:bg-[hsl(var(--card))] shadow-xl rounded-md border border-blue-200 dark:border-[hsl(var(--border))] p-3"
              style={{ top: `${newEventForm.top}px` }}
            >
              <div className="text-sm font-medium text-blue-800 dark:text-[hsl(var(--primary))] mb-2">
                Create event at {newEventForm.time ? format(newEventForm.time, 'p') : ''}
              </div>
              <input
                type="text"
                className="w-full border border-gray-300 dark:border-[hsl(var(--input))] dark:bg-[hsl(var(--input))] rounded-md p-2 mb-2 text-sm"
                placeholder="Event title"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                autoFocus
              />
              <div className="flex items-center mb-2">
                <span className="text-xs text-gray-500 dark:text-[hsl(var(--muted-foreground))] mr-2">Duration:</span>
                <select 
                  className="border border-gray-300 dark:border-[hsl(var(--input))] dark:bg-[hsl(var(--input))] rounded-md p-1 text-sm"
                  value={newEventDuration}
                  onChange={(e) => setNewEventDuration(Number(e.target.value))}
                >
                  <option value="15">15 min</option>
                  <option value="30">30 min</option>
                  <option value="60">1 hour</option>
                  <option value="90">1.5 hours</option>
                  <option value="120">2 hours</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  className="px-3 py-1 text-xs bg-gray-200 dark:bg-[hsl(var(--secondary))] text-gray-700 dark:text-[hsl(var(--secondary-foreground))] rounded-md hover:bg-gray-300 dark:hover:bg-[hsl(var(--accent))]"
                  onClick={() => setNewEventForm(null)}
                >
                  Cancel
                </button>
                <button
                  className="px-3 py-1 text-xs bg-blue-600 dark:bg-[hsl(var(--primary))] text-white rounded-md hover:bg-blue-700 dark:hover:bg-[hsl(var(--primary))/0.8] disabled:opacity-50"
                  disabled={!newEventTitle.trim()}
                  onClick={() => {
                    if (newEventForm.time && newEventTitle.trim()) {
                      // Calculate end time based on duration
                      const endTime = new Date(newEventForm.time);
                      endTime.setMinutes(endTime.getMinutes() + newEventDuration);
                      
                      // Call the creation callback with new event data
                      onEventCreate?.({
                        title: newEventTitle.trim(),
                        start: newEventForm.time,
                        end: endTime,
                        color: 'blue', // Default color
                      });
                      
                      // Reset the form
                      setNewEventForm(null);
                      setNewEventTitle("");
                    }
                  }}
                >
                  Create
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}