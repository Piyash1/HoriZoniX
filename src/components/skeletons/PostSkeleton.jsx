import React from 'react'

const PostSkeleton = () => {
  return (
    <div className='bg-white rounded-xl shadow p-4 space-y-4 w-full max-w-2xl animate-pulse'>
      {/* User Info Skeleton */}
      <div className='flex items-center gap-3'>
        <div className='w-10 h-10 bg-gray-200 rounded-full'></div>
        <div className='space-y-2'>
          <div className='h-4 w-32 bg-gray-200 rounded'></div>
          <div className='h-3 w-24 bg-gray-200 rounded'></div>
        </div>
      </div>
      
      {/* Content Skeleton */}
      <div className='space-y-2'>
        <div className='h-4 w-full bg-gray-200 rounded'></div>
        <div className='h-4 w-3/4 bg-gray-200 rounded'></div>
        <div className='h-4 w-1/2 bg-gray-200 rounded'></div>
      </div>

      {/* Images Skeleton */}
      <div className='grid grid-cols-2 gap-2'>
        <div className='h-48 bg-gray-200 rounded-lg'></div>
        <div className='h-48 bg-gray-200 rounded-lg'></div>
      </div>

      {/* Actions Skeleton */}
      <div className='flex items-center gap-4 pt-2 border-t border-gray-300'>
        <div className='flex items-center gap-1'>
          <div className='w-4 h-4 bg-gray-200 rounded'></div>
          <div className='h-4 w-6 bg-gray-200 rounded'></div>
        </div>
        <div className='flex items-center gap-1'>
          <div className='w-4 h-4 bg-gray-200 rounded'></div>
          <div className='h-4 w-6 bg-gray-200 rounded'></div>
        </div>
        <div className='flex items-center gap-1'>
          <div className='w-4 h-4 bg-gray-200 rounded'></div>
          <div className='h-4 w-6 bg-gray-200 rounded'></div>
        </div>
      </div>
    </div>
  )
}

export default PostSkeleton
