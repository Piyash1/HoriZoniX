import React, { useEffect, useMemo, useState } from 'react'
import {Users, UserPlus, UserCheck, UserRoundPen, MessagesSquare} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { listFollowers, listFollowing, listConnections, listConnectionRequests, respondConnectionRequest } from '../lib/api'
import sampleProfile from '../assets/sample_profile.jpg'
import ConnectionsSkeleton from '../components/skeletons/ConnectionsSkeleton'

const Connections = () => {

  const [currentTab, setCurrentTab] = useState('followers')
  const [followers, setFollowers] = useState([])
  const [following, setFollowing] = useState([])
  const [connections, setConnections] = useState([])
  const [pending, setPending] = useState([])
  const [loading, setLoading] = useState(true)
  const [responding, setResponding] = useState({})

  const navigate = useNavigate()

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [f1, f2, conns, reqs] = await Promise.all([
        listFollowers(),
        listFollowing(),
        listConnections(),
        listConnectionRequests(),
      ])
      
      const mapUser = (u) => ({
        _id: u.id,
        full_name: `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.username || u.email,
        username: u.username,
        bio: u.bio || '',
        profile_picture: u.profile_picture_url,
      })
      setFollowers(f1.map(mapUser))
      setFollowing(f2.map(mapUser))
      setConnections(conns.map(mapUser))
      setPending(reqs.map(r => ({
        request_id: r.id,
        ...mapUser(r.sender)
      })))
    } catch (e) {
      console.error('Error fetching connections data:', e)
      setFollowers([]); setFollowing([]); setConnections([]); setPending([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  const handleRespond = async (requestId, action) => {
    setResponding(prev => ({ ...prev, [requestId]: true }))
    try {
      await respondConnectionRequest(requestId, action)
      await fetchAll() // Refresh the data
    } catch (error) {
      console.error('Failed to respond to connection request:', error)
    } finally {
      setResponding(prev => ({ ...prev, [requestId]: false }))
    }
  }

  const dataArray = useMemo(() => ([
    {label: 'followers', value: followers, icon: Users},
    {label: 'following', value: following, icon: UserCheck},
    {label: 'pending', value: pending, icon: UserRoundPen},
    {label: 'connections', value: connections, icon: UserPlus},
  ]), [followers, following, pending, connections])

  if (loading) {
    return <ConnectionsSkeleton />
  }

  return (
    <div className='min-h-screen bg-slate-50'>
      <div className='max-w-6xl mx-auto p-6'>

        {/* Title */}
        <div>
          <h1 className='text-3xl font-bold text-slate-900 mb-2'>Connections</h1>
          <p className='text-slate-600'>Manage your network and discover new connections</p>
        </div>

        {/* Counts */}
        <div className='mb-8 flex flex-wrap gap-6'>
          {dataArray.map((item, index)=>(
            <div key={index} className='flex flex-col items-center justify-center gap-1 border h-20 w-40 border-gray-200 bg-white shadow rounded-md'>
              <b>{item.value.length}</b>
              <p className='text-slate-600'>{item.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className='inline-flex flex-wrap items-center border border-gray-200 rounded-md p-1 bg-white shadow-sm'>
          {
            dataArray.map((tab)=> (
              <button onClick={()=> setCurrentTab(tab.label)} key={tab.label} className={`flex items-center px-3 py-1 text-sm rounded-md transition-colors cursor-pointer ${currentTab === tab.label ? 'bg-white font-medium text-black' : 'text-gray-500 hover:text-black'}`}>
                <tab.icon className='w-4 h-4' />
                <span className='ml-1'>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className='ml-2 text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full'>{tab.count}</span>
                )}
              </button>
            ))
          }
        </div>

        {/* Connections */}
        <div className='flex flex-wrap gap-6 mt-6'>
          {dataArray.find((item)=>item.label === currentTab).value.map((user)=> (
            <div key={user._id} className='w-full max-w-88 flex gap-5 p-6 bg-white shadow rounded-md'>
              <img 
                src={user.profile_picture || sampleProfile} 
                alt={user.full_name} 
                className='rounded-full w-12 h-12 shadow-md mx-auto object-cover' 
                onError={(e) => {
                  e.target.src = sampleProfile;
                }}
              />
              <div className='flex-1'>
                <p className='font-medium text-slate-700'>{user.full_name}</p>
                <p className=' text-slate-500'>{user.username}</p>
                <p className='text-sm text-slate-600'>{user.bio.slice(0, 30)}</p>
                <div className='flex max-sm:flex-col gap-2 mt-4'>
                  {
                    <button onClick={()=> navigate(`/profile/${user._id}`)} className='w-full p-2 text-sm rounded bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition text-white cursor-pointer'>
                      View Profile
                    </button>
                  }
                  {
                    currentTab === 'following' && (
                      <button className='w-full p-2 text-sm rounded bg-slate-100 hover:bg-slate-200 text-black active:scale-95 transition cursor-pointer'>
                        Unfollow
                      </button>
                    )
                  }
                  {
                    currentTab === 'pending' && (
                      <div className='flex gap-2 w-full'>
                        <button 
                          onClick={() => handleRespond(user.request_id, 'accept')} 
                          disabled={responding[user.request_id]}
                          className='w-full p-2 text-sm rounded bg-slate-100 hover:bg-slate-200 text-black active:scale-95 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-1'
                        >
                          {responding[user.request_id] && (
                            <div className='animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600'></div>
                          )}
                          Accept
                        </button>
                        <button 
                          onClick={() => handleRespond(user.request_id, 'reject')} 
                          disabled={responding[user.request_id]}
                          className='w-full p-2 text-sm rounded bg-slate-100 hover:bg-slate-200 text-black active:scale-95 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-1'
                        >
                          {responding[user.request_id] && (
                            <div className='animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600'></div>
                          )}
                          Reject
                        </button>
                      </div>
                    )
                  }
                  {
                    currentTab === 'connections' && (
                      <button onClick={()=> navigate(`/messages/${user._id}`)} className='w-full p-2 text-sm rounded bg-slate-100 hover:bg-slate-200 text-slate-800 active:scale-95 transition cursor-pointer flex items-center justify-center gap-1'>
                        <MessagesSquare className='w-4 h-4' />
                        Message
                      </button>
                    )
                  }
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default Connections