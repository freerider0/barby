# Agenda Component

A comprehensive agenda component with day, week, month, and resources views that allows for easy date switching and includes drag and drop functionality using dndkit. It also supports resource management for staff, rooms, or other resources.

## Features

- **Multiple Views**: 
  - Day view: Shows a detailed timeline for a single day
  - Week view: Shows a weekly calendar with time slots
  - Month view: Shows a traditional month calendar
  - Resources view: Shows bookings for all resources in columns for a given day
- **Date Navigation**: Easy navigation between dates with previous, next, and today buttons
- **Calendar Picker**: Quick date selection with a calendar popup
- **Drag and Drop**: Move events around using dndkit
- **Resource Management**: Manage staff, rooms, or other resources
- **Responsive Design**: Works on all screen sizes

## Components

### Agenda

The main agenda component that displays events in different views.

```tsx
import { Agenda } from '@/components/agenda'

// Usage
<Agenda
  events={events}
  resources={resources}
  onEventCreate={handleEventCreate}
  onEventUpdate={handleEventUpdate}
  onEventDelete={handleEventDelete}
  defaultView="week"
  defaultDate={new Date()}
/>
```

### ResourceManager

A component to manage resources (staff, rooms, equipment, etc.).

```tsx
import { ResourceManager } from '@/components/agenda'

// Usage
<ResourceManager
  resources={resources}
  onResourcesChange={handleResourcesChange}
/>
```

## Types

### AgendaEvent

```tsx
type AgendaEvent = {
  id: string
  title: string
  start: Date
  end: Date
  resourceId?: string
  color?: string
  description?: string
}
```

### Resource

```tsx
type Resource = {
  id: string
  name: string
  type: 'staff' | 'room' | 'equipment' | 'other'
  color?: string
  avatar?: string
}
```

## Props

### Agenda Props

| Prop | Type | Description |
|------|------|-------------|
| events | AgendaEvent[] | Array of events to display |
| resources | Resource[] | Array of resources |
| onEventCreate | (event: AgendaEvent) => void | Callback when an event is created |
| onEventUpdate | (event: AgendaEvent) => void | Callback when an event is updated |
| onEventDelete | (eventId: string) => void | Callback when an event is deleted |
| onDateChange | (date: Date) => void | Callback when the selected date changes |
| defaultView | 'day' \| 'week' \| 'month' \| 'resources' | Default view to show |
| defaultDate | Date | Default date to show |

### ResourceManager Props

| Prop | Type | Description |
|------|------|-------------|
| resources | Resource[] | Array of resources to manage |
| onResourcesChange | (resources: Resource[]) => void | Callback when resources are changed |

## Views

### Day View
Shows a detailed timeline for a single day with all events.

### Week View
Shows a weekly calendar with time slots and events for each day.

### Month View
Shows a traditional month calendar with events for each day.

### Resources View
Shows bookings for all resources in columns for a given day. This view is particularly useful for seeing all staff schedules side by side or comparing room availability.

## Demo

Check out the demo page at `/agenda-demo` to see the agenda component in action. 