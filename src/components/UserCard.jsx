import { MapPin, MessageCircle, Plus, UserPlus } from 'lucide-react'
import { toggleFollow, sendConnectionRequest } from '../lib/api'
import React, { useState } from 'react'

const UserCard = ({user}) => {

    const currentUser = null
    const [isFollowing, setIsFollowing] = useState(!!user.is_following)
    const [followersCount, setFollowersCount] = useState(Array.isArray(user.followers) ? user.followers.length : (user.followers_count || 0))
    const [isConnected, setIsConnected] = useState(!!user.is_connected)
    const [hasPendingRequest, setHasPendingRequest] = useState(!!user.has_pending_request)

    const handleFollow = async () => {
        try {
            if (!user?._id) return
            const res = await toggleFollow(user._id)
            if (res?.action === 'followed') {
                setIsFollowing(true)
                setFollowersCount((c)=> c + 1)
            } else if (res?.action === 'unfollowed') {
                setIsFollowing(false)
                setFollowersCount((c)=> Math.max(0, c - 1))
            }
        } catch (e) {
            console.error(e)
        }
    }

    const handleConnectionRequest = async () => {
        try {
            if (!user?._id) return
            const res = await sendConnectionRequest(user._id)
            if (res?.status === 'pending') {
                setHasPendingRequest(true)
            } else if (res?.status === 'accepted') {
                setIsConnected(true)
                setHasPendingRequest(false)
            }
        } catch (e) {
            console.error(e)
        }
    }

  return (
    <div key={user._id} className='p-4 pt-6 flex flex-col justify-between w-72 shadow border border-gray-200 rounded-md'>
        <div className='text-center'>
            <img src={user.profile_picture} alt="" className='rounded-full w-16 shadow-md mx-auto' />
            <p className='mt-4 font-semibold'>{user.full_name}</p>
            {user.username && <p className='font-light text-gray-500'>@{user.username}</p>}
            {user.bio && <p className=' text-gray-600 mt-2 text-center text-sm px-4'>{user.bio}</p>}
        </div>

        <div className='flex items-center justify-center gap-2 mt-4 text-xs text-gray-600'>
          <div className='flex items-center gap-1 border border-gray-300 rounded-full px-3 py-1'>
            <MapPin className='2-4 h-4' /> {user.location}
          </div>
          <div className='flex items-center gap-1 border border-gray-300 rounded-full px-3 py-1'>
            <span>{followersCount}</span>  Followers
          </div>
        </div>

        <div className='flex mt-4 gap-2'>
          {/* Follow Button */}
          <button onClick={handleFollow} className='w-full py-2 rounded-md flex justify-center items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition text-white cursor-pointer'>
            <UserPlus className='w-4 h-4' /> {isFollowing ? 'Following' : 'Follow'}
          </button>
          {/* Connection Request Button / Message Button */}
          <button onClick={handleConnectionRequest} disabled={hasPendingRequest} className='flex items-center justify-center w-16 border text-slate-500 group rounded-md cursor-pointer active:scale-95 transition'>
            { isConnected ? (
                <MessageCircle className='w-5 h-5 group-hover:scale-105 transition' />
              ) : (
                <Plus className='w-5 h-5 group-hover:scale-105 transition' />
              )
            }
          </button>
        </div>
    </div>

    
  )
}

export default UserCard