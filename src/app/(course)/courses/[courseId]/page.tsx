import { redirect } from 'next/navigation'

import { prisma } from '@/db/prisma'

const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {
  const course = await prisma.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        orderBy: {
          position: 'asc',
        },
      },
    },
  })

  if (!course) {
    return redirect('/')
  }

  return <div className=""></div>
}

export default CourseIdPage
