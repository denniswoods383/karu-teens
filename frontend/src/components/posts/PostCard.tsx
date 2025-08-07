import { useState, useEffect } from 'react';
import { Post, Comment } from '../../types/post';
import ProfilePhoto from '../user/ProfilePhoto';
import MediaDisplay from './MediaDisplay';
import { getRelativeTime } from '../../utils/timeUtils';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    checkLikeStatus();
  }, [post.id]);

  const checkLikeStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://10.0.0.122:8001/api/v1/posts/${post.id}/like-status`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setIsLiked(data.is_liked);
      }
    } catch (error) {
      console.error('Failed to check like status');
    }
  };

  const loadComments = async () => {
    if (!showComments) {
      try {
        const response = await fetch(`http://10.0.0.122:8001/api/v1/posts/${post.id}/comments`);
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error('Failed to load comments');
      }
    }
    setShowComments(!showComments);
  };

  const addComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://10.0.0.122:8001/api/v1/posts/${post.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: newComment, post_id: post.id })
      });
      const data = await response.json();
      setComments([...comments, data]);
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    console.log('Like button clicked for post:', post.id);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://10.0.0.122:8001/api/v1/posts/${post.id}/like`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Response data:', data);
        setIsLiked(data.is_liked);
        setLikesCount(data.likes_count);
      } else {
        const error = await response.text();
        console.error('API error:', error);
      }
    } catch (error) {
      console.error('Failed to like/unlike post:', error);
    }
  };

  const handleReport = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://10.0.0.122:8001/api/v1/posts/${post.id}/report`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      alert('Post reported successfully');
      setShowDropdown(false);
    } catch (error) {
      console.error('Failed to report post');
    }
  };

  const handleHide = () => {
    setIsHidden(true);
    setShowDropdown(false);
  };

  const handleFollow = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://10.0.0.122:8001/api/v1/social/follow/${post.author.id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        setIsFollowing(true);
        setShowDropdown(false);
      }
    } catch (error) {
      console.error('Failed to follow user');
    }
  };

  if (isHidden) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
      {/* Header */}
      <div className="p-4">
        <div className="flex items-center">
          <ProfilePhoto 
            userId={post.author.id}
            username={post.author.username}
            profilePhoto={post.author.profile_photo}
            size="md"
            showBadges={true}
          />
          <div className="ml-3 flex-1">
            <div className="flex items-center space-x-1">
              <h3 className="font-semibold text-gray-900 hover:underline cursor-pointer">
                {post.author.full_name || post.author.username}
              </h3>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <span>{getRelativeTime(post.created_at)}</span>
              <span className="mx-1">·</span>
              <span>🌐</span>
            </div>
          </div>
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="text-gray-400 hover:bg-gray-100 rounded-full p-2"
            >
              •••
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <button
                  onClick={handleReport}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600 rounded-t-lg"
                >
                  🚨 Report Post
                </button>
                <button
                  onClick={handleHide}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700"
                >
                  🙈 Hide Post
                </button>
                <button
                  onClick={handleFollow}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-blue-600 rounded-b-lg"
                  disabled={isFollowing}
                >
                  {isFollowing ? '✅ Following' : '👤 Follow User'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-gray-900 text-base leading-relaxed">{post.content}</p>
      </div>
      
      {/* Media */}
      {post.image_url && (
        <div className="px-4 pb-3">
          <MediaDisplay 
            mediaUrl={post.image_url} 
            className="w-full max-h-96 object-cover"
          />
        </div>
      )}
      
      {/* Reactions Summary */}
      {(likesCount > 0 || post.comments_count > 0) && (
        <div className="px-4 py-2 border-b border-gray-100">
          <div className="flex items-center justify-between text-sm text-gray-500">
            {likesCount > 0 && (
              <div className="flex items-center space-x-1">
                <div className="flex -space-x-1">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">👍</span>
                  </div>
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">❤️</span>
                  </div>
                </div>
                <span>{likesCount}</span>
              </div>
            )}
            {post.comments_count > 0 && (
              <button 
                onClick={loadComments}
                className="hover:underline"
              >
                {post.comments_count} comment{post.comments_count !== 1 ? 's' : ''}
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="px-4 py-2">
        <div className="flex items-center justify-between">
          <button 
            onClick={handleLike}
            className={`flex flex-col items-center px-4 py-2 rounded-lg hover:bg-gray-100 flex-1 transition-all duration-200 transform hover:scale-105 ${
              isLiked ? 'text-red-600 bg-red-50' : 'text-gray-600'
            }`}
          >
            {post.image_url && (post.image_url.includes('.mp4') || post.image_url.includes('.webm')) ? (
              <img src="/ui/like_video.jpeg" alt="Like" className="w-6 h-6 mb-1" />
            ) : (
              <img src="/ui/like_post.jpeg" alt="Like" className="w-6 h-6 mb-1" />
            )}
            <span className="text-xs font-medium">{isLiked ? 'Liked' : 'Like'}</span>
          </button>
          
          <button 
            onClick={loadComments}
            className="flex flex-col items-center px-4 py-2 rounded-lg hover:bg-gray-100 flex-1 text-gray-600 transition-colors"
          >
            {post.image_url && (post.image_url.includes('.mp4') || post.image_url.includes('.webm')) ? (
              <img src="/ui/comment_on_video.jpeg" alt="Comment" className="w-6 h-6 mb-1" />
            ) : (
              <img src="/ui/coment.jpeg" alt="Comment" className="w-6 h-6 mb-1" />
            )}
            <span className="text-xs font-medium">Comment</span>
          </button>
          
          <button className="flex flex-col items-center px-4 py-2 rounded-lg hover:bg-gray-100 flex-1 text-gray-600 transition-colors">
            <img src="/ui/share.jpeg" alt="Share" className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Share</span>
          </button>
        </div>
      </div>
      
      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-gray-100">
          <form onSubmit={addComment} className="p-4 border-b border-gray-100">
            <div className="flex space-x-3">
              <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm">
                U
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="w-full px-3 py-2 bg-gray-100 rounded-full focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </form>
          
          <div className="max-h-96 overflow-y-auto">
            {comments.map((comment) => (
              <div key={comment.id} className="p-4 hover:bg-gray-50">
                <div className="flex space-x-3">
                  <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm">
                    {comment.author.username[0].toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-100 rounded-2xl px-3 py-2">
                      <p className="font-semibold text-sm">{comment.author.username}</p>
                      <p className="text-gray-900">{comment.content}</p>
                    </div>
                    <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                      <button className="hover:underline">Like</button>
                      <button className="hover:underline">Reply</button>
                      <span>{new Date(comment.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}