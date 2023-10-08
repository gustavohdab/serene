import { auth } from '@clerk/nextjs'
import { NextRequest, NextResponse } from 'next/server'

import { prisma } from '@/db/prisma'

export async function DELETE(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      courseId: string
      attachmentId: string
    }
  },
) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
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

    const attachment = await prisma.attachment.findUnique({
      where: {
        id: params.attachmentId,
      },
    })

    if (!attachment) {
      return new NextResponse('Not Found', { status: 404 })
    }

    await prisma.attachment.delete({
      where: {
        id: params.attachmentId,
      },
    })

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/teacher/courses/${params.courseId}`,
      { status: 303 },
    )
  } catch (error) {
    console.error('ATTACHMENT_ID', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
