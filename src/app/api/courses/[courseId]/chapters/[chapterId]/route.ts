import { auth } from '@clerk/nextjs'
import Mux from '@mux/mux-node'
import { NextRequest, NextResponse } from 'next/server'

import { prisma } from '@/db/prisma'

const { Video } = new Mux(
  process.env.MUX_TOKEN_ID as string,
  process.env.MUX_TOKEN_SECRET as string,
)

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    if (values.videoUrl) {
      const existingMuxData = await prisma.muxData.findFirst({
        where: {
          chapterId: params.chapterId,
        },
      })

      if (existingMuxData) {
        await Video.Assets.del(existingMuxData.assetId)
        await prisma.muxData.delete({
          where: {
            id: existingMuxData.id,
          },
        })
      }

      const asset = await Video.Assets.create({
        input: values.videoUrl,
        playback_policy: 'public',
        test: false,
      })

      await prisma.muxData.create({
        data: {
          assetId: asset.id,
          playbackId: asset.playback_ids?.[0].id,
          chapterId: params.chapterId,
        },
      })
    }

    return NextResponse.json(chapter)
  } catch (error) {
    console.log('[COURSES_CHAPTER_ID', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
