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

import Editor from '@/components/Editor'
import FormSubmit from '@/components/FormSubmit'
import Preview from '@/components/Preview'
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
import { useToast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'

type ChapterDescriptionFormProps = {
  initialData: Chapter
  chapterId: string
}

const formSchema = z.object({
  description: z.string().min(3),
})

const ChapterDescriptionForm = (props: ChapterDescriptionFormProps) => {
  const router = useRouter()
  const { toast } = useToast()

  const [isEditing, setIsEditing] = useState<boolean>(false)

  const handleToggle = () => setIsEditing((prev) => !prev)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: props.initialData?.description || '',
    },
  })

  const { isValid } = form.formState

  const { mutate: updateChapter, isLoading } = useMutation(
    async (values: z.infer<typeof formSchema>) => {
      const { data } = await axios.patch(
        `/api/courses/${props.initialData?.courseId}/chapters/${props.chapterId}`,
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
          duration: 4000,
          draggable: true,
        })
        handleToggle()
      },
      onError: () => {
        toast({
          description: 'Error',
          title: 'Something went wrong. Please try again.',
          variant: 'destructive',
          duration: 4000,
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
        Chapter description
        <Button variant="ghost" onClick={handleToggle}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            !isEditing && (
              <>
                <Pencil className="mr-2 h-4 w-4" />
                Edit description
              </>
            )
          )}
        </Button>
      </div>
      {!isEditing && (
        <div
          className={cn(
            'mt-2 text-sm',
            props.initialData?.description
              ? 'text-slate-700'
              : 'italic text-primary',
          )}
        >
          {!props.initialData?.description && <>No description yet.</>}

          {props.initialData?.description && (
            <Preview value={props.initialData?.description} />
          )}
        </div>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-4"
          >
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Give your chapter a description.</FormLabel>
                  <FormControl>
                    <Editor {...field} />
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

export default ChapterDescriptionForm
