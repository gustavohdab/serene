'use client'

import axios from 'axios'
import { CheckCircle, XCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import { useConfettiStore } from '@/hooks/useConfettiStore'

interface CourseProgressButtonProps {
  chapterId: string
  courseId: string
  isCompleted?: boolean
  nextChapterId?: string
}

const CourseProgressButton = ({
  chapterId,
  courseId,
  isCompleted,
  nextChapterId,
}: CourseProgressButtonProps) => {
  const router = useRouter()
  const confetti = useConfettiStore()
  const [isLoading, setIsLoading] = useState(false)

  const onClick = async () => {
    try {
      setIsLoading(true)

      await axios.put(
        `/api/courses/${courseId}/chapters/${chapterId}/progress`,
        {
          isCompleted: !isCompleted,
        },
      )

      if (!isCompleted && !nextChapterId) {
        confetti.onOpen()
      }

      if (!isCompleted && nextChapterId) {
        router.push(`/courses/${courseId}/chapters/${nextChapterId}`)
      }

      toast({
        title: 'Success',
        description: 'Your progress has been updated.',
        variant: 'success',
      })
      router.refresh()
    } catch {
      toast({
        title: 'Error',
        description: 'An error occurred while updating your progress.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const Icon = isCompleted ? XCircle : CheckCircle

  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      type="button"
      variant={isCompleted ? 'outline' : 'success'}
      className="w-full md:w-auto"
    >
      {isCompleted ? 'Not completed' : 'Mark as complete'}
      <Icon className="ml-2 h-4 w-4" />
    </Button>
  )
}

export { CourseProgressButton }
