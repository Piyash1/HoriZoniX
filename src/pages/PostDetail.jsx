import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { BadgeCheck, Heart, MessageCircle, Share2, ArrowLeft, Trash2, MoreVertical } from 'lucide-react'
import moment from 'moment'
import { getPostById, listComments, createComment, toggleLike, sharePost, deletePost, getMe } from '../lib/api'
import toast from 'react-hot-toast'
import LoadingButton from '../components/LoadingButton'
import PostSkeleton from '../components/skeletons/PostSkeleton'

const PostDetail = () => {
  const { postId } = useParams()
  const navigate = useNavigate()
  
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)
  const [commentText, setCommentText] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)
  const [liking, setLiking] = useState(false)
  const [sharing, setSharing] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    fetchPostData()
    fetchCurrentUser()
  }, [postId])

  const fetchPostData = async () => {
    setLoading(true)
    try {
      const [postData, commentsData] = await Promise.all([
        getPostById(postId),
        listComments(postId)
      ])
      
      // Map post data to UI format
      const mappedPost = {
        _id: postData.id,
        user: {
          _id: postData.user.id,
          id: postData.user.id,
          full_name: postData.user.full_name,
          username: postData.user.username,
          profile_picture: postData.user.profile_picture,
        },
        content: postData.content,
        image_urls: postData.image_urls,
        likes_count: postData.likes_count || 0,
        comments_count: postData.comments_count || 0,
        shares_count: postData.shares_count || 0,
        liked_by_me: !!postData.liked_by_me,
        createdAt: postData.created_at,
      }
      
      setPost(mappedPost)
      setComments(commentsData)
    } catch (error) {
      console.error('Failed to fetch post data:', error)
      toast.error('Failed to load post')
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const fetchCurrentUser = async () => {
    try {
      const response = await getMe()
      setCurrentUser(response.user)
    } catch (error) {
      console.error('Failed to fetch current user:', error)
    }
  }

  const handleLike = async () => {
    if (liking) return
    setLiking(true)
    try {
      const res = await toggleLike(postId)
      setPost(prev => ({
        ...prev,
        liked_by_me: res.liked,
        likes_count: res.likes_count
      }))
    } catch (error) {
      toast.error('Failed to like post')
    } finally {
      setLiking(false)
    }
  }

  const handleShare = async () => {
    if (sharing) return
    setSharing(true)
    try {
      const res = await sharePost(postId)
      setPost(prev => ({
        ...prev,
        shares_count: res.shares_count
      }))
      toast.success('Post shared!')
    } catch (error) {
      toast.error('Failed to share post')
    } finally {
      setSharing(false)
    }
  }

  const handleAddComment = async () => {
    const text = commentText.trim()
    if (!text || submittingComment) return
    
    setSubmittingComment(true)
    try {
      const newComment = await createComment(postId, text)
      setComments(prev => [...prev, newComment])
      setPost(prev => ({
        ...prev,
        comments_count: prev.comments_count + 1
      }))
      setCommentText('')
      toast.success('Comment added!')
    } catch (error) {
      toast.error('Failed to add comment')
    } finally {
      setSubmittingComment(false)
    }
  }

  const handleDeletePost = async () => {
    if (deleting) return
    setDeleting(true)
    try {
      await deletePost(postId)
      toast.success('Post deleted successfully!')
      navigate('/')
    } catch (error) {
      toast.error('Failed to delete post')
    } finally {
      setDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  const isPostOwner = currentUser && post && currentUser.id === post.user.id

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-b from-slate-50 to-white p-6'>
        <div className='max-w-4xl mx-auto'>
          <PostSkeleton />
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className='min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-gray-900 mb-4'>Post not found</h2>
          <p className='text-gray-600 mb-6'>The post you're looking for doesn't exist or has been deleted.</p>
          <Link to='/' className='px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition'>
            Go Home
          </Link>
        </div>
      </div>
    )
  }

  const postWithHashtags = (post.content || '').replace(/(#\w+)/g, '<span class="text-indigo-600">$1</span>')

  return (
    <div className='bg-gradient-to-b from-slate-50 to-white'>
      <div className='max-w-4xl mx-auto p-6'>
        {/* Header */}
        <div className='flex items-center gap-4 mb-6'>
          <button
            onClick={() => navigate(-1)}
            className='p-2 hover:bg-gray-100 rounded-full transition-colors'
          >
            <ArrowLeft className='w-6 h-6' />
          </button>
          <h1 className='text-2xl font-bold text-gray-900'>Post Details</h1>
          {isPostOwner && (
            <div className='ml-auto relative'>
              <button
                onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
                className='p-2 hover:bg-gray-100 rounded-full transition-colors'
              >
                <MoreVertical className='w-5 h-5' />
              </button>
              {showDeleteConfirm && (
                <div className='absolute right-0 top-12 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-10'>
                  <button
                    onClick={handleDeletePost}
                    disabled={deleting}
                    className='flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition-colors'
                  >
                    <Trash2 className='w-4 h-4' />
                    {deleting ? 'Deleting...' : 'Delete Post'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Post Content */}
        <div className='bg-white rounded-xl shadow p-6 space-y-6'>
          {/* User Info */}
          <div className='flex items-center gap-3'>
            <img 
              src={post.user?.profile_picture || '/default-avatar.png'} 
              alt="" 
              className='w-12 h-12 rounded-full shadow object-cover' 
            />
            <div className='flex-1'>
              <div className='flex items-center space-x-1'>
                <span className='font-semibold'>{post.user?.full_name || post.user?.username}</span>
                <BadgeCheck className='w-4 h-4 text-blue-500' />
              </div>
              <div className='text-gray-500 text-sm'>
                @{post.user?.username} • {moment(post.createdAt).fromNow()}
              </div>
            </div>
          </div>
          
          {/* Content */}
          {post.content && (
            <div 
              className='text-gray-800 text-base whitespace-pre-line' 
              dangerouslySetInnerHTML={{__html: postWithHashtags}}
            />
          )}

          {/* Images */}
          {post.image_urls && post.image_urls.length > 0 && (
            <div className={`grid gap-4 ${post.image_urls.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
              {post.image_urls.map((img, index) => (
                <img 
                  key={index} 
                  src={img} 
                  className='w-full h-auto object-cover rounded-lg' 
                  alt="" 
                />
              ))}
            </div>
          )}

          {/* Actions */}
          <div className='flex items-center gap-6 text-gray-600 text-sm pt-4 border-t border-gray-200'>
            <div className='flex items-center gap-2'>
              <button
                onClick={handleLike}
                disabled={liking}
                className={`p-2 rounded-full transition-colors ${post.liked_by_me ? 'text-red-500 bg-red-50' : 'hover:bg-gray-100'}`}
              >
                <Heart className={`w-5 h-5 ${post.liked_by_me ? 'fill-current' : ''}`} />
              </button>
              <span className='font-medium'>{post.likes_count}</span>
              {liking && <span className='text-xs text-gray-400'>Liking...</span>}
            </div>
            
            <div className='flex items-center gap-2'>
              <MessageCircle className='w-5 h-5' />
              <span className='font-medium'>{post.comments_count}</span>
            </div>
            
            <div className='flex items-center gap-2'>
              <button
                onClick={handleShare}
                disabled={sharing}
                className='p-2 rounded-full hover:bg-gray-100 transition-colors'
              >
                <Share2 className='w-5 h-5' />
              </button>
              <span className='font-medium'>{post.shares_count}</span>
              {sharing && <span className='text-xs text-gray-400'>Sharing...</span>}
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className='mt-6 bg-white rounded-xl shadow p-6'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>Comments ({comments.length})</h3>
          
          {/* Add Comment */}
          <div className='flex items-center gap-3 mb-6 p-3 bg-gray-50 rounded-lg'>
            <img 
              src={currentUser?.profile_picture_url || '/default-avatar.png'} 
              alt="" 
              className='w-8 h-8 rounded-full object-cover' 
            />
            <input
              className='flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300'
              placeholder='Write a comment...'
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddComment() } }}
            />
            <LoadingButton
              onClick={handleAddComment}
              loading={submittingComment}
              loadingText='Posting...'
              disabled={!commentText.trim()}
              className='px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm'
            >
              Post
            </LoadingButton>
          </div>

          {/* Comments List */}
          <div className='space-y-4'>
            {comments.length === 0 ? (
              <div className='text-center py-8 text-gray-500'>
                <MessageCircle className='w-12 h-12 mx-auto mb-3 text-gray-300' />
                <p>No comments yet. Be the first to comment!</p>
              </div>
            ) : (
              comments.map(comment => (
                <div key={comment.id} className='flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50'>
                  <img 
                    src={comment.user?.profile_picture || '/default-avatar.png'} 
                    alt="" 
                    className='w-8 h-8 rounded-full object-cover' 
                  />
                  <div className='flex-1'>
                    <div className='flex items-center gap-2 mb-1'>
                      <span className='font-medium text-sm'>{comment.user?.full_name || comment.user?.username}</span>
                      <span className='text-xs text-gray-500'>
                        {moment(comment.created_at).fromNow()}
                      </span>
                    </div>
                    <p className='text-sm text-gray-800'>{comment.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostDetail
