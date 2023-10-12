import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

import CourseNavbar from './_components/CourseNavbar'
import CourseSidebar from './_components/CourseSidebar'

import getProgress from '@/actions/getProgress'
import { prisma } from '@/db/prisma'

const CourseIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode
  params: {
    courseId: string
  }
}) => {
  const { userId } = auth()

  if (!userId) redirect('/')

  const course = await prisma.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        include: {
          userProgress: {
            where: {
              userId,
            },
          },
        },
        orderBy: {
          position: 'asc',
        },
      },
    },
  })

  if (!course) redirect('/')

  const progressCount = await getProgress(userId, course.id)

  return (
    <div className="h-full">
      <div className="fixed inset-y-0 z-50 h-[5rem] w-full md:pl-80">
        <CourseNavbar course={course} progressCount={progressCount} />
      </div>
      <div className="fixed inset-y-0 z-50 hidden h-full w-80 flex-col md:flex">
        <CourseSidebar course={course} progressCount={progressCount} />
      </div>
      <main className="h-full pt-[5rem] md:pl-80">{children}</main>
    </div>
  )
}

export default CourseIdLayout
