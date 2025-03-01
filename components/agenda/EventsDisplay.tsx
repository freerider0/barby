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
  // Function to handle event click without needing the MouseEvent parameter
  const handleEventClick = (event: AgendaEvent) => {
    if (onEventUpdate) {
      onEventUpdate(event);
    }
  };

  return (
    <div className="absolute inset-0 pl-4 pr-2" style={{ marginTop: '-60px' }}>
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
              <div key={event.id} className="relative" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
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
        })
      )}
    </div>
  );
} 