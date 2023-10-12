import { auth } from '@clerk/nextjs'
import { CheckCircle, Clock } from 'lucide-react'
import { redirect } from 'next/navigation'

import { CoursesList } from '../search/_components/CoursesList'

import InfoCard from './_components/InfoCard'

import { getDashboardCourses } from '@/actions/getDashboardCourses'

const DashboardPage = async () => {
  const { userId } = auth()

  if (!userId) return redirect('/')

  const { completedCourses, coursesInProgress } =
    await getDashboardCourses(userId)
  return (
    <div className="space-y-4 p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InfoCard
          icon={Clock}
          label="In Progress"
          number={coursesInProgress.length}
        />
        <InfoCard
          icon={CheckCircle}
          label="Completed"
          number={completedCourses.length}
          variant="success"
        />
        <div className=""></div>
      </div>
      <CoursesList items={[...coursesInProgress, ...completedCourses]} />
    </div>
  )
}

export default DashboardPage
