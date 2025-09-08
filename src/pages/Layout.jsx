import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import MobileNav from '../components/MobileNav'
import { Outlet } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { dummyUserData } from '../assets/assets'
import Loading from '../components/Loading'

const Layout = () => {

  const user = dummyUserData
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return user ? (
    <div className='w-full h-screen overflow-hidden'>

      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className='ml-0 sm:ml-60 xl:ml-72 bg-slate-50 h-full overflow-y-auto pb-14 sm:pb-0'>
        <Outlet />
      </div>
      <MobileNav />
      {sidebarOpen && (
        <div className='fixed inset-0 bg-black/30 backdrop-blur-[1px] z-10 sm:hidden' onClick={()=> setSidebarOpen(false)} />
      )}
      {sidebarOpen ? (
        <X className='fixed top-3 right-3 p-2 z-20 bg-white rounded-md shadow w-10 h-10 text-gray-600 sm:hidden' onClick={()=> setSidebarOpen(false)} />
      ) : (
        <Menu className='fixed top-3 right-3 p-2 z-20 bg-white rounded-md shadow w-10 h-10 text-gray-600 sm:hidden' onClick={()=> setSidebarOpen(true)} />
      )}
    </div>
  ) : (
    <Loading />
  )
}

export default Layout