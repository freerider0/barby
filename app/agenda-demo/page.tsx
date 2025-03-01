'use client'

import { useState } from 'react'
import { addDays, addHours, startOfDay } from 'date-fns'
import { v4 as uuidv4 } from 'uuid'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Agenda, ResourceManager, AgendaEvent, Resource } from '@/components/agenda'

// Generate some sample data
const generateSampleResources = (): Resource[] => {
  return [
    {
      id: uuidv4(),
      name: 'John Doe',
      type: 'staff',
      color: '#3b82f6',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    {
      id: uuidv4(),
      name: 'Jane Smith',
      type: 'staff',
      color: '#10b981',
      avatar: 'https://i.pravatar.cc/150?img=2',
    },
    {
      id: uuidv4(),
      name: 'Mike Johnson',
      type: 'staff',
      color: '#8b5cf6',
      avatar: 'https://i.pravatar.cc/150?img=3',
    },
    {
      id: uuidv4(),
      name: 'Room 101',
      type: 'room',
      color: '#f59e0b',
    },
    {
      id: uuidv4(),
      name: 'Room 102',
      type: 'room',
      color: '#ef4444',
    },
    {
      id: uuidv4(),
      name: 'Massage Chair',
      type: 'equipment',
      color: '#ec4899',
    },
  ]
}

const generateSampleEvents = (resources: Resource[]): AgendaEvent[] => {
  const today = startOfDay(new Date())
  const events: AgendaEvent[] = []
  
  // Generate some events for each resource
  resources.forEach(resource => {
    // Add 2-3 events per resource
    const numEvents = Math.floor(Math.random() * 2) + 2
    
    for (let i = 0; i < numEvents; i++) {
      const dayOffset = Math.floor(Math.random() * 7) // 0-6 days from today
      const hourOffset = Math.floor(Math.random() * 8) + 9 // 9am-5pm
      const duration = Math.floor(Math.random() * 3) + 1 // 1-3 hours
      
      const start = addHours(addDays(today, dayOffset), hourOffset)
      const end = addHours(start, duration)
      
      events.push({
        id: uuidv4(),
        title: `Appointment with ${resource.name}`,
        start,
        end,
        resourceId: resource.id,
        color: resource.color,
        description: `This is a sample appointment with ${resource.name}`,
      })
    }
  })
  
  return events
}

export default function AgendaDemoPage() {
  const [activeTab, setActiveTab] = useState<'agenda' | 'resources'>('agenda')
  const [resources, setResources] = useState<Resource[]>(generateSampleResources())
  const [events, setEvents] = useState<AgendaEvent[]>(generateSampleEvents(resources))
  const [agendaView, setAgendaView] = useState<'day' | 'week' | 'month' | 'resources'>('week')
  
  // Event handlers
  const handleEventCreate = (event: AgendaEvent) => {
    setEvents([...events, event])
  }
  
  const handleEventUpdate = (updatedEvent: AgendaEvent) => {
    setEvents(events.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    ))
  }
  
  const handleEventDelete = (eventId: string) => {
    setEvents(events.filter(event => event.id !== eventId))
  }
  
  const handleResourcesChange = (updatedResources: Resource[]) => {
    setResources(updatedResources)
  }
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Agenda Demo</h1>
      
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'agenda' | 'resources')}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="agenda">Agenda</TabsTrigger>
            <TabsTrigger value="resources">Manage Resources</TabsTrigger>
          </TabsList>
          
          {activeTab === 'agenda' && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground mr-2">View:</span>
              <Button 
                variant={agendaView === 'day' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setAgendaView('day')}
              >
                Day
              </Button>
              <Button 
                variant={agendaView === 'week' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setAgendaView('week')}
              >
                Week
              </Button>
              <Button 
                variant={agendaView === 'month' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setAgendaView('month')}
              >
                Month
              </Button>
              <Button 
                variant={agendaView === 'resources' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setAgendaView('resources')}
              >
                Resources
              </Button>
            </div>
          )}
        </div>
        
        <TabsContent value="agenda" className="mt-0">
          <Agenda
            events={events}
            resources={resources}
            onEventCreate={handleEventCreate}
            onEventUpdate={handleEventUpdate}
            onEventDelete={handleEventDelete}
            defaultView={agendaView}
          />
        </TabsContent>
        
        <TabsContent value="resources" className="mt-0">
          <ResourceManager
            resources={resources}
            onResourcesChange={handleResourcesChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
} 