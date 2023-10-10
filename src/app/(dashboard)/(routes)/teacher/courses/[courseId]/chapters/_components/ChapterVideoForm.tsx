'use client'

import MuxPlayer from '@mux/mux-player-react'
import { Chapter, MuxData } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { Pencil, PlusCircle, VideoIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import * as z from 'zod'

import FileUpload from '@/components/FileUpload'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

type ChapterVideoFormProps = {
  initialData: Chapter & { muxData?: MuxData | null }
  courseId: string
  chapterId: string
}

const formSchema = z.object({
  videoUrl: z.string().min(1),
})

const ChapterVideoForm = (props: ChapterVideoFormProps) => {
  const router = useRouter()
  const { toast } = useToast()

  const [isEditing, setIsEditing] = useState<boolean>(false)

  const handleToggle = () => setIsEditing((prev) => !prev)

  const { mutate: updateChapter } = useMutation(
    async (values: z.infer<typeof formSchema>) => {
      const { data } = await axios.patch(
        `/api/courses/${props.courseId}/chapters/${props.chapterId}`,
        values,
      )
      return data
    },
    {
      onSuccess: () => {
        router.refresh()
        toast({
          description: 'Chapter updated',
          title: 'Your course has been updated successfully.',
          variant: 'success',
          duration: 3000,
          draggable: true,
        })
        handleToggle()
      },
      onError: () => {
        toast({
          description: 'Error',
          title: 'Something went wrong. Please try again.',
          variant: 'destructive',
          duration: 3000,
          draggable: true,
        })
      },
    },
  )

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateChapter(values)
  }

  return (
    <div className="mt-6 rounded-md bg-slate-100/70 p-4">
      <div className="flex items-center justify-between font-medium">
        Chapter video
        <Button variant="ghost" onClick={handleToggle}>
          {isEditing && <>Cancel</>}
          {!isEditing && !props.initialData?.videoUrl && (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add video
            </>
          )}
          {!isEditing && props.initialData?.videoUrl && (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Edit video
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!props.initialData?.videoUrl ? (
          <div className="flex h-60 items-center justify-center rounded-md bg-slate-200">
            <VideoIcon className="h-10 w-10 text-primary" />
          </div>
        ) : (
          <div className="relative mt-2 aspect-video">
            <MuxPlayer
              playbackId={props.initialData?.muxData?.playbackId || ''}
              metadata={{
                title: props.initialData?.title,
                description: props.initialData?.description,
              }}
            />
          </div>
        ))}
      {isEditing && (
        <div className="">
          <FileUpload
            endpoint="chapterVideo"
            onChange={(url) => {
              if (url) {
                onSubmit({ videoUrl: url })
              }
            }}
          />
          <div className="mt-4 text-xs text-muted-foreground">
            <span className="font-medium">Tip:</span> Upload this chapter&apos;s
            video.
          </div>
        </div>
      )}

      {props.initialData?.videoUrl && !isEditing && (
        <div className="mt-2 text-xs text-muted-foreground">
          Videos can take a few minutes to process. If you don&apos;t see your
          video yet, check back in a few minutes.
        </div>
      )}
    </div>
  )
}

export default ChapterVideoForm
