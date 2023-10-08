import { auth } from '@clerk/nextjs'
import { LayoutDashboard } from 'lucide-react'
import { redirect } from 'next/navigation'

import DescriptionForm from './_components/DescriptionForm'
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
            Complete all fields to publish your course {completionText}.
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
        </div>
      </div>
    </div>
  )
}

export default CourseIdPage
