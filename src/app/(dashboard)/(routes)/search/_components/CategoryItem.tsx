'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import qs from 'query-string'

import { cn } from '@/lib/utils'

type CategoryItemProps = {
  key: string
  label: string
  icon: React.ElementType
  value: string
}

const CategoryItem = ({ label, icon: Icon, value }: CategoryItemProps) => {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentCategoryId = searchParams.get('categoryId')
  const currentTitle = searchParams.get('title')

  const isSelected = currentCategoryId === value

  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          title: currentTitle,
          categoryId: isSelected ? null : value,
        },
      },
      { skipEmptyString: true, skipNull: true },
    )

    router.push(url)
  }
  return (
    <button
      className={cn(
        'flex items-center gap-x-1 rounded-full border border-slate-200 px-3 py-2 text-sm transition hover:border-sky-700',
        isSelected
          ? 'border-sky-700 bg-sky-200/20 text-sky-800'
          : 'border-transparent',
      )}
      type="button"
      onClick={onClick}
    >
      {Icon && <Icon className="h-5 w-5" />}
      <div className="truncate">{label}</div>
    </button>
  )
}

export default CategoryItem
