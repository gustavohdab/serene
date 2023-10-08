'use client'

import { Attachment, Course } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { File, Loader2, PlusCircle, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import * as z from 'zod'

import FileUpload from '@/components/FileUpload'
import { Button, buttonVariants } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

type ImageFormProps = {
  initialData: Course & {
    attachments: Attachment[]
  }
}

const formSchema = z.object({
  url: z.string().min(1),
})

const AttachmentForm = (props: ImageFormProps) => {
  const router = useRouter()
  const { toast } = useToast()

  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleToggle = () => setIsEditing((prev) => !prev)

  const { mutate: updateCourse } = useMutation(
    async (values: z.infer<typeof formSchema>) => {
      const { data } = await axios.post(
        `/api/courses/${props.initialData?.id}/attachments`,
        values,
      )
      return data
    },
    {
      onSuccess: () => {
        router.refresh()
        toast({
          description: 'Course updated',
          title: 'Your course has been updated successfully.',
          variant: 'success',
          duration: 4000,
          draggable: true,
        })
        handleToggle()
      },
      onError: (error) => {
        console.log(error)
        toast({
          description: 'Error',
          title: 'Something went wrong.',
          variant: 'destructive',
          duration: 4000,
          draggable: true,
        })
      },
    },
  )

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateCourse(values)
  }

  const { mutate: deleteAttachment } = useMutation(
    async (id: string) => {
      const { data } = await axios.delete(
        `/api/courses/${props.initialData?.id}/attachments/${id}`,
      )
      return data
    },
    {
      onSuccess: () => {
        toast({
          description: 'Course updated',
          title: 'Your course has been updated successfully.',
          variant: 'success',
          duration: 4000,
          draggable: true,
        })
        handleToggle()
      },
      onError: (error) => {
        console.log(error)
        toast({
          description: 'Error',
          title: 'Something went wrong.',
          variant: 'destructive',
          duration: 4000,
          draggable: true,
        })
      },
    },
  )

  return (
    <div className="mt-6 rounded-md bg-slate-100/70 p-4">
      <div className="flex items-center justify-between font-medium">
        Course attachments
        <Button variant="ghost" onClick={handleToggle}>
          {isEditing && <>Cancel</>}
          {!isEditing && (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add image
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          {props.initialData?.attachments.length === 0 && (
            <p className="mt-2 text-sm italic">No attachments yet. </p>
          )}

          {props.initialData?.attachments.length > 0 && (
            <div className="mt-2 space-y-2">
              {props.initialData?.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex w-full items-center rounded-md border border-sky-200 bg-sky-100 p-3 text-sky-700"
                >
                  <File className="mr-2 h-4 w-4" />
                  <p className="line-clamp-1 text-xs">{attachment.name}</p>
                  {deletingId === attachment.id && (
                    <div
                      className={buttonVariants({
                        variant: 'ghost',
                        size: 'icon',
                      })}
                    >
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    </div>
                  )}
                  {deletingId !== attachment.id && (
                    <Button
                      className="ml-auto"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setDeletingId(attachment.id)
                        deleteAttachment(attachment.id)
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {isEditing && (
        <div className="">
          <FileUpload
            endpoint="courseAttachment"
            onChange={(url) => {
              if (url) {
                onSubmit({ url })
              }
            }}
          />
          <div className="mt-4 text-xs text-muted-foreground">
            <span className="font-medium">Tip:</span> Add anything your students
            might need to complete your course.
          </div>
        </div>
      )}
    </div>
  )
}

export default AttachmentForm
