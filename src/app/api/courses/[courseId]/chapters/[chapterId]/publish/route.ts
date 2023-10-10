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

    if (!userId) return new NextResponse('Unauthorized', { status: 401 })

    const courseOwner = await prisma.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    })

    if (!courseOwner) return new NextResponse('Unauthorized', { status: 401 })

    const chapter = await prisma.chapter.findUnique({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
    })

    if (!chapter) return new NextResponse('Not Found', { status: 404 })

    const muxData = await prisma.muxData.findUnique({
      where: {
        chapterId: params.chapterId,
      },
    })

    if (
      !chapter ||
      !muxData ||
      !chapter.title ||
      !chapter.description ||
      !chapter.videoUrl
    ) {
      return new NextResponse('Missing Required Data', { status: 400 })
    }

    const publishedChapter = await prisma.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      data: {
        isPublished: true,
      },
    })

    return NextResponse.json(publishedChapter)
  } catch (error) {
    console.error(error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
