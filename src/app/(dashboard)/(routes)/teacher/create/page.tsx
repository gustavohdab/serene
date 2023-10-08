'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button, buttonVariants } from '@/components/ui/button'
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

const formSchema = z.object({
  title: z.string().min(3, {
    message: 'Title is required',
  }),
})

const CreatePage = () => {
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
    },
  })

  const { isValid } = form.formState

  const { mutate: createCourse, isLoading } = useMutation(
    async (values: z.infer<typeof formSchema>) => {
      const { data } = await axios.post('/api/courses', values)
      return data
    },
    {
      onSuccess: (data) => {
        router.push(`/teacher/courses/${data.id}`)
        toast({
          title: 'Course created',
          description: 'Your course has been created successfully.',
          variant: 'success',
          duration: 4000,
          draggable: true,
        })
      },
      onError: () => {
        toast({
          title: 'An error occurred',
          description: "We couldn't create your course. Please try again.",
          variant: 'destructive',
          duration: 4000,
          draggable: true,
        })
      },
      onSettled: () => {
        form.reset()
      },
    },
  )

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createCourse(values)
  }

  return (
    <div className="mx-auto flex h-full max-w-5xl p-6 md:items-center md:justify-center">
      <div className="">
        <h1 className="text-2xl">Name your course</h1>
        <p className="text-sm text-slate-600">
          What would you like to name your course? Don&apos;t worry, you can
          change this later.
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-8 space-y-8"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course title</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder='e.g. "Advanced web development"'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    What will you teach in this course?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Link
                href="/"
                className={buttonVariants({
                  variant: 'ghost',
                })}
              >
                Cancel
              </Link>
              <Button type="submit" disabled={!isValid || isLoading}>
                {isLoading ? (
                  <div className="flex items-center gap-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Redirecting...
                  </div>
                ) : (
                  'Continue'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default CreatePage
