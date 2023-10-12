'use client'

import axios from 'axios'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import { formatPrice } from '@/lib/format'

interface CourseEnrollButtonProps {
  price: number
  courseId: string
}

export const CourseEnrollButton = ({
  price,
  courseId,
}: CourseEnrollButtonProps) => {
  const [isLoading, setIsLoading] = useState(false)

  const onClick = async () => {
    try {
      setIsLoading(true)

      const response = await axios.post(`/api/courses/${courseId}/checkout`)

      window.location.assign(response.data.url)
    } catch {
      toast({
        title: 'Error',
        description: 'Something went wrong',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      size="sm"
      className="w-full md:w-auto"
      type="button"
      title="Enroll"
    >
      Enroll for {formatPrice(price)}
    </Button>
  )
}
