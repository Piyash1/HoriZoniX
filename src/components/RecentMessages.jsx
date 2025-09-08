import React, { useEffect, useState } from 'react'
import { listRecentThreads } from '../lib/api'
import { Link } from 'react-router-dom'
import moment from 'moment'

const RecentMessages = () => {

    const [messages, setMessages] = useState([])

    const fetchRecentMessages = async () => {
        try {
            const threads = await listRecentThreads()
            const mapped = threads.map(t => ({
                from_user_id: {
                    _id: t.counterpart.id,
                    full_name: `${t.counterpart.first_name || ''} ${t.counterpart.last_name || ''}`.trim() || t.counterpart.username,
                    profile_picture: t.counterpart.profile_picture,
                },
                text: t.message_type === 'image' ? '' : (t.text || ''),
                message_type: t.message_type,
                media_url: t.media_url,
                createdAt: t.created_at,
                seen: true,
            }))
            setMessages(mapped)
        } catch (e) {
            setMessages([])
        }
    }

    useEffect(()=> {
        fetchRecentMessages()
    }, [])

  return (
    <div className='bg-white max-w-xs mt-4 p-4 min-h-20 rounded-md shadow text-xs text-slate-800'>
        <h3 className='font-semibold text-slate-8 mb-4'>Recent Messages</h3>
        <div className='flex flex-col max-h-56 overflow-y-scroll no-scrollbar'>
            {
                messages.map((message, index)=>(
                    <Link to={`/messages/${message.from_user_id._id}`} key={index} className='flex items-start gap-2 py-2 hover:bg-slate-100'>
                        <img src={message.from_user_id.profile_picture} alt="" className='w-8 h-8 rounded-full' />
                        <div className='w-full'>
                            <div className='flex justify-between'>
                                <p className='font-medium'>{message.from_user_id.full_name}</p>
                                <p className='text-[10px] text-slate-400'>{moment(message.createdAt).fromNow()}</p>
                            </div>
                            <div className='flex justify-between'>
                                <p className='text-gray-500'>{message.text ? message.text : 'Media'}</p>
                                {!message.seen && <p className='bg-indigo-500 text-white w-4 h-4 flex items-center justify-center rounded-fiull text-[10px]'>1</p>}
                            </div>
                        </div>
                        
                    </Link> 
                ))
            }
        </div>
    </div>
  )
}

export default RecentMessages