import { auth } from '@clerk/nextjs'
import { CircleDollarSign, LayoutDashboard, ListChecks } from 'lucide-react'
import { redirect } from 'next/navigation'

import CategoryForm from './_components/CategoryForm'
import DescriptionForm from './_components/DescriptionForm'
import ImageForm from './_components/ImageForm'
import PriceForm from './_components/PriceForm'
import TitleForm from './_components/TitleForm'

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

  const course = await prisma.course.findUnique({
    where: {
      id: params.courseId,
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
  ]

  const totalFields = requiredFields.length
  const completedFields = requiredFields.filter(Boolean).length

  const completionText = `(${completedFields}/${totalFields})`

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Course Setup</h1>
          <span className="text-sm text-slate-700">
            {totalFields === completedFields ? (
              <>Your course is ready to be published.</>
            ) : (
              <>Complete all fields to publish your course {completionText}. </>
            )}
          </span>
        </div>
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
            <div className="">TODO: Add chapters here</div>
          </div>

          <div className="">
            <div className="flex items-center gap-x-2">
              <IconBadge icon={CircleDollarSign} />
              <h2 className="text-xl">Sell your course</h2>
            </div>
            <PriceForm initialData={course} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseIdPage
