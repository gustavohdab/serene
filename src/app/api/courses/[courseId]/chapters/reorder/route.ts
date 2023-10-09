import { auth } from '@clerk/nextjs'
import { NextRequest, NextResponse } from 'next/server'

import { prisma } from '@/db/prisma'

export async function PUT(
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

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { list } = await req.json()

    const courseOwner = await prisma.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    })

    if (!courseOwner) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    for (const chapter of list) {
      await prisma.chapter.update({
        where: {
          id: chapter.id,
        },
        data: {
          position: chapter.position,
        },
      })
    }

    return new NextResponse('Success', { status: 201 })
  } catch (error) {
    console.log('[REORDER]', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
