import React from 'react';
import { AgendaEvent } from './Agenda';

interface EventItemProps {
  event: AgendaEvent;
  onClick?: () => void;
}

export function EventItem({ event, onClick }: EventItemProps) {
  // Calculate duration in minutes
  const durationMinutes = Math.floor((event.end.getTime() - event.start.getTime()) / (1000 * 60));
  
  const style = React.useMemo(() => {
    // Calculate height (1px = 1 minute)
    const heightInPixels = Math.max(durationMinutes, 30);

    // Calculate top position (1px = 1 minute)
    const startHours = event.start.getHours();
    const startMinutes = event.start.getMinutes();
    const totalStartMinutes = startHours * 60 + startMinutes;
    
    return {
      height: `${heightInPixels}px`,
      top: `${totalStartMinutes}px`,
      backgroundColor: event.color || 'hsl(var(--chart-1))',
      position: 'absolute' as const,
      width: 'calc(100% - 16px)',
      borderRadius: '6px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05)',
      overflow: 'hidden',
      cursor: 'pointer',
      zIndex: 10,
      transition: 'all 0.2s ease'
    };
  }, [event]);

  return (
    <div
      style={style}
      onClick={onClick}
      className="p-2 text-white hover:shadow-md hover:brightness-95 transition-all"
    >
      <div className="font-medium text-sm truncate">{event.title}</div>
      <div className="text-xs opacity-90 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {event.start.getHours().toString().padStart(2, '0')}:
        {event.start.getMinutes().toString().padStart(2, '0')} - 
        {event.end.getHours().toString().padStart(2, '0')}:
        {event.end.getMinutes().toString().padStart(2, '0')}
      </div>
      {event.description && durationMinutes >= 45 && (
        <div className="text-xs mt-1 opacity-90 truncate border-t border-white pt-1 mt-1">{event.description}</div>
      )}
    </div>
  );
} 