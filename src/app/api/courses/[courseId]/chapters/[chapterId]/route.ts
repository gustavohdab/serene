import { auth } from '@clerk/nextjs'
import { NextRequest, NextResponse } from 'next/server'

import { prisma } from '@/db/prisma'

export async function PATCH(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      courseId: string
      chapterId: string
    }
  },
) {
  try {
    const { userId } = auth()
    const { isPublished, ...values } = await req.json()

    if (!userId) return new NextResponse('Unauthorized', { status: 401 })

    const courseOwner = await prisma.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    })

    if (!courseOwner) return new NextResponse('Unauthorized', { status: 401 })

    const chapter = await prisma.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      data: {
        ...values,
      },
    })

    // TODO - Handle video upload

    return NextResponse.json(chapter)
  } catch (error) {
    console.log('[COURSES_CHAPTER_ID', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
