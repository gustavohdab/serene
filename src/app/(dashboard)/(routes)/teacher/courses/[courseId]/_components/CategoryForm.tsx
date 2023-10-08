'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Course } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { Pencil } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { forwardRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import FormSubmit from '@/components/FormSubmit'
import { Button } from '@/components/ui/button'
import Combobox from '@/components/ui/combobox'
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

type CategoryFormProps = {
  initialData: Course
  options: { label: string; value: string }[]
}

const formSchema = z.object({
  categoryId: z.string().min(1),
})

const CategoryForm = forwardRef<HTMLButtonElement, CategoryFormProps>(
  (props, ref) => {
    const router = useRouter()
    const { toast } = useToast()

    const [isEditing, setIsEditing] = useState<boolean>(false)

    const handleToggle = () => setIsEditing((prev) => !prev)

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        categoryId: props.initialData?.categoryId || '',
      },
    })

    const { isValid } = form.formState

    const { mutate: updateCourse, isLoading } = useMutation(
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

    const selectedOption = props.options.find(
      (option) => option.value === props.initialData?.categoryId,
    )

    const onSubmit = (values: z.infer<typeof formSchema>) => {
      updateCourse(values)
    }

    return (
      <div className="mt-6 rounded-md bg-slate-100/70 p-4">
        <div className="flex items-center justify-between font-medium">
          Course category
          <Button variant="ghost" onClick={handleToggle}>
            {isEditing ? (
              <>Cancel</>
            ) : (
              !isEditing && (
                <>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit category
                </>
              )
            )}
          </Button>
        </div>
        {!isEditing && (
          <p
            className={cn(
              'mt-2 text-sm',
              props.initialData?.categoryId
                ? 'text-slate-700'
                : 'italic text-primary',
            )}
          >
            {selectedOption?.label || 'No category selected.'}
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
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name}>
                      What&apos;s your course about? Describe it in a few
                      sentences.
                    </FormLabel>
                    <FormControl>
                      <Combobox
                        {...field}
                        options={props.options}
                        ref={ref}
                        name={field.name}
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
  },
)

CategoryForm.displayName = 'CategoryForm'

export default CategoryForm
