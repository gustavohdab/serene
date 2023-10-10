'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Chapter } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { Pencil } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import FormSubmit from '@/components/FormSubmit'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'

type ChapterTitleFormProps = {
  initialData: Chapter
  courseId: string
  chapterId: string
}

const formSchema = z.object({
  title: z.string().min(3),
})

const ChapterTitleForm = (props: ChapterTitleFormProps) => {
  const router = useRouter()
  const { toast } = useToast()

  const [isEditing, setIsEditing] = useState<boolean>(false)

  const handleToggle = () => setIsEditing((prev) => !prev)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: props.initialData?.title,
    },
  })

  const { isValid } = form.formState

  const { mutate: updateChapter, isLoading } = useMutation(
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
          title: 'Chapter updated',
          description: 'Your course has been updated successfully.',
          variant: 'success',
          duration: 3000,
          draggable: true,
        })
        handleToggle()
      },
      onError: (error) => {
        console.log(error)
        toast({
          title: 'Chapter could not be updated',
          description: 'Something went wrong. Please try again.',
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
        Chapter title
        <Button variant="ghost" onClick={handleToggle}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            !isEditing && (
              <>
                <Pencil className="mr-2 h-4 w-4" />
                Edit title
              </>
            )
          )}
        </Button>
      </div>
      {!isEditing && <p className="mt-2 text-sm">{props.initialData?.title}</p>}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    What would you like to rename this chapter to?
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading || !isEditing}
                      placeholder="e.g. 'Introduction to the course'"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Don&apos;t worry, you can change this at any time.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-2">
              <FormSubmit isValid={isValid} isLoading={isLoading} isEditing />
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}

export default ChapterTitleForm
