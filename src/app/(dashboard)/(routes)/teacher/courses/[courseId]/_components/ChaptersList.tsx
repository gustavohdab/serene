'use client'

import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from '@hello-pangea/dnd'
import { Chapter } from '@prisma/client'
import { Grip, Pencil } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ChapterListProps = {
  onEdit: (id: string) => void
  onReorder: (
    updateData: {
      id: string
      position: number
    }[],
  ) => void
  items: Chapter[]
}

const ChaptersList = ({ items, onReorder, onEdit }: ChapterListProps) => {
  const [isMounted, setIsMounted] = useState<boolean>(false)
  const [chapters, setChapters] = useState<Chapter[]>(items)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    setChapters(items)
  }, [items])

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(chapters)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    const startIndex = Math.min(result.source.index, result.destination.index)
    const enIndex = Math.max(result.source.index, result.destination.index)

    const updatedChapters = items.slice(startIndex, enIndex + 1)

    setChapters(items)

    const bulkUpdateData = updatedChapters.map((chapter, index) => ({
      id: chapter.id,
      position: startIndex + index,
    }))

    onReorder(bulkUpdateData)
  }

  if (!isMounted) return null

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="chapters">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {chapters.map((chapter, index) => (
              <Draggable
                key={chapter.id}
                draggableId={chapter.id}
                index={index}
              >
                {(provided) => (
                  <div
                    className={cn(
                      'mb-4 flex items-center gap-x-2 rounded-md border border-slate-200 bg-slate-200 text-sm text-slate-700',
                      chapter.isPublished &&
                        'border-sky-200 bg-sky-100 text-sky-700',
                    )}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <div
                      className={cn(
                        'rounded-l-md border-r border-r-slate-200 px-2 py-3 transition hover:bg-slate-300',
                        chapter.isPublished &&
                          'border-r-sky-200 hover:bg-sky-200',
                      )}
                      {...provided.dragHandleProps}
                    >
                      <Grip className="h-5 w-5" />
                    </div>
                    {chapter.title}
                    <div className="ml-auto flex items-center gap-x-2 pr-2">
                      {chapter.isFree && <Badge>Free</Badge>}
                      <Badge
                        className={cn(
                          'bg-slate-500',
                          chapter.isPublished && 'bg-sky-700',
                        )}
                      >
                        {chapter.isPublished ? 'Published' : 'Draft'}
                      </Badge>
                      <Button
                        onClick={() => onEdit(chapter.id)}
                        variant={chapter.isPublished ? 'ghost' : 'secondary'}
                        size="icon"
                      >
                        <Pencil className="h-4 w-4 cursor-pointer transition hover:opacity-75" />
                      </Button>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

export default ChaptersList
