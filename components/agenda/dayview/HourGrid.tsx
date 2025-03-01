import React from 'react';

/**
 * Component for displaying the hour grid lines for the day view
 */
export function HourGrid() {
  return (
    <>
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
    </>
  );
} 