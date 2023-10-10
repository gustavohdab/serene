import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

import { columns } from './_components/Columns'
import { DataTable } from './_components/DataTable'

import { prisma } from '@/db/prisma'

const CoursesPage = async () => {
  const { userId } = auth()

  if (!userId) redirect('/')

  const courses = await prisma.course.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div className="p-6">
      <DataTable columns={columns} data={courses} />
    </div>
  )
}

export default CoursesPage
