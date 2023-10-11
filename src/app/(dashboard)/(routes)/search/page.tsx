import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

import Categories from './_components/Categories'
import { CoursesList } from './_components/CoursesList'

import { getCourses } from '@/actions/getCourses'
import SearchInput from '@/components/SearchInput'
import { prisma } from '@/db/prisma'

type SearchPageProps = {
  searchParams: {
    title: string
    categoryId: string
  }
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const { userId } = auth()

  if (!userId) {
    return redirect('/')
  }

  const categories = await prisma.category.findMany({
    orderBy: {
      name: 'asc',
    },
  })

  const courses = await getCourses({
    userId,
    ...searchParams,
  })
  return (
    <>
      <div className="block px-6 pt-6 md:mb-0 md:hidden">
        <SearchInput />
      </div>
      <div className="space-y-4 p-6">
        <Categories items={categories} />
        <CoursesList items={courses} />
      </div>
    </>
  )
}

export default SearchPage
