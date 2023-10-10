import { auth } from '@clerk/nextjs'
import Mux from '@mux/mux-node'
import { NextRequest, NextResponse } from 'next/server'

import { prisma } from '@/db/prisma'

const { Video } = new Mux(
  process.env.MUX_TOKEN_ID as string,
  process.env.MUX_TOKEN_SECRET as string,
)

// delete course
export async function DELETE(
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
    const { courseId } = params

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
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

    if (!course) {
      return new NextResponse('Not Founds', { status: 404 })
    }

    for (const chapter of course.chapters) {
      if (chapter.muxData?.assetId) {
        await Video.Assets.del(chapter.muxData.assetId)
      }
    }

    await prisma.course.delete({
      where: {
        id: courseId,
      },
    })

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/teacher/courses`,
    )
  } catch (error) {
    console.log('[COURSE_ID]', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function PATCH(
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
    const { courseId } = params
    const values = await req.json()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const course = await prisma.course.update({
      where: {
        id: courseId,
        userId,
      },
      data: {
        ...values,
      },
    })

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/teacher/courses/${course.id}`,
    )
  } catch (error) {
    console.log('[COURSE_ID]', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
