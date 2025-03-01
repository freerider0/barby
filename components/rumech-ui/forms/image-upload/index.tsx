'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form'
import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { useSensor, useSensors, PointerSensor } from '@dnd-kit/core'
import { useSortable } from '@dnd-kit/sortable'
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import Image from 'next/image'

const imageFormSchema = z.object({
  images: z.array(z.string()).min(1, 'You must upload at least one image.'),
})

type ImageFormValues = z.infer<typeof imageFormSchema>

// Add this new component for draggable images
function SortableImage({ imageUrl, index, onRemove }: { imageUrl: string; index: number; onRemove: () => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: index });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging 
      ? transition 
      : transform ? 'transform 250ms ease' : undefined,
    gridColumn: index === 0 ? 'span 2' : 'span 1',
    gridRow: index === 0 ? 'span 2' : 'span 1',
    zIndex: isDragging ? 50 : 0,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative aspect-square group cursor-move"
      {...attributes}
      {...listeners}
    >
      <Image
        src={imageUrl}
        alt={`Preview ${index + 1}`}
        className="w-full h-full object-cover rounded-lg"
      />
      <button
        type="button"
        className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={onRemove}
      >
        ✕
      </button>
    </div>
  );
}

export function ImageUploadForm() {
  const form = useForm<ImageFormValues>({
    resolver: zodResolver(imageFormSchema),
    defaultValues: {
      images: [],
    },
  })

  const {  handleSubmit, setValue } = form

  // Manejar imágenes arrastradas
  const onDropImage = (image: File) => {
    const newImageUrl = URL.createObjectURL(image)
    setValue('images', [...form.getValues('images'), newImageUrl])
  }

  // Eliminar una imagen
  const removeImage = (index: number) => {
    const updatedImages = form.getValues('images').filter((_, i) => i !== index)
    setValue('images', updatedImages)
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Update the onDragEnd handler
  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = active.id;
      const newIndex = over.id;
      const images = [...form.getValues('images')];
      const [movedItem] = images.splice(Number(oldIndex), 1);
      images.splice(Number(newIndex), 0, movedItem);
      setValue('images', images);
    }
  };

  const handleSubmitForm = (data: ImageFormValues) => {
    toast.success('Form submitted with images!', {
      description: <pre>{JSON.stringify(data, null, 2)}</pre>,
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-6 lg:max-w-xl">
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Upload Images</FormLabel>
              <FormControl>
                <div className="border-2 border-dashed p-4 rounded-lg hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || [])
                      files.forEach(file => {
                        onDropImage(file)
                      })
                    }}
                    className="cursor-pointer w-full"
                  />
                </div>
              </FormControl>
              <FormDescription>Drag and drop or click to upload multiple images.</FormDescription>
              <FormMessage />

              {/* Updated Image Preview Grid */}
              <div className="mt-4">
                <DndContext sensors={sensors} onDragEnd={onDragEnd}>
                  <SortableContext items={form.getValues('images').map((_, i) => i)} strategy={rectSortingStrategy}>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {form.getValues('images').map((imageUrl, index) => (
                        <SortableImage
                          key={index}
                          index={index}
                          imageUrl={imageUrl}
                          onRemove={() => removeImage(index)}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
