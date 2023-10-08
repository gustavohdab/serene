import MobileNavbar from './MobileNavbar'

import NavbarRoutes from '@/components/NavbarRoutes'

const Navbar = () => {
  return (
    <nav className="flex h-full items-center border-b bg-white p-4 shadow-sm">
      <MobileNavbar />
      <NavbarRoutes />
    </nav>
  )
}

export default Navbar
