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
