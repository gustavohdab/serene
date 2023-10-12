import { auth } from '@clerk/nextjs'
import { Chapter, Course, UserProgress } from '@prisma/client'
import { redirect } from 'next/navigation'

import CourseSidebarItem from './CourseSidebarItem'

import CourseProgress from '@/components/CourseProgress'
import { prisma } from '@/db/prisma'

interface CourseSidebarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null
    })[]
  }
  progressCount: number
}

const CourseSidebar = async ({ course, progressCount }: CourseSidebarProps) => {
  const { userId } = auth()

  if (!userId) {
    return redirect('/')
  }

  const purchase = await prisma.purchase.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: course.id,
      },
    },
  })

  return (
    <div className="flex h-full flex-col overflow-y-auto border-r shadow-sm">
      <div className="flex flex-col border-b p-8">
        <h1 className="font-semibold">{course.title}</h1>
        {purchase && (
          <div className="mt-10">
            <CourseProgress variant="success" value={progressCount} />
          </div>
        )}
      </div>
      <div className="flex w-full flex-col">
        {course.chapters.map((chapter) => (
          <CourseSidebarItem
            key={chapter.id}
            id={chapter.id}
            label={chapter.title}
            isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
            courseId={course.id}
            isLocked={!chapter.isFree && !purchase}
          />
        ))}
      </div>
    </div>
  )
}

export default CourseSidebar
