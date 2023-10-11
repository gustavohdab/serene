import Categories from './_components/Categories'

import SearchInput from '@/components/SearchInput'
import { prisma } from '@/db/prisma'

const SearchPage = async () => {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: 'asc',
    },
  })
  return (
    <>
      <div className="block px-6 pt-6 md:mb-0 md:hidden">
        <SearchInput />
      </div>
      <div className="p-6">
        <Categories items={categories} />
      </div>
    </>
  )
}

export default SearchPage
