'use client'

import { UseMutationOptions, useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'

import ConfirmModal from '@/components/modals/ConfirmModal'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { useConfettiStore } from '@/hooks/useConfettiStore'

type ActionsProps = {
  disabled: boolean
  courseId: string
  isPublished: boolean
}

interface MutationContext {
  action: 'published' | 'unpublished'
}

const deleteCourseMutation = async (courseId: string) => {
  const { data } = await axios.delete(`/api/courses/${courseId}`)
  return data
}

const togglePublishMutation = async (
  isPublished: boolean,
  courseId: string,
) => {
  const endpoint = isPublished ? 'unpublish' : 'publish'
  const { data } = await axios.patch(`/api/courses/${courseId}/${endpoint}`)
  return { data, action: isPublished ? 'unpublished' : 'published' }
}

const Actions = ({ disabled, courseId, isPublished }: ActionsProps) => {
  const router = useRouter()
  const { toast } = useToast()
  const confetti = useConfettiStore()

  const { mutate: deleteCourse, isLoading: isDeletingCourse } = useMutation(
    () => deleteCourseMutation(courseId),
    {
      onSuccess: () => {
        router.refresh()
        router.push(`/teacher/courses/${courseId}`)
        toast({
          description: 'Course deleted.',
          title: 'Your chapter has been deleted successfully.',
          variant: 'success',
          duration: 3000,
          draggable: true,
        })
      },
      onError: () => {
        toast({
          description: 'Could not delete chapter.',
          title: 'Something went wrong. Please try again.',
          variant: 'destructive',
          duration: 3000,
          draggable: true,
        })
      },
    },
  )

  const { mutate: togglePublish, isLoading: isTogglingPublish } = useMutation(
    () => togglePublishMutation(isPublished, courseId),
    {
      onMutate: async () => {
        return { action: isPublished ? 'unpublished' : 'published' }
      },
      onSuccess: (_, __, context: MutationContext) => {
        router.refresh()
        const action = context.action
        toast({
          description: `Course ${action}.`,
          title: `Your chapter has been ${action} successfully.`,
          variant: 'success',
          duration: 3000,
          draggable: true,
        })

        if (action === 'published') {
          confetti.onOpen()
        }
      },
      onError: (error, __, context: MutationContext) => {
        console.log(error)
        const action = context.action === 'published' ? 'publish' : 'unpublish'
        toast({
          description: `Could not ${action} chapter.`,
          title: 'Something went wrong. Please try again.',
          variant: 'destructive',
          duration: 3000,
          draggable: true,
        })
      },
    } as UseMutationOptions<unknown, unknown, MutationContext>,
  )

  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={() =>
          togglePublish({ action: isPublished ? 'unpublished' : 'published' })
        }
        disabled={disabled || isDeletingCourse || isTogglingPublish}
        variant="outline"
        size="sm"
      >
        {isPublished ? 'Unpublish' : 'Publish'}
      </Button>
      <ConfirmModal onConfirm={deleteCourse}>
        <Button size="sm" disabled={isDeletingCourse}>
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  )
}

export default Actions
