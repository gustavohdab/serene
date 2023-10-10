import { auth } from '@clerk/nextjs'
import {
  CircleDollarSign,
  File,
  LayoutDashboard,
  ListChecks,
} from 'lucide-react'
import { redirect } from 'next/navigation'

import Actions from './_components/Actions'
import AttachmentForm from './_components/AttachmentForm'
import CategoryForm from './_components/CategoryForm'
import ChaptersForm from './_components/ChaptersForm'
import DescriptionForm from './_components/DescriptionForm'
import ImageForm from './_components/ImageForm'
import PriceForm from './_components/PriceForm'
import TitleForm from './_components/TitleForm'

import Banner from '@/components/Banner'
import IconBadge from '@/components/IconBadge'
import { prisma } from '@/db/prisma'

const CourseIdPage = async ({
  params,
}: {
  params: {
    courseId: string
  }
}) => {
  const { userId } = auth()

  if (!userId) redirect('/')

  const course = await prisma.course.findUnique({
    where: {
      id: params.courseId,
      userId,
    },
    include: {
      chapters: {
        orderBy: {
          position: 'asc',
        },
      },
      attachments: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })

  const categories = await prisma.category.findMany({
    orderBy: {
      name: 'asc',
    },
  })

  if (!course) redirect('/teacher/courses')

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
    course.chapters.some((chapter) => chapter.isPublished),
  ]

  const totalFields = requiredFields.length
  const completedFields = requiredFields.filter(Boolean).length

  const completionText = `(${completedFields}/${totalFields})`

  const isComplete = requiredFields.every(Boolean)

  return (
    <>
      {!course.isPublished && (
        <Banner label="This course is unpublished. It will not be visible to students." />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Course Setup</h1>
            <span className="text-sm text-slate-700">
              {totalFields === completedFields ? (
                <>Your course is ready to be published.</>
              ) : (
                <>
                  Complete all fields to publish your course {completionText}.{' '}
                </>
              )}
            </span>
          </div>
          <Actions
            courseId={course.id}
            isPublished={course.isPublished}
            disabled={!isComplete}
          />
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="">
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Customize your course</h2>
            </div>
            <TitleForm initialData={course} />
            <DescriptionForm initialData={course} />
            <ImageForm initialData={course} />
            <CategoryForm
              initialData={course}
              options={categories.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
            />
          </div>

          <div className="space-y-6">
            <div className="">
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">Course chapters</h2>
              </div>
              <ChaptersForm initialData={course} />
            </div>

            <div className="">
              <div className="flex items-center gap-x-2">
                <IconBadge icon={CircleDollarSign} />
                <h2 className="text-xl">Sell your course</h2>
              </div>
              <PriceForm initialData={course} />
            </div>

            <div className="flex items-center gap-x-2">
              <IconBadge icon={File} />
              <h2 className="text-xl">Resources &amp; Attachments</h2>
            </div>
            <AttachmentForm initialData={course} />
          </div>
        </div>
      </div>
    </>
  )
}

export default CourseIdPage
