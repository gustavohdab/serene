'use client'

import { Search } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import qs from 'query-string'
import { useEffect, useState } from 'react'

import { Input } from './ui/input'

import { useDebounce } from '@/hooks/useDebounce'

const SearchInput = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [value, setValue] = useState<string>('')
  const debouncedValue = useDebounce(value)

  const currentCategoryId = searchParams.get('categoryId')

  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          title: debouncedValue,
          categoryId: currentCategoryId,
        },
      },
      { skipEmptyString: true, skipNull: true },
    )

    router.push(url)
  }, [debouncedValue, pathname, currentCategoryId, router])

  return (
    <div className="relative">
      <Search className="absolute left-3 top-3 h-4 w-4 text-slate-600" />
      <Input
        className="w-full rounded-full bg-slate-100 pl-9 focus-visible:ring-slate-200 md:w-[18.75rem]"
        placeholder="Search for a course"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  )
}

export default SearchInput
