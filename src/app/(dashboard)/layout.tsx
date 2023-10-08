import React from 'react'

import Navbar from './_components/Navbar'
import Sidebar from './_components/Sidebar'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <div className="fixed inset-y-0 z-50 h-20 w-full md:pl-56">
        <Navbar />
      </div>
      <div className="fixed inset-y-0 z-50 hidden h-full w-56 flex-col md:flex">
        <Sidebar />
      </div>
      <main className="h-full md:pl-56">{children}</main>
    </div>
  )
}

export default DashboardLayout
