import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Compass, PlusCircle, MessageSquare, User } from 'lucide-react'

const MobileNav = () => {
  const location = useLocation()
  const isActive = (path) => location.pathname === path

  const itemCls = (active) => `flex flex-col items-center justify-center gap-0.5 flex-1 py-2 ${active ? 'text-indigo-600' : 'text-slate-600'}`

  return (
    <nav className='fixed bottom-0 left-0 right-0 z-20 sm:hidden border-t border-slate-200 bg-white/95 backdrop-blur shadow-sm'>
      <div className='max-w-3xl mx-auto flex items-center'>
        <Link to='/' className={itemCls(isActive('/'))}>
          <Home className='w-5 h-5' />
          <span className='text-[11px]'>Home</span>
        </Link>
        <Link to='/discover' className={itemCls(isActive('/discover'))}>
          <Compass className='w-5 h-5' />
          <span className='text-[11px]'>Discover</span>
        </Link>
        <Link to='/create-post' className='flex flex-col items-center justify-center gap-0.5 flex-1 py-2 text-white'>
          <div className='w-9 h-9 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center shadow'>
            <PlusCircle className='w-5 h-5' />
          </div>
          <span className='text-[11px] text-slate-600'>Create</span>
        </Link>
        <Link to='/messages' className={itemCls(isActive('/messages'))}>
          <MessageSquare className='w-5 h-5' />
          <span className='text-[11px]'>Messages</span>
        </Link>
        <Link to='/profile' className={itemCls(isActive('/profile'))}>
          <User className='w-5 h-5' />
          <span className='text-[11px]'>Profile</span>
        </Link>
      </div>
    </nav>
  )
}

export default MobileNav


