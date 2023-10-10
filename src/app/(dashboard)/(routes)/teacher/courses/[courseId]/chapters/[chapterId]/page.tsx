import { auth } from '@clerk/nextjs'
import { ArrowLeftIcon, Eye, LayoutDashboard, Video } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import ChapterAccessForm from '../_components/ChapterAccessForm'
import ChapterActions from '../_components/ChapterActions'
import ChapterDescriptionForm from '../_components/ChapterDescriptionForm'
import ChapterTitleForm from '../_components/ChapterTitleForm'
import ChapterVideoForm from '../_components/ChapterVideoForm'

import Banner from '@/components/Banner'
import IconBadge from '@/components/IconBadge'
import { buttonVariants } from '@/components/ui/button'
import { prisma } from '@/db/prisma'
import { cn } from '@/lib/utils'

const ChapterIdPage = async ({
  params,
}: {
  params: {
    courseId: string
    chapterId: string
  }
}) => {
  const { userId } = auth()

  if (!userId) {
    return redirect('/')
  }

  const chapter = await prisma.chapter.findUnique({
    where: {
      id: params.chapterId,
      courseId: params.courseId,
    },
    include: {
      muxData: true,
    },
  })

  if (!chapter) {
    return redirect('/')
  }

  const requiredFields = [chapter.title, chapter.description, chapter.videoUrl]

  const totalFields = requiredFields.length
  const completedFields = requiredFields.filter(Boolean).length

  const completionText = `${completedFields}/${totalFields}`

  const IsComplete = requiredFields.every(Boolean)

  return (
    <>
      {!chapter.isPublished && (
        <Banner label="This chapter unpublished. It will not be visible to students." />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              href={`/teacher/courses/${params.courseId}`}
              className={cn(
                buttonVariants({
                  variant: 'ghost',
                }),
                'px-1',
              )}
            >
              <ArrowLeftIcon className="mr-2 h-6 w-6" />
              Back to course setup
            </Link>
            <div className="flex w-full items-center justify-between">
              <div className="mt-2 flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">Chapter creation</h1>
                <span className="text-sm text-slate-700">
                  Complete all the fields to create a chapter {completionText}.
                </span>
              </div>
              <ChapterActions
                disabled={!IsComplete}
                courseId={params.courseId}
                chapterId={params.chapterId}
                isPublished={chapter.isPublished}
              />
            </div>
          </div>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="">
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">Customize your chapter</h2>
              </div>
              <ChapterTitleForm
                initialData={chapter}
                courseId={params.courseId}
                chapterId={params.chapterId}
              />
              <ChapterDescriptionForm
                initialData={chapter}
                chapterId={params.chapterId}
              />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={Eye} />
                <h2 className="text-xl">Access settings</h2>
              </div>
              <ChapterAccessForm
                initialData={chapter}
                chapterId={params.chapterId}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Video} />
              <h2 className="text-xl">Video</h2>
            </div>
            <ChapterVideoForm
              initialData={chapter}
              courseId={params.courseId}
              chapterId={params.chapterId}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default ChapterIdPage
