import React, { useState, useEffect } from 'react'
import { Image, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { createPost, getMe } from '../lib/api'
import CreatePostSkeleton from '../components/skeletons/CreatePostSkeleton'

const CreatePost = () => {

  const [content, setContent] = useState('')
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      setInitialLoading(true)
      try {
        const response = await getMe()
        console.log('API Response:', response) // Debug log
        if (response.user) {
          setUser(response.user)
        } else {
          console.error('No user data in response')
          toast.error('No user data available')
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error)
        toast.error('Failed to load user data')
      } finally {
        setInitialLoading(false)
      }
    }
    fetchUser()
  }, [])

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await createPost({ content, files: images })
      setContent('')
      setImages([])
    } catch (error) {
      console.error('Failed to create post:', error)
    } finally {
      setLoading(false)
    }
  }
 

  if (initialLoading) {
    return <CreatePostSkeleton />
  }

  if (!user) {
    return (
      <div className='min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4'></div>
          <p className='text-slate-600'>Loading user data...</p>
        </div>
      </div>
    )
  }

  // Debug log to see what user data we have
  console.log('User data:', user)

  return (
    <div className='min-h-screen bg-gradient-to-b from-slate-50 to-white'>
      <div className='max-w-6xl mx-auto p-6'>
        {/* Title */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-slate-900 mb-2'>Create Post</h1>
          <p className='text-slate-600'>Share your thoughts with the world</p>
        </div>

        {/* Form */}
        <div className='max-w-xl bg-white p-4 sm:p-8 rounded-xl shadow-md space-y-4'>
          {/* Header */}
          <div className='flex items-center gap-3'>
            <img 
              src={user.profile_picture_url || '/default-avatar.png'} 
              alt="" 
              className='w-12 h-12 rounded-full shadow object-cover' 
            />
            <div>
              <h2 className='font-semibold'>
                {user.first_name && user.last_name 
                  ? `${user.first_name} ${user.last_name}`.trim()
                  : user.username
                }
              </h2>
              <p className='text-sm text-gray-500'>@{user.username}</p>
            </div>
          </div>

          {/* Text Area */}
          <textarea className='w-full resize-none max-h-20 mt-4 text-sm outline-none placeholder-gray-400' placeholder="What's happening?" onChange={(e)=>setContent(e.target.value)} value={content} />

          {/* Image Upload */}
          {
            images.length > 0 && <div className='flex flex-wrap gap-2 mt-4'>
              {images.map((image, i)=>(
                <div key={i} className='relative group'>
                  <img src={URL.createObjectURL(image)} className='h-20 rounded-md' alt="" />
                  <div onClick={()=> setImages(images.filter((_, index)=> index!== i))} className='absolute hidden group-hover:flex justify-center items-center top-0 right-0 bottom-0 left-0 bg-black/40 rounded-md cursor-pointer'>
                    <X className='w-6 h-6 text-white' />
                  </div>
                </div>
              ))}
            </div>
          }

          {/* Bottom Bar */}
          <div className='flex items-center justify-between pt-3 border-t border-gray-300'>
            <label htmlFor="images" className='flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition cursor-pointer'>
              <Image className='size-6' />
            </label>

            <input type="file" id='images' accept='image/*' hidden multiple onChange={(e)=> setImages([...images, ...e.target.files])} />

            <button 
              disabled={loading || !content.trim()} 
              onClick={()=> toast.promise(handleSubmit(),
              {
                loading: 'Publishing...',
                success: <p>Post published successfully!</p>,
                error: <p>Failed to publish post</p>
              }
              )} 
              className='text-sm bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition text-white font-medium px-8 py-2 rounded-md cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2'
            >
              {loading && (
                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
              )}
              {loading ? 'Publishing...' : 'Publish Post'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePost