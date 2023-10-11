'use client'

import { UserButton } from '@clerk/nextjs'
import { LogOut } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import SearchInput from './SearchInput'
import { buttonVariants } from './ui/button'

const NavbarRoutes = () => {
  const pathname = usePathname()

  const isTeacherPage = pathname?.startsWith('/teacher')
  const isCoursePage = pathname?.startsWith('/courses')
  const isSearchPage = pathname === '/search'

  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}
      <div className="ml-auto flex gap-2">
        {isTeacherPage || isCoursePage ? (
          <Link
            href="/"
            className={buttonVariants({
              variant: 'ghost',
              size: 'sm',
            })}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Exit
          </Link>
        ) : (
          <Link
            href="/teacher/courses"
            className={buttonVariants({
              variant: 'ghost',
              size: 'sm',
            })}
          >
            Teacher mode
          </Link>
        )}
        <UserButton afterSignOutUrl="/" />
      </div>
    </>
  )
}

export default NavbarRoutes
