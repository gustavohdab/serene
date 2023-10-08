'use client'

import { Course } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { ImageIcon, Pencil, PlusCircle } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import * as z from 'zod'

import FileUpload from '@/components/FileUpload'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

type ImageFormProps = {
  initialData: Course
}

const formSchema = z.object({
  imageUrl: z.string().url({ message: 'Please enter a valid URL.' }),
})

const ImageForm = (props: ImageFormProps) => {
  const router = useRouter()
  const { toast } = useToast()

  const [isEditing, setIsEditing] = useState<boolean>(false)

  const handleToggle = () => setIsEditing((prev) => !prev)

  const { mutate: updateCourse } = useMutation(
    async (values: z.infer<typeof formSchema>) => {
      const { data } = await axios.patch(
        `/api/courses/${props.initialData?.id}`,
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
      onError: () => {
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

  return (
    <div className="mt-6 rounded-md bg-slate-100/70 p-4">
      <div className="flex items-center justify-between font-medium">
        Course image
        <Button variant="ghost" onClick={handleToggle}>
          {isEditing && <>Cancel</>}
          {!isEditing && !props.initialData?.imageUrl && (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add image
            </>
          )}
          {!isEditing && props.initialData?.imageUrl && (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Edit image
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!props.initialData?.imageUrl ? (
          <div className="flex h-60 items-center justify-center rounded-md bg-slate-200">
            <ImageIcon className="h-10 w-10 text-primary" />
          </div>
        ) : (
          <div className="relative mt-2 aspect-video">
            <Image
              src={props.initialData.imageUrl}
              alt={props.initialData.title}
              fill
              className="rounded-md object-cover"
              priority
            />
          </div>
        ))}
      {isEditing && (
        <div className="">
          <FileUpload
            endpoint="courseImage"
            onChange={(url) => {
              if (url) {
                onSubmit({ imageUrl: url })
              }
            }}
          />
          <div className="mt-4 text-xs text-muted-foreground">
            <span className="font-medium">Tip:</span> Use a 16:9 aspect ratio
            image for best results.
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageForm
