import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import PostCard from './PostCard';

export default function PostFeed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (!error) {
        // Filter out deleted posts
        const activePosts = (data || []).filter(post => {
          try {
            const attachments = JSON.parse(post.attachments || '{}');
            console.log('Post attachments:', post.id, attachments);
            return !attachments.deleted;
          } catch {
            return true; // If can't parse, assume not deleted
          }
        });
        console.log('Total posts:', data?.length, 'Active posts:', activePosts.length);
        setPosts(activePosts);
      }
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.length > 0 ? (
        posts.map((post: any) => (
          <PostCard key={post.id} post={post} />
        ))
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No posts yet. Be the first to post!</p>
        </div>
      )}
    </div>
  );
}