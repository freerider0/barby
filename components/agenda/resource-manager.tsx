'use client'

import { useState } from 'react'
import { PlusCircle, X, GripVertical, User, Home, Laptop } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DndContext, DragEndEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Resource } from './Agenda'

interface ResourceManagerProps {
  resources: Resource[]
  onResourcesChange: (resources: Resource[]) => void
}

// Draggable Resource Item
function SortableResourceItem({ resource, onUpdate, onDelete }: { 
  resource: Resource
  onUpdate: (id: string, updates: Partial<Resource>) => void
  onDelete: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: resource.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'staff':
        return <User className="h-4 w-4" />
      case 'room':
        return <Home className="h-4 w-4" />
      default:
        return <Laptop className="h-4 w-4" />
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 p-3 bg-card border rounded-md mb-2"
    >
      <div className="cursor-move" {...attributes} {...listeners}>
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>
      
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
        <div className="flex items-center gap-2">
          <div 
            className="w-4 h-4 rounded-full" 
            style={{ backgroundColor: resource.color || '#3b82f6' }}
          />
          <Input 
            value={resource.name} 
            onChange={(e) => onUpdate(resource.id, { name: e.target.value })}
            className="h-8"
            placeholder="Resource name"
          />
        </div>
        
        <Select 
          value={resource.type} 
          onValueChange={(value) => onUpdate(resource.id, { 
            type: value as 'staff' | 'room' | 'equipment' | 'other' 
          })}
        >
          <SelectTrigger className="h-8">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="staff">Staff</SelectItem>
            <SelectItem value="room">Room</SelectItem>
            <SelectItem value="equipment">Equipment</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="flex items-center gap-2">
          <Label htmlFor={`color-${resource.id}`} className="sr-only">Color</Label>
          <Input 
            id={`color-${resource.id}`}
            type="color" 
            value={resource.color || '#3b82f6'} 
            onChange={(e) => onUpdate(resource.id, { color: e.target.value })}
            className="w-8 h-8 p-1"
          />
          
          <Input 
            value={resource.avatar || ''} 
            onChange={(e) => onUpdate(resource.id, { avatar: e.target.value })}
            className="h-8 flex-1"
            placeholder="Avatar URL (optional)"
          />
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onDelete(resource.id)}
            className="h-8 w-8 text-destructive"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export function ResourceManager({ resources, onResourcesChange }: ResourceManagerProps) {
  const [searchTerm, setSearchTerm] = useState('')
  
  // Sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )
  
  // Add a new resource
  const addResource = () => {
    const newResource: Resource = {
      id: uuidv4(),
      name: 'New Resource',
      type: 'staff',
      color: '#3b82f6',
    }
    
    onResourcesChange([...resources, newResource])
  }
  
  // Update a resource
  const updateResource = (id: string, updates: Partial<Resource>) => {
    const updatedResources = resources.map(resource => 
      resource.id === id ? { ...resource, ...updates } : resource
    )
    
    onResourcesChange(updatedResources)
  }
  
  // Delete a resource
  const deleteResource = (id: string) => {
    const updatedResources = resources.filter(resource => resource.id !== id)
    onResourcesChange(updatedResources)
  }
  
  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    if (over && active.id !== over.id) {
      const oldIndex = resources.findIndex(r => r.id === active.id)
      const newIndex = resources.findIndex(r => r.id === over.id)
      
      const newResources = [...resources]
      const [movedItem] = newResources.splice(oldIndex, 1)
      newResources.splice(newIndex, 0, movedItem)
      
      onResourcesChange(newResources)
    }
  }
  
  // Filter resources based on search term
  const filteredResources = resources.filter(resource => 
    resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.type.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Resource Manager</CardTitle>
        <Button onClick={addResource} size="sm" className="h-8">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Resource
        </Button>
      </CardHeader>
      
      <CardContent>
        <div className="mb-4">
          <Input
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-9"
          />
        </div>
        
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <SortableContext items={filteredResources.map(r => r.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {filteredResources.length > 0 ? (
                filteredResources.map(resource => (
                  <SortableResourceItem
                    key={resource.id}
                    resource={resource}
                    onUpdate={updateResource}
                    onDelete={deleteResource}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  {searchTerm ? 'No resources match your search' : 'No resources yet. Add one to get started.'}
                </div>
              )}
            </div>
          </SortableContext>
        </DndContext>
      </CardContent>
    </Card>
  )
} 