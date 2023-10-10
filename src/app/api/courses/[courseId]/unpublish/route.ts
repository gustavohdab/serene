import { auth } from '@clerk/nextjs'
import { NextRequest, NextResponse } from 'next/server'

import { prisma } from '@/db/prisma'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { courseId: string } },
) {
  try {
    const { userId } = auth()

    if (!userId) return new NextResponse('Unauthorized', { status: 401 })

    const course = await prisma.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    })

    if (!course) return new NextResponse('Not Found', { status: 404 })

    const unpublishedCourse = await prisma.course.update({
      where: {
        id: params.courseId,
      },
      data: {
        isPublished: false,
      },
    })

    return NextResponse.json(unpublishedCourse)
  } catch (error) {
    console.log('[COURSE_ID_UNPUBLISH]', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
