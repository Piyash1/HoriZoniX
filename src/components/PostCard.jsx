import { BadgeCheck, Heart, MessageCircle, Share2 } from 'lucide-react'
import React, { useState } from 'react'
import moment from 'moment'
import { dummyUserData } from '../assets/assets'
import { useNavigate, Link } from 'react-router-dom'
import { toggleLike, sharePost, listComments, createComment } from '../lib/api'

const PostCard = ({post}) => {

    const postWithHashtags = (post.content || '').replace(/(#\w+)/g, '<span class="text-indigo-600">$1</span>')
    const [likesCount, setLikesCount] = useState(post.likes_count || 0)
    const [liked, setLiked] = useState(!!post.liked_by_me)
    const [commentsCount, setCommentsCount] = useState(post.comments_count || 0)
    const [sharesCount, setSharesCount] = useState(post.shares_count || 0)
    const [showComments, setShowComments] = useState(false)
    const [comments, setComments] = useState([])
    const [loadingComments, setLoadingComments] = useState(false)
    const [commentText, setCommentText] = useState('')
    const [submittingComment, setSubmittingComment] = useState(false)
    const [liking, setLiking] = useState(false)
    const [sharing, setSharing] = useState(false)
    const currentUser = dummyUserData

    const handleLike = async ()=> {
      if (liking) return
      setLiking(true)
      try {
        console.log('Attempting to like post:', post._id)
        const res = await toggleLike(post._id)
        console.log('Like response:', res)
        setLiked(res.liked)
        setLikesCount(res.likes_count)
      } catch (e) {
        console.error('Like error:', e)
      }
      finally {
        setLiking(false)
      }
    }

    const handleShare = async ()=> {
      if (sharing) return
      setSharing(true)
      try {
        const res = await sharePost(post._id)
        setSharesCount(res.shares_count)
      } catch (e) {}
      finally {
        setSharing(false)
      }
    }

    const toggleComments = async () => {
      const next = !showComments
      setShowComments(next)
      if (next && comments.length === 0 && !loadingComments) {
        setLoadingComments(true)
        try {
          const data = await listComments(post._id)
          setComments(data)
        } catch (e) {
          setComments([])
        } finally {
          setLoadingComments(false)
        }
      }
    }

    const handleAddComment = async () => {
      const text = commentText.trim()
      if (!text) return
      setSubmittingComment(true)
      try {
        const newComment = await createComment(post._id, text)
        setComments(prev => [...prev, newComment])
        setCommentsCount(prev => prev + 1)
        setCommentText('')
        if (!showComments) setShowComments(true)
      } catch (e) {
        // noop
      } finally {
        setSubmittingComment(false)
      }
    }

    const navigate = useNavigate()

  return (
    <div className='bg-white rounded-xl shadow p-4 space-y-4 w-full max-w-2xl'>
        {/* User Info */}
        <div onClick={()=> navigate('/profile/' + (post.user?.id || post.user?._id))} className='inline-flex items-center gap-3 cursor-pointer'>
            <img src={post.user?.profile_picture} alt="" className='w-10 h-10 rounded-full shadow' />
            <div>
                <div className='flex items-center space-x-1'>
                    <span>{post.user?.full_name || post.user?.username}</span>
                    <BadgeCheck className='w-4 h-4 text-blue-500' />
                </div>
                <div className='text-gray-500 text-sm'>
                    @{post.user?.user_name || post.user?.username} ● {post.createdAt ? moment(post.createdAt).fromNow() : ''}
                </div>
            </div>
        </div>
        
        {/* Content - Clickable to go to post detail */}
        <Link to={`/post/${post._id}`} className='block hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors'>
          {post.content && <div className='text-gray-800 text-sm whitespace-pre-line' dangerouslySetInnerHTML={{__html: postWithHashtags}}/>}
        </Link>

        {/* Images - Clickable to go to post detail */}
        <Link to={`/post/${post._id}`} className='block'>
          <div className='grid grid-cols-2 gap-2'>
              {(post.image_urls || []).map((img, index)=>(
                  <img src={img} key={index} className={`w-full h-48 object-cover rounded-lg ${Array.isArray(post.image_urls) && post.image_urls.length === 1 ? 'col-span-2 h-auto' : ''}`} alt="" />
              ))}
          </div>
        </Link>

        {/* Actions */}
        <div className='flex items-center gap-4 text-gray-600 text-sm pt-2 border-t border-gray-300'>
            <div className='flex items-center gap-1'>
                <Heart className={`w-4 h-4 cursor-pointer ${liked ? 'text-red-500 fill-red-500' : ''} ${liking ? 'opacity-50' : ''}`} onClick={handleLike} />
                <span>{likesCount}</span>
                {liking && <span className='text-xs text-gray-400'>Liking...</span>}
            </div>
            <div className='flex items-center gap-1'>
                <MessageCircle className='w-4 h-4 cursor-pointer' onClick={toggleComments} />
                <span>{commentsCount}</span>
            </div>
            <div className='flex items-center gap-1'>
                <Share2 className={`w-4 h-4 cursor-pointer ${sharing ? 'opacity-50' : ''}`} onClick={handleShare} />
                <span>{sharesCount}</span>
                {sharing && <span className='text-xs text-gray-400'>Sharing...</span>}
            </div>
        </div>

        {showComments && (
          <div className='pt-3 border-t border-gray-200 space-y-3'>
            {loadingComments ? (
              <p className='text-xs text-gray-500'>Loading comments…</p>
            ) : (
              <div className='space-y-2 max-h-56 overflow-y-auto pr-1'>
                {comments.length === 0 && (
                  <p className='text-xs text-gray-500'>No comments yet. Be the first!</p>
                )}
                {comments.map(c => (
                  <div key={c.id} className='flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50'>
                    <div className='w-7 h-7 rounded-full overflow-hidden bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-semibold mt-0.5'>
                      {c.user?.profile_picture ? (
                        <img src={c.user.profile_picture} className='w-full h-full object-cover' />
                      ) : (
                        <span>{(c.user?.full_name || c.user?.username || '?').slice(0,2).toUpperCase()}</span>
                      )}
                    </div>
                    <div className='flex-1'>
                      <p className='text-[13px]'>
                        <span className='font-medium text-slate-800'>{c.user?.full_name || c.user?.username}</span>
                        <span className='text-slate-700'> {c.text}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className='flex items-center gap-2 p-1.5 bg-gray-50 rounded-lg'>
              <input
                className='flex-1 border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 bg-white'
                placeholder='Write a comment…'
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddComment() } }}
              />
              <button
                disabled={submittingComment || !commentText.trim()}
                onClick={handleAddComment}
                className='text-xs px-3 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60 flex items-center gap-1'
              >
                {submittingComment && (
                  <div className='animate-spin rounded-full h-3 w-3 border-b-2 border-white'></div>
                )}
                {submittingComment ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>
        )}

    </div>
  )
}

export default PostCard