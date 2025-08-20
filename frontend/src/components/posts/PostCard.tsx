import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useSupabase';
import { getRelativeTime } from '../../utils/timeUtils';
import { Post } from '../../types/post';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [authorProfile, setAuthorProfile] = useState<any>(null);

  useEffect(() => {
    if (user) {
      checkLikeStatus();
      loadLikesCount();
    }
    loadAuthorProfile();
  }, [post.id, user]);

  const loadAuthorProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, full_name, avatar_url')
        .eq('id', post.user_id)
        .single();
      
      console.log('Loading profile for user_id:', post.user_id);
      console.log('Profile data found:', data);
      
      if (data) {
        setAuthorProfile(data);
      } else {
        // Fallback - create basic profile info
        setAuthorProfile({
          username: 'student',
          full_name: 'Student',
          avatar_url: null
        });
      }
    } catch (error) {
      console.error('Failed to load author profile:', error);
      setAuthorProfile({
        username: 'student',
        full_name: 'Student',
        avatar_url: null
      });
    }
  };

  const checkLikeStatus = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('likes')
        .select('id')
        .eq('post_id', post.id)
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') {
        console.log('Like check error:', error.message);
        setIsLiked(false);
        return;
      }
      
      setIsLiked(!!data);
    } catch (error) {
      console.log('Like check failed:', error);
      setIsLiked(false);
    }
  };

  const loadLikesCount = async () => {
    try {
      const { count, error } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', post.id);
      
      if (error) {
        console.log('Likes count error:', error.message);
        setLikesCount(post.likes_count || 0);
        return;
      }
      
      setLikesCount(count || 0);
    } catch (error) {
      console.log('Likes count failed:', error);
      setLikesCount(post.likes_count || 0);
    }
  };

  const loadComments = async () => {
    if (!showComments) {
      try {
        const { data } = await supabase
          .from('comments')
          .select('*')
          .eq('post_id', post.id)
          .order('created_at', { ascending: true });
        
        setComments(data || []);
      } catch (error) {
        console.error('Failed to load comments:', error);
      }
    }
    setShowComments(!showComments);
  };

  const addComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          post_id: post.id,
          user_id: user.id,
          content: newComment.trim()
        })
        .select()
        .single();

      if (!error && data) {
        setComments([...comments, data]);
        setNewComment('');
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) return;

    try {
      if (isLiked) {
        // Unlike
        await supabase
          .from('likes')
          .delete()
          .eq('post_id', post.id)
          .eq('user_id', user.id);
        
        setIsLiked(false);
        setLikesCount(prev => prev - 1);
      } else {
        // Like
        await supabase
          .from('likes')
          .insert({
            post_id: post.id,
            user_id: user.id
          });
        
        setIsLiked(true);
        setLikesCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const handleReport = async () => {
    alert('Post reported successfully');
    setShowDropdown(false);
  };

  const handleHide = () => {
    setIsHidden(true);
    setShowDropdown(false);
  };

  const handleFollow = async () => {
    setIsFollowing(true);
    setShowDropdown(false);
  };

  if (isHidden) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-blue-100 mb-6 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Header */}
      <div className="p-4">
        <div className="flex items-center">
          <button
            onClick={() => window.location.href = `/profile/${post.user_id}`}
            className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg ring-4 ring-blue-100 overflow-hidden hover:ring-6 hover:ring-blue-200 transition-all duration-300 cursor-pointer"
          >
            {authorProfile?.avatar_url ? (
              <img src={authorProfile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              '🎓'
            )}
          </button>
          <div className="ml-3 flex-1">
            <div className="flex items-center space-x-1">
              <button
                onClick={() => window.location.href = `/profile/${post.user_id}`}
                className="text-left"
              >
                <h3 className="font-bold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors text-lg">
                  {authorProfile?.full_name || authorProfile?.username || 'Student'}
                </h3>
                {authorProfile?.username && (
                  <p className="text-sm text-blue-500 font-medium hover:text-blue-700 transition-colors">@{authorProfile.username}</p>
                )}
              </button>
            </div>
            <div className="flex items-center text-sm text-blue-500 font-medium">
              <span>⏰ {getRelativeTime(post.created_at)}</span>
              <span className="mx-2">•</span>
              <span>🌍 Public</span>
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
      <div className="px-6 pb-4">
        <p className="text-gray-800 text-lg leading-relaxed font-medium">{post.content}</p>
      </div>
      
      {/* Media */}
      {post.image_url && (
        <div className="px-6 pb-4">
          {post.image_url.includes('.mp4') || post.image_url.includes('.webm') || post.image_url.includes('video') ? (
            <video 
              src={post.image_url}
              controls 
              className="w-full max-h-96 rounded-2xl shadow-lg border-2 border-blue-100"
              preload="metadata"
            />
          ) : (
            <img 
              src={post.image_url}
              alt="Post media"
              className="w-full max-h-96 object-cover rounded-2xl shadow-lg border-2 border-blue-100"
            />
          )}
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
      <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-gray-50">
        <div className="flex items-center justify-between gap-2">
          <button 
            onClick={handleLike}
            className={`group flex items-center justify-center px-4 py-3 rounded-full flex-1 transition-all duration-300 transform hover:scale-105 font-semibold border-2 ${
              isLiked 
                ? 'text-red-500 bg-red-50 border-red-200 shadow-lg shadow-red-100' 
                : 'text-gray-600 bg-white border-gray-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200 shadow-md'
            }`}
          >
            <span className={`text-xl mr-2 transition-transform duration-300 ${
              isLiked ? 'animate-pulse' : 'group-hover:scale-125'
            }`}>
              {isLiked ? '❤️' : '🤍'}
            </span>
            <span className="text-sm">{likesCount > 0 ? likesCount : 'Like'}</span>
          </button>
          
          <button 
            onClick={loadComments}
            className="group flex items-center justify-center px-4 py-3 rounded-full flex-1 text-gray-600 bg-white border-2 border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all duration-300 transform hover:scale-105 font-semibold shadow-md mx-1"
          >
            <span className="text-xl mr-2 transition-transform duration-300 group-hover:scale-125">💬</span>
            <span className="text-sm">Comment</span>
          </button>
          
          <button className="group flex items-center justify-center px-4 py-3 rounded-full flex-1 text-gray-600 bg-white border-2 border-gray-200 hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-all duration-300 transform hover:scale-105 font-semibold shadow-md">
            <span className="text-xl mr-2 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12">📤</span>
            <span className="text-sm">Share</span>
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
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                    🎓
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-100 rounded-2xl px-3 py-2">
                      <p className="font-semibold text-sm">Student</p>
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