import React, { useState, useEffect } from 'react'
import { assets, dummyUserData } from '../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import MenuItems from './MenuItems'
import { CirclePlus, LogOut, X } from 'lucide-react'
import { logout, getMe } from '../lib/api'
import { api } from '../lib/api'
import axios from 'axios'
import { useAuth } from '../App'

const Sidebar = ({sidebarOpen, setSidebarOpen}) => {

    const navigate = useNavigate()
    const [user, setUser] = useState(dummyUserData)
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
    const { checkAuth } = useAuth()

    useEffect(() => {
      getMe().then((res) => {
        if (res?.user) setUser({
          full_name: `${res.user.first_name || ''} ${res.user.last_name || ''}`.trim() || res.user.username,
          username: res.user.username,
          profile_picture: res.user.profile_picture,
        })
      }).catch(() => {})
    }, [])

    const handleLogout = async () => {
      try {
        console.log('Logging out...')
        
        // Get the API base URL
        const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'
        console.log('Using API_BASE:', API_BASE)
        
        // Get a fresh CSRF token first using direct axios call
        console.log('Getting fresh CSRF token for logout...')
        try {
          const csrfResponse = await axios.get(`${API_BASE}/api/auth/csrf/`, { 
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
            }
          })
          console.log('CSRF token obtained successfully:', csrfResponse.data)
          console.log('CSRF response headers:', csrfResponse.headers)
        } catch (csrfError) {
          console.error('Failed to get CSRF token:', csrfError)
          console.error('CSRF error response:', csrfError.response?.data)
          // Continue anyway - maybe we have an old token
        }
        
        // Get the CSRF token from cookies
        function getCookie(name) {
          const match = document.cookie.match(new RegExp('(^|; )' + name + '=([^;]*)'));
          return match ? decodeURIComponent(match[2]) : null;
        }
        
        const csrftoken = getCookie('csrftoken');
        console.log('All cookies:', document.cookie);
        console.log('CSRF token from cookie:', csrftoken);
        
        if (!csrftoken) {
          console.error('No CSRF token found in cookies!');
          throw new Error('CSRF token not found');
        }
        
        // Make logout request with direct axios call
        console.log('Making logout request with CSRF token:', csrftoken);
        const logoutResponse = await axios.post(`${API_BASE}/api/auth/logout/`, {}, {
          withCredentials: true,
          headers: {
            'X-CSRFToken': csrftoken,
            'Content-Type': 'application/json',
          }
        });
        
        console.log('Logout API call successful:', logoutResponse.data);
        
        // Check if we're actually logged out
        const isStillAuthenticated = await checkAuth()
        console.log('Auth state after logout:', isStillAuthenticated)
        
        if (!isStillAuthenticated) {
          console.log('Successfully logged out, redirecting to login...')
          navigate('/', { replace: true })
        } else {
          console.warn('Logout failed - still authenticated')
          // Force logout by clearing local state and redirecting
          navigate('/', { replace: true })
        }
      } catch (error) {
        console.error('Logout error:', error)
        console.error('Error response data:', error.response?.data)
        console.error('Error response status:', error.response?.status)
        console.error('Error response headers:', error.response?.headers)
        // Even if logout API fails, try to redirect
        navigate('/', { replace: true })
      }
    }

    const handleModalClick = (e) => {
      if (e.target === e.currentTarget) {
        setShowLogoutConfirm(false)
      }
    }

    useEffect(() => {
      const handleEscape = (e) => {
        if (e.key === 'Escape' && showLogoutConfirm) {
          setShowLogoutConfirm(false)
        }
      }
      
      if (showLogoutConfirm) {
        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
      }
    }, [showLogoutConfirm])

  return (
    <div className={`w-60 xl:w-72 bg-white border-r border-gray-200 flex flex-col justify-between items-center h-screen fixed left-0 top-0 z-20 max-sm:${sidebarOpen ? 'translate-x-0' : 'translate-x-full'} transition-all duration-300 ease-in-out`}>
        <div className='w-full'>
            <img onClick={()=> navigate('/')} src={assets.logo} alt="" className='w-40 ml-7 my-2 cursor-pointer' />
            <hr className='border-gray-300 mb-8' />

            <MenuItems setSidebarOpen={setSidebarOpen} />

            <Link to={'/create-post'} className='flex items-center justify-center gap-2 py-2.5 mt-6 mx-6 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95 transition text-white cursor-pointer'>
                <CirclePlus className='w-5 h-5' />
                Create Post
            </Link>
        </div>

        <div className='w-full border-t border-gray-200 p-4 px-7 flex items-center justify-between'>
          <div className='flex gap-2 items-center cursor-pointer'>
          <img src={user.profile_picture || assets.sample_profile} className='w-8 h-8 rounded-full object-cover' />
            <div>
              <h1 className='text-sm font-medium'>{user.full_name}</h1>
              <p className='text-xs text-gray-500'>@{user.username}</p>
            </div>
          </div>
          <LogOut onClick={() => setShowLogoutConfirm(true)} className='w-4.5 text-gray-400 hover:text-gray-700 transition cursor-pointer' />
        </div>

        {/* Logout Confirmation Modal */}
        {showLogoutConfirm && (
          <div 
            className='fixed inset-0 flex items-center justify-center z-50'
            onClick={handleModalClick}
          >
            {/* Background Blur Overlay */}
            <div className='absolute inset-0 bg-black/20 backdrop-blur-sm'></div>
            <div className='relative bg-white/95 backdrop-blur-md rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border border-white/20 animate-in fade-in-0 zoom-in-95 duration-200'>
              <div className='flex items-center justify-between mb-6'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center'>
                    <LogOut className='w-5 h-5 text-white' />
                  </div>
                  <h3 className='text-xl font-bold text-gray-900'>Confirm Logout</h3>
                </div>
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className='text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full'
                >
                  <X className='w-5 h-5' />
                </button>
              </div>
              
              <div className='mb-8'>
                <p className='text-gray-700 text-base leading-relaxed'>
                  Are you sure you want to logout? You'll need to sign in again to access your account.
                </p>
                <div className='mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg'>
                  <p className='text-amber-800 text-sm flex items-center gap-2'>
                    <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                      <path fillRule='evenodd' d='M8.257 3.099c.765-1.36 2.726-1.36 3.491 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z' clipRule='evenodd' />
                    </svg>
                    This action cannot be undone
                  </p>
                </div>
              </div>
              
              <div className='flex gap-3'>
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className='flex-1 px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 font-medium hover:scale-[1.02] active:scale-[0.98]'
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className='flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-xl transition-all duration-200 font-medium hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl'
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  )
}

export default Sidebar