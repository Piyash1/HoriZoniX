import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Loading from '../components/Loading'
import { useEffect } from 'react'
import UserProfileInfo from '../components/UserProfileInfo'
import PostCard from '../components/PostCard'
import moment from 'moment'
import ProfileModel from '../components/ProfileModel'
import { getProfile, getProfileById, listPosts } from '../lib/api'
import ProfileSkeleton from '../components/skeletons/ProfileSkeleton'

const Profile = () => {

  const {profileId} = useParams()
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [activeTab, setActiveTab] = useState('posts')
  const [showEdit, setShowEdit] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchUser = async () => {
    setLoading(true)
    try {
      const data = profileId ? await getProfileById(profileId) : await getProfile()
      const u = data
      // Map backend fields to UI expectations
      setUser({
        id: u.id,
        full_name: `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.username,
        username: u.username,
        bio: u.bio,
        profile_picture: u.profile_picture_url || u.profile_picture,
        cover_photo: u.cover_photo_url || u.cover_photo,
        location: u.location || '',
        followers: Array(u.followers_count || 0).fill(0),
        following: Array(u.following_count || 0).fill(0),
        createdAt: u.created_at,
        is_verified: u.is_email_verified,
      })
      // Fetch user's posts and map to UI shape
      const allPosts = await listPosts()
      const mapped = allPosts.map(p => ({
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
      const onlyUserPosts = mapped.filter(p => p.user.id === u.id)
      setPosts(onlyUserPosts)
    } catch (e) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [profileId])

  if (loading) {
    return <ProfileSkeleton />
  }

  if (!user) {
    return <Loading />
  }

  return (
    <div className='relative bg-gray-50 p-6'>
      <div className='max-w-3xl mx-auto'>
        {/* Profile Card */}
        <div className='bg-white rounded-2xl shadow overflow-hidden'>
          {/* Cover Photo */}
          <div className='h-40 md:h-56 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200'>
            { user.cover_photo && <img src={user.cover_photo} alt="" className='w-full h-full object-cover' /> }
          </div>
          {/* Profile Info */}
          <UserProfileInfo user={user} posts={posts} profileId={profileId} setShowEdit={setShowEdit} />
        </div>

        {/* Tabs */}
        <div className='mt-6'>
          <div className='bg-white rounded-xl shadow p-1 flex max-w-md mx-auto'>
            {["posts", "media", "likes"].map((tab)=>(
              <button key={tab} onClick={()=> setActiveTab(tab)} className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${activeTab === tab ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          {/* Posts */}
          {activeTab === 'posts' && (
            <div className='mt-6 flex flex-col gap-6 items-center'>
              {posts.map((post) => <PostCard key={post._id} post={post} />)}
            </div>
          )}

          {/* Media */}
          {activeTab === 'media' && (
            <div className='flex flex-wrap mt-6 max-w-6xl'>
              {posts
                .filter(post => (post.image_urls || []).length > 0)
                .map(post => (
                  <React.Fragment key={post._id || post.id}>
                    {post.image_urls.map((image, index) => (
                      <Link target='_blank' to={image} key={`${post._id || post.id}-${index}`} className='relative group'>
                        <img src={image} className='w-64 aspect-video object-cover' alt="" />
                        <p className='absolute bottom-0 right-0 text-xs p-1 px-3 backdrop-blur-xl text-white opacity-0 group-hover:opacity-100 transition duration-300'>Posted {moment(post.createdAt).fromNow()}</p>
                      </Link>
                    ))}
                  </React.Fragment>
                ))}
            </div>
          )}
        </div>
      </div>
      {/* Edit Profile Modal */}
      {showEdit && <ProfileModel setShowEdit={setShowEdit} onProfileUpdate={fetchUser} />}
    </div>
  )
}

export default Profile