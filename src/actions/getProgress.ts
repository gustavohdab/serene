import { prisma } from '@/db/prisma'

const getProgress = async (
  userId: string,
  courseId: string,
): Promise<number> => {
  try {
    const publishedChapters = await prisma.chapter.findMany({
      where: {
        course: {
          id: courseId,
          isPublished: true,
        },
      },
      select: {
        id: true,
      },
    })

    const publishedChapterIds = publishedChapters.map((chapter) => chapter.id)

    const validCompletedChapters = await prisma.userProgress.count({
      where: {
        userId,
        chapterId: {
          in: publishedChapterIds,
        },
        isCompleted: true,
      },
    })

    const progressPercentage = Math.round(
      (validCompletedChapters / publishedChapterIds.length) * 100,
    )

    return progressPercentage
  } catch (error) {
    console.log('Error in GetProgress: ', error)
    return 0
  }
}

export default getProgress
