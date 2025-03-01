'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { format, addDays, subDays, addWeeks, subWeeks, addMonths, subMonths } from 'date-fns'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import React from 'react'
import dynamic from 'next/dynamic'

// Import view components
import { DayView } from './dayview'
import { WeekView } from './WeekView'
import { MonthView } from './MonthView'

// Import dummy data
import { dummyEvents, dummyResources } from './dummyData'

// Types
export type AgendaView = 'day' | 'week' | 'month' | 'resources'

export interface AgendaEvent {
  id: string
  title: string
  start: Date
  end: Date
  description?: string
  color?: string
  resourceId?: string
}

export interface Resource {
  id: string
  name: string
  type?: string
  color?: string
  avatar?: string
}

export interface AgendaProps {
  events?: AgendaEvent[]
  resources?: Resource[]
  view?: AgendaView
  date?: Date
  onEventCreate?: (event: AgendaEvent) => void
  onEventUpdate?: (event: AgendaEvent) => void
  onEventDelete?: (eventId: string) => void
  onResourceCreate?: (resource: Resource) => void
  onResourceUpdate?: (resource: Resource) => void
  onResourceDelete?: (resourceId: string) => void
  onViewChange?: (view: AgendaView) => void
  onDateChange?: (date: Date) => void
}

export function Agenda({
  events = dummyEvents,
  resources = dummyResources,
  view = 'day',
  date,
  onEventCreate,
  onEventUpdate,
  onEventDelete,
  onResourceCreate,
  onResourceUpdate,
  onResourceDelete,
  onViewChange,
  onDateChange,
}: AgendaProps) {
  // Use a stable initial date
  const initialDate = React.useMemo(() => {
    if (date) {
      return new Date(date);
    }
    // Use the same base date as in dummyData.ts
    return new Date(2024, 5, 15); // June 15, 2024
  }, [date]);

  const initialDateRef = useRef(initialDate);
  const initialViewRef = useRef(view);
  
  // Stabilize events array
  const stabilizedEvents = React.useMemo(() => {
    return events.map(event => ({
      ...event,
      start: new Date(event.start),
      end: new Date(event.end)
    })).sort((a, b) => a.start.getTime() - b.start.getTime());
  }, [events]);
  
  const [selectedDate, setSelectedDate] = useState<Date>(initialDateRef.current);
  const [selectedView, setSelectedView] = useState<AgendaView>(initialViewRef.current);
  const [calendarOpen, setCalendarOpen] = useState(false);
  
  // Update state when props change
  useEffect(() => {
    if (date) {
      setSelectedDate(date);
    }
  }, [date]);
  
  useEffect(() => {
    setSelectedView(view);
  }, [view]);

  // Handle date navigation
  const navigatePrevious = () => {
    let newDate = selectedDate;
    
    if (selectedView === 'day') {
      newDate = subDays(selectedDate, 1);
    } else if (selectedView === 'week') {
      newDate = subWeeks(selectedDate, 1);
    } else if (selectedView === 'month') {
      newDate = subMonths(selectedDate, 1);
    } else if (selectedView === 'resources') {
      newDate = subDays(selectedDate, 1);
    }
    
    setSelectedDate(newDate);
    if (onDateChange) onDateChange(newDate);
  };
  
  const navigateNext = () => {
    let newDate = selectedDate;
    
    if (selectedView === 'day') {
      newDate = addDays(selectedDate, 1);
    } else if (selectedView === 'week') {
      newDate = addWeeks(selectedDate, 1);
    } else if (selectedView === 'month') {
      newDate = addMonths(selectedDate, 1);
    } else if (selectedView === 'resources') {
      newDate = addDays(selectedDate, 1);
    }
    
    setSelectedDate(newDate);
    if (onDateChange) onDateChange(newDate);
  };
  
  const navigateToday = useCallback(() => {
    const today = new Date();
    today.setMilliseconds(0);
    setSelectedDate(today);
    if (onDateChange) onDateChange(today);
  }, [onDateChange]);
  
  // Handle view change
  const setView = (newView: AgendaView) => {
    setSelectedView(newView);
    if (onViewChange) onViewChange(newView);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Agenda</CardTitle>
          <div className="flex items-center gap-2">
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 border-dashed">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(selectedDate, 'PPP')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    if (date) {
                      setSelectedDate(date)
                      onDateChange?.(date)
                      setCalendarOpen(false)
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" onClick={navigatePrevious}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={navigateToday}>
                Today
              </Button>
              <Button variant="outline" size="icon" onClick={navigateNext}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={selectedView} onValueChange={(v) => setView(v as AgendaView)}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>
            
            {resources.length > 0 && selectedView !== 'resources' && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    Resources <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="font-medium">Resources</h4>
                    <div className="grid gap-2">
                      {resources.map(resource => (
                        <div key={resource.id} className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: resource.color || '#3b82f6' }}
                          />
                          <span>{resource.name}</span>
                          <span className="text-xs text-muted-foreground ml-auto">{resource.type}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
          
          <TabsContent value="day" className="h-[500px] mt-0">
            <DayView 
              selectedDate={selectedDate}
              events={stabilizedEvents}
              onEventUpdate={onEventUpdate}
              onDayClick={(time) => {
                if (onEventCreate) {
                  // Create a default 1-hour event
                  const endTime = new Date(time);
                  endTime.setHours(time.getHours() + 1);
                  
                  const newEvent: AgendaEvent = {
                    id: `new-event-${Date.now()}`,
                    title: 'New Event',
                    start: time,
                    end: endTime,
                    description: ''
                  };
                  
                  onEventCreate(newEvent);
                }
              }}
            />
          </TabsContent>
          
          <TabsContent value="week" className="h-[500px] mt-0">
            <WeekView 
              selectedDate={selectedDate}
              events={stabilizedEvents}
              onEventUpdate={onEventUpdate}
            />
          </TabsContent>
          
          <TabsContent value="month" className="h-[500px] mt-0">
            <MonthView 
              selectedDate={selectedDate}
              events={stabilizedEvents}
              onEventUpdate={onEventUpdate}
            />
          </TabsContent>
          
          <TabsContent value="resources" className="h-[500px] mt-0">
      
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}