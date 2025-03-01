import React from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isSameMonth } from 'date-fns';
import { cn } from '@/lib/utils';
import { AgendaEvent } from './Agenda';

interface MonthViewProps {
  selectedDate: Date;
  events: AgendaEvent[];
  onEventUpdate?: (event: AgendaEvent) => void;
}

export function MonthView({ selectedDate, events, onEventUpdate }: MonthViewProps) {
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  
  // Group days into weeks
  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];
  
  days.forEach(day => {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  return (
    <div className="h-[600px] overflow-y-auto">
      <div className="grid grid-cols-7 border-b">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
          <div key={day} className="p-2 text-center font-medium">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 h-full">
        {weeks.map((week, weekIndex) => (
          <React.Fragment key={`week-${weekIndex}`}>
            {week.map(day => {
              const dayEvents = events.filter(event => isSameDay(event.start, day));
              const isCurrentMonth = isSameMonth(day, selectedDate);
              
              return (
                <div 
                  key={day.toString()} 
                  className={cn(
                    "border p-1 min-h-[100px]",
                    !isCurrentMonth && "bg-muted/50",
                    isSameDay(day, new Date()) && "bg-accent"
                  )}
                >
                  <div className={cn(
                    "text-right mb-1",
                    !isCurrentMonth && "text-muted-foreground"
                  )}>
                    {format(day, 'd')}
                  </div>
                  
                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map(event => (
                      <div 
                        key={event.id} 
                        className="text-xs p-1 rounded-sm truncate cursor-pointer hover:ring-1 hover:ring-primary"
                        style={{ backgroundColor: event.color || '#3b82f6', color: 'white' }}
                        onClick={() => onEventUpdate?.(event)}
                      >
                        {format(event.start, 'HH:mm')} {event.title}
                      </div>
                    ))}
                    
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-muted-foreground text-center">
                        +{dayEvents.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
} 