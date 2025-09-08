import React, { useState } from 'react'
import { Search } from 'lucide-react'
import UserCard from '../components/UserCard'
import Loading from '../components/Loading'
import { searchUsers } from '../lib/api'

const Discover = () => {

  const [input, setInput] = useState('')
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e) => {
    if (e.key === 'Enter') {
      const term = input.trim()
      if (!term) {
        setUsers([])
        return
      }
      setLoading(true)
      try {
        const results = await searchUsers(term)
        // Normalize to what UserCard expects
        const normalized = results.map(u => ({
          _id: u.id,
          full_name: `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.username || u.email,
          username: u.username,
          bio: u.bio,
          profile_picture: u.profile_picture_url,
          location: u.location || '',
          followers: Array(u.followers_count || 0).fill(0),
          is_following: u.is_following,
          is_connected: u.is_connected,
          has_pending_request: u.has_pending_request,
        }))
        setUsers(normalized)
      } catch (err) {
        console.error(err)
        setUsers([])
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-slate-50 to-white'>
      <div className='max-w-6xl mx-auto p-6'>

        {/* Title */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-slate-900 mb-2'>Discover People</h1>
          <p className='text-slate-600'>Connect with amzing people and grow your network</p>
        </div>

        {/* Search Bar */}
        <div className='mb-8 shadow-md rounded-md border border-slate-200/60 bg-white/80'>
          <div className='p-6'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5' />
              <input type="text" placeholder='Search people by name, username, bio, or location...' className='pl-10 sm:pl-12 py-2 w-full border border-gray-300 rounded-md max-sm:text-sm' onChange={(e)=> setInput(e.target.value)} value={input} onKeyUp={handleSearch} />
            </div>
          </div>
        </div>

        <div className='flex flex-wrap gap-6'>
          {users.map((user)=>(
            <UserCard user={user} key={user._id} />
          ))}
        </div>

        {
          loading && (<Loading height='60vh' />)
        }

      </div>
    </div>
  )
}

export default Discover