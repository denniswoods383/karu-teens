import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabase';

const PostsManagement = () => {
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showComments, setShowComments] = useState<string | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const subscriptionRef = useRef<any>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.email !== 'denniswood383@gmail.com') {
        router.push('/');
        return;
      }
      fetchPosts();
      
      // Set up real-time subscriptions
      subscriptionRef.current = supabase
        .channel('admin-posts-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => {
          fetchPosts();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'likes' }, () => {
          fetchPosts();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'comments' }, () => {
          fetchPosts();
        })
        .subscribe();
    };
    
    checkAdmin();
    
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [router]);

  const fetchPosts = async () => {
    try {
      // Get posts first
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (postsError) {
        console.error('Posts fetch error:', postsError);
        setPosts([]);
        setLoading(false);
        return;
      }
      
      // Get unique user IDs
      const userIds = [...new Set(postsData?.map(post => post.user_id) || [])];
      
      // Get profiles for these users
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url')
        .in('id', userIds);
      
      if (profilesError) {
        console.error('Profiles fetch error:', profilesError);
      }
      
      // Get real comment counts for all posts
      const postIds = postsData?.map(post => post.id) || [];
      const { data: commentsCount } = await supabase
        .from('comments')
        .select('post_id')
        .in('post_id', postIds);
      
      // Get real likes counts for all posts
      const { data: likesCount } = await supabase
        .from('likes')
        .select('post_id')
        .in('post_id', postIds);
      
      // Count comments and likes per post
      const commentCounts = commentsCount?.reduce((acc, comment) => {
        acc[comment.post_id] = (acc[comment.post_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};
      
      const likesCounts = likesCount?.reduce((acc, like) => {
        acc[like.post_id] = (acc[like.post_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};
      
      // Combine posts with profile data and real counts
      const postsWithProfiles = postsData?.map(post => ({
        ...post,
        profile: profilesData?.find(profile => profile.id === post.user_id) || null,
        real_comments_count: commentCounts[post.id] || 0,
        real_likes_count: likesCounts[post.id] || 0
      })) || [];
      
      setPosts(postsWithProfiles);
    } catch (error) {
      console.error('Fetch error:', error);
      setPosts([]);
    }
    setLoading(false);
  };

  const viewComments = async (postId: string) => {
    if (showComments === postId) {
      setShowComments(null);
      return;
    }
    
    try {
      const { data: commentsData, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: false });
      
      if (!error) {
        // Get user profiles for comments
        const userIds = [...new Set(commentsData?.map(comment => comment.user_id) || [])];
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, username, full_name')
          .in('id', userIds);
        
        const commentsWithProfiles = commentsData?.map(comment => ({
          ...comment,
          profile: profilesData?.find(profile => profile.id === comment.user_id) || null
        })) || [];
        
        setComments(commentsWithProfiles);
        setShowComments(postId);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const deletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to permanently delete this post from everywhere?')) return;
    
    try {
      // Get post data first
      const { data: post } = await supabase
        .from('posts')
        .select('*')
        .eq('id', postId)
        .single();
      
      if (!post) {
        alert('Post not found');
        return;
      }
      
      // Call secure API endpoint for deletion
      const response = await fetch('/api/admin-delete-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          postId: postId,
          imageUrl: post.image_url 
        })
      });
      
      const result = await response.json();
      
      if (response.ok) {
        // Send message from "admin" to user about deleted post
        const { data: adminMessage, error: messageError } = await supabase
          .from('messages')
          .insert({
            sender_id: null, // null indicates system/admin message
            receiver_id: post.user_id,
            content: 'Your post has been deleted by an administrator due to violation of system policy. Please review our community guidelines to avoid future violations.'
          })
          .select();
        

        
        alert('Post permanently deleted and user notified via admin message');
        fetchPosts();
      } else {
        alert(`Failed to delete post: ${result.error}`);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete post');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Posts Management</h1>
            <button
              onClick={() => router.push('/mhesh')}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Back to Admin
            </button>
          </div>

          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {post.profile?.avatar_url ? (
                      <img 
                        src={post.profile.avatar_url} 
                        alt={post.profile.username}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {post.profile?.username?.[0]?.toUpperCase() || 'U'}
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900">
                          {post.profile?.full_name || post.profile?.username || 'Unknown User'}
                        </h3>
                        <span className="text-gray-500">@{post.profile?.username || 'unknown'}</span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {new Date(post.created_at).toLocaleDateString()} at {new Date(post.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => window.location.href = `/profile/${post.user_id}`}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => deletePost(post.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                {post.content && (
                  <p className="text-gray-800 mb-4 whitespace-pre-wrap">{post.content}</p>
                )}
                
                {post.image_url && (
                  <div className="mb-4">
                    {post.image_url.includes('video') ? (
                      <video 
                        src={post.image_url} 
                        controls 
                        className="w-full max-w-md rounded-lg"
                      />
                    ) : (
                      <img 
                        src={post.image_url} 
                        alt="Post media" 
                        className="w-full max-w-md rounded-lg object-cover"
                      />
                    )}
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <span className="flex items-center space-x-1">
                      <span>❤️</span>
                      <span>{post.real_likes_count} likes</span>
                    </span>
                    <button
                      onClick={() => viewComments(post.id)}
                      className="flex items-center space-x-1 hover:text-blue-600"
                    >
                      <span>💬</span>
                      <span>{post.real_comments_count} comments</span>
                    </button>
                    <span className="text-xs">ID: {post.id.slice(0, 8)}...</span>
                  </div>
                </div>
                
                {showComments === post.id && (
                  <div className="mt-4 bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold">Comments ({comments.length})</h4>
                      <button
                        onClick={() => setShowComments(null)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {comments.map((comment) => (
                        <div key={comment.id} className="bg-white p-3 rounded border">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-sm">{comment.profile?.username || 'Unknown'}</span>
                            <span className="text-xs text-gray-500">
                              {new Date(comment.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-800">{comment.content}</p>
                        </div>
                      ))}
                      {comments.length === 0 && (
                        <p className="text-gray-500 text-center py-4">No comments yet</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostsManagement;