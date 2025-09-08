import React, { useEffect, useState } from 'react'
import { assets, dummyStoriesData } from '../assets/assets'
import Loading from '../components/Loading'
import StoriesBar from '../components/StoriesBar'
import StoryModel from '../components/StoryModel'
import PostCard from '../components/PostCard'
import { fetchFeeds, createStory } from '../lib/api'
import RecentMessages from '../components/RecentMessages'
import FeedSkeleton from '../components/skeletons/FeedSkeleton'

const Feed = () => {

  const [feeds, setFeeds] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModel, setShowModel] = useState(false)
  const [stories, setStories] = useState([])

  const fetchFeedsData = async () => {
    try {
      const data = await fetchFeeds()
      
      // Map API posts to UI shape expected by PostCard
      const mappedPosts = data.posts.map(p => ({
        _id: p.id,
        user: {
          _id: p.user.id,
          id: p.user.id,
          full_name: p.user.full_name,
          username: p.user.username,
          profile_picture: p.user.profile_picture,
        },
        content: p.content,
        image_urls: p.image_urls,
        likes_count: p.likes_count || 0,
        comments_count: p.comments_count || 0,
        shares_count: p.shares_count || 0,
        liked_by_me: !!p.liked_by_me,
        createdAt: p.created_at,
      }))
      setFeeds(mappedPosts)

      // Map API stories to UI shape expected by StoriesBar
      const mappedStories = data.stories.map(s => ({
        _id: s.id,
        user: {
          _id: s.user.id,
          profile_picture: s.user.profile_picture,
          full_name: s.user.full_name,
          username: s.user.username,
        },
        content: s.content || '',
        media_type: s.media_type,
        media_url: s.media_url,
        background_color: s.background_color,
        createdAt: s.created_at,
      }))
      setStories(mappedStories)
      
      setLoading(false)
    } catch (error) {
      console.error('Error fetching feeds:', error)
      setLoading(false)
    }
  }

  const fetchStories = async () => {
    try {
      const data = await fetchFeeds()
      const mapped = data.stories.map(s => ({
        _id: s.id,
        user: {
          _id: s.user.id,
          profile_picture: s.user.profile_picture,
          full_name: s.user.full_name,
          username: s.user.username,
        },
        content: s.content || '',
        media_type: s.media_type,
        media_url: s.media_url,
        background_color: s.background_color,
        createdAt: s.created_at,
      }))
      setStories(mapped)
    } catch (error) {
      console.error('Error fetching stories:', error)
    }
  }

  useEffect(()=>{
    fetchFeedsData()
  },[])

  if (loading) {
    return <FeedSkeleton />
  }

  return (
    <div className='py-10 xl:py-5 flex items-start justify-center xl:gap-8'>
      {/* Stories and post list */}
      <div>
        {!showModel && (
          <StoriesBar setShowModel={setShowModel} stories={stories} fetchStories={fetchStories} />
        )}
        <div className='p-4 space-y-6'>
          {feeds.map((post)=>(
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </div>
      {/* Right Sidebar */}
      <div className='max-xl:hidden sticky top-0'>
        <div className='max-w-xs bg-white text-xs p-4 rounded-md inline-flex flex-col gap-2 shadow'>
          <h3 className='text-slate-800 font-semibold'>Sponsor</h3>
          <img src={assets.sponsored_img} className='w-75 h-50 rounded-md' alt="" />
          <p className='text-slate-600'>Asteroid Orbit</p>
          <p className='text-slate-400'>Discover, shop, and save on thousands of trending items daily.</p>
        </div>
        <RecentMessages />
      </div>
      {/* StoryModel Modal */}
      {showModel && <StoryModel setShowModel={setShowModel} fetchStories={fetchStories} />}
    </div>
  )
}

export default Feed