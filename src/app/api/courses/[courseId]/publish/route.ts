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
      include: {
        chapters: {
          include: {
            muxData: true,
          },
        },
      },
    })

    if (!course) return new NextResponse('Not Found', { status: 404 })

    const hadPublishedChapter = course.chapters.some(
      (chapter) => chapter.isPublished,
    )

    if (
      !course.title ||
      !course.description ||
      !course.imageUrl ||
      !course.categoryId ||
      !hadPublishedChapter
    ) {
      return new NextResponse('Missing Data', { status: 400 })
    }

    const publishedCourse = await prisma.course.update({
      where: {
        id: params.courseId,
      },
      data: {
        isPublished: true,
      },
    })

    return NextResponse.json(publishedCourse)
  } catch (error) {
    console.log('[COURSE_ID_PUBLISH]', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
