import { auth } from '@clerk/nextjs'
import { NextRequest, NextResponse } from 'next/server'

import { prisma } from '@/db/prisma'

export async function POST(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      courseId: string
    }
  },
) {
  try {
    const { userId } = auth()
    const { title } = await req.json()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!title) {
      return new NextResponse('Bad Request', { status: 400 })
    }

    const courseOwner = await prisma.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    })

    if (!courseOwner) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const lastChapter = await prisma.chapter.findFirst({
      where: {
        courseId: params.courseId,
      },
      orderBy: {
        position: 'desc',
      },
    })

    const newPosition = lastChapter ? lastChapter.position + 1 : 1

    const chapter = await prisma.chapter.create({
      data: {
        title,
        position: newPosition,
        courseId: params.courseId,
      },
    })

    return NextResponse.json(chapter)
  } catch (error) {
    console.log('[CHAPTERS]', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
