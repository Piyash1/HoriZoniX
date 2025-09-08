import React from 'react'

const ProfileSkeleton = () => {
  return (
    <div className='relative h-full overflow-y-scroll bg-gray-50 p-6 animate-pulse'>
      <div className='max-w-3xl mx-auto'>
        {/* Profile Card Skeleton */}
        <div className='bg-white rounded-2xl shadow overflow-hidden'>
          {/* Cover Photo Skeleton */}
          <div className='h-40 md:h-56 bg-gray-200'></div>
          
          {/* Profile Info Skeleton */}
          <div className='relative py-4 px-6 md:px-8 bg-white'>
            <div className='flex flex-col md:flex-row items-start gap-6'>
              {/* Profile Picture Skeleton */}
              <div className='w-32 h-32 border-4 border-white shadow-lg absolute -top-16 rounded-full bg-gray-200'></div>

              <div className='w-full pt-16 md:pt-0 md:pl-36'>
                <div className='flex flex-col md:flex-row items-start justify-between'>
                  <div className='space-y-2'>
                    <div className='h-8 w-48 bg-gray-200 rounded'></div>
                    <div className='h-4 w-32 bg-gray-200 rounded'></div>
                  </div>
                  <div className='h-10 w-20 bg-gray-200 rounded-lg mt-4 md:mt-0'></div>
                </div>
                
                <div className='h-4 w-96 bg-gray-200 rounded mt-4'></div>

                <div className='flex flex-wrap items-center gap-x-6 gap-y-2 mt-4'>
                  <div className='h-4 w-24 bg-gray-200 rounded'></div>
                  <div className='h-4 w-32 bg-gray-200 rounded'></div>
                </div>

                <div className='flex items-center gap-6 mt-6 border-t border-gray-200 pt-4'>
                  <div className='h-6 w-16 bg-gray-200 rounded'></div>
                  <div className='h-6 w-20 bg-gray-200 rounded'></div>
                  <div className='h-6 w-20 bg-gray-200 rounded'></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div className='mt-6'>
          <div className='bg-white rounded-xl shadow p-1 flex max-w-md mx-auto'>
            <div className='flex-1 px-4 py-2 bg-gray-200 rounded-lg'></div>
            <div className='flex-1 px-4 py-2'></div>
            <div className='flex-1 px-4 py-2'></div>
          </div>
        </div>

        {/* Posts Skeleton */}
        <div className='mt-6 flex flex-col gap-6 items-center'>
          {[1, 2, 3].map((i) => (
            <div key={i} className='bg-white rounded-xl shadow p-4 space-y-4 w-full max-w-2xl'>
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 bg-gray-200 rounded-full'></div>
                <div className='space-y-2'>
                  <div className='h-4 w-32 bg-gray-200 rounded'></div>
                  <div className='h-3 w-24 bg-gray-200 rounded'></div>
                </div>
              </div>
              <div className='space-y-2'>
                <div className='h-4 w-full bg-gray-200 rounded'></div>
                <div className='h-4 w-3/4 bg-gray-200 rounded'></div>
              </div>
              <div className='h-48 bg-gray-200 rounded-lg'></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProfileSkeleton
