'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Chapter, Course } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { Loader2, PlusCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import ChaptersList from './ChaptersList'

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
import { cn } from '@/lib/utils'

type ChaptersFormProps = {
  initialData: Course & {
    chapters: Chapter[]
  }
}

const formSchema = z.object({
  title: z.string().min(1),
})

const ChaptersForm = (props: ChaptersFormProps) => {
  const router = useRouter()
  const { toast } = useToast()

  // State hooks
  const [isOpen, setIsOpen] = useState<boolean>(false)

  // Form hooks
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
    },
  })

  const { isValid } = form.formState

  // Mutation hooks
  const { mutate: updateCourse, isLoading } = useMutation(
    async (values: z.infer<typeof formSchema>) => {
      const { data } = await axios.post(
        `/api/courses/${props.initialData?.id}/chapters`,
        values,
      )
      return data
    },
    {
      onSuccess: () => {
        router.refresh()
        toast({
          description: 'Chapter created.',
          title: 'Your chapter has been created.',
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
      onSettled: () => {
        form.reset()
      },
    },
  )

  const { mutate: onReorder, isLoading: isReordering } = useMutation(
    async (updateData: { id: string; position: number }[]) => {
      await axios.put(
        `/api/courses/${props.initialData?.id}/chapters/reorder`,
        {
          list: updateData,
        },
      )
    },
    {
      onSuccess: () => {
        toast({
          title: 'Chapters reordered.',
          description: 'Your chapters have been reordered.',
          variant: 'success',
          duration: 3000,
          draggable: true,
        })
      },
      onError: () => {
        toast({
          title: 'Something went wrong.',
          description: 'Could not reorder chapters. Please try again.',
          variant: 'destructive',
          duration: 3000,
          draggable: true,
        })
      },
    },
  )

  // Handlers
  const handleToggle = () => setIsOpen((prev) => !prev)

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateCourse(values)
  }

  const onEdit = (id: string) => {
    router.push(`/teacher/courses/${props.initialData.id}/chapters/${id}`)
  }

  return (
    <div className="relative mt-6 rounded-md bg-slate-100/70 p-4">
      {isReordering && (
        <div className="absolute right-0 top-0 flex h-full w-full items-center justify-center rounded-md bg-slate-500/20">
          <Loader2 className="h-6 w-6 animate-spin to-sky-700" />
        </div>
      )}
      <div className="flex items-center justify-between font-medium">
        Course chapters
        <Button variant="ghost" onClick={handleToggle}>
          {isOpen ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add a chapter
            </>
          )}
        </Button>
      </div>
      {isOpen && (
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
                  <FormLabel>Chapter title</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading || !isOpen}
                      placeholder="e.g. 'Introduction to Next.js 13'"
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
              <FormSubmit isValid={isValid} isLoading={isLoading} />
            </div>
          </form>
        </Form>
      )}
      {!isOpen && (
        <div
          className={cn(
            'mt-2 text-sm',
            !props.initialData.chapters.length && 'italic',
          )}
        >
          {!props.initialData.chapters.length &&
            "Your course doesn't have any chapters yet."}
          <ChaptersList
            onEdit={onEdit}
            onReorder={onReorder}
            items={props.initialData.chapters || []}
          />
        </div>
      )}
      {!isOpen && (
        <p className="mt-4 text-xs text-muted-foreground">
          Drag and drop to reorder chapters.
        </p>
      )}
    </div>
  )
}

export default ChaptersForm
