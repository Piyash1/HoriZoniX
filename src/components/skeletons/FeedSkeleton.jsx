import React from 'react'

const FeedSkeleton = () => {
  return (
    <div className='min-h-screen bg-gradient-to-b from-slate-50 to-white p-6 animate-pulse'>
      <div className='max-w-6xl mx-auto'>
        {/* Header Skeleton */}
        <div className='mb-8'>
          <div className='h-8 w-32 bg-gray-200 rounded mb-2'></div>
          <div className='h-4 w-48 bg-gray-200 rounded'></div>
        </div>

        {/* Stories Skeleton */}
        <div className='bg-white rounded-xl shadow p-4 mb-6'>
          <div className='flex gap-4 overflow-x-auto'>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className='flex-shrink-0 text-center'>
                <div className='w-16 h-16 bg-gray-200 rounded-full mb-2'></div>
                <div className='h-3 w-12 bg-gray-200 rounded mx-auto'></div>
              </div>
            ))}
          </div>
        </div>

        {/* Posts Skeleton */}
        <div className='flex flex-col gap-6 items-center'>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className='bg-white rounded-xl shadow p-4 space-y-4 w-full max-w-2xl'>
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
          ))}
        </div>
      </div>
    </div>
  )
}

export default FeedSkeleton
