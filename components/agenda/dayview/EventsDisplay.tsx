import React from 'react';
import { AgendaEvent } from '../Agenda';
import { EventItem } from '../EventItem';
import { EmptyDayPlaceholder } from './EmptyDayPlaceholder';

interface EventsDisplayProps {
  events: AgendaEvent[];
  onEventUpdate?: (event: AgendaEvent) => void;
}

/**
 * Component for displaying events in the day view
 */
export function EventsDisplay({ events, onEventUpdate }: EventsDisplayProps) {
  // Create a wrapper function that handles both click propagation and calls onEventUpdate
  const handleEventClick = (event: AgendaEvent) => {
    // We removed the MouseEvent parameter since EventItem expects onClick with no parameters
    if (onEventUpdate) {
      console.log('onEventUpdate', event);
      onEventUpdate(event);
    }
  };

  // Calculate free time slots between events
  const getFreeTimeSlots = () => {
    if (events.length <= 1) return []; // No gaps if 0 or 1 event
    
    // Sort events by start time
    const sortedEvents = [...events].sort((a, b) => 
      a.start.getTime() - b.start.getTime()
    );
    
    const freeTimeSlots: { start: Date; end: Date; duration: number }[] = [];
    
    // Check gaps between consecutive events
    for (let i = 0; i < sortedEvents.length - 1; i++) {
      const currentEvent = sortedEvents[i];
      const nextEvent = sortedEvents[i + 1];
      
      // If there's a gap between current event end and next event start
      if (currentEvent.end < nextEvent.start) {
        const gapStart = new Date(currentEvent.end);
        const gapEnd = new Date(nextEvent.start);
        
        // Calculate duration in minutes
        const durationMs = gapEnd.getTime() - gapStart.getTime();
        const durationMinutes = Math.floor(durationMs / (1000 * 60));
        
        // Only show gaps of at least 10 minutes
        if (durationMinutes >= 10) {
          freeTimeSlots.push({
            start: gapStart,
            end: gapEnd,
            duration: durationMinutes
          });
        }
      }
    }
    
    return freeTimeSlots;
  };

  // Get free time slots
  const freeTimeSlots = getFreeTimeSlots();

  return (
    <div className="absolute inset-0 pl-4 pr-2" data-component="EventsDisplay">
      {/* Free time slots */}
      {freeTimeSlots.map((slot, index) => {
        // Calculate position (similar to how EventItem does it)
        const startHour = slot.start.getHours() + (slot.start.getMinutes() / 60);
        const endHour = slot.end.getHours() + (slot.end.getMinutes() / 60);
        const durationHours = endHour - startHour;
        
        const top = startHour * 60; // 60px per hour
        const height = durationHours * 60; // 60px per hour
        
        // Format duration as hours and minutes
        const hours = Math.floor(slot.duration / 60);
        const minutes = slot.duration % 60;
        const durationText = hours > 0 
          ? `${hours}h ${minutes > 0 ? minutes + 'm' : ''}`
          : `${minutes}m`;
            
        return (
          <div 
            key={`free-${index}`}
            className="absolute left-0 right-0 border-l-2 border-dashed border-green-300 dark:border-emerald-500 bg-gradient-to-r from-green-50/30 to-transparent dark:from-emerald-950/10 rounded-r px-4 flex items-center justify-center z-0"
            style={{ 
              top: `${top}px`, 
              height: `${height}px`,
              opacity: Math.min(0.7, Math.max(0.3, slot.duration / 120)) // Opacity based on duration
            }}
            data-component="FreeTimeSlot"
          >
            {slot.duration >= 30 && (
              <div className="flex flex-col items-center justify-center text-green-700 dark:text-emerald-300 opacity-80">
                <span className="text-xs font-medium">{durationText} available</span>
                <span className="text-[10px]">{slot.start.getHours()}:{slot.start.getMinutes().toString().padStart(2, '0')} - {slot.end.getHours()}:{slot.end.getMinutes().toString().padStart(2, '0')}</span>
              </div>
            )}
          </div>
        );
      })}
      
      {events.length === 0 ? (
        <EmptyDayPlaceholder />
      ) : (
        events.map(event => {
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
              <div 
                key={event.id} 
                className="relative" 
                onClick={(e) => e.stopPropagation()}
              >
                <div className="absolute top-0 left-0 right-0 bg-gray-200 dark:bg-[hsl(var(--secondary))] text-xs text-center py-0.5 z-20 rounded-t-md text-gray-700 dark:text-[hsl(var(--primary))]">
                  Starts earlier
                </div>
                <EventItem 
                  event={modifiedEvent}
                  onClick={() => handleEventClick(event)}
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
              <div 
                key={event.id} 
                className="relative" 
                onClick={(e) => e.stopPropagation()}
              >
                <div className="absolute top-0 left-0 right-0 bg-gray-200 dark:bg-[hsl(var(--secondary))] text-xs text-center py-0.5 z-20 rounded-t-md text-gray-700 dark:text-[hsl(var(--primary))]">
                  Starts earlier
                </div>
                <EventItem 
                  event={modifiedEvent}
                  onClick={() => handleEventClick(event)}
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
              <div 
                key={event.id} 
                className="relative" 
                onClick={(e) => e.stopPropagation()}
              >
                <EventItem 
                  event={modifiedEvent}
                  onClick={() => handleEventClick(event)}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gray-200 dark:bg-[hsl(var(--secondary))] text-xs text-center py-0.5 z-20 rounded-b-md text-gray-700 dark:text-[hsl(var(--primary))]">
                  Continues later
                </div>
              </div>
            );
          }
          
          // For events that are within our visible range
          return (
            <div key={event.id} onClick={(e) => e.stopPropagation()}>
              <EventItem 
                event={event}
                onClick={() => handleEventClick(event)}
              />
            </div>
          );
        })
      )}
    </div>
  );
} 