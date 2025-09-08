import React from 'react'

const CreatePostSkeleton = () => {
  return (
    <div className='min-h-screen bg-gradient-to-b from-slate-50 to-white animate-pulse'>
      <div className='max-w-6xl mx-auto p-6'>
        {/* Title Skeleton */}
        <div className='mb-8'>
          <div className='h-8 w-48 bg-gray-200 rounded mb-2'></div>
          <div className='h-4 w-64 bg-gray-200 rounded'></div>
        </div>

        {/* Form Skeleton */}
        <div className='max-w-xl bg-white p-4 sm:p-8 rounded-xl shadow-md space-y-4'>
          {/* User Info Skeleton */}
          <div className='flex items-center gap-3'>
            <div className='w-12 h-12 bg-gray-200 rounded-full'></div>
            <div className='space-y-2'>
              <div className='h-5 w-32 bg-gray-200 rounded'></div>
              <div className='h-3 w-20 bg-gray-200 rounded'></div>
            </div>
          </div>

          {/* Text Area Skeleton */}
          <div className='h-20 w-full bg-gray-200 rounded'></div>

          {/* Bottom Bar Skeleton */}
          <div className='flex items-center justify-between pt-3 border-t border-gray-300'>
            <div className='w-6 h-6 bg-gray-200 rounded'></div>
            <div className='h-8 w-24 bg-gray-200 rounded'></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePostSkeleton
