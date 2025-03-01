import React from 'react';

/**
 * Component displayed when there are no events for the selected day
 */
export function EmptyDayPlaceholder() {
  return (
    <div className="absolute top-1/3 left-0 right-0 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-[hsl(var(--secondary))] flex items-center justify-center mb-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500 dark:text-[hsl(var(--primary))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-700 dark:text-[hsl(var(--primary))] mb-1">No events scheduled</h3>
      <p className="text-sm text-gray-500 dark:text-[hsl(var(--muted-foreground))]">There are no events scheduled for this day.</p>
    </div>
  );
} 