import { useState, useEffect } from 'react';
import { Post } from '../../types/post';
import { api } from '../../utils/api';
import PostCard from './PostCard';
import CreatePost from './CreatePost';

export default function PostFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const loadPosts = async (pageNum: number = 0) => {
    try {
      const response = await fetch(`http://10.0.0.122:8001/api/v1/posts/?skip=${pageNum * 20}&limit=20`);
      const data = await response.json();
      if (pageNum === 0) {
        setPosts(data);
      } else {
        setPosts(prev => [...prev, ...data]);
      }
      setHasMore(data.length === 20);
    } catch (error) {
      console.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handlePostCreated = () => {
    loadPosts(0);
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadPosts(nextPage);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <CreatePost onPostCreated={handlePostCreated} />
      
      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      
      {hasMore && (
        <div className="text-center py-4">
          <button
            onClick={loadMore}
            className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}