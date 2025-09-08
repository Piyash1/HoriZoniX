import React from 'react'

const ConnectionsSkeleton = () => {
  return (
    <div className='min-h-screen bg-gradient-to-b from-slate-50 to-white p-6 animate-pulse'>
      <div className='max-w-6xl mx-auto'>
        {/* Header Skeleton */}
        <div className='mb-8'>
          <div className='h-8 w-48 bg-gray-200 rounded mb-2'></div>
          <div className='h-4 w-64 bg-gray-200 rounded'></div>
        </div>

        {/* Tabs Skeleton */}
        <div className='bg-white rounded-xl shadow p-1 flex max-w-md mx-auto mb-6'>
          <div className='flex-1 px-4 py-2 bg-gray-200 rounded-lg'></div>
          <div className='flex-1 px-4 py-2'></div>
          <div className='flex-1 px-4 py-2'></div>
          <div className='flex-1 px-4 py-2'></div>
        </div>

        {/* Users Grid Skeleton */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className='bg-white rounded-xl shadow p-6 space-y-4'>
              {/* User Info Skeleton */}
              <div className='flex items-center gap-4'>
                <div className='w-16 h-16 bg-gray-200 rounded-full'></div>
                <div className='space-y-2 flex-1'>
                  <div className='h-5 w-32 bg-gray-200 rounded'></div>
                  <div className='h-4 w-24 bg-gray-200 rounded'></div>
                  <div className='h-3 w-40 bg-gray-200 rounded'></div>
                </div>
              </div>
              
              {/* Bio Skeleton */}
              <div className='space-y-1'>
                <div className='h-3 w-full bg-gray-200 rounded'></div>
                <div className='h-3 w-3/4 bg-gray-200 rounded'></div>
              </div>

              {/* Button Skeleton */}
              <div className='h-10 w-full bg-gray-200 rounded'></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ConnectionsSkeleton
