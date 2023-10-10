'use client'

import { UseMutationOptions, useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'

import ConfirmModal from '@/components/modals/ConfirmModal'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

type ChapterActionsProps = {
  disabled: boolean
  courseId: string
  chapterId: string
  isPublished: boolean
}

interface MutationContext {
  action: 'published' | 'unpublished'
}

const deleteChapterMutation = async (courseId: string, chapterId: string) => {
  const { data } = await axios.delete(
    `/api/courses/${courseId}/chapters/${chapterId}`,
  )
  return data
}

const togglePublishMutation = async (
  isPublished: boolean,
  courseId: string,
  chapterId: string,
) => {
  const endpoint = isPublished ? 'unpublish' : 'publish'
  const { data } = await axios.patch(
    `/api/courses/${courseId}/chapters/${chapterId}/${endpoint}`,
  )
  return { data, action: isPublished ? 'unpublished' : 'published' }
}

const ChapterActions = ({
  disabled,
  courseId,
  chapterId,
  isPublished,
}: ChapterActionsProps) => {
  const router = useRouter()
  const { toast } = useToast()

  const { mutate: deleteChapter, isLoading: isDeletingChapter } = useMutation(
    () => deleteChapterMutation(courseId, chapterId),
    {
      onSuccess: () => {
        router.refresh()
        router.push(`/teacher/courses/${courseId}`)
        toast({
          description: 'Chapter deleted.',
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
    () => togglePublishMutation(isPublished, courseId, chapterId),
    {
      onMutate: async () => {
        return { action: isPublished ? 'unpublished' : 'published' }
      },
      onSuccess: (_, __, context: MutationContext) => {
        router.refresh()
        const action = context.action
        toast({
          description: `Chapter ${action}.`,
          title: `Your chapter has been ${action} successfully.`,
          variant: 'success',
          duration: 3000,
          draggable: true,
        })
      },
      onError: (_, __, context: MutationContext) => {
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
        disabled={disabled || isDeletingChapter || isTogglingPublish}
        variant="outline"
        size="sm"
      >
        {isPublished ? 'Unpublish' : 'Publish'}
      </Button>
      <ConfirmModal onConfirm={deleteChapter}>
        <Button size="sm" disabled={isDeletingChapter}>
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  )
}

export default ChapterActions
