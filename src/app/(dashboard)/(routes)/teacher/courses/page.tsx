import Link from 'next/link'

import { buttonVariants } from '@/components/ui/button'

const CoursesPage = () => {
  return (
    <div className="p-6">
      <Link
        className={buttonVariants({
          variant: 'default',
        })}
        href="/teacher/create"
      >
        New Course
      </Link>
    </div>
  )
}

export default CoursesPage
