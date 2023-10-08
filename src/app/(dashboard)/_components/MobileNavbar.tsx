import { Menu } from 'lucide-react'

import Sidebar from './Sidebar'

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

const MobileNavbar = () => {
  return (
    <Sheet>
      <SheetTrigger>
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <Sidebar />
      </SheetContent>
    </Sheet>
  )
}

export default MobileNavbar
