import { Chapter, Course, UserProgress } from '@prisma/client'

import CourseMobileSidebar from './CourseMobileSidebar'

import NavbarRoutes from '@/components/NavbarRoutes'

type CourseNavbarProps = {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null
    })[]
  }
  progressCount: number
}

const CourseNavbar = ({ course, progressCount }: CourseNavbarProps) => {
  return (
    <div className="flex h-full items-center border-b bg-white p-4 shadow-sm">
      <CourseMobileSidebar course={course} progressCount={progressCount} />
      <NavbarRoutes />
    </div>
  )
}

export default CourseNavbar
