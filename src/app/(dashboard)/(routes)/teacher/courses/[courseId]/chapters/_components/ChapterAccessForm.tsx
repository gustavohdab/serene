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
import { Checkbox } from '@/components/ui/checkbox'
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

type ChapterAccessFormProps = {
  initialData: Chapter
  chapterId: string
}

const formSchema = z.object({
  isFree: z.boolean().default(false),
})

const ChapterAccessForm = (props: ChapterAccessFormProps) => {
  const router = useRouter()
  const { toast } = useToast()

  const [isEditing, setIsEditing] = useState<boolean>(false)

  const handleToggle = () => setIsEditing((prev) => !prev)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isFree: !!props.initialData?.isFree,
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
        Chapter access
        <Button variant="ghost" onClick={handleToggle}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            !isEditing && (
              <>
                <Pencil className="mr-2 h-4 w-4" />
                Edit access
              </>
            )
          )}
        </Button>
      </div>
      {!isEditing && (
        <p
          className={cn(
            'mt-2 text-sm',
            props.initialData?.isFree
              ? 'text-slate-700'
              : 'italic text-primary',
          )}
        >
          {props.initialData?.isFree
            ? 'This chapter is free for everyone.'
            : 'This chapter is only available to students who have purchased the course.'}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-4"
          >
            <FormField
              control={form.control}
              name="isFree"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="mt-2"
                    />
                  </FormControl>
                  <div className="space-y-1">
                    <FormLabel>Free chapter</FormLabel>
                    <FormDescription>
                      This chapter will be free for everyone.
                    </FormDescription>
                  </div>
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

export default ChapterAccessForm
