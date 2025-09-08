import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import { Outlet } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { dummyUserData } from '../assets/assets'
import Loading from '../components/Loading'

const Layout = () => {

  const user = dummyUserData
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return user ? (
    <div className='w-full h-screen overflow-hidden'>

      <Sidebar sidebarOpen={setSidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className='ml-0 sm:ml-60 xl:ml-72 bg-slate-50 h-full overflow-y-auto'>
        <Outlet />
      </div>
      {
        sidebarOpen ?
        <X className='absolute top-3 right-3 p-2 z-30 bg-white rounded-md shadow w-10 h-10 text-gray-600 sm:hidden' onClick={()=> setSidebarOpen(false)} />
        :
        <Menu className='absolute top-3 right-3 p-2 z-30 bg-white rounded-md shadow w-10 h-10 text-gray-600 sm:hidden' onClick={()=> setSidebarOpen(true)} />
      }
    </div>
  ) : (
    <Loading />
  )
}

export default Layout